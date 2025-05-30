const express = require('express');
const router = express.Router();
const { SurveyQuestion, SurveyOption, User, SurveyResponse} = require('../models');
const {getCityNames} = require("../utils/api/cityNames");

router.get('/questions', async (req, res) => {
    try {
        const questions = await SurveyQuestion.findAll({
            include: [{
                model: SurveyOption,
                as: 'options',
                attributes: ['id', 'option_text']
            }]
        });

        res.json({ questions });
    } catch (error) {
        res.status(500);
    }
});

router.get("/:country/cities", async (req, res) => {
    const country = req.params.country.toUpperCase();
    try {
        const cityNames = await getCityNames(country);
        if (!cityNames.length) {
            res.status(404).send('No city name found');
        }
        res.json({ cities: cityNames });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch city names" });
    }
});

router.post("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { answers } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const responsePromises = answers.map(async (answer) => {
            const { question_id, option_id } = answer;

            const question = await SurveyQuestion.findByPk(question_id);
            const option = await SurveyOption.findByPk(option_id);

            if (!question || !option) {
                throw new Error("Invalid question or option");
            }

            await SurveyResponse.create({
                user_id: userId,
                question_id,
                option_id
            });
        });

        await Promise.all(responsePromises);

        res.status(200).json({ message: "Survey responses saved successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to save survey responses" });
    }
});

module.exports = router;