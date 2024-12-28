const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');
const ViewLog = require('../models/ViewLog');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Blog işlemleri
const blogController = {
    // Tüm blogları getir
    getAllBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find().sort({ createdAt: -1 });
            res.json(blogs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Blog ekle - Birebir userController.addEditor gibi
    addBlog: async (req, res) => {
        try {
            console.log('Gelen request body:', req.body); // Debug için
            console.log('Gelen dosya:', req.file); // Debug için

            const { title, content, author } = req.body;
            const image = req.file ? req.file.filename : null;

            // Validasyonlar
            if (!title || !content || !author || !image) {
                console.log('Eksik alanlar:', { title, content, author, image }); // Debug için
                return res.status(400).json({ 
                    error: 'Tüm alanlar zorunludur (başlık, içerik, yazar ve resim)' 
                });
            }

            // Yeni blog oluştur
            const newBlog = new Blog({
                title: title.trim(),
                content,
                author,
                image,
                createdAt: new Date()
            });

            const savedBlog = await newBlog.save();
            console.log('Blog kaydedildi:', savedBlog); // Debug için

            res.status(201).json(savedBlog);
        } catch (err) {
            console.error('Blog ekleme hatası:', err);
            res.status(500).json({ error: 'Blog eklenirken bir hata oluştu' });
        }
    },

    // Blog güncelle
    updateBlog: async (req, res) => {
        try {
            const blog = await Blog.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(blog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Blog sil
    deleteBlog: async (req, res) => {
        try {
            await Blog.findByIdAndDelete(req.params.id);
            res.json({ message: 'Blog silindi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Blog detayı getir
    getBlogById: async (req, res) => {
        try {
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                return res.status(404).json({ error: 'Blog bulunamadı' });
            }
            res.json(blog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = blogController;