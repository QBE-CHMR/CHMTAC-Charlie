import request from 'supertest';
import app from '../../server/server.js';

describe('Report Router Tests', () => {
  it('should return all reports when no status is provided', async () => {
    const response = await request(app).get('/report');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
  });

  it('should return reports filtered by status', async () => {
    const response = await request(app).get('/report?status=initialized');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(report => {
      expect(report.status).toBe('initialized');
    });
  });

  it('should return 404 for a non-existent report', async () => {
    const response = await request(app).get('/report/9999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Report not found' });
  });
});