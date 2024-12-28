import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { token, role } = await response.json();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({ role, username }));
                
                if (role === 'admin') {
                    navigate('/panel');
                } else if (role === 'editor') {
                    navigate('/editor');
                } else {
                    setError('Geçersiz kullanıcı rolü.');
                }
            } else {
                setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.');
            }
        } catch (error) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">Giriş Yap</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Giriş Yap
                </button>
            </div>
        </div>
    );
};

export default Login;