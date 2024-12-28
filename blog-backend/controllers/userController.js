const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Tüm editörleri getir
exports.getEditors = async (req, res) => {
    try {
        const editors = await User.find({ role: 'editor' }).select('-password');
        res.json(editors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ID'ye göre editör getir
exports.getEditorById = async (req, res) => {
    try {
        const editor = await User.findById(req.params.id).select('-password');
        if (!editor) {
            return res.status(404).json({ error: 'Editör bulunamadı' });
        }
        res.json(editor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Yeni editör ekle
exports.addEditor = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: 'Editör başarıyla eklendi' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editör güncelle
exports.updateEditor = async (req, res) => {
    try {
        console.log('Update isteği geldi:', {
            body: req.body,
            params: req.params,
            user: req.user
        });

        const { username, password } = req.body;
        const userId = req.params.id;

        if (!userId) {
            console.log('UserID bulunamadı');
            return res.status(400).json({ error: 'Editör ID bulunamadı' });
        }

        const updateData = {};

        if (username) {
            console.log('Username güncellenecek:', username);
            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId }
            });

            if (existingUser) {
                console.log('Username çakışması:', existingUser);
                return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanılıyor' });
            }

            updateData.username = username;
        }

        if (password) {
            console.log('Şifre güncellenecek');
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        console.log('Güncellenecek data:', updateData);

        const editor = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!editor) {
            console.log('Editör bulunamadı:', userId);
            return res.status(404).json({ error: 'Editör bulunamadı' });
        }

        console.log('Güncelleme başarılı:', editor);
        res.json(editor);
    } catch (err) {
        console.error('Editör güncelleme hatası:', err);
        res.status(500).json({ error: err.message });
    }
};

// Editör sil
exports.deleteEditor = async (req, res) => {
    try {
        const editor = await User.findByIdAndDelete(req.params.id);
        if (!editor) {
            return res.status(404).json({ error: 'Editör bulunamadı' });
        }
        res.json({ message: 'Editör başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};