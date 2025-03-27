const express = require("express");
const router = express.Router();
const { getTravelRecommendations } = require("../utils/aiService");
const { User } = require("../models");

router.get("/:userId/:city/:country", async (req, res) => {
    try {
        const { userId, city, country } = req.params;

        // Find user by uid
        const user = await User.findOne({
            where: { uid: userId }
        });

        if (!user) {
            console.log(`User not found with UID: ${userId}`);
            return res.status(404).json({ error: "User not found" });
        }

        //TODO: delete, have real user preference data instead
        const userPreferences = [
            { question_id: 1, option_id: 2 },  // Outdoor adventures
            { question_id: 2, option_id: 8 },  // Exciting and adventurous
            { question_id: 3, option_id: 13 }  // Nature environment
        ];

        const recommendations = await getTravelRecommendations(userPreferences, city, country);
        res.json(recommendations);
    } catch (error) {
        console.error("Error in recommendations route:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;