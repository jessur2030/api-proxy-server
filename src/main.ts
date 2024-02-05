import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import {fastifySwagger} from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { weatherRoutes } from './module/weather/weather.route';
import { healthcheckResponseJsonSchema } from "./module/weather/weather.schema";
import fastifyRateLimit from "@fastify/rate-limit";

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
                  description: "This API serves as a proxy.",
                  license: {
                    name: "MIT",
                    url: "https://opensource.org/licenses/MIT",
                  }
              },
              tags: [
                { name: 'Weather', description: 'Weather-related endpoints' },
                { name: '', description: 'General purpose endpoints' }
              ],
		},
	});

	await app.register(fastifySwaggerUi, {
		routePrefix: "/docs",

	});

    // register cors
    await app.register(fastifyCors, {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type"],
	});

    await app.register(fastifyRateLimit, {
        max: 100, // Max number of requests per timeWindow per client
        timeWindow: '4 hour', // Time window for the rate limit
        // allowList: ['127.0.0.1'], // Requests from these IPs will skip rate limiting
        keyGenerator: (req) => req.ip, // Function to generate keys used to track requests (default: IP)
        addHeaders: {
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true,
            'retry-after': true
        },
        errorResponseBuilder: (req, context) => ({
            code: 429,
            error: "Too Many Requests",
            message: `Rate limit exceeded, retry in ${context.after}`
        }),
    });

    /**
    * Healthcheck route.
    * @returns {Object} The healthcheck response.
    */
   app.get('/healthcheck',  {schema: {
        tags: ['Default'], 
        summary: 'Health Check',
        description: 'Performs a simple health check, returning the API status and timestamp. Useful for monitoring and uptime checks.', response: {200: healthcheckResponseJsonSchema,},}}, ()=>{
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