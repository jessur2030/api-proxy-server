import {FastifyInstance} from 'fastify';
import { currentWeatherDataHandler } from './weather.controller';
import { WeatherSchemaJsonSchema } from './weather.schema';

export async function weatherRoutes(app: FastifyInstance) {
    app.get('/current', 
    {
        schema: {
            querystring: WeatherSchemaJsonSchema,
          },
      },
    currentWeatherDataHandler)
    app.get('/forecast', currentWeatherDataHandler)
}