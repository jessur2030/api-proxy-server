import fetch, { RequestInit } from 'node-fetch';
import { WeatherSchemaType } from "../module/weather/weather.schema";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

type WeatherEndpoint = 'weather' | 'forecast' | '';

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

/**
 * Validates the provided query parameters for a weather request. Ensures that either city name,
 * lat-lon pair, or zip code is provided. Validates that both latitude and longitude are provided together if one is present.
 *
 * @param {WeatherSchemaType} queryParams The query parameters to validate.
 * @returns {ValidationResult} An object containing the validation result and an optional message.
 */
export function appendWeatheSearchParams(searchParams: URLSearchParams, query: WeatherSchemaType) {
  const { q, lat, lon, zip } = query;
  if (q) {
    searchParams.append('q', q);
  } else if (lat !== undefined && lon !== undefined) { // Check if both lat and lon are provided
    searchParams.append('lat', lat.toString());
    searchParams.append('lon', lon.toString());
  } else if (zip) {
    searchParams.append('zip', zip);
  }
}

/**
 * Validates the provided query parameters for a weather request. Ensures that either city name,
 * lat-lon pair, or zip code is provided. Validates that both latitude and longitude are provided together if one is present.
 *
 * @param {WeatherSchemaType} queryParams The query parameters to validate.
 * @returns {ValidationResult} An object containing the validation result and an optional message.
 */
export function validateWeatherQueryParams(queryParams: WeatherSchemaType): ValidationResult {
  const requiresBothLatLon = (queryParams.lat != null || queryParams.lon != null) && !(queryParams.lat != null && queryParams.lon != null);
  const hasRequiredParams = queryParams.q || queryParams.zip || (queryParams.lat != null && queryParams.lon != null);

  if (requiresBothLatLon) {
    return { isValid: false, message: "Both latitude and longitude must be provided together." };
  }
  if (!hasRequiredParams) {
    return { isValid: false, message: "At least one of city name, lat-lon, or zip must be provided." };
  }
  return { isValid: true };
}

/**
 * Determines the weather API endpoint ('weather' or 'forecast') based on the requested URL.
 * Returns an empty string if the endpoint cannot be determined.
 *
 * @param {string} url The requested URL.
 * @returns {WeatherEndpoint} The determined endpoint, or an empty string if none matches.
 */
export function determineEndpoint(url: string): WeatherEndpoint {
  if (url.startsWith('/api/v1/weather/current')) {
    return 'weather';
  } else if (url.startsWith('/api/v1/weather/forecast')) {
    return 'forecast';
  }
  return '';
}