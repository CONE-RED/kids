"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Story {
  id: string;
  childName: string;
  childAge: number;
  topic: string;
  artStyle: string;
  language: "en" | "uk";
  coverImageUrl: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  english: number;
  ukrainian: number;
  today: number;
  thisWeek: number;
  topTopics: { topic: string; count: number }[];
}

function AdminContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret");

  const [stories, setStories] = useState<Story[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [filter, setFilter] = useState({
    language: "",
    date: "",
    topic: "",
  });

  useEffect(() => {
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "storyforge-admin-2025";
    if (secret === adminSecret) {
      setIsAuthorized(true);
      fetchStories();
    } else {
      setIsLoading(false);
    }
  }, [secret]);

  const fetchStories = async (): Promise<void> => {
    try {
      const params = new URLSearchParams();
      if (filter.language) params.set("language", filter.language);
      if (filter.date) params.set("date", filter.date);
      if (filter.topic) params.set("topic", filter.topic);

      const response = await fetch(`/api/stories?${params.toString()}`);
      const data = await response.json();
      setStories(data.stories || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchStories();
    }
  }, [filter, isAuthorized]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-4xl animate-bounce">📚</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-600 mt-2">Please provide the correct secret</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Story Gallery</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Stories" value={stats.total} />
            <StatCard label="English" value={stats.english} emoji="🇬🇧" />
            <StatCard label="Ukrainian" value={stats.ukrainian} emoji="🇺🇦" />
            <StatCard label="Today" value={stats.today} />
            <StatCard label="This Week" value={stats.thisWeek} />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <select
              value={filter.language}
              onChange={(e) => setFilter((f) => ({ ...f, language: e.target.value }))}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="uk">Ukrainian</option>
            </select>

            <select
              value={filter.date}
              onChange={(e) => setFilter((f) => ({ ...f, date: e.target.value }))}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600">No stories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
}: {
  label: string;
  value: number;
  emoji?: string;
}): React.ReactElement {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <div className="text-3xl font-bold text-purple-600">
        {emoji && <span className="mr-1">{emoji}</span>}
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function StoryCard({ story }: { story: Story }): React.ReactElement {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        {story.coverImageUrl ? (
          <img
            src={story.coverImageUrl}
            alt={`Story for ${story.childName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">📚</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800">{story.childName}</h3>
          <span className="text-lg">{story.language === "uk" ? "🇺🇦" : "🇬🇧"}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Age {story.childAge} • {story.topic}
        </p>
        <p className="text-xs text-gray-400 mb-4">
          {new Date(story.createdAt).toLocaleDateString()}
        </p>
        <Link
          href={`/en/story/${story.id}`}
          className="block w-full text-center py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          View Story
        </Link>
      </div>
    </div>
  );
}

export default function AdminPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-4xl animate-bounce">📚</div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
