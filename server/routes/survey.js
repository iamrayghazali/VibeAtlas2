const express = require('express');
const router = express.Router();
const { SurveyQuestion, SurveyOption } = require('../models');

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
        res.status(500)
    }
});

module.exports = router;