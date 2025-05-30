jest.mock('../models', () => ({
    sequelize: {
        sync: jest.fn().mockResolvedValue(),
    },
    initializeAssociations: jest.fn(),
    User: {
        findOne: jest.fn(),
    }
}));

jest.mock('../utils/aiService', () => ({
    getTravelRecommendations: jest.fn(),
}));

import request from 'supertest';
import app from '../app';
import { getTravelRecommendations } from '../utils/aiService';
import { User } from '../models';

describe('Recommendations API', () => {
    it('should return travel recommendations', async () => {
        const mockUser = { id: 1, uid: '123' };
        const mockResults = [{ city: 'Rome', country: 'Italy' }];

        User.findOne.mockResolvedValue(mockUser);
        getTravelRecommendations.mockResolvedValue(mockResults);

        const res = await request(app).get('/api/recommendations/123/Rome/Italy');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockResults);
    });

    it('should return 404 if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app).get('/api/recommendations/999/Rome/Italy');

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('User not found');
    });
});