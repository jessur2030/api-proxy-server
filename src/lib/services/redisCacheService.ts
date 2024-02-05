// src/lib/services/CacheService.ts
import redis from '../../config/redisConfig';

class CacheService {
    async get(key: string): Promise<string | null> {
        try {
            return await redis.get(key);
        } catch (error) {
            console.error(`Error getting key ${key} from Redis`, error);
            return null;
        }
    }

    async set(key: string, value: string, ttl = 3600): Promise<void> {
        try {
            await redis.set(key, value, 'EX', ttl);
        } catch (error) {
            console.error(`Error setting key ${key} in Redis`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await redis.del(key);
        } catch (error) {
            console.error(`Error deleting key ${key} from Redis`, error);
        }
    }
}

// Export an instance of the CacheService
const cacheService = new CacheService();
export default cacheService;
// 