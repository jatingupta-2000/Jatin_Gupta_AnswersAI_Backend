const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Question = require('../models/question');
const authenticateToken = require('../middlewares');

// /api/users
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
});

// /api/users/:userId
router.get('/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// /api/users/:userId/questions
router.get('/:userId/questions', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const userQuestions = await Question.find({ userId });
    res.json(userQuestions);
});

module.exports = router;
