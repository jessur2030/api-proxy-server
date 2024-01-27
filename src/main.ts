import fastify, {FastifyInstance} from 'fastify';
import dotenv from 'dotenv';
import fastifyCors from "@fastify/cors";
import { weatherRoutes } from './module/weather/weather.route';
dotenv.config();

const PORT = parseInt(process.env.PORT || "9000", 10)
const HOST = process.env.HOST || "0.0.0.0"
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV;

/**
 * Builds the server instance.
 * @returns {Promise<FastifyInstance>} The server instance.
 */
export async function buildServer(): Promise<FastifyInstance> {
    const app = fastify()

     /**
     * Healthcheck route.
     * @returns {Object} The healthcheck response.
     */
    app.get('/healthcheck', ()=>{
        return {status: "Ok", port: PORT, timestamp: new Date().toISOString()}
    })

    // register routes
    app.register(weatherRoutes, {prefix: '/api/v1/weather'})

    // register cors
    app.register(fastifyCors, {
        origin: CORS_ORIGIN
    })

    return app;
}


async function main(){
    const app =  await buildServer();

    await app.listen({
        port: PORT,
        host: HOST
    })
    console.log(`Server running on port ${PORT}`);
}

main();