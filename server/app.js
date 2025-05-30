const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const surveyRoutes = require("./routes/survey");
const recommendationsRoutes = require("./routes/recommendations");
const userRoutes = require('./routes/user');
const searchHistory = require('./routes/serachHistory');
const { json } = require("body-parser");
const { initializeAssociations, sequelize } = require('./models');

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(json());

initializeAssociations();
sequelize.sync().then(() => {
    console.log('Database synchronized');
});

app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/history', searchHistory);

module.exports = app;