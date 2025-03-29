const express = require('express');
const { User, SurveyResponse} = require('../models'); // Assuming you have a User model set up
const router = express.Router();

// Route to check if the user exists by UID
router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ where: { uid } });
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json(null);  // User does not exist
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to create a new user
router.post('/users', async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;
        const newUser = await User.create({ uid, email, displayName, photoURL });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/survey/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;

        const surveyIsFilledOut = await SurveyResponse.findOne({ where: { user_id: userId } });

        //return true or false
        return res.status(200).json({ filledOut: !!surveyIsFilledOut });

    } catch (e) {
        console.error("Error fetching user:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;