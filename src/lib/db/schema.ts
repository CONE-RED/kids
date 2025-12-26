import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const stories = sqliteTable(
  "stories",
  {
    id: text("id").primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    language: text("language", { enum: ["en", "uk"] }).notNull(),
    childName: text("child_name").notNull(),
    childAge: integer("child_age").notNull(),
    parentName: text("parent_name"),
    topic: text("topic").notNull(),
    isCustomTopic: integer("is_custom_topic", { mode: "boolean" })
      .notNull()
      .default(false),
    artStyle: text("art_style").notNull(),
    storyText: text("story_text").notNull(),
    summaryTags: text("summary_tags").notNull(),
    lesson: text("lesson").notNull(),
    wordCount: integer("word_count").notNull(),
    generationTimeMs: integer("generation_time_ms"),
    coverImageUrl: text("cover_image_url"),
    characterSheetUrl: text("character_sheet_url"),
  },
  (table) => [
    index("idx_stories_language").on(table.language),
    index("idx_stories_topic").on(table.topic),
    index("idx_stories_created").on(table.createdAt),
  ]
);

export const images = sqliteTable("images", {
  id: text("id").primaryKey(),
  storyId: text("story_id")
    .notNull()
    .references(() => stories.id, { onDelete: "cascade" }),
  pageNumber: integer("page_number").notNull(),
  imageUrl: text("image_url").notNull(),
  imagePrompt: text("image_prompt").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const storiesRelations = relations(stories, ({ many }) => ({
  images: many(images),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  story: one(stories, {
    fields: [images.storyId],
    references: [stories.id],
  }),
}));

export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
