import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const BlogForm = ({ initialData, onSubmit, buttonText }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        content: '',
        author: '',
        image: null
    });
    const [preview, setPreview] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setFormData({ ...formData, image: file });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Lütfen sadece resim dosyası seçin');
                e.target.value = '';
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Başlık
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    İçerik
                </label>
                <div className="border rounded-lg">
                    <Editor
                        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                        init={editorConfig}
                        value={formData.content}
                        onEditorChange={(content) => setFormData({...formData, content})}
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Yazar
                </label>
                <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kapak Resmi
                </label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {preview && (
                    <div className="mt-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-xs rounded-lg shadow-lg"
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
                {buttonText || 'Kaydet'}
            </button>
        </form>
    );
};

export default BlogForm; 