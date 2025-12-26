import { NextResponse } from "next/server";
import { getAllStories, getStats } from "@/lib/db/queries";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") as "en" | "uk" | null;
    const topic = searchParams.get("topic");
    const dateFilter = searchParams.get("date");

    let dateFrom: Date | undefined;
    if (dateFilter === "today") {
      dateFrom = new Date();
      dateFrom.setHours(0, 0, 0, 0);
    } else if (dateFilter === "week") {
      dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 7);
    } else if (dateFilter === "month") {
      dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - 1);
    }

    const stories = await getAllStories({
      language: language || undefined,
      topic: topic || undefined,
      dateFrom,
    });

    const stats = await getStats();

    return NextResponse.json({
      stories: stories.map((story) => ({
        id: story.id,
        childName: story.childName,
        childAge: story.childAge,
        topic: story.topic,
        artStyle: story.artStyle,
        language: story.language,
        coverImageUrl: story.coverImageUrl,
        createdAt: story.createdAt.toISOString(),
      })),
      stats,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
