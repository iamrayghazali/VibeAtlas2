import { jest } from '@jest/globals';

await jest.unstable_mockModule('../models/index.js', () => ({
    SearchHistory: {
        findAll: jest.fn(),
        create: jest.fn(),
    },
    SurveyOption: {},
    SurveyQuestion: {},
    SurveyResponse: {},
    User: {},
    sequelize: {
        sync: jest.fn(() => Promise.resolve()),
    },    initializeAssociations: () => {},
}));

const { SearchHistory } = await import('../models/index.js');
const request = (await import('supertest')).default;
const app = (await import('../app.js')).default;

describe('Search History Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/history/:userId/searches - should return 404 if none found', async () => {
        SearchHistory.findAll.mockResolvedValue([]);

        const res = await request(app).get('/api/history/1/searches');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/no search history/i);
    });

    it('GET /api/history/:userId/searches - should return 200 with history', async () => {
        SearchHistory.findAll.mockResolvedValue([
            {
                user_id: 1,
                country: 'France',
                city: 'Paris',
                searched_at: new Date().toISOString(),
            },
        ]);

        const res = await request(app).get('/api/history/1/searches');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.searchHistory)).toBe(true);
        expect(res.body.searchHistory[0]).toHaveProperty('country', 'France');
    });

    it('POST /api/history/:userId/searches - should save new history', async () => {
        SearchHistory.create.mockResolvedValue({
            user_id: 1,
            country: 'Germany',
            city: 'Berlin',
            searched_at: new Date().toISOString(),
        });

        const res = await request(app)
            .post('/api/history/1/searches')
            .send({ country: 'Germany', city: 'Berlin' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('city', 'Berlin');
    });
});