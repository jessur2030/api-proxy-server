import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";

const weatherQuerySchema = z.object({
  q: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  zip: z.string().optional(),
})

export const weather200ResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  response: z.object({}).passthrough(), // Use .passthrough() for an open object
});

export const weatherErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export const healthcheckResponseSchema = z.object({
  status: z.string(),
  port: z.number(),
  timestamp: z.string(),
})

export type WeatherSchemaType = z.infer<typeof weatherQuerySchema>;
export type Weather200ResponseSchemaType = z.infer<typeof weather200ResponseSchema>;
export type healthcheckResponseSchemaType = z.infer<typeof healthcheckResponseSchema>;

// Exporting JSON Schemas for Fastify and Swagger
export const weatherQueryJsonSchema = zodToJsonSchema(weatherQuerySchema);
export const weather200ResponseJsonSchema = zodToJsonSchema(weather200ResponseSchema);
export const weatherErrorResponseJsonSchema = zodToJsonSchema(weatherErrorResponseSchema);
export const healthcheckResponseJsonSchema = zodToJsonSchema(healthcheckResponseSchema);


