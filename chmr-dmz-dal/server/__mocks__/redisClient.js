import { vi } from 'vitest';

const redisClient = {
    isOpen: true,
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(true),
    quit: vi.fn().mockResolvedValue(true),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    sendCommand: vi.fn().mockResolvedValue('OK'),
};

export default redisClient;