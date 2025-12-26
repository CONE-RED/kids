import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("landing");

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section with more visual impact */}
        <div className="mb-8">
          <span className="inline-block text-6xl md:text-8xl mb-4 animate-bounce">📚</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
          {t("title")}
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
          {t("subtitle")}
        </p>

        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("description")}
        </p>

        {/* CTA with stronger visual presence */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50 animate-pulse" />
          <Link
            href="/setup"
            className="relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-bold rounded-full text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-2 border-white/20"
          >
            <span className="text-2xl">✨</span>
            {t("cta")}
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Feature cards with visual rhythm */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <FeatureCard
            icon="🎯"
            title={t("features.personalized.title")}
            description={t("features.personalized.description")}
            accent="purple"
          />
          <FeatureCard
            icon="🎨"
            title={t("features.illustrated.title")}
            description={t("features.illustrated.description")}
            accent="pink"
          />
          <FeatureCard
            icon="📖"
            title={t("features.educational.title")}
            description={t("features.educational.description")}
            accent="orange"
          />
        </div>

        {/* Trust badge */}
        <div className="mt-16 text-sm text-gray-400">
          <span className="inline-flex items-center gap-2">
            <span className="text-green-500">●</span>
            Powered by Cone Red AI
          </span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: string;
  title: string;
  description: string;
  accent: "purple" | "pink" | "orange";
}): React.ReactElement {
  const accentColors = {
    purple: "from-purple-500/20 to-purple-500/5 border-purple-200 hover:border-purple-300",
    pink: "from-pink-500/20 to-pink-500/5 border-pink-200 hover:border-pink-300",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-200 hover:border-orange-300",
  };

  return (
    <div className={`relative bg-gradient-to-br ${accentColors[accent]} backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
