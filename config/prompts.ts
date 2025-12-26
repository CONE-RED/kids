export const PROMPTS = {
  story: {
    en: `You are a master children's storyteller creating an engaging, illustrated story.

<child>
Name: {childName}
Age: {childAge} years old
</child>

<story_params>
Topic: {topic}
Lesson to embed: {lesson}
Art Style: {artStyle}
</story_params>

<uniqueness>
Previous stories on this topic used these elements (AVOID):
{existingTags}
</uniqueness>

<requirements>
- Create a story with exactly 10 scenes/chapters
- Word count: 800-1200 words total
- Make {childName} the protagonist or close companion to the main character
- Embed the lesson naturally through plot, NEVER preach directly
- Include 2-3 memorable funny moments that kids love
- Age-appropriate vocabulary for a {childAge} year old
- Each scene should be visually distinct and illustratable
- End with a satisfying conclusion that reinforces the lesson
</requirements>

<output_format>
Respond in JSON format:
{
  "title": "Story title",
  "scenes": [
    {
      "pageNumber": 1,
      "text": "Story text for this page (80-120 words)",
      "sceneDescription": "Visual description for illustration (what to draw)"
    }
  ],
  "lesson": "The embedded lesson",
  "summaryTags": "Two lines describing unique elements of this story for future uniqueness checking"
}
</output_format>`,

    uk: `Ви майстер дитячих історій. Створіть захоплюючу ілюстровану історію ТІЛЬКИ українською мовою.

<дитина>
Ім'я: {childName}
Вік: {childAge} років
</дитина>

<параметри_історії>
Тема: {topic}
Урок для вбудовування: {lesson}
Стиль малюнків: {artStyle}
</параметри_історії>

<унікальність>
Попередні історії на цю тему використовували такі елементи (УНИКАЙТЕ):
{existingTags}
</унікальність>

<вимоги>
- Створіть історію з рівно 10 сцен/розділів
- Кількість слів: 800-1200 слів загалом
- Зробіть {childName} головним героєм або близьким другом головного персонажа
- Вбудуйте урок природно через сюжет, НІКОЛИ не читайте нотацій
- Включіть 2-3 запам'ятовуваних смішних моменти, які люблять діти
- Словник, відповідний віку {childAge} років
- Кожна сцена повинна бути візуально унікальною та придатною для ілюстрування
- Завершіть задовільним закінченням, що підкріплює урок
- Пишіть ТІЛЬКИ українською мовою, природною та правильною
</вимоги>

<формат_відповіді>
Відповідайте у форматі JSON:
{
  "title": "Назва історії",
  "scenes": [
    {
      "pageNumber": 1,
      "text": "Текст історії для цієї сторінки (80-120 слів)",
      "sceneDescription": "Візуальний опис для ілюстрації (що малювати) - англійською для AI"
    }
  ],
  "lesson": "Вбудований урок",
  "summaryTags": "Два рядки з унікальними елементами цієї історії для перевірки унікальності"
}
</формат_відповіді>`,
  },

  characterSheet: {
    en: `Create a character reference sheet for a children's book illustration.

Character: {childName}, a {childAge}-year-old child
Art Style: {artStyle}

Show the character in these poses on a single image:
- Full body front view (center, largest)
- Face close-up (top right)
- 3/4 side view (left side)
- Key expressions: happy, surprised, determined (bottom row)

Style Requirements:
- {artStyleDescription}
- Child-friendly, warm, and appealing
- Consistent proportions and features across all poses
- Background: Plain white for clear reference

This reference sheet will be used to maintain character consistency across 10+ story illustrations.`,

    uk: `Створіть референс-лист персонажа для ілюстрації дитячої книги.

Персонаж: {childName}, дитина {childAge} років
Стиль: {artStyle}

Покажіть персонажа в таких позах на одному зображенні:
- Повний зріст, вигляд спереду (центр, найбільший)
- Крупний план обличчя (верхній правий кут)
- Вигляд 3/4 збоку (лівий бік)
- Ключові вирази: радісний, здивований, рішучий (нижній ряд)

Вимоги до стилю:
- {artStyleDescription}
- Дитячо-дружній, теплий та привабливий
- Послідовні пропорції та риси у всіх позах
- Фон: Чистий білий для чіткого референсу

Цей референс-лист буде використовуватися для підтримки послідовності персонажа на 10+ ілюстраціях.`,
  },

  pageImage: {
    en: `Create a children's book illustration in {artStyle} style.

Scene: {sceneDescription}

Main character: {childName} (reference image attached - maintain EXACT same appearance)

Important Requirements:
- Match the character EXACTLY to the reference image
- {artStyleDescription} aesthetic throughout
- Warm, child-friendly, engaging imagery
- No text in the image
- Composition suitable for a book page (4:3 landscape)
- Clear focal point on the action/emotion`,

    uk: `Створіть ілюстрацію для дитячої книги у стилі {artStyle}.

Сцена: {sceneDescription}

Головний персонаж: {childName} (референс-зображення додано - збережіть ТОЧНО такий самий вигляд)

Важливі вимоги:
- Персонаж повинен ТОЧНО відповідати референс-зображенню
- Естетика {artStyleDescription} по всьому зображенню
- Тепле, дитячо-дружнє, захоплююче зображення
- Без тексту на зображенні
- Композиція, придатна для сторінки книги (4:3 альбомна орієнтація)
- Чіткий фокус на дії/емоції`,
  },

  coverImage: {
    en: `Create a captivating children's book cover illustration in {artStyle} style.

Title: {title}
Main Character: {childName} (reference image attached - maintain EXACT same appearance)
Theme: {topic}

Requirements:
- Exciting, dynamic composition that captures the story's essence
- Main character prominently featured
- {artStyleDescription} aesthetic
- Leave space at top for title text
- Warm, inviting colors that appeal to children
- No text in the image (title will be added separately)`,

    uk: `Створіть захоплюючу обкладинку для дитячої книги у стилі {artStyle}.

Назва: {title}
Головний персонаж: {childName} (референс-зображення додано - збережіть ТОЧНО такий самий вигляд)
Тема: {topic}

Вимоги:
- Захоплююча, динамічна композиція, що передає суть історії
- Головний персонаж на видному місці
- Естетика {artStyleDescription}
- Залиште місце вгорі для тексту назви
- Теплі, привітні кольори, що подобаються дітям
- Без тексту на зображенні (назва буде додана окремо)`,
  },
};

export const ART_STYLE_DESCRIPTIONS: Record<string, string> = {
  cartoon: "Bright, bold colors with exaggerated expressions and playful proportions, like modern animated films",
  clay: "Soft, textured appearance like claymation/stop-motion, with visible sculpted details and warm lighting",
  watercolor: "Soft, flowing colors with gentle gradients and dreamy atmosphere, like traditional watercolor paintings",
  disney: "Classic Disney animation style with expressive characters, magical lighting, and fairy-tale atmosphere",
  pixel: "Retro 16-bit pixel art style with vibrant colors and charming blocky aesthetics",
  comic: "Bold outlines, dynamic action poses, and vibrant colors like a children's comic book",
  ghibli: "Soft, detailed anime style with magical atmosphere and beautiful natural elements, inspired by Studio Ghibli",
  minimal: "Clean, simple shapes with limited color palette, modern and elegant illustration style",
};

export function getPrompt(
  type: keyof typeof PROMPTS,
  locale: "en" | "uk"
): string {
  return PROMPTS[type][locale];
}

export function getArtStyleDescription(styleId: string): string {
  return ART_STYLE_DESCRIPTIONS[styleId] ?? ART_STYLE_DESCRIPTIONS.cartoon;
}

export function fillPromptTemplate(
  template: string,
  variables: Record<string, string | number | undefined>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value ?? ""));
  }
  return result;
}
