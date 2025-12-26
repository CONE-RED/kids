export interface Topic {
  id: string;
  lesson: {
    en: string;
    uk: string;
  };
}

export const STORY_TOPICS: Topic[] = [
  {
    id: "vegetables",
    lesson: { en: "Healthy eating", uk: "Здорове харчування" },
  },
  {
    id: "dragon",
    lesson: { en: "Managing emotions", uk: "Керування емоціями" },
  },
  {
    id: "homework",
    lesson: { en: "Responsibility", uk: "Відповідальність" },
  },
  {
    id: "grandma",
    lesson: { en: "Respecting elders", uk: "Повага до старших" },
  },
  {
    id: "gravity",
    lesson: { en: "Problem-solving", uk: "Вирішення проблем" },
  },
  {
    id: "robot",
    lesson: { en: "Making friends", uk: "Як знаходити друзів" },
  },
  {
    id: "tooth",
    lesson: { en: "Money basics", uk: "Основи грошей" },
  },
  {
    id: "pirates",
    lesson: { en: "Facing fears", uk: "Подолання страхів" },
  },
  {
    id: "superhero",
    lesson: { en: "Finding purpose", uk: "Пошук мети" },
  },
  {
    id: "teddy",
    lesson: { en: "Appreciating the present", uk: "Цінувати теперішнє" },
  },
];

export function getTopicLesson(topicId: string, locale: "en" | "uk"): string {
  const topic = STORY_TOPICS.find((t) => t.id === topicId);
  return topic?.lesson[locale] ?? "";
}
