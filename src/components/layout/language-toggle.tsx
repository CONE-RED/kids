"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LanguageToggle(): React.ReactElement {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = (): void => {
    const newLocale = locale === "en" ? "uk" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
      aria-label="Toggle language"
    >
      <span className={`text-lg ${locale === "en" ? "opacity-100" : "opacity-40"}`}>
        🇬🇧
      </span>
      <span className="text-gray-300">/</span>
      <span className={`text-lg ${locale === "uk" ? "opacity-100" : "opacity-40"}`}>
        🇺🇦
      </span>
    </button>
  );
}
