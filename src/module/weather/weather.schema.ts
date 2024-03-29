import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";

const weatherQuerySchema = z.object({
  q: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  zip: z.string().optional(),
});

const weatherDataSchema = z.unknown();

export const weather200ResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: weatherDataSchema.optional(), 
});

export const weatherErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
});

export const healthcheckResponseSchema = z.object({
  status: z.string(),
  port: z.number(),
  timestamp: z.string(),
});

export type WeatherSchemaType = z.infer<typeof weatherQuerySchema>;
export type Weather200ResponseSchemaType = z.infer<typeof weather200ResponseSchema>;
export type HealthcheckResponseSchemaType = z.infer<typeof healthcheckResponseSchema>;

// Exporting JSON Schemas for Fastify and Swagger
export const weatherQueryJsonSchema = zodToJsonSchema(weatherQuerySchema);
export const weather200ResponseJsonSchema = zodToJsonSchema(weather200ResponseSchema);
export const weatherErrorResponseJsonSchema = zodToJsonSchema(weatherErrorResponseSchema);
export const healthcheckResponseJsonSchema = zodToJsonSchema(healthcheckResponseSchema);