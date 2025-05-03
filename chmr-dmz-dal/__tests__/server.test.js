jest.mock('../server/redisClient.js'); // Automatically uses the mock from __mocks__/redisClient.js
import redisClient from '../server/redisClient.js'; // Import the mocked Redis client

// Ensure the mock Redis client methods are properly mocked
redisClient.on.mockImplementation(() => {});
redisClient.connect.mockResolvedValue(true);
redisClient.quit.mockResolvedValue(true);

import request from 'supertest';
import app from '../server/server.js';

console.log('Test file is being loaded...');
console.log('App and dependencies imported successfully.');

describe('Server Regression Tests', () => {
  it('should respond to the root route with 404', async () => {
    console.log('Starting test for root route...');
    const response = await request(app).get('/');
    console.log('Response received for root route:', response.status);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not Found' });
  });

  it('should respond to an unknown route with 404', async () => {
    console.log('Starting test for unknown route...');
    const response = await request(app).get('/unknown-route');
    console.log('Response received for unknown route:', response.status);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not Found' });
  });
});