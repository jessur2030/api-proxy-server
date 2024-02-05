import redis from '../../config/redisConfig';

/**
 * Provides caching services using Redis as the backend store.
 */class CacheService {
    /**
     * Retrieves a value from Redis cache and parses it as JSON.
     * 
     * @param {string} key - The key to retrieve from the cache.
     * @returns {Promise<any | null>} - The parsed JSON object associated with the key in the cache, or null if the key does not exist or an error occurs.
     */
    async get(key: string): Promise<any | null> {
        try {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting key ${key} from Redis`, error);
            return null;
        }
    }

    /**
     * Serializes an object to a JSON string and sets it in Redis cache with an optional time-to-live (TTL).
     * 
     * @param {string} key - The key under which to store the value.
     * @param {any} value - The object to serialize and store in the cache.
     * @param {number} [ttl=3600] - The time-to-live (TTL) in seconds. Defaults to 3600 seconds (1 hour).
     * @returns {Promise<void>}
     */
    async set(key: string, value: any, ttl = 3600): Promise<void> {
        console.log(`Setting key ${key} in Redis`, `Value: ${value}`, `TTL: ${ttl}`)

        try {
            const stringValue = JSON.stringify(value);
            await redis.set(key, stringValue, 'EX', ttl);
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
const redisCacheService = new CacheService();
export default redisCacheService;