import request from 'supertest';
import app from '../server/server.js'; // Import the Express app

describe('Server Tests', () => {
  it('should respond to the root route with 404', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(404); // Assuming no root route is defined
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
});