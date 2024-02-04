import { FastifyInstance } from 'fastify';
import { handleWeatherData } from './weather.controller';
import { weatherQueryJsonSchema, weather200ResponseJsonSchema, weatherErrorResponseJsonSchema } from './weather.schema';

export async function weatherRoutes(app: FastifyInstance) {
  app.get('/current', {
    schema: {
      tags: ['Weather'],
      summary: 'Get current weather data for a location.',
      description: 'Get the current weather data for a location by city name, lat-lon pair, or zip code.',
      querystring: weatherQueryJsonSchema,
      response: {
        200: weather200ResponseJsonSchema,
        400: weatherErrorResponseJsonSchema,
        500: weatherErrorResponseJsonSchema,
      }
    }
  }, handleWeatherData);
  app.get('/forecast', {
    schema: {
      tags: ['Weather'],
      summary: 'Get weather forecast data for a location.',
      description: 'Get the weather forecast data for a location by city name, lat-lon pair, or zip code.',
      querystring: weatherQueryJsonSchema,
      response: {
        200: weather200ResponseJsonSchema,
        400: weatherErrorResponseJsonSchema,
        500: weatherErrorResponseJsonSchema,
      }
    }
  }, handleWeatherData);
}
