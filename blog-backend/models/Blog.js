const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    visitorToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    viewedBy: [{
        type: String
    }],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;