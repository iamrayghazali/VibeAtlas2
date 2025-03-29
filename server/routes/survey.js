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

router.get('/:country/cities', async (req, res) => {
    const country = req.params.country;
    try {
        const cityNames = await getCityNames(country);
        res.json({ names: cityNames });
    } catch (e) {
        console.log(e);
        res.status(404);
    }
})

module.exports = router;