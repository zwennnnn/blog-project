import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../contexts/AuthContext';

const EditorPanel = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editBlogData, setEditBlogData] = useState(null);
    const [activeSection, setActiveSection] = useState('blogs');
    const [newBlog, setNewBlog] = useState({
        title: '',
        content: '',
        author: user?.username || '',
        image: null
    });
    const [showSuccess, setShowSuccess] = useState(false);

    // TinyMCE editör ayarları
    const editorConfig = {
        height: 500,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'fontfamily fontsize | ' +
                'bold italic underline strikethrough | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist | forecolor backcolor | ' +
                'link image | removeformat help',
        font_formats: 
            'Andale Mono=andale mono,times;' +
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
        fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs');
                // Sadece kullanıcının kendi bloglarını filtrele
                const userBlogs = response.data.filter(blog => blog.author === user.username);
                setBlogs(userBlogs);
                setLoading(false);
            } catch (error) {
                console.error('Bloglar yüklenirken hata:', error);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [user.username]);

    const handleUpdateBlog = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editBlogData.title);
            formData.append('content', editBlogData.content);
            formData.append('author', editBlogData.author);
            
            if (editBlogData.image && editBlogData.image instanceof File) {
                formData.append('image', editBlogData.image);
            }

            await axios.put(`http://localhost:5000/api/blogs/${editBlogData._id}`, formData);
            
            // Blog güncellendikten sonra listeyi yenile
            const response = await axios.get('http://localhost:5000/api/blogs');
            const userBlogs = response.data.filter(blog => blog.author === user.username);
            setBlogs(userBlogs);
            setIsBlogModalOpen(false);
        } catch (error) {
            console.error('Blog güncellenirken hata:', error);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`http://localhost:5000/api/blogs/${blogId}`);
                setBlogs(blogs.filter(blog => blog._id !== blogId));
            } catch (error) {
                console.error('Blog silinirken hata:', error);
            }
        }
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newBlog.title);
            formData.append('content', newBlog.content);
            formData.append('author', user.username);
            
            if (newBlog.image) {
                formData.append('image', newBlog.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post('http://localhost:5000/api/blogs/add', formData, config);

            // Blog başarıyla eklendiyse
            if (response.data) {
                // Önce modal'ı kapat
                setIsAddModalOpen(false);
                
                // Sonra blog listesini güncelle
                const blogsResponse = await axios.get('http://localhost:5000/api/blogs');
                const userBlogs = blogsResponse.data.filter(blog => blog.author === user.username);
                setBlogs(userBlogs);
                
                // Form verilerini sıfırla
                setNewBlog({ 
                    title: '', 
                    content: '', 
                    author: user.username, 
                    image: null 
                });
                
                // Başarı mesajını göster
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Blog eklenirken hata:', error);
            alert('Blog eklenirken bir hata oluştu');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setNewBlog({ ...newBlog, image: file });
            } else {
                alert('Lütfen sadece resim dosyası seçin');
                e.target.value = '';
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Bloglarım</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Yeni Blog Ekle
                </button>
            </div>

            {blogs.length === 0 ? (
                <p className="text-gray-600">Henüz blog yazınız bulunmamaktadır.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map(blog => (
                        <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {blog.imageUrl && (
                                <img
                                    src={`http://localhost:5000${blog.imageUrl}`}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                <p className="text-gray-600 mb-4">{blog.author}</p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleDeleteBlog(blog._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Sil
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditBlogData(blog);
                                            setIsBlogModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Düzenle
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Blog ekleme modalı */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Yeni Blog Ekle</h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddBlog}  className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    value={newBlog.title}
                                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Blog başlığı"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İçerik
                                </label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                                    init={editorConfig}
                                    value={newBlog.content}
                                    onEditorChange={(content) => setNewBlog({ ...newBlog, content })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapak Resmi
                                </label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                                >
                                    Blog Ekle
                                    
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Blog düzenleme modalı */}
            {isBlogModalOpen && editBlogData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Blog Düzenle</h3>
                            <button 
                                onClick={() => setIsBlogModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İçerik
                                </label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                                    init={editorConfig}
                                    value={editBlogData.content}
                                    onEditorChange={(content) => setEditBlogData({ ...editBlogData, content })}
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
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

            {/* Başarı mesajı */}
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    Blog başarıyla oluşturuldu!
                </div>
            )}
        </div>
    );
};

export default EditorPanel;
