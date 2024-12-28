import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../services/api';
import ImagePlaceholder from '../components/ImagePlaceholder';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const data = await fetchBlogs();
            // En son eklenenler
            const sortedBlogs = [...data].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setBlogs(sortedBlogs);

            // En çok okunanlar (örnek olarak ilk 5)
            const mostViewed = [...data]
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5);
            setPopularBlogs(mostViewed);
        } catch (error) {
            console.error('Blog yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Ana Blog Listesi */}
                <div className="lg:w-2/3">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Son Yazılar</h2>
                    <div className="space-y-8">
                        {blogs.map((blog) => (
                            <Link 
                                key={blog._id} 
                                to={`/blog/${blog._id}`}
                                className="block bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3">
                                        {blog.imageUrl ? (
                                            <img
                                                src={`http://localhost:5000${blog.imageUrl}`}
                                                alt={blog.title}
                                                className="w-full h-48 md:h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentElement.innerHTML = '<div class="h-full"><ImagePlaceholder /></div>';
                                                }}
                                            />
                                        ) : (
                                            <div className="h-48 md:h-full">
                                                <ImagePlaceholder />
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:w-2/3 p-6">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                                            <span>•</span>
                                            <span>{blog.author}</span>
                                            {blog.views && (
                                                <>
                                                    <span>•</span>
                                                    <span>{blog.views} görüntülenme</span>
                                                </>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <div 
                                            className="prose prose-sm line-clamp-3
                                                prose-p:text-gray-600 prose-p:leading-relaxed
                                                prose-headings:text-base prose-headings:font-normal
                                                prose-a:text-blue-600 
                                                prose-strong:text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: blog.content }}
                                        />
                                        <div className="mt-4">
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.location.href = `/blog/${blog._id}`;
                                                }}
                                                className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full hover:bg-blue-200 transition-colors duration-300"
                                            >
                                                Devamını Oku
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sağ Sidebar - En Çok Okunanlar */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            En Çok Okunanlar
                        </h3>
                        <div className="space-y-4">
                            {popularBlogs.map((blog) => (
                                <Link 
                                    key={blog._id}
                                    to={`/blog/${blog._id}`}
                                    className="flex items-start space-x-4 group"
                                >
                                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                                        {blog.imageUrl ? (
                                            <img
                                                src={`http://localhost:5000${blog.imageUrl}`}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentElement.innerHTML = '<div class="h-full"><ImagePlaceholder /></div>';
                                                }}
                                            />
                                        ) : (
                                            <ImagePlaceholder />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                            {blog.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {blog.views || 0} görüntülenme
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogList;
