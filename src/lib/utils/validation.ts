import { z } from "zod";

export const personalizationSchema = z.object({
  childName: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be 30 characters or less"),
  childAge: z
    .number()
    .min(2, "Age must be at least 2")
    .max(15, "Age must be 15 or less"),
  parentName: z.string().max(30).optional(),
});

export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, "API key is required")
    .startsWith("AIza", "API key must start with AIza"),
});

export const storyGenerationSchema = z.object({
  childName: z.string().min(1).max(30),
  childAge: z.number().min(2).max(15),
  parentName: z.string().optional(),
  topic: z.string().min(1),
  artStyle: z.string().min(1),
  locale: z.enum(["en", "uk"]),
  apiKey: z.string().min(1),
});

export type PersonalizationInput = z.infer<typeof personalizationSchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type StoryGenerationInput = z.infer<typeof storyGenerationSchema>;
