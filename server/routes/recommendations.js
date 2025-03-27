const express = require("express");
const router = express.Router();
const { getTravelRecommendations } = require("../utils/aiService");
const { User } = require("../models");  // Assuming user preferences are stored in DB

router.get("/recommendations/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user preferences from database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Example: Use user preferences from DB
        const userPreferences = {
            music: user.favorite_music_genre,
            nightlife: user.nightlife_preference,
            nature: user.nature_preference
        };

        // Call AI to get recommendations
        const recommendations = await getTravelRecommendations(userPreferences);

        res.json(recommendations);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;