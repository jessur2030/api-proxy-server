// Import axios and its types for request configurations
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { WeatherSchemaType } from "../module/weather/weather.schema";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

type WeatherEndpoint = 'weather' | 'forecast' | '';

/**
 * Generic interface for the data response to ensure type safety and consistency in the response structure.
 * @template T The type of the data being fetched.
 */
interface DataResponse<T> {
  data: T;
}

/**
 * Fetches data from a specified URL using Axios. Designed to be reusable, it abstracts the complexities of making HTTP requests and provides robust error handling.
 *
 * @template T The expected type of the data to be returned in the response.
 * @param {string} url The URL from which to fetch data.
 * @param {AxiosRequestConfig} [options={}] Optional configurations for the Axios request.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a DataResponse object containing the fetched data.
 * @throws {Error} Throws an error if the request fails or if data parsing encounters an issue.
 */
export async function fetchData<T>(url: string, options: AxiosRequestConfig = {}): Promise<DataResponse<T>> {
  try {
    const response = await axios({ url, ...options });
    // The response data is directly assigned and asserted to the generic type T for type safety.
    return { data: response.data as T };
  } catch (error) {
    const axiosError = error as AxiosError;
    // Distinguish between Axios errors (e.g., HTTP errors) and other unexpected errors.
    if (axiosError.isAxiosError) {
      // Provide detailed error information for better debugging by the developer.
      console.error(`HTTP error: ${axiosError.message}`, {
        url,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
      throw new Error(`Failed to fetch data: ${axiosError.message}`);
    } else {
      // Handle non-Axios errors, such as network issues or JSON parsing errors.
      console.error('Error fetching data:', error);
      throw new Error('An unexpected error occurred while fetching data.');
    }
  }
}

/**
 * Appends weather-related search parameters to a given URLSearchParams object based on the provided query.
 * Ensures that parameters are only added if they are valid and not undefined.
 *
 * @param searchParams The URLSearchParams object to modify.
 * @param query The query parameters containing potential weather-related information.
 */
export function appendWeatherSearchParams(searchParams: URLSearchParams, query: WeatherSchemaType): void {
  const { q, lat, lon, zip } = query;

  if (q) searchParams.append('q', q);
  if (lat !== undefined && lon !== undefined) {
    searchParams.append('lat', lat.toString());
    searchParams.append('lon', lon.toString());
  }
  if (zip) searchParams.append('zip', zip);
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