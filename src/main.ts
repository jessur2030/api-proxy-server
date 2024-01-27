import fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env.PORT || "9000", 10)
const HOST = process.env.HOST || "0.0.0.0"
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV;

export async function buildServer(){
    const app = await fastify()

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