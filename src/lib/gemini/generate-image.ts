import { GoogleGenAI } from "@google/genai";
import type { GenerateImageOptions } from "./types";

// Primary model for image generation
const IMAGE_MODEL = "gemini-2.5-flash-image";

export async function generateImage(
  client: GoogleGenAI,
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  console.log(`[Image] Generating with ${IMAGE_MODEL}${options.referenceImage ? " (with reference)" : ""}`);

  // Build contents array - prompt first, then optional reference image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contents: any[] = [prompt];

  // Add reference image for character consistency if provided
  if (options.referenceImage) {
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: options.referenceImage,
      },
    });
  }

  try {
    const response = await client.models.generateContent({
      model: IMAGE_MODEL,
      contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyPart = part as any;
      if (anyPart.inlineData?.data) {
        console.log("[Image] Successfully generated");
        return anyPart.inlineData.data;
      }
    }
  } catch (err) {
    console.error("[Image] Generation failed:", (err as Error).message);
    throw err;
  }

  throw new Error("No image returned from Gemini");
}
