"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCreationStore } from "@/lib/store/creation-store";
import { STORY_TOPICS } from "@/lib/constants/topics";

export default function TopicSelectionPage(): React.ReactElement {
  const t = useTranslations("create.topic");
  const tTopics = useTranslations("topics");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { topic, customTopic, isCustomTopic, setTopic, setCustomTopic } = useCreationStore();
  const [showCustomInput, setShowCustomInput] = useState(isCustomTopic);

  const handleTopicSelect = (topicId: string): void => {
    setShowCustomInput(false);
    setTopic(topicId, false);
  };

  const handleCustomClick = (): void => {
    setShowCustomInput(true);
    setTopic("", true);
  };

  const handleContinue = (): void => {
    if (topic || (isCustomTopic && customTopic)) {
      router.push("/create/generate");
    }
  };

  const isValid = topic || (isCustomTopic && customTopic.trim().length > 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {STORY_TOPICS.map((topicItem) => (
            <button
              key={topicItem.id}
              onClick={() => handleTopicSelect(topicItem.id)}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                topic === topicItem.id && !isCustomTopic
                  ? "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              <div className="text-3xl mb-2">{getTopicEmoji(topicItem.id)}</div>
              <h3 className="font-semibold text-sm text-gray-800">
                {tTopics(`${topicItem.id}.name`)}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {tTopics(`${topicItem.id}.description`)}
              </p>
              <div className="mt-2 inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {tTopics(`${topicItem.id}.lesson`)}
              </div>
              {topic === topicItem.id && !isCustomTopic && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </button>
          ))}

          <button
            onClick={handleCustomClick}
            className={`relative p-4 rounded-2xl border-2 border-dashed text-left transition-all ${
              showCustomInput
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 bg-gray-50 hover:border-purple-300"
            }`}
          >
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-sm text-gray-800">{t("customTopic")}</h3>
            <p className="text-xs text-gray-500 mt-1">Create your own unique adventure</p>
          </button>
        </div>

        {showCustomInput && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("customTopic")}
            </label>
            <textarea
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder={t("customPlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/create/style")}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            ← {tCommon("back")}
          </button>
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {tCommon("generate")} ✨
          </button>
        </div>
      </div>
    </div>
  );
}

function getTopicEmoji(topicId: string): string {
  const emojis: Record<string, string> = {
    vegetables: "🥕",
    dragon: "🐉",
    homework: "📚",
    grandma: "👵",
    gravity: "🌍",
    robot: "🤖",
    tooth: "🦷",
    pirates: "🏴‍☠️",
    superhero: "🦸",
    teddy: "🧸",
  };
  return emojis[topicId] ?? "📖";
}
