import { jest } from '@jest/globals';

const redisClient = {
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(true),
  quit: jest.fn().mockResolvedValue(true),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

export default redisClient;