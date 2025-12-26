"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSettingsStore } from "@/lib/store/settings-store";

export default function SetupPage(): React.ReactElement {
  const t = useTranslations("setup");
  const router = useRouter();
  const { apiKey, isKeyValidated, setApiKey, setKeyValidated, clearApiKey } =
    useSettingsStore();

  const [inputKey, setInputKey] = useState(apiKey ?? "");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const handleValidate = async (): Promise<void> => {
    if (!inputKey.startsWith("AIza")) {
      setError(t("invalid"));
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: inputKey }),
      });

      const data = await response.json();

      if (data.valid) {
        setApiKey(inputKey);
        setKeyValidated(true);
        router.push("/create");
      } else {
        setError(t("invalid"));
      }
    } catch {
      setError(t("invalid"));
    } finally {
      setIsValidating(false);
    }
  };

  const handleChangeKey = (): void => {
    clearApiKey();
    setInputKey("");
  };

  if (isKeyValidated && apiKey) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold mb-4 text-green-600">{t("connected")}</h1>
          <button
            onClick={() => router.push("/create")}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl mb-4"
          >
            {t("connected")} - Continue
          </button>
          <button
            onClick={handleChangeKey}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            {t("changeKey")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <Step number={1} title={t("step1.title")} description={t("step1.description")}>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Open Google AI Studio →
              </a>
            </Step>

            <Step number={2} title={t("step2.title")} description={t("step2.description")} />
            <Step number={3} title={t("step3.title")} description={t("step3.description")} />
            <Step number={4} title={t("step4.title")} description={t("step4.description")} />
            <Step number={5} title={t("step5.title")} description={t("step5.description")} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("inputLabel")}
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleValidate}
            disabled={isValidating || !inputKey}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {isValidating ? t("validating") : t("validateButton")}
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-2">
            <p>💰 {t("costEstimate")}</p>
            <p>🎁 {t("freeInfo")}</p>
            <p>🔒 {t("safetyInfo")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        {children}
      </div>
    </div>
  );
}
