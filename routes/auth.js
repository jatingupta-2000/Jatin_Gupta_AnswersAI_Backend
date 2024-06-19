const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

const generateAccessToken = (user) => jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (user) => jwt.sign({ userId: user._id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

//  /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken });
});

//  /api/auth/logout
router.post('/logout', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    if (refreshTokensStore[token]) {
        delete refreshTokensStore[token];
        return res.sendStatus(204);
    } else {
        return res.status(400).json({ error: 'Invalid token' });
    }
});

//  /api/auth/refresh
router.post('/refresh', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.sendStatus(403);
    }
    jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
});

module.exports = router;