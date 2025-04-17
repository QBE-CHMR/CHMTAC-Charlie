import { createClient } from 'redis';

const redisUrl = process.env.REDIS_HOST;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await redisClient.connect();

export { redisClient };
