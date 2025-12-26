import type { StoryChunk } from "@/lib/gemini/types";

export interface ParsedStory {
  title: string;
  scenes: StoryChunk[];
  lesson: string;
  summaryTags: string;
}

export function parseStoryResponse(response: string): ParsedStory {
  // Try to extract JSON from the response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse story response - no JSON found");
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      title: parsed.title || "Untitled Story",
      scenes: (parsed.scenes || []).map(
        (scene: { pageNumber: number; text: string; sceneDescription: string }, index: number) => ({
          pageNumber: scene.pageNumber || index + 1,
          text: scene.text || "",
          sceneDescription: scene.sceneDescription || "",
        })
      ),
      lesson: parsed.lesson || "",
      summaryTags: parsed.summaryTags || "",
    };
  } catch {
    throw new Error("Could not parse story response - invalid JSON");
  }
}

export function calculateWordCount(scenes: StoryChunk[]): number {
  return scenes.reduce((total, scene) => {
    return total + scene.text.split(/\s+/).filter(Boolean).length;
  }, 0);
}
