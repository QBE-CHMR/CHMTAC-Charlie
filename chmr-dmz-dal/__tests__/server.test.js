console.log('Test file is being loaded...');
import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../server/server.js';
console.log('App and dependencies imported successfully.');

// jest.setTimeout(10000);

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