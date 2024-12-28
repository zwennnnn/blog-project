import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { viewBlog } from '../services/api';
import CommentSection from '../components/CommentSection';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const data = await viewBlog(id);
                setBlog(data);
            } catch (err) {
                console.error('Blog detay hatası:', err);
                setError('Blog yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
        </div>
    );
    
    if (!blog) return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            Blog bulunamadı
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={`http://localhost:5000${blog.imageUrl}`} 
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 shadow-text">{blog.title}</h1>
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center">
                                <i className="fas fa-user mr-2"></i>
                                <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-eye mr-2"></i>
                                <span>{blog.views} görüntülenme</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-calendar mr-2"></i>
                                <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                        <div className="prose prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                            prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-800
                            prose-strong:text-gray-900 prose-strong:font-bold
                            prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4
                            prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4
                            prose-li:text-gray-700 prose-li:my-2
                            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
                            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                            prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                            prose-pre:bg-gray-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-4
                            prose-code:text-gray-800 prose-code:bg-gray-50 prose-code:px-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <i className="fas fa-comments mr-3 text-blue-500"></i>
                            Yorumlar
                        </h2>
                        
                        {blog.comments && blog.comments.length > 0 ? (
                            <div className="space-y-6 mb-8">
                                {blog.comments.map((comment, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-6 transition-transform hover:scale-[1.01]">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                    {comment.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="font-semibold">{comment.username}</h3>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {[1,2,3,4,5].map((star) => (
                                                    <i 
                                                        key={star}
                                                        className={`fas fa-star ${
                                                            star <= comment.rating 
                                                                ? 'text-yellow-400' 
                                                                : 'text-gray-300'
                                                        } text-lg`}
                                                    ></i>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{comment.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <i className="far fa-comment-dots text-4xl mb-3"></i>
                                <p>Henüz yorum yapılmamış</p>
                            </div>
                        )}

                        {/* Comment Form */}
                        <div className="border-t pt-8">
                            <CommentSection blogId={id} onCommentAdded={() => {
                                viewBlog(id).then(data => setBlog(data));
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
