"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface MagicalLoaderProps {
  phase: "story" | "character" | "images" | "assembly";
  progress: number;
  currentImage: number;
  totalImages: number;
  childName: string;
}

export function MagicalLoader({
  phase,
  progress,
  currentImage,
  totalImages,
  childName,
}: MagicalLoaderProps): React.ReactElement {
  const t = useTranslations("loading");
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = getMessagesForPhase(phase, t, childName, currentImage, totalImages);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length, phase]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {t("title")}
      </h1>

      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-spin-slow opacity-20" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse flex items-center justify-center">
            <span className="text-5xl animate-bounce">{getPhaseEmoji(phase)}</span>
          </div>
        </div>

        <div className="absolute -inset-4 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>

      <p className="text-lg text-gray-700 min-h-[3rem] flex items-center justify-center">
        {messages[messageIndex]}
      </p>
    </div>
  );
}

function getPhaseEmoji(phase: string): string {
  const emojis: Record<string, string> = {
    story: "📝",
    character: "🎨",
    images: "🖼️",
    assembly: "📚",
  };
  return emojis[phase] ?? "✨";
}

function getMessagesForPhase(
  phase: string,
  t: ReturnType<typeof useTranslations>,
  childName: string,
  currentImage: number,
  totalImages: number
): string[] {
  const phaseKey = phase === "story" ? "storyWriting" : phase === "character" ? "characterDesign" : phase === "images" ? "imageGeneration" : "assembly";

  try {
    // Get messages array from translations
    const rawMessages = t.raw(phaseKey);
    if (Array.isArray(rawMessages)) {
      return rawMessages.map((msg: string) =>
        msg
          .replace("{childName}", childName)
          .replace("{current}", String(currentImage))
          .replace("{total}", String(totalImages))
      );
    }
    return ["Creating magic..."];
  } catch {
    return ["Creating magic..."];
  }
}
