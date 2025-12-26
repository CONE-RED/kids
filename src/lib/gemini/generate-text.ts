import { GoogleGenAI } from "@google/genai";

export async function generateText(
  client: GoogleGenAI,
  prompt: string
): Promise<string> {
  const response = await client.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
  });

  const textPart = response.candidates?.[0]?.content?.parts?.find(
    (part) => "text" in part
  );

  if (!textPart || !("text" in textPart) || !textPart.text) {
    throw new Error("No text returned from Gemini");
  }

  return textPart.text as string;
}
