import express from 'express';
import { SearchHistory } from '../models/index.js';
const router = express.Router();

router.get('/:userId/searches', async (req, res) => {
    try {
        const searchHistory = await SearchHistory.findAll({
            where: {
                user_id: req.params.userId,
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

        const searchHistory = await SearchHistory.create({
            user_id: userId,
            country: country,
            city: city,
            searched_at: new Date()
        });

        res.status(201).json(searchHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;