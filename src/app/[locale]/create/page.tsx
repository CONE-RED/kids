"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCreationStore } from "@/lib/store/creation-store";
import { useSettingsStore } from "@/lib/store/settings-store";
import { useEffect } from "react";

export default function PersonalizationPage(): React.ReactElement {
  const t = useTranslations("create.personalization");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const {
    childName,
    childAge,
    parentName,
    childAppearance,
    setChildName,
    setChildAge,
    setParentName,
    setChildAppearance,
  } = useCreationStore();
  const { isKeyValidated } = useSettingsStore();

  useEffect(() => {
    if (!isKeyValidated) {
      router.push("/setup");
    }
  }, [isKeyValidated, router]);

  const handleContinue = (): void => {
    if (childName.trim()) {
      router.push("/create/style");
    }
  };

  const ageOptions = Array.from({ length: 14 }, (_, i) => i + 2);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("childName")} *
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder={t("childNamePlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("childAge")}
            </label>
            <select
              value={childAge}
              onChange={(e) => setChildAge(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age} {t("ageYears")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("parentName")}
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder={t("parentNamePlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={30}
            />
          </div>

          {/* Child Appearance - Optional personalization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("childAppearance")}
            </label>
            <textarea
              value={childAppearance}
              onChange={(e) => setChildAppearance(e.target.value)}
              placeholder={t("childAppearancePlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-500">{t("childAppearanceTip")}</p>
          </div>

          <button
            onClick={handleContinue}
            disabled={!childName.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {tCommon("continue")} →
          </button>
        </div>
      </div>
    </div>
  );
}
