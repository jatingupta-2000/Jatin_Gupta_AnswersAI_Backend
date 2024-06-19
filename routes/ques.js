const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const authenticateToken = require('../middlewares');
const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })

//  /api/questions
router.post('/', authenticateToken, async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    const res = await api.sendMessage(question, {
        onProgress: (partialResponse) => console.log(partialResponse.text)
      })
    const newQuestion = new Question({ userId: req.user.userId, question, res });
    await newQuestion.save();
    res.status(201).json(newQuestion);
});

// /api/questions/:questionId
router.get('/:questionId', authenticateToken, async (req, res) => {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) {
        return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
});

module.exports = router;
