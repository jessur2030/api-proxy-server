import Redis from 'ioredis';

// Use environment variables to configure the Redis connection string
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL);

redis.on('connect', () => console.log('Connected to Redis'));

redis.on('error', (error) => console.error('Redis Error:', error));

export default redis;