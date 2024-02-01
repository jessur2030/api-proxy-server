import "dotenv/config";
import { FastifyRequest, FastifyReply } from "fastify";
import { WeatherSchemaType } from "./weather.schema";
import { fetchData } from "../../lib/util";

const OPEN_WEATHER_API_BASE_URL = process.env.OPEN_WEATHER_API_BASE_URL as string;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY as string;

if (!OPEN_WEATHER_API_BASE_URL || !OPEN_WEATHER_API_KEY) {
  throw new Error('OpenWeather API key or base URL missing');
}

export async function currentWeatherDataHandler(request: FastifyRequest<{
  Querystring: WeatherSchemaType;
}>, reply: FastifyReply) {
    const searchParams = new URLSearchParams({
      appid: OPEN_WEATHER_API_KEY
    });
  const queryParams = request.query;
  if (Object.keys(queryParams).length === 0) {
    reply.status(400).send({status: false, message: "At least one of city, lat-lon, or zip must be provided", response: []})
  }

  appendSearchParams(searchParams, queryParams);
  try {
    const url = `${OPEN_WEATHER_API_BASE_URL}/weather?${searchParams.toString()}`;
    const data = await fetchData(url);
   reply.status(200).send({status: true, message: "Weather data fetched successfully", response: data})
  } catch (error) {
    console.log(error)
    reply.status(500).send({status: false, message: "Error fetching weather data", response: []})
  }
}

function appendSearchParams(searchParams: URLSearchParams, query: WeatherSchemaType) {
  const { q, lat, lon, zip } = query;
    if (q) {
      searchParams.append('q', q);
    } else if (lat && lon) {
      searchParams.append('lat', lat)
      searchParams.append('lon', lon);
    } else if (zip) {
      searchParams.append('zip', zip);
    }
}