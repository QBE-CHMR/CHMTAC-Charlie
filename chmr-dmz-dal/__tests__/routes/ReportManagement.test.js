import request from 'supertest';
import app from '../../server/server.js';

describe('Report Management Router Tests', () => {
  it('should return all reports for management', async () => {
    const response = await request(app).get('/report/management');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

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

  it('should download a file successfully', async () => {
    const response = await request(app).get('/report/management/files/example1.txt');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/octet-stream');
  });

  it('should return 404 for a non-existent file', async () => {
    const response = await request(app).get('/report/management/files/nonexistent.txt');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'File not found' });
  });
});