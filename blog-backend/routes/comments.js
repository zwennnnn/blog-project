const express = require('express');
const { addComment } = require('../controllers/commentController');
const router = express.Router();


router.post('/:blogId/comments', addComment);

module.exports = router;