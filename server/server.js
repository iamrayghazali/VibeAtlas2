const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Import your auth routes
const surveyRoutes = require("./routes/survey");
const recommendationsRoutes = require("./routes/recommendations"); // Import your recommendations routes
const userRoutes = require('./routes/user'); // Import your new user routes

const {json} = require("body-parser"); // Ensure this points to your Sequelize setup
const { initializeAssociations, sequelize } = require('./models');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 7050;

// Middleware setup
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse incoming JSON requests (No need for body-parser)
app.use(json());  // Parse incoming JSON requests


// Initialize associations before syncing
initializeAssociations();

sequelize.sync().then(() => {
    console.log('Database synchronized');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

