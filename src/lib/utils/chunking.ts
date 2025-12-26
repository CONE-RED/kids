import type { StoryChunk } from "@/lib/gemini/types";

export interface StoryWorld {
  setting: string;
  visualStyle: string;
}

export interface StoryCharacter {
  name: string;
  role: string;
  appearance: string;
}

export interface ExtendedStoryChunk extends StoryChunk {
  charactersInScene: string[];
}

export interface ParsedStory {
  title: string;
  storyWorld: StoryWorld;
  characters: StoryCharacter[];
  scenes: ExtendedStoryChunk[];
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

    // Parse story world metadata
    const storyWorld: StoryWorld = {
      setting: parsed.storyWorld?.setting || "A magical world",
      visualStyle: parsed.storyWorld?.visualStyle || "Warm and colorful",
    };

    // Parse characters
    const characters: StoryCharacter[] = (parsed.characters || []).map(
      (char: { name: string; role: string; appearance: string }) => ({
        name: char.name || "Unknown",
        role: char.role || "character",
        appearance: char.appearance || "",
      })
    );

    return {
      title: parsed.title || "Untitled Story",
      storyWorld,
      characters,
      scenes: (parsed.scenes || []).map(
        (scene: { pageNumber: number; text: string; sceneDescription: string; charactersInScene?: string[] }, index: number) => ({
          pageNumber: scene.pageNumber || index + 1,
          text: scene.text || "",
          sceneDescription: scene.sceneDescription || "",
          charactersInScene: scene.charactersInScene || [],
        })
      ),
      lesson: parsed.lesson || "",
      summaryTags: parsed.summaryTags || "",
    };
  } catch {
    throw new Error("Could not parse story response - invalid JSON");
  }
}

/**
 * Build a description of characters for a specific scene
 */
export function buildCharactersDescription(
  allCharacters: StoryCharacter[],
  charactersInScene: string[]
): string {
  if (charactersInScene.length === 0) {
    // If no specific characters listed, include all
    return allCharacters
      .map((c) => `- ${c.name} (${c.role}): ${c.appearance}`)
      .join("\n");
  }

  // Filter to only characters in this scene
  const sceneCharacters = allCharacters.filter((c) =>
    charactersInScene.some((name) =>
      name.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  if (sceneCharacters.length === 0) {
    // Fallback to all characters if no match found
    return allCharacters
      .map((c) => `- ${c.name} (${c.role}): ${c.appearance}`)
      .join("\n");
  }

  return sceneCharacters
    .map((c) => `- ${c.name} (${c.role}): ${c.appearance}`)
    .join("\n");
}

export function calculateWordCount(scenes: StoryChunk[]): number {
  return scenes.reduce((total, scene) => {
    return total + scene.text.split(/\s+/).filter(Boolean).length;
  }, 0);
}
