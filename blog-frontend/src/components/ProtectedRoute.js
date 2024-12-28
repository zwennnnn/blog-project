import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        // Token yoksa login'e yönlendir
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Kullanıcının rolü izin verilenler arasında değilse ana sayfaya yönlendir
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute; 