# Reverse Proxy Server

This is a reverse proxy server built using Fastify.

## Description

A reverse proxy server acts as an intermediary between clients and servers. It receives requests from clients and forwards them to the appropriate server. This allows for load balancing, caching, and other advanced routing techniques.

## Dependencies

- [@fastify/cors](https://www.npmjs.com/package/@fastify/cors): ^8.5.0
- [@fastify/swagger](https://www.npmjs.com/package/@fastify/swagger): ^8.14.0
- [dotenv](https://www.npmjs.com/package/dotenv): ^16.4.1
- [fastify](https://www.npmjs.com/package/fastify): ^4.25.2
- [zod](https://www.npmjs.com/package/zod): ^3.22.4

## Commands

- `dev`: Run the TypeScript compiler in watch mode for src/main.ts using tsx.
- `build`: Build the TypeScript project using tsc.