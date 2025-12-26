export type AspectRatio =
  | "1:1"
  | "4:3"
  | "3:2"
  | "16:9"
  | "21:9"
  | "3:4"
  | "2:3"
  | "9:16"
  | "5:4"
  | "4:5";

export interface GenerateImageOptions {
  referenceImage?: string;
  aspectRatio?: AspectRatio;
}

export interface StoryGenerationRequest {
  childName: string;
  childAge: number;
  parentName?: string;
  topic: string;
  artStyle: string;
  locale: "en" | "uk";
  existingTags?: string[];
}

export interface StoryChunk {
  pageNumber: number;
  text: string;
  sceneDescription: string;
}

export interface GeneratedStory {
  title: string;
  storyText: string;
  chunks: StoryChunk[];
  lesson: string;
  summaryTags: string;
  wordCount: number;
}
