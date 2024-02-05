import Redis from 'ioredis';

// 
/**
 *  The Redis client instance using local redis service.
 * */
const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379, // Default Redis port
	password: process.env.REDIS_PASSWORD,
	// other configuration options
});

/**
 *  The Redis client instance using upstash redis service.
 * */
// const REDIS_URL = (`redis://default:${process.env.UPSTASH_REDIS_PASSWORD}@${process.env.UPSTASH_REDIS_ENDPOINT}:${process.env.UPSTASH_REDIS_PORT}`) as string
// const redis = new Redis(REDIS_URL);

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (error) => console.error('Redis Error:', error));

export default redis;   