import {FastifyInstance} from 'fastify';
import { weatherDataHandler } from './weather.controller';

export async function weatherRoutes(app: FastifyInstance) {
    app.get('/', weatherDataHandler)
}