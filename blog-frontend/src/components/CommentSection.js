import React, { useState } from 'react';
import { addComment } from '../services/api';
import { getVisitorToken } from '../utils/tokenUtil';

const CommentSection = ({ blogId, onCommentAdded }) => {
    const [comment, setComment] = useState({
        username: '',
        comment: '',
        rating: 5,
        visitorToken: getVisitorToken()
    });
    const [hoveredStar, setHoveredStar] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addComment(blogId, comment);
            
            setComment({ 
                username: '', 
                comment: '', 
                rating: 5,
                visitorToken: getVisitorToken()
            });
            setHoveredStar(null);
            setError(null);
            
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Yorum eklenirken bir hata oluştu';
            setError(errorMessage);
        }
    };

    // Eğer kullanıcı zaten yorum yapmışsa
    if (comment.disabled) {
        return (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                Bu blog için zaten yorum yapmışsınız.
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-pen-to-square mr-2 text-blue-500"></i>
                Yorum Yap
            </h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">İsminiz</label>
                    <input
                        type="text"
                        placeholder="İsminizi girin"
                        value={comment.username}
                        onChange={(e) => setComment({...comment, username: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Yorumunuz</label>
                    <textarea
                        placeholder="Yorumunuzu yazın"
                        value={comment.comment}
                        onChange={(e) => setComment({...comment, comment: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Değerlendirmeniz</label>
                    <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(null)}
                                onClick={() => setComment({...comment, rating: star})}
                                className="text-2xl focus:outline-none transition-colors"
                            >
                                <i className={`fas fa-star ${
                                    (hoveredStar ? star <= hoveredStar : star <= comment.rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                } hover:scale-110 transition-transform`}></i>
                            </button>
                        ))}
                        <span className="ml-2 text-gray-600">
                            ({comment.rating} yıldız)
                        </span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Yorum Yap
                </button>
            </form>
        </div>
    );
};

export default CommentSection; 