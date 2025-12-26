import { NextResponse } from "next/server";
import { getStoryWithImages } from "@/lib/db/queries";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Params
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const story = await getStoryWithImages(id);

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Build pages from story text paragraphs, optionally with images
    const paragraphs = story.storyText.split("\n\n").filter(Boolean);
    const imageMap = new Map(story.images.map((img) => [img.pageNumber, img.imageUrl]));

    const pages = paragraphs.map((text, index) => ({
      pageNumber: index + 1,
      text,
      imageUrl: imageMap.get(index + 1) ?? "",
    }));

    return NextResponse.json({
      id: story.id,
      title: `Story for ${story.childName}`,
      childName: story.childName,
      childAge: story.childAge,
      parentName: story.parentName,
      topic: story.topic,
      artStyle: story.artStyle,
      language: story.language,
      pages,
      coverImageUrl: story.coverImageUrl,
      lesson: story.lesson,
      createdAt: story.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}
