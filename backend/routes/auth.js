import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import redis from '../redisClient.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(req.body);
    const { login, password, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ login, passwordHash, name });
        res.json({ message: 'User created', login: user.login });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });
  
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await redis.set(`session:${user.id}`, 'valid', 'EX', 3600);
  
    res.json({ token });
});

router.post('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token required' });
  
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        await redis.del(`session:${payload.id}`);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
});

export default router;
