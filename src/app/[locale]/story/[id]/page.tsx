"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GetStoryResponse } from "@/types/api";
import { generateStoryPDF, downloadPDF } from "@/lib/utils/pdf";

export default function StoryViewerPage(): React.ReactElement {
  const params = useParams();
  const storyId = params.id as string;
  const t = useTranslations("viewer");
  const tCommon = useTranslations("common");

  const [story, setStory] = useState<GetStoryResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchStory = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) throw new Error("Story not found");
        const data = await response.json();
        setStory(data);
      } catch {
        setError("Story not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowRight" && story) {
        setCurrentPage((prev) => Math.min(prev + 1, story.pages.length + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [story]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">📚</div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-600 mb-4">{error || "Story not found"}</p>
          <Link href="/" className="text-purple-600 hover:underline">
            {tCommon("home")}
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = story.pages.length + 2; // Cover + pages + end

  const handleDownloadPDF = async (): Promise<void> => {
    if (!story || isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await generateStoryPDF(story);
      const filename = `${story.childName}-story-${new Date().toISOString().split("T")[0]}.pdf`;
      downloadPDF(blob, filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Book container */}
          <div
            className="aspect-[4/3] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer relative"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          >
            {currentPage === 0 ? (
              // Cover page
              <CoverPage story={story} />
            ) : currentPage <= story.pages.length ? (
              // Story page
              <StoryPage
                page={story.pages[currentPage - 1]}
                pageNumber={currentPage}
                totalPages={story.pages.length}
              />
            ) : (
              // End page
              <EndPage childName={story.childName} parentName={story.parentName} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white rounded-xl shadow disabled:opacity-50"
            >
              ← {tCommon("back")}
            </button>

            <span className="text-gray-600">
              {t("pageOf", { current: currentPage, total: totalPages - 1 })}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white rounded-xl shadow disabled:opacity-50"
            >
              {tCommon("continue")} →
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 disabled:opacity-50"
            >
              {isDownloading ? t("downloading") : tCommon("download")}
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
            >
              {tCommon("createAnother")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverPage({ story }: { story: GetStoryResponse }): React.ReactElement {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-200 via-pink-100 to-amber-100 p-6 md:p-10">
      {/* Cover image area */}
      {story.coverImageUrl ? (
        <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
          <img
            src={story.coverImageUrl}
            alt="Cover"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
          <div className="text-8xl">📚</div>
        </div>
      )}
      {/* Title and info */}
      <div className="text-center bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-800 font-serif mb-2">
          {story.title}
        </h1>
        <p className="text-lg md:text-xl text-purple-600">
          A story for <span className="font-semibold">{story.childName}</span>, age {story.childAge}
        </p>
        {story.parentName && (
          <p className="text-gray-600 mt-1">With love from {story.parentName}</p>
        )}
        <p className="mt-4 text-sm text-gray-500 animate-pulse">Click to start reading →</p>
      </div>
    </div>
  );
}

function StoryPage({
  page,
  pageNumber,
  totalPages,
}: {
  page: { text: string; imageUrl: string };
  pageNumber: number;
  totalPages: number;
}): React.ReactElement {
  return (
    <div className="h-full flex flex-col">
      {/* Image takes most of the space */}
      <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 min-h-0">
        {page.imageUrl ? (
          <img
            src={page.imageUrl}
            alt={`Page ${pageNumber}`}
            className="max-w-full max-h-full object-contain rounded-xl shadow-xl"
          />
        ) : (
          <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center">
            <span className="text-6xl opacity-50">🖼️</span>
          </div>
        )}
      </div>
      {/* Text area at bottom - styled like a children's book */}
      <div className="bg-white border-t-4 border-purple-200 px-6 py-4 md:px-10 md:py-6">
        <p className="text-base md:text-xl lg:text-2xl leading-relaxed text-gray-800 font-serif text-center">
          {page.text}
        </p>
        <p className="mt-3 text-xs text-gray-400 text-right">
          {pageNumber} / {totalPages}
        </p>
      </div>
    </div>
  );
}

function EndPage({
  childName,
  parentName,
}: {
  childName: string;
  parentName?: string;
}): React.ReactElement {
  const t = useTranslations("viewer");

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-8 text-center">
      <div className="text-6xl mb-6">✨</div>
      <h1 className="text-4xl font-bold mb-4 text-purple-800">{t("theEnd")}</h1>
      <p className="text-xl text-purple-600">
        {parentName
          ? t("dedication", { childName, parentName })
          : t("dedicationNoParent", { childName })}
      </p>
      <div className="mt-8 text-sm text-gray-500">
        by Dima Levin • linkedin.com/in/leeevind
      </div>
    </div>
  );
}
