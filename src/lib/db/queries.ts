import { db } from "./index";
import { stories, images, type NewStory, type NewImage, type Story } from "./schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export async function createStory(data: Omit<NewStory, "id">, id?: string): Promise<string> {
  const storyId = id ?? crypto.randomUUID();
  await db.insert(stories).values({ id: storyId, ...data });
  return storyId;
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  const result = await db.query.stories.findFirst({
    where: eq(stories.id, id),
  });
  return result;
}

export async function getStoryWithImages(id: string) {
  return db.query.stories.findFirst({
    where: eq(stories.id, id),
    with: { images: true },
  });
}

export async function addImage(data: Omit<NewImage, "id">): Promise<string> {
  const id = crypto.randomUUID();
  await db.insert(images).values({ id, ...data });
  return id;
}

export async function getUniquenessTagsByTopic(topic: string): Promise<string[]> {
  const results = await db
    .select({ tags: stories.summaryTags })
    .from(stories)
    .where(eq(stories.topic, topic))
    .limit(20);
  return results.map((r) => r.tags);
}

export interface StoryFilters {
  language?: "en" | "uk";
  topic?: string;
  dateFrom?: Date;
}

export async function getAllStories(filters?: StoryFilters) {
  const conditions = [];

  if (filters?.language) {
    conditions.push(eq(stories.language, filters.language));
  }

  if (filters?.topic) {
    conditions.push(eq(stories.topic, filters.topic));
  }

  if (filters?.dateFrom) {
    conditions.push(gte(stories.createdAt, filters.dateFrom));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.stories.findMany({
    where: whereClause,
    orderBy: [desc(stories.createdAt)],
    with: { images: true },
  });
}

export async function getStats() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(stories);
  const english = await db
    .select({ count: sql<number>`count(*)` })
    .from(stories)
    .where(eq(stories.language, "en"));
  const ukrainian = await db
    .select({ count: sql<number>`count(*)` })
    .from(stories)
    .where(eq(stories.language, "uk"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(stories)
    .where(gte(stories.createdAt, today));

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(stories)
    .where(gte(stories.createdAt, weekAgo));

  const topTopics = await db
    .select({
      topic: stories.topic,
      count: sql<number>`count(*)`,
    })
    .from(stories)
    .groupBy(stories.topic)
    .orderBy(sql`count(*) DESC`)
    .limit(3);

  return {
    total: total[0]?.count ?? 0,
    english: english[0]?.count ?? 0,
    ukrainian: ukrainian[0]?.count ?? 0,
    today: todayCount[0]?.count ?? 0,
    thisWeek: weekCount[0]?.count ?? 0,
    topTopics,
  };
}
