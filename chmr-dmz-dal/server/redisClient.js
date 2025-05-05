console.log('Real Redis client loaded');
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_HOST || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

//await redisClient.connect();

export default redisClient;
