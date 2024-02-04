import { FastifyRequest, FastifyReply } from "fastify";
import { WeatherSchemaType } from "./weather.schema";
import { appendWeatheSearchParams, determineEndpoint, fetchData, validateWeatherQueryParams } from "../../lib/utils";

const OPEN_WEATHER_API_BASE_URL = process.env.OPEN_WEATHER_API_BASE_URL as string;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY as string;

  export async function handleWeatherData(request: FastifyRequest<{
  Querystring: WeatherSchemaType;
}>, reply: FastifyReply) {

  const endpoint = determineEndpoint(request.url);
  const searchParams = new URLSearchParams({ appid: OPEN_WEATHER_API_KEY });
  const queryParams = request.query;
  const validation = validateWeatherQueryParams(queryParams);
  if (!validation.isValid) {
    return reply.status(400).send({ status: false, message: validation.message });
  }

  appendWeatheSearchParams(searchParams, queryParams);
  
  try {
    const url = `${OPEN_WEATHER_API_BASE_URL}/${endpoint}?${searchParams.toString()}`;
    console.log(`Fetching weather data from: ${url}`); // For debugging
    const data = await fetchData(url);
    // Format data as per SuccessResponseSchema before sending
    return reply.status(200).send({status: true, message: "Weather data fetched successfully", response: data});
  } catch (error) {
    console.error('Error fetching weather data:', error); // Detailed logging
    return reply.status(500).send({ error: "Internal Server Error", message: "Error fetching weather data" });
  }
}
