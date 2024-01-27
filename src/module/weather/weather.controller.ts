import { FastifyRequest, FastifyReply } from "fastify";

export async function weatherDataHandler(request: FastifyRequest, reply: FastifyReply){
    return {hello: "world"}
}