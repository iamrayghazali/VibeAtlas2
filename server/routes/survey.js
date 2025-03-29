const express = require('express');
const router = express.Router();
const { SurveyQuestion, SurveyOption } = require('../models');
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
    const country = req.params.country.toUpperCase(); // Ensure uppercase country code
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

module.exports = router;