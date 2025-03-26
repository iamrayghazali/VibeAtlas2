const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');  // Import your auth routes

const app = express();
const PORT = process.env.PORT || 7050;

// Middleware setup
app.use(cors());  // Allow cross-origin requests
app.use(bodyParser.json());  // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);  // Mount your auth routes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});