import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../server/server.js';
import redisClient from '../../server/redisClient.js';

vi.mock('../../server/redisClient.js'); // Use the mocked version

describe('Report Management API Tests', () => {
  beforeEach(() => {
    // Mock Redis behavior for getting a report by ID
    redisClient.get.mockImplementation((key) => {
      if (key === 'report:1') {
        return JSON.stringify({
          "publicUUID": "9e48eb63-9a08-41e0-a450-e0686ddb8137",
          "full_name": "John Doe",
          "phone_number": "555-123-4567",
          "email_address": "john.doe@example.com",
          "reporting_unit": "Alpha Unit",
          "duty_title": "Platoon Leader",
          "duty_type": "Officer",
          "duty_rank": "O-2",
          "assigned_unit": "Special Operations",
          "combat_command": "CENTCOM",
          "location": "USA",
          "start_datetime": "2023-01-01T00:00:00Z",
          "time_zone": "Etc/GMT+5",
          "total_harm": "None",
          "us_harm": "None",
          "status": "submitted"
        });
      }
      return null; // Simulate no report found for other keys
    });
  });

  it('should return a specific report by ID', async () => {
    const response = await request(app).get('/report/management/1'); // Assuming ID 1 exists
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('title', 'Mock Report');
  });

  it('should return 404 for a non-existent report ID', async () => {
    const response = await request(app).get('/report/management/9999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Report not found' });
  });
});