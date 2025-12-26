export interface StoryData {
  id: string;
  title: string;
  childName: string;
  childAge: number;
  parentName?: string;
  topic: string;
  artStyle: string;
  language: "en" | "uk";
  storyText: string;
  lesson: string;
  pages: StoryPage[];
  coverImageUrl?: string;
  characterSheetUrl?: string;
  createdAt: Date;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl?: string;
}

export interface GenerationProgress {
  phase: "story" | "character" | "images" | "assembly";
  current: number;
  total: number;
  message: string;
}
