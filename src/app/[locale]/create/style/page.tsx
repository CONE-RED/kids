"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCreationStore } from "@/lib/store/creation-store";
import { ART_STYLES } from "@/lib/constants/styles";

export default function StyleSelectionPage(): React.ReactElement {
  const t = useTranslations("create.style");
  const tStyles = useTranslations("styles");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { artStyle, setArtStyle } = useCreationStore();

  const handleContinue = (): void => {
    if (artStyle) {
      router.push("/create/topic");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ART_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setArtStyle(style.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all ${
                artStyle === style.id
                  ? "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-3 flex items-center justify-center text-4xl">
                {getStyleEmoji(style.id)}
              </div>
              <h3 className="font-semibold text-sm text-gray-800">
                {tStyles(`${style.id}.name`)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {tStyles(`${style.id}.description`)}
              </p>
              {artStyle === style.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/create")}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            ← {tCommon("back")}
          </button>
          <button
            onClick={handleContinue}
            disabled={!artStyle}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {tCommon("continue")} →
          </button>
        </div>
      </div>
    </div>
  );
}

function getStyleEmoji(styleId: string): string {
  const emojis: Record<string, string> = {
    cartoon: "🎨",
    clay: "🎭",
    watercolor: "🌊",
    disney: "🏰",
    pixel: "👾",
    comic: "💥",
    ghibli: "🌸",
    minimal: "◻️",
  };
  return emojis[styleId] ?? "🎨";
}
