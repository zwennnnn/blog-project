import axios from 'axios';
import { getVisitorToken } from '../utils/tokenUtil';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 120000 
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const fetchBlogs = () => api.get('/blogs').then(res => res.data);
export const fetchBlogById = async (id) => {
    try {
        console.log('Blog detayı isteniyor:', id);
        const response = await api.get(`/blogs/${id}`);
        console.log('Blog detayı alındı:', response.data);
        return response.data;
    } catch (error) {
        console.error('Blog detayı hatası:', error.response?.data || error);
        throw error;
    }
};
export const addBlog = async (blogData) => {
    try {
        console.log('Gönderilen blog verisi:', blogData); 

        const formData = new FormData();
        formData.append('title', blogData.get('title'));
        formData.append('content', blogData.get('content'));
        formData.append('author', blogData.get('author'));
        formData.append('image', blogData.get('image'));

        
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); 
        }

        const response = await api.post('/blogs/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error('Blog ekleme hatası:', error);
        throw error;
    }
};
export const updateBlog = async (id, data) => {
    try {
        if (!id) {
            throw new Error('Blog ID bulunamadı');
        }
        const response = await api.put(`/blogs/${id}`, {
            title: data.title.trim(),
            content: data.content.trim(),
            author: data.author,
            status: data.status || 'published'
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Blog güncellenirken bir hata oluştu';
    }
};
export const deleteBlog = (id) => api.delete(`/blogs/${id}`).then(res => res.data);


export const fetchEditors = () => api.get('/users').then(res => res.data);
export const fetchEditorById = (id) => api.get(`/users/${id}`).then(res => res.data);
export const addEditor = async (data) => {
    try {
        const response = await api.post('/users/add-editor', {
            username: data.username.trim(),
            password: data.password,
            role: 'editor'
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Editör eklenirken bir hata oluştu';
    }
};
export const updateUser = async (id, userData) => {
    try {
        if (!id) {
            throw new Error('Editör ID bulunamadı');
        }
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Güncelleme sırasında bir hata oluştu';
    }
};
export const deleteUser = (id) => api.delete(`/users/${id}`).then(res => res.data);


export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;
        
       
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { token, user };
    } catch (error) {
        throw error.response?.data?.error || 'Giriş yapılırken bir hata oluştu';
    }
};


export const fetchPopularBlogs = async () => {
    try {
        const response = await axios.get(`${API_URL}/blogs/popular`);
        return response.data;
    } catch (error) {
        console.error('Popüler blogları getirme hatası:', error);
        throw error;
    }
};

// Blog görüntüleme
export const viewBlog = async (id) => {
    try {
        const visitorToken = getVisitorToken();
        const response = await api.get(`/blogs/${id}`, {
            headers: {
                'Authorization': visitorToken
            }
        });
        return response.data;
    } catch (error) {
        console.error('Blog görüntüleme hatası:', error);
        throw error;
    }
};

// Yorum ekleme
export const addComment = async (blogId, commentData) => {
    try {
        const visitorToken = getVisitorToken();
        const response = await api.post(`/blogs/${blogId}/comments`, {
            ...commentData,
            visitorToken
        });
        return response.data;
    } catch (error) {
        console.error('Yorum ekleme hatası:', error);
        throw error;
    }
};

// Yorumları getirme
export const getComments = async (blogId) => {
    try {
        const response = await api.get(`/blogs/${blogId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Yorumları getirme hatası:', error);
        throw error;
    }
};

export default api;
