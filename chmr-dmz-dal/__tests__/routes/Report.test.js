import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server/server.js';

// Mock the Redis client
vi.mock('../../server/redisClient.js'); // Automatically uses the mock from __mocks__/redisClient.js

describe('Report Submission API Tests', () => {
  it('should successfully submit a valid report', async () => {
    const validReport = {
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
      "status": "initialized"
    }

    const response = await request(app)
      .post('/report?type=DOD')
      .send(validReport);

    expect(response.status).toBe(200); // Indicates success
  });

  it('should fail to submit a report with missing required fields', async () => {
    const invalidReport = {
      description: 'Missing title field',
      status: 'initialized',
    };

    const response = await request(app)
      .post('/report?type=DOD')
      .send(invalidReport);
  
    expect(response.status).toBe(400); // Assuming validation errors return 400
    expect(response.body).toEqual({
      error: 'Validation failed: title is required',
    }); // Adjust based on your API's error response
  });

  it('should fail to submit a report with an invalid status', async () => {
    const invalidReport = {
      title: 'Invalid Status Report',
      description: 'This report has an invalid status',
      status: 'invalid_status', // Invalid status
    };

    const response = await request(app)
      .post('/report?type=DOD')
      .send(invalidReport);

    expect(response.status).toBe(400); // Validation errors return 400
    expect(response.body).toEqual({
      error: 'Validation failed: status is invalid',
    });
  });

  it('should fail to submit a report with no data', async () => {
    const response = await request(app)
      .post('/report?type=DOD')
      .send({}); // Empty payload

    expect(response.status).toBe(400); // Validation errors return 400
    expect(response.body).toEqual({
      error: 'Validation failed: required fields are missing',
    }); // Adjust based on your API's error response
  });
});