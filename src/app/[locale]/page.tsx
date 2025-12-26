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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-4">{t("subtitle")}</p>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          {t("description")}
        </p>

        <Link
          href="/setup"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <span>✨</span>
          {t("cta")}
          <span>→</span>
        </Link>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon="🎯"
            title={t("features.personalized.title")}
            description={t("features.personalized.description")}
          />
          <FeatureCard
            icon="🎨"
            title={t("features.illustrated.title")}
            description={t("features.illustrated.description")}
          />
          <FeatureCard
            icon="📖"
            title={t("features.educational.title")}
            description={t("features.educational.description")}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}): React.ReactElement {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
