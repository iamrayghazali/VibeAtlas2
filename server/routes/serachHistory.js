const express = require('express');
const {SearchHistory} = require("../models");
const router = express.Router();

router.get('/:userId/searches', async (req, res) => {
    try {
        // Change from SurveyQuestion to SearchHistory model
        const searchHistory = await SearchHistory.findAll({
            where: {
                user_id: req.params.userId,  // Ensure the user_id matches the correct field in the SearchHistory model
            }
        });

        if (searchHistory.length === 0) {
            return res.status(404).json({ message: 'No search history found for this user' });
        }

        res.json({ searchHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/:userId/searches', async (req, res) => {
    try {
        const { country, city } = req.body;
        const { userId } = req.params;

        if (!country || !city) {
            return res.status(400).json({ message: 'Country and City are required' });
        }

        // Create a new search history entry
        const searchHistory = await SearchHistory.create({
            user_id: userId,  // The user ID from the route parameter
            country: country,
            city: city,
            searched_at: new Date()  // Set the current date and time as the search time
        });

        res.status(201).json(searchHistory);  // Respond with the created search history
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;