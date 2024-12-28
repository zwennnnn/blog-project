const express = require('express');
const router = express.Router();
const {
    getEditors,
    getEditorById,
    addEditor,
    updateEditor,
    deleteEditor
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');


router.get('/', getEditors);
router.get('/:id', getEditorById);


router.post('/add-editor', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        
        const newUser = new User({
            username,
            password,
            role: 'editor'
        });

        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:id', authMiddleware('admin'), updateEditor);
router.delete('/:id', authMiddleware('admin'), deleteEditor);

module.exports = router;