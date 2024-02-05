import { FastifyRequest, FastifyReply } from "fastify";
import { WeatherSchemaType } from "./weather.schema";
import { appendWeatheSearchParams, determineEndpoint, fetchData, validateWeatherQueryParams } from "../../lib/utils";
import { cacheService } from "../../lib/services/cacheService";
// import redisCacheService from "../../lib/services/redisCacheService";

const OPEN_WEATHER_API_BASE_URL = process.env.OPEN_WEATHER_API_BASE_URL as string;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY as string;

  export async function handleWeatherData(request: FastifyRequest<{
  Querystring: WeatherSchemaType;
}>, reply: FastifyReply) {
  const endpoint = determineEndpoint(request.url);
  const queryParams = request.query;
  
  const { q, lat, lon, zip } = request.query as WeatherSchemaType;
  const cacheKey: string = `${endpoint}-${q || lat + ',' + lon || zip}`;
  
  // Cache-Control header for each response
  reply.header('Cache-Control', 'public, max-age=300'); // Set cache control header to 5 minutes
  // Attempt to retrieve data from cache
  const cachedData = await cacheService.get(cacheKey);
  // const cachedData = await redisCacheService.get(cacheKey);
  if (cachedData) {
    return reply.status(200).send({status: true, message: "Weather data fetched successfully", response: cachedData});
  }
  const validation = validateWeatherQueryParams(queryParams);
  if (!validation.isValid) {
    return reply.status(400).send({ status: false, message: validation.message });
  }
  
  const searchParams = new URLSearchParams({ appid: OPEN_WEATHER_API_KEY });
  appendWeatheSearchParams(searchParams, queryParams);
  
  try {
    const url = `${OPEN_WEATHER_API_BASE_URL}/${endpoint}?${searchParams.toString()}`;
    console.log(`Fetching weather data from: ${url}`); // For debugging
    const freshData  = await fetchData(url);
   await cacheService.set(cacheKey, freshData , 300); // Cache for 5 minutes
    // await redisCacheService.set(cacheKey, freshData , 300); // Cache for 5 minutes
    return reply.status(200).send({status: true, message: "Weather data fetched successfully", response: freshData });
  } catch (error) {
    console.error('Error fetching weather data:', error); // Detailed logging
    return reply.status(500).send({ error: "Internal Server Error", message: "Error fetching weather data" });
  }
}
