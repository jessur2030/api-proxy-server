import { FastifyRequest, FastifyReply } from "fastify";
import { WeatherSchemaType } from "./weather.schema";
import { appendWeatherSearchParams, determineEndpoint, fetchData, validateWeatherQueryParams } from "../../lib/utils";
import redisCacheService from "../../lib/services/redisCacheService";

const OPEN_WEATHER_API_BASE_URL = process.env.OPEN_WEATHER_API_BASE_URL as string;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY as string;

export async function handleWeatherData(request: FastifyRequest<{ Querystring: WeatherSchemaType; }>, reply: FastifyReply) {
  const endpoint = determineEndpoint(request.url);
  const queryParams = request.query;
  
  const { q, lat, lon, zip } = queryParams;
  const cacheKey: string = `${endpoint}-${q || lat + ',' + lon || zip}`;
  // Set cache control header to 5 minutes
  reply.header('Cache-Control', 'public, max-age=300');

  // Attempt to retrieve data from cache
  const cachedData = await redisCacheService.get(cacheKey);
  if (cachedData) {
    return reply.status(200).send({ success: true, message: "Weather data fetched successfully from cache", data: cachedData });
  }

  const validation = validateWeatherQueryParams(queryParams);
  if (!validation.isValid) {
    return reply.status(400).send({ success: false, message: validation.message });
  }

  const searchParams = new URLSearchParams({ appid: OPEN_WEATHER_API_KEY });
  appendWeatherSearchParams(searchParams, queryParams);

  try {
    const url = `${OPEN_WEATHER_API_BASE_URL}/${endpoint}?${searchParams.toString()}`;
    const freshData = await fetchData(url);
    await redisCacheService.set(cacheKey, freshData, 300); // Cache for 5 minutes
    return reply.status(200).send({ success: true, message: "Weather data fetched successfully", data: freshData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return reply.status(500).send({ success: false, message: "Failed to fetch weather data", error: errorMessage });
  }
}