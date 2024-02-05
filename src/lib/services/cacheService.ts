// cacheService.ts
import NodeCache from 'node-cache';

// Create a NodeCache instance
const cache = new NodeCache({ stdTTL: 600 }); // Default TTL is 10 minutes

/**
 * Retrieves a value from the cache.
 * 
 * @param key - The cache key to retrieve.
 * @returns The cached value or undefined if not found.
 */
async function get<T>(key: string): Promise<T | undefined>{
    try {
        return cache.get<T>(key);
    } catch (error) {
        console.error(`Cache get error for key ${key}: ${error}`);
    }
}

/**
 * Stores a value in the cache.
 * 
 * @param key - The cache key under which to store the value.
 * @param value - The value to store.
 * @param ttl - Time to live in seconds. Defaults to 600 seconds.
 * @returns True on success, false on failure.
 */
async function set<T>(key: string, value: T, ttl: number = 600): Promise<boolean> {
    try {
        return cache.set(key, value, ttl);
    } catch (error) {
        console.error(`Cache set error for key ${key}: ${error}`);
        return false;
    }
}

/**
 * Removes a value from the cache.
 * 
 * @param key - The cache key to remove.
 * @returns The number of removed entries, 1 if an entry was deleted.
 */
async function del(key: string): Promise<number> {
    try {
        return cache.del(key);
    } catch (error) {
        console.error(`Cache delete error for key ${key}: ${error}`);
        return 0; // Indicates failure to delete due to error
    }
}

/**
 * Clears the entire cache. Use with caution.
 * 
 * @returns void
 */
async function flush(): Promise<void> {
    try {
        cache.flushAll();
    } catch (error) {
        console.error(`Cache flush error: ${error}`);
        // In case of flush failure, consider re-throwing, or handle accordingly
    }
}

export const cacheService = { get, set, del, flush };
