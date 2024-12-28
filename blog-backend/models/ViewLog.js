const mongoose = require('mongoose');

const viewLogSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    visitorToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 86400 } // 24 saat sonra otomatik silinir
    }
}, {
    timestamps: true
});

// Bir blog için aynı token'la tekrar görüntülemeyi engelle
viewLogSchema.index({ blogId: 1, visitorToken: 1 }, { unique: true });

module.exports = mongoose.model('ViewLog', viewLogSchema); 