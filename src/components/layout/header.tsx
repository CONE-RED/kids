"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "./language-toggle";

export function Header(): React.ReactElement {
  const t = useTranslations("landing");

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("title")}
          </span>
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}
