"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCreationStore } from "@/lib/store/creation-store";
import { useSettingsStore } from "@/lib/store/settings-store";
import { MagicalLoader } from "@/components/loading/magical-loader";

export default function GeneratePage(): React.ReactElement {
  const t = useTranslations("loading");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const locale = useLocale() as "en" | "uk";

  const { childName, childAge, parentName, artStyle, topic, customTopic, isCustomTopic, reset } =
    useCreationStore();
  const { apiKey } = useSettingsStore();

  const [phase, setPhase] = useState<"story" | "character" | "images" | "assembly">("story");
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!apiKey || !childName || !artStyle || (!topic && !customTopic)) {
      router.push("/create");
      return;
    }

    const generate = async (): Promise<void> => {
      if (isGenerating) return;
      setIsGenerating(true);

      try {
        setPhase("story");
        setProgress(10);

        const response = await fetch("/api/generate/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childName,
            childAge,
            parentName: parentName || undefined,
            topic: isCustomTopic ? customTopic : topic,
            artStyle,
            locale,
            apiKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Generation failed");
        }

        // Simulate progress for demo
        const updateProgress = (): void => {
          setPhase("character");
          setProgress(30);

          setTimeout(() => {
            setPhase("images");
            let img = 1;
            const imageInterval = setInterval(() => {
              setCurrentImage(img);
              setProgress(30 + (img / 10) * 50);
              img++;
              if (img > 10) {
                clearInterval(imageInterval);
                setPhase("assembly");
                setProgress(90);

                setTimeout(() => {
                  setProgress(100);
                }, 1000);
              }
            }, 500);
          }, 2000);
        };

        updateProgress();

        const data = await response.json();

        // Wait for UI to show completion
        setTimeout(() => {
          reset();
          router.push(`/story/${data.storyId}`);
        }, 3000);
      } catch (err) {
        console.error(err);
        setError(tErrors("generationFailed"));
      }
    };

    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">😢</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">{error}</h1>
          <button
            onClick={() => router.push("/create/topic")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <MagicalLoader
          phase={phase}
          progress={progress}
          currentImage={currentImage}
          totalImages={10}
          childName={childName}
        />
      </div>
    </div>
  );
}
