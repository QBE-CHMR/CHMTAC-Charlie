const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary

describe('Report Route', () => {
    test('should return a list of reports', async () => {
        const response = await request(app).get('/api/reports');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('should create a new report', async () => {
        const newReport = { title: 'Test Report', content: 'This is a test report.' };
        const response = await request(app).post('/api/reports').send(newReport);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newReport.title);
    });
});