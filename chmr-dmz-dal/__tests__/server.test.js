import request from 'supertest';
import app from '../server/server.js'; // Import the Express app

describe('Server Regression Tests', () => {
    it('should respond to the root route with 404', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not Found' });
    });

    it('should respond to an unknown route with 404', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not Found' });
    });

    it('should handle server errors gracefully', async () => {
        // Simulate a server error by mocking a route
        app.get('/error', (req, res) => {
            throw new Error('Test Error');
        });

        const response = await request(app).get('/error');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Server Error' });
    });

    it('should return 200 for the /report route', async () => {
        const response = await request(app).get('/report');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    });

    it('should return 200 for the /report/management route', async () => {
        const response = await request(app).get('/report/management');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    });

    it('should return 404 for a non-existent report ID', async () => {
        const response = await request(app).get('/report/9999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Report not found' });
    });

    it('should return 404 for a non-existent file in /report/management/files', async () => {
        const response = await request(app).get('/report/management/files/nonexistent.txt');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'File not found' });
    });

    it('should download a file successfully from /report/management/files', async () => {
        const response = await request(app).get('/report/management/files/example1.txt');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/octet-stream');
    });
});