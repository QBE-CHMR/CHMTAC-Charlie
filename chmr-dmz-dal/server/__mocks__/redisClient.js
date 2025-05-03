// export const redisClient = {
//     get: jest.fn(),
//     set: jest.fn(),
//     del: jest.fn(),
//     connect: jest.fn(),
//     quit: jest.fn(),
//   };
const redisClient = {
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(true),
  quit: jest.fn().mockResolvedValue(true),
};

export default redisClient;