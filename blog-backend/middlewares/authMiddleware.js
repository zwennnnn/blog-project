const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token bulunamadı' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Token'ı kontrol et
            if (!decoded) {
                return res.status(401).json({ error: 'Geçersiz token' });
            }

            // Role kontrolü
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
            }

            // Kullanıcı bilgilerini request'e ekle
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Auth middleware hatası:', error);
            return res.status(401).json({ error: 'Yetkilendirme hatası' });
        }
    };
};

module.exports = authMiddleware;
