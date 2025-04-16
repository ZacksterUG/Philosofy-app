import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import exporterRoutes from './routes/exporter.js';

dotenv.config();

const app = express();
const corsOptions = process.env.NODE_ENV === 'dev' 
  ? { origin: '*' }  // Разрешить все источники в dev
  : { origin: process.env.ALLOWED_ORIGIN };  // Разрешить только один источник в production
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // если нужны формы
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/exporter', exporterRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
