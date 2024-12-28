const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kullanıcıyı MongoDB'den bul
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        let isValidPassword = false;

        // Admin için özel kontrol
        if (username === 'admin' && password === 'admin123') {
            isValidPassword = true;
        } else {
            // Diğer kullanıcılar için bcrypt ile kontrol
            isValidPassword = await bcrypt.compare(password, user.password);
        }

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // JWT Token oluştur
        const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Login sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
