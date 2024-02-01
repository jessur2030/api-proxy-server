import fetch, { RequestInit } from 'node-fetch';

/**
 * Interface representing a successful data response with typed data.
 *
 * @template T The type of the data in the response.
 */
interface DataResponse<T> {
  data: T;
}

/**
 * Fetches data from a URL using node-fetch with robust error handling and type safety.
 *
 * @template T The type of the data expected in the response.
 * @param url The URL to fetch data from.
 * @param options Optional request options (e.g., headers, method, body).
 * @returns A promise resolving to a `DataResponse` object containing the fetched data.
*/
export async function fetchData<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<DataResponse<T>> {
    try {
      const response = await fetch(url, options);
  
      // Check for successful status codes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Type assertion to ensure the response is JSON with the expected type
      const data = await response.json() as T; // Type assertion here
      return  data as DataResponse<T>;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw to allow handling in calling code
    }
  }