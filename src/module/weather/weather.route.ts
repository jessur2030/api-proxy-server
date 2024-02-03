import { FastifyInstance } from 'fastify';
import { currentWeatherDataHandler } from './weather.controller';
import { weatherQueryJsonSchema, weather200ResponseJsonSchema, weatherErrorResponseJsonSchema } from './weather.schema';

export async function weatherRoutes(app: FastifyInstance) {
  app.get('/current', {
    schema: {
      querystring: weatherQueryJsonSchema,
      response: {
        200: weather200ResponseJsonSchema,
        400: weatherErrorResponseJsonSchema,
        500: weatherErrorResponseJsonSchema,
      }
    }
  }, currentWeatherDataHandler);
  app.get('/forecast', {
    schema: {
      querystring: weatherQueryJsonSchema,
      response: {
        200: weather200ResponseJsonSchema,
        400: weatherErrorResponseJsonSchema,
        500: weatherErrorResponseJsonSchema,
      }
    }
  }, currentWeatherDataHandler);
}
