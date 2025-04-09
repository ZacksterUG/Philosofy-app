import jwt from 'jsonwebtoken';
import redis from '../redisClient.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const exists = await redis.get(`session:${payload.id}`);
    if (!exists) throw new Error('Session expired');

    req.user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token or session expired' });
  }
}
