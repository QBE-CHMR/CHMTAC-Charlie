import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server/server.js';

vi.mock('../../server/redisClient.js'); // Automatically uses the mock from __mocks__/redisClient.js

describe('Report Management API Tests', () => {
  it('should return a specific report by ID', async () => {
    const response = await request(app).get('/report/management/1'); // Assuming ID 1 exists
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should return 404 for a non-existent report ID', async () => {
    const response = await request(app).get('/report/management/9999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Report not found' });
  });
});