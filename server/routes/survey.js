const express = require('express');
const router = express.Router();
const { SurveyQuestion, SurveyOption } = require('../models');

router.get('/questions', async (req, res) => {
    try {
        // Log the actual table name Sequelize is using
        console.log('Survey Questions Table Name:', SurveyQuestion.getTableName());

        const questions = await SurveyQuestion.findAll({
            include: [{
                model: SurveyOption,
                as: 'options',
                attributes: ['id', 'option_text']
            }]
        });

        console.log('Questions count:', questions.length);
        console.log('Questions:', JSON.stringify(questions, null, 2));

        res.json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;