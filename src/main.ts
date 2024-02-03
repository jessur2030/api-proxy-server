import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import {fastifySwagger} from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { weatherRoutes } from './module/weather/weather.route';
import { healthcheckResponseJsonSchema } from "./module/weather/weather.schema";

const PORT = parseInt(process.env.PORT || "9000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV;

/**
 * Builds the server instance.
 * @returns {Promise<FastifyInstance>} The server instance.
 */
export async function buildServer(): Promise<FastifyInstance> {
    const app = fastify()

	await app.register(fastifySwagger, {
        mode: "dynamic",
		swagger: {
            info: {
                title: "Proxy server API",
				version: "0.1.0",
                description: "Proxy server API",

			},
		},


	});

	await app.register(fastifySwaggerUi, {
		routePrefix: "/docs",

	});

    /**
    * Healthcheck route.
    * @returns {Object} The healthcheck response.
    */
   app.get('/healthcheck',  {schema: {response: {200: healthcheckResponseJsonSchema,},}}, ()=>{
        return {status: "Ok", port: PORT, timestamp: new Date().toISOString()}
    })

    // // register weather routes with prefix api/v1/weather
    app.register(weatherRoutes, { prefix: '/api/v1/weather' })

    // add schema for weather routes
    return app;
}

async function main(){
    const app =  await buildServer();
    await app.listen({
        port: PORT,
        host: HOST
    })
    console.log(`Server running on port http://${HOST}:${PORT} in ${NODE_ENV} mode`);
}

main();