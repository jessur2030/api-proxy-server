import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";

export const WeatherSchema = z.object({
  q: z.string().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  zip: z.string().optional(),
}).refine(data => {
  // At least one of the city, lat-lon, or zip should be provided
  return !!(data.q || (data.lat && data.lon) || data.zip);
}, {
  // Custom error message
  message: 'At least one of city, lat-lon, or zip must be provided',
});

export type WeatherSchemaType = z.infer<typeof WeatherSchema>;
export const WeatherSchemaJsonSchema = zodToJsonSchema(WeatherSchema, "WeatherSchema");
