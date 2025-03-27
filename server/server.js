const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Import your auth routes
const surveyRoutes = require("./routes/survey");
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
app.use('/api/auth', authRoutes);  // Mount your auth routes
app.use('/api/survey', surveyRoutes);  // Mount your survey routes

// Sync Sequelize models with the database
sequelize.sync().then(() => {
    console.log('Database synchronized');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

