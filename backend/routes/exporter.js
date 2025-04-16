import express from 'express';
import fs from 'fs'

const router = express.Router();

router.get('/hashes', (req, res) => {
    const data = fs.readFileSync('../dbrepo/parser/data.json', 'utf-8');
    const jsonData = JSON.parse(data);

    res.json({ data: jsonData});
});

router.post('/hashes', (req, res) => {
    const data = fs.readFileSync('../dbrepo/parser/data_projects.json', 'utf-8');
    const jsonData = JSON.parse(data);

    const body = req.body;
    jsonData.push(...body);

    fs.writeFileSync('../dbrepo/parser/data_projects.json', JSON.stringify(jsonData, null, 2));
    res.status(200).json({ message: 'Data saved successfully' });
})

export default router;