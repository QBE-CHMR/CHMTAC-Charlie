import { jest } from '@jest/globals';
import request from 'supertest';

// Use unstable_mockModule to mock the Redis client
await jest.unstable_mockModule('../server/redisClient.js', async () => {
  console.log('Mock Redis client loaded');
  return import('../server/__mocks__/redisClient.js'); // Import the mock from __mocks__
});

// Dynamically import the mocked Redis client and the app
const redisClient = (await import('../server/redisClient.js')).default;
const app = (await import('../server/server.js')).default;


// Ensure the mock Redis client methods are properly mocked
redisClient.on.mockImplementation(() => {});
redisClient.connect.mockResolvedValue(true);
redisClient.quit.mockResolvedValue(true);

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
});