const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});


router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bloglar getirilirken bir hata oluştu' });
    }
});


router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const image = req.file;

        if (!title || !content || !author || !image) {
            return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
        }

        const imageUrl = `/uploads/${image.filename}`;

        const blog = new Blog({
            title,
            content,
            author,
            imageUrl
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Blog eklenirken bir hata oluştu' });
    }
});


router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const updateData = {
            title,
            content,
            author
        };

        if (req.file) {
            updateData.imageURL = `/uploads/${req.file.filename}`;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog bulunamadı' });
        }

        res.json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Blog güncellenirken bir hata oluştu' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog başarıyla silindi' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Blog silinirken bir hata oluştu' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ error: 'Token gerekli' });
        }

        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog bulunamadı' });
        }

        if (!blog.viewedBy.includes(token)) {
            blog.views += 1;
            blog.viewedBy.push(token);
            await blog.save();
        }

        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Blog getirilirken bir hata oluştu' });
    }
});


router.post('/:id/comments', async (req, res) => {
    try {
        const { username, comment, rating, visitorToken } = req.body;

        if (!username || !comment || !rating || !visitorToken) {
            return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
        }

        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog bulunamadı' });
        }

        const hasCommented = blog.comments.some(c => c.visitorToken === visitorToken);
        if (hasCommented) {
            return res.status(400).json({ error: 'Bu blog için zaten yorum yapmışsınız' });
        }

        blog.comments.push({
            username,
            comment,
            rating: Number(rating),
            visitorToken
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
    }
});


router.get('/:id/comments', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog bulunamadı' });
        }

        res.json(blog.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
    }
});

module.exports = router;
