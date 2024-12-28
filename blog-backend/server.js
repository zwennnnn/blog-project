const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('=== MongoDB Bağlantı Bilgileri ===');
    console.log('Durum:', mongoose.connection.readyState);
    console.log('Veritabanı:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('================================');
})
.catch(err => {
    console.error('MongoDB Bağlantı Hatası:', err.message);
    process.exit(1);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB bağlantısı başarılı');
});

mongoose.connection.on('error', err => {
    console.error('MongoDB bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB bağlantısı koptu');
});

app.use((req, res, next) => {
    console.log('İstek geldi:', {
        method: req.method,
        url: req.url,
        path: req.path,
        body: req.body
    });
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blogs', require('./routes/blogs'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
