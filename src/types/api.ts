export interface ValidateKeyRequest {
  apiKey: string;
}

export interface ValidateKeyResponse {
  valid: boolean;
  error?: string;
  warning?: string;
}

export interface GenerateStoryRequest {
  childName: string;
  childAge: number;
  parentName?: string;
  topic: string;
  artStyle: string;
  locale: "en" | "uk";
  apiKey: string;
}

export interface GenerateStoryResponse {
  storyId: string;
  title: string;
  pages: {
    pageNumber: number;
    text: string;
    imageUrl: string;
  }[];
  coverImageUrl: string;
  lesson: string;
}

export interface GetStoryResponse {
  id: string;
  title: string;
  childName: string;
  childAge: number;
  parentName?: string;
  topic: string;
  artStyle: string;
  language: "en" | "uk";
  pages: {
    pageNumber: number;
    text: string;
    imageUrl: string;
  }[];
  coverImageUrl: string;
  lesson: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  code?: string;
}
