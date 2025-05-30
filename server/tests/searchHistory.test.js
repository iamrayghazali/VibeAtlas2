jest.mock('../models', () => ({
    sequelize: {
        sync: jest.fn().mockResolvedValue(),
    },
    initializeAssociations: jest.fn(),
    SearchHistory: {
        findAll: jest.fn(),
        create: jest.fn(),
    }
}));

import request from 'supertest';
import app from '../app';
const { SearchHistory } = require('../models');

describe('SearchHistory API', () => {
    it('should return search history for user', async () => {
        const fakeHistory = [{ id: 1, city: 'Paris', country: 'France' }];
        SearchHistory.findAll.mockResolvedValue(fakeHistory);

        const res = await request(app).get('/api/history/123/searches');
        expect(res.statusCode).toBe(200);
        expect(res.body.searchHistory).toEqual(fakeHistory);
    });

    it('should return 404 if no search history', async () => {
        SearchHistory.findAll.mockResolvedValue([]);

        const res = await request(app).get('/api/history/123/searches');
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('No search history found for this user');
    });

    it('should create new search history', async () => {
        const newEntry = { id: 1, city: 'Berlin', country: 'Germany' };
        SearchHistory.create.mockResolvedValue(newEntry);

        const res = await request(app)
            .post('/api/history/123/searches')
            .send({ country: 'Germany', city: 'Berlin' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(newEntry));
    });

    it('should return 400 if country or city missing', async () => {
        const res = await request(app)
            .post('/api/history/123/searches')
            .send({ country: 'Germany' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Country and City are required');
    });
});