import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchBlogs,
    fetchEditors,
    addBlog,
    updateBlog,
    deleteBlog,
    addEditor,
    deleteUser,
    updateUser,
} from '../services/api';
import ImagePlaceholder from '../components/ImagePlaceholder';
import BlogForm from '../components/BlogForm';
import { Editor } from '@tinymce/tinymce-react';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('blogs');
    const [blogs, setBlogs] = useState([]);
    const [editors, setEditors] = useState([]);
    const [newBlog, setNewBlog] = useState({
        title: '',
        content: '',
        author: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [newEditor, setNewEditor] = useState({ username: '', password: '' });
    const [editBlogData, setEditBlogData] = useState(null);
    const [editEditorData, setEditEditorData] = useState({ id: '', username: '', password: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingEditor, setEditingEditor] = useState({
        id: '',
        currentUsername: '',
        newUsername: '',
        password: ''
    });
    const [preview, setPreview] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            loadInitialData();
        }
    }, []);

    const loadInitialData = async () => {
        try {
            const [blogsData, editorsData] = await Promise.all([
                fetchBlogs(),
                fetchEditors()
            ]);
            setBlogs(blogsData);
            setEditors(editorsData);
        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewBlog({ ...newBlog, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddBlog = async (formData) => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', newBlog.title);
            data.append('content', newBlog.content);
            data.append('author', newBlog.author);
            if (newBlog.image) {
                data.append('image', newBlog.image);
            }

            await addBlog(data);
            
            // Modal'ı kapat
            setShowAddModal(false);
            
            // Form verilerini temizle
            setNewBlog({ title: '', content: '', author: '', image: null });
            setImagePreview(null);
            
            // Başarı mesajını göster
            setShowSuccess(true);
            setSuccessMessage('Blog başarıyla oluşturuldu!');
            setTimeout(() => setShowSuccess(false), 3000);

            
            // Blog listesini güncelle
            await loadInitialData();
            setActiveSection('blogs');
            

        } catch (error) {
            console.error('Blog ekleme hatası:', error);
            setShowError(true);
            setErrorMessage('Blog eklenirken bir hata oluştu');
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBlog = async () => {
        try {
            if (!editBlogData.title || !editBlogData.content) {
                throw new Error('Başlık ve içerik alanları zorunludur');
            }

            await updateBlog(editBlogData._id, {
                title: editBlogData.title,
                content: editBlogData.content,
                author: editBlogData.author,
                status: editBlogData.status || 'published'
            });

            setIsBlogModalOpen(false);
            await loadInitialData();
            setSuccessMessage('Blog başarıyla güncellendi!');
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            setShowError(true);
            setErrorMessage('Blog güncellenirken bir hata oluştu');
            setTimeout(() => setShowError(false), 3000);
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            await deleteBlog(id);
            setShowSuccess(true);
            setSuccessMessage('Blog başarıyla silindi!');
            setTimeout(() => setShowSuccess(false), 3000);
            loadInitialData();
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleAddEditor = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (!newEditor.username || !newEditor.password) {
                alert('Kullanıcı adı ve şifre zorunludur');
                return;
            }

            const editorData = {
                username: newEditor.username.trim(),
                password: newEditor.password,
                role: 'editor'
            };

            await addEditor(editorData);
            setNewEditor({ username: '', password: '' });
            await loadInitialData();
            setShowSuccess(true);
            setSuccessMessage('Editör başarıyla eklendi!');
            setTimeout(() => setShowSuccess(false), 3000);
            setActiveSection('editors');
        } catch (error) {
            console.error('Editör eklenirken hata:', error);
            setShowError(true);
            setErrorMessage('Editör eklenirken bir hata oluştu');
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleEditEditor = (editor) => {
        setEditingEditor({
            id: editor._id,
            currentUsername: editor.username,
            newUsername: editor.username,
            password: ''
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteEditor = async (id) => {
        try {
            if (window.confirm('Bu editörü silmek istediğinizden emin misiniz?')) {
                await deleteUser(id);
                await loadInitialData();
                setShowSuccess(true);
                setSuccessMessage('Editör başarıyla silindi!');
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Editör silinirken hata:', error);
            setShowError(true);
            setErrorMessage('Editör silinirken bir hata oluştu');
            setTimeout(() => setShowError(false), 3000);
        }
    };

    const handleEditorChange = (content, editor) => {
        setNewBlog(prev => ({ ...prev, content }));
    };

    const handleEditEditorChange = (content, editor) => {
        setEditBlogData(prev => ({ ...prev, content }));
    };

    const renderContent = (content) => {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };


    
    const EditModal = () => {
        const [formData, setFormData] = useState({
            newUsername: editingEditor.currentUsername || '',
            password: ''
        });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                setLoading(true);

                if (!editingEditor.id) {
                    throw new Error('Editör ID bulunamadı');
                }

                if (!formData.newUsername) {
                    throw new Error('Kullanıcı adı zorunludur');
                }

                const updateData = {
                    username: formData.newUsername.trim(),
                    ...(formData.password && { password: formData.password })
                };

                await updateUser(editingEditor.id, updateData);
                await loadInitialData();
                setIsEditModalOpen(false);
                alert('Editör başarıyla güncellendi');
            } catch (error) {
                console.error('Güncelleme hatası:', error);
                alert(error.message || 'Güncelleme sırasında bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Editör Düzenle</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                value={formData.newUsername}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    newUsername: e.target.value
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                minLength={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yeni Şifre (Opsiyonel)
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    password: e.target.value
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Boş bırakılabilir"
                                minLength={4}
                            />
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                                disabled={loading}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? 'Güncelleniyor...' : 'Güncelle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderAddBlogModal = () => {
        if (!showAddModal) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Blog Ekle</h2>
                        <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <BlogForm 
                        onSubmit={async (formData) => {
                            try {
                                const data = new FormData();
                                data.append('title', formData.title);
                                data.append('content', formData.content);
                                data.append('author', formData.author);
                                if (formData.image) {
                                    data.append('image', formData.image);
                                }
                                await addBlog(data);
                                setShowAddModal(false);
                                fetchBlogs();
                            } catch (error) {
                                console.error('Blog ekleme hatası:', error);
                                alert('Blog eklenirken bir hata oluştu');
                            }
                        }}
                        buttonText="Blog Ekle"
                    />
                </div>
            </div>
        );
    };

    const renderEditBlogModal = () => {
        if (!showEditModal || !selectedBlog) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Blog Düzenle</h2>
                        <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <BlogForm 
                        initialData={selectedBlog}
                        onSubmit={async (formData) => {
                            try {
                                const data = new FormData();
                                data.append('title', formData.title);
                                data.append('content', formData.content);
                                data.append('author', formData.author);
                                if (formData.image) {
                                    data.append('image', formData.image);
                                }
                                await updateBlog(selectedBlog._id, data);
                                setShowEditModal(false);
                                fetchBlogs();
                            } catch (error) {
                                console.error('Blog güncelleme hatası:', error);
                                alert('Blog güncellenirken bir hata oluştu');
                            }
                        }}
                        buttonText="Blog Güncelle"
                    />
                </div>
            </div>
        );
    };

  

    // CSS stil tanımlaması ekle
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .ql-snow .ql-picker.ql-size .ql-picker-label::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item::before {
                content: 'Normal';
            }
            .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
                content: 'Small';
            }
            .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
                content: 'Large';
            }
            .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
                content: 'Huge';
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="bg-white shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-3xl font-bold text-gray-800">Admin Paneli</h1>
                            <div className="flex space-x-2 ml-8">
                                <button
                                    onClick={() => setActiveSection('blogs')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        activeSection === 'blogs'
                                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                    >
                        Bloglar
                                </button>
                                <button
                                    onClick={() => setActiveSection('addBlog')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        activeSection === 'addBlog'
                                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Blog Ekle
                                </button>
                                <button
                        onClick={() => setActiveSection('editors')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        activeSection === 'editors'
                                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                    >
                        Editörler
                                </button>
                                <button
                                    onClick={() => setActiveSection('addEditor')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        activeSection === 'addEditor'
                                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Editör Ekle
                                </button>
                            </div>
                        </div>
                <button
                    onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                >
                    Çıkış Yap
                </button>
                    </div>
                </div>
            </div>

            {activeSection === 'addBlog' && (
                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Blog Ekle</h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    value={newBlog.title}
                                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Blog başlığı"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İçerik
                                </label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | ' +
                                            'bold italic backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | fontselect fontsizeselect | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                        font_formats: 
                                            'Arial=arial,helvetica,sans-serif;' +
                                            'Arial Black=arial black,avant garde;' +
                                            'Book Antiqua=book antiqua,palatino;' +
                                            'Comic Sans MS=comic sans ms,sans-serif;' +
                                            'Courier New=courier new,courier;' +
                                            'Georgia=georgia,palatino;' +
                                            'Helvetica=helvetica;' +
                                            'Impact=impact,chicago;' +
                                            'Symbol=symbol;' +
                                            'Tahoma=tahoma,arial,helvetica,sans-serif;' +
                                            'Terminal=terminal,monaco;' +
                                            'Times New Roman=times new roman,times;' +
                                            'Trebuchet MS=trebuchet ms,geneva;' +
                                            'Verdana=verdana,geneva;',
                                        fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
                                    }}
                                    value={newBlog.content}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yazar
                                </label>
                                <input
                                    type="text"
                                    value={newBlog.author}
                                    onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Yazar adı"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapak Fotoğrafı
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Önizleme"
                                        className="mt-4 w-full h-48 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                            <button
                                onClick={handleAddBlog}
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105"
                            >
                                {loading ? 'Ekleniyor...' : 'Blog Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 py-8">
                {activeSection === 'blogs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div key={blog._id} 
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                                {blog.imageUrl ? (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={`http://localhost:5000${blog.imageUrl}`}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                console.error('Image load error:', blog.imageUrl);
                                                const imgContainer = document.getElementById(`blog-img-${blog._id}`);
                                                if (imgContainer) {
                                                    imgContainer.innerHTML = '<div class="h-48"><ImagePlaceholder /></div>';
                                                }
                                            }}
                                            id={`blog-img-${blog._id}`}
                                        />
                                    </div>
                                ) : (
                                    <ImagePlaceholder />
                                )}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                                    <div className="prose max-w-none mb-4">
                                        {renderContent(blog.content)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm">
                                            <p className="text-blue-500 font-semibold">{blog.author}</p>
                                            <p className="text-gray-400">
                                                {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditBlogData(blog);
                                                    setIsBlogModalOpen(true);
                                                }}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBlog(blog._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'editors' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {editors.map((editor) => (
                            <div key={editor._id} 
                                className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{editor.username}</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {new Date(editor.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditEditor(editor)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEditor(editor._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'addEditor' && (
                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Editör Ekle</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kullanıcı Adı
                                </label>
                                <input
                                    type="text"
                                    value={newEditor.username}
                                    onChange={(e) => setNewEditor({ ...newEditor, username: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Kullanıcı adı"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    value={newEditor.password}
                                    onChange={(e) => setNewEditor({ ...newEditor, password: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Şifre"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleAddEditor}
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105"
                            >
                                {loading ? 'Ekleniyor...' : 'Editör Ekle'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isBlogModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Blog Düzenle</h3>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    value={editBlogData.title}
                                    onChange={(e) => setEditBlogData({ ...editBlogData, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Başlık"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İçerik
                                </label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | ' +
                                            'bold italic backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | fontselect fontsizeselect | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                        font_formats: 
                                            'Arial=arial,helvetica,sans-serif;' +
                                            'Arial Black=arial black,avant garde;' +
                                            'Book Antiqua=book antiqua,palatino;' +
                                            'Comic Sans MS=comic sans ms,sans-serif;' +
                                            'Courier New=courier new,courier;' +
                                            'Georgia=georgia,palatino;' +
                                            'Helvetica=helvetica;' +
                                            'Impact=impact,chicago;' +
                                            'Symbol=symbol;' +
                                            'Tahoma=tahoma,arial,helvetica,sans-serif;' +
                                            'Terminal=terminal,monaco;' +
                                            'Times New Roman=times new roman,times;' +
                                            'Trebuchet MS=trebuchet ms,geneva;' +
                                            'Verdana=verdana,geneva;',
                                        fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
                                    }}
                                    value={editBlogData.content}
                                    onEditorChange={handleEditEditorChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yazar
                                </label>
                                <input
                                    type="text"
                                    value={editBlogData.author}
                                    onChange={(e) => setEditBlogData({ ...editBlogData, author: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Yazar"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setIsBlogModalOpen(false)}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleUpdateBlog}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                                >
                                    Güncelle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <EditModal />
            )}

            {renderAddBlogModal()}
            {renderEditBlogModal()}

            {/* Başarı mesajı */}
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in-out flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {showError && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in-out flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">{errorMessage}</span>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
