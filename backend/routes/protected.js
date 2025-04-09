import express from 'express';
import auth from '../middleware/auth.js';

import fs from 'fs';
import csv from 'csv-parser';

let results = [];

fs.createReadStream('comments_likes.csv')
    .pipe(csv())
    .on('data', (data) => results.push({comments: +data.comments, likes: +data.likes}));

const router = express.Router();

router.get('/public', (req, res) => {
    res.json({ message: 'This is a public route.' });
});

router.get('/profile', auth, (req, res) => {
    res.json({
        message: 'This is a protected route.',
        user: req.user.login,
    });
});

router.get('/testdata', auth, (req, res) => {
    res.json(results.slice(0, 500));
});



export default router;
