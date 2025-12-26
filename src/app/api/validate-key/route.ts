import { NextResponse } from "next/server";
import { z } from "zod";
import { createGeminiClient } from "@/lib/gemini/client";
import { generateText } from "@/lib/gemini/generate-text";

const schema = z.object({
  apiKey: z.string().startsWith("AIza"),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { valid: false, error: "Invalid API key format" },
        { status: 400 }
      );
    }

    const { apiKey } = result.data;

    try {
      const client = createGeminiClient(apiKey);
      await generateText(client, "Say hello in exactly one word.");
      return NextResponse.json({ valid: true });
    } catch (error) {
      console.error("API key validation failed:", error);

      // Check if it's a rate limit error
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("429") || errorMessage.includes("rate")) {
        return NextResponse.json({
          valid: true,
          warning: "Rate limited, but key appears valid",
        });
      }

      return NextResponse.json(
        { valid: false, error: "Invalid API key" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
