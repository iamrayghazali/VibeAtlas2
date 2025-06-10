import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import surveyRoutes from './routes/survey.js';
import recommendationsRoutes from './routes/recommendations.js';
import userRoutes from './routes/user.js';
import searchHistory from './routes/serachHistory.js';
import { initializeAssociations, sequelize } from './models/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

initializeAssociations();
sequelize.sync().then(() => {
    console.log('Database synchronized');
});

app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/history', searchHistory);

export default app;