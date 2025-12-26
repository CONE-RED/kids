import { NextResponse } from "next/server";
import { z } from "zod";
import { createGeminiClient } from "@/lib/gemini/client";
import { generateText } from "@/lib/gemini/generate-text";
import { generateImage } from "@/lib/gemini/generate-image";
import { getPrompt, getArtStyleDescription, fillPromptTemplate } from "@/config/prompts";
import { parseStoryResponse, calculateWordCount, buildCharactersDescription } from "@/lib/utils/chunking";
import { getTopicLesson } from "@/lib/constants/topics";
import { createStory, addImage, getUniquenessTagsByTopic } from "@/lib/db/queries";
import fs from "fs/promises";
import path from "path";

const schema = z.object({
  childName: z.string().min(1).max(30),
  childAge: z.number().min(2).max(15),
  parentName: z.string().optional(),
  childAppearance: z.string().max(200).optional(),
  topic: z.string().min(1),
  artStyle: z.string().min(1),
  locale: z.enum(["en", "uk"]),
  apiKey: z.string().min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { childName, childAge, parentName, childAppearance, topic, artStyle, locale, apiKey } = result.data;

    const client = createGeminiClient(apiKey);

    // Get existing uniqueness tags for this topic
    const existingTags = await getUniquenessTagsByTopic(topic);
    const existingTagsStr = existingTags.join("\n") || "None yet - be creative!";

    // Get lesson for the topic
    const lesson = getTopicLesson(topic, locale) || topic;

    // Generate story text
    const storyPrompt = fillPromptTemplate(getPrompt("story", locale), {
      childName,
      childAge,
      topic,
      lesson,
      artStyle,
      existingTags: existingTagsStr,
    });

    console.log("[Story] Generating story text...");
    const storyResponse = await generateText(client, storyPrompt);
    console.log("[Story] Raw response length:", storyResponse.length);
    console.log("[Story] Raw response preview:", storyResponse.substring(0, 500));

    const parsedStory = parseStoryResponse(storyResponse);
    console.log("[Story] Parsed title:", parsedStory.title);
    console.log("[Story] Story world:", parsedStory.storyWorld);
    console.log("[Story] Characters:", parsedStory.characters.map(c => c.name));
    console.log("[Story] Parsed scenes count:", parsedStory.scenes.length);
    console.log("[Story] Scenes:", parsedStory.scenes.map(s => ({ page: s.pageNumber, textLen: s.text.length, chars: s.charactersInScene })));

    const wordCount = calculateWordCount(parsedStory.scenes);

    // Build all characters description for cover
    const allCharactersDescription = buildCharactersDescription(parsedStory.characters, []);

    // Create story directory
    const storyId = crypto.randomUUID();
    const storyDir = path.join(process.cwd(), "public", "generated", storyId);
    await fs.mkdir(storyDir, { recursive: true });

    // Generate character sheet FIRST - this will be used as reference for all other images
    const characterPrompt = fillPromptTemplate(getPrompt("characterSheet", locale), {
      childName,
      childAge,
      artStyle,
      artStyleDescription: getArtStyleDescription(artStyle),
      childAppearance: childAppearance || "",
    });

    let characterSheetUrl = "";
    let characterSheetBase64 = ""; // Store for reference in subsequent images
    try {
      console.log("[Story] Generating character sheet for consistency...");
      characterSheetBase64 = await generateImage(client, characterPrompt, {
        aspectRatio: "1:1",
      });
      const characterPath = path.join(storyDir, "character-sheet.png");
      await fs.writeFile(characterPath, Buffer.from(characterSheetBase64, "base64"));
      characterSheetUrl = `/generated/${storyId}/character-sheet.png`;
      console.log("[Story] Character sheet generated successfully");
    } catch (err) {
      console.error("Character sheet generation failed:", err);
    }

    // Generate cover image (with character reference and story context for consistency)
    let coverImageUrl = "";
    try {
      const coverPrompt = fillPromptTemplate(getPrompt("coverImage", locale), {
        title: parsedStory.title,
        childName,
        topic,
        artStyle,
        artStyleDescription: getArtStyleDescription(artStyle),
        childAppearance: childAppearance || "",
        storySetting: parsedStory.storyWorld.setting,
        storyVisualStyle: parsedStory.storyWorld.visualStyle,
        charactersDescription: allCharactersDescription,
      });

      console.log("[Story] Generating cover image...");
      const coverBase64 = await generateImage(client, coverPrompt, {
        aspectRatio: "4:3",
        referenceImage: characterSheetBase64 || undefined, // Pass character sheet for consistency
      });
      const coverPath = path.join(storyDir, "cover.png");
      await fs.writeFile(coverPath, Buffer.from(coverBase64, "base64"));
      coverImageUrl = `/generated/${storyId}/cover.png`;
    } catch (err) {
      console.error("Cover generation failed:", err);
    }

    // Generate page images (all with character reference and story context for consistency)
    const pages: { pageNumber: number; text: string; imageUrl: string }[] = [];

    for (const scene of parsedStory.scenes) {
      // Build scene-specific characters description
      const sceneCharactersDescription = buildCharactersDescription(
        parsedStory.characters,
        scene.charactersInScene
      );

      const pagePrompt = fillPromptTemplate(getPrompt("pageImage", locale), {
        childName,
        sceneDescription: scene.sceneDescription,
        artStyle,
        artStyleDescription: getArtStyleDescription(artStyle),
        childAppearance: childAppearance || "",
        storySetting: parsedStory.storyWorld.setting,
        storyVisualStyle: parsedStory.storyWorld.visualStyle,
        charactersDescription: sceneCharactersDescription,
      });

      let imageUrl = "";
      try {
        console.log(`[Story] Generating page ${scene.pageNumber} image...`);
        const imageBase64 = await generateImage(client, pagePrompt, {
          aspectRatio: "4:3",
          referenceImage: characterSheetBase64 || undefined, // Pass character sheet for consistency
        });
        const imagePath = path.join(storyDir, `page-${String(scene.pageNumber).padStart(2, "0")}.png`);
        await fs.writeFile(imagePath, Buffer.from(imageBase64, "base64"));
        imageUrl = `/generated/${storyId}/page-${String(scene.pageNumber).padStart(2, "0")}.png`;
      } catch (err) {
        console.error(`Page ${scene.pageNumber} generation failed:`, err);
      }

      pages.push({
        pageNumber: scene.pageNumber,
        text: scene.text,
        imageUrl,
      });
    }

    // Save to database
    const generationTimeMs = Date.now() - startTime;

    await createStory({
      language: locale,
      childName,
      childAge,
      parentName: parentName || null,
      topic,
      isCustomTopic: !getTopicLesson(topic, locale),
      artStyle,
      storyText: parsedStory.scenes.map((s) => s.text).join("\n\n"),
      summaryTags: parsedStory.summaryTags,
      lesson: parsedStory.lesson,
      wordCount,
      generationTimeMs,
      coverImageUrl,
      characterSheetUrl,
    }, storyId);

    // Save page images to database
    for (const page of pages) {
      if (page.imageUrl) {
        await addImage({
          storyId,
          pageNumber: page.pageNumber,
          imageUrl: page.imageUrl,
          imagePrompt: parsedStory.scenes[page.pageNumber - 1]?.sceneDescription ?? "",
        });
      }
    }

    return NextResponse.json({
      storyId,
      title: parsedStory.title,
      pages,
      coverImageUrl,
      lesson: parsedStory.lesson,
    });
  } catch (error) {
    console.error("Story generation failed:", error);
    return NextResponse.json(
      { error: "Story generation failed. Please try again." },
      { status: 500 }
    );
  }
}
