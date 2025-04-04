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

//create new user
router.post('/new', async (req, res) => {
    try {
        const { uid, email, name } = req.body;
        console.log("Creating user:", uid, email, name);
        const newUser = await User.create({
            uid,
            email,
            display_name: name,
            created_at: new Date()
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get boolean if survey is filled out by user
router.get('/survey/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log("Checking if survey is filled out for user:", user_id);

        const surveyIsFilledOut = await SurveyResponse.findOne({
            where: { user_id }
        });

        return res.status(200).json({ filledOut: !!surveyIsFilledOut });
    } catch (e) {
        console.error("Error fetching user:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//Get user user_id from db by uId
router.get('/user-id/:uid', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { uid: req.params.uid },
            attributes: ['id'],  // Only select the id column
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ id: user.id });  // Send back the user id
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;