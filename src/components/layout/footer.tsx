"use client";

import { useTranslations } from "next-intl";

export function Footer(): React.ReactElement {
  const t = useTranslations("footer");

  return (
    <footer className="py-6 border-t bg-white/50">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <a
          href="https://linkedin.com/in/leeevind"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-600 transition-colors"
        >
          {t("credit")} • {t("linkedin")}
        </a>
      </div>
    </footer>
  );
}
