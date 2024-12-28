const Blog = require('../models/Blog');

// Bir bloga yorum ekle
exports.addComment = async (req, res) => {
    const { name, surname, comment } = req.body;
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });

        const newComment = { name, surname, comment };
        blog.comments.push(newComment);
        await blog.save();

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};