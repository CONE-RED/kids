# StoryForge AI 📚✨

**Turn bedtime into adventure time!**

StoryForge AI is a magical web app that creates personalized, illustrated children's stories featuring YOUR child as the hero. Because the best stories are the ones where they see themselves saving the day!

![StoryForge AI](https://img.shields.io/badge/Made%20with-Love%20%26%20AI-ff69b4)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## 🎯 The Mission

**Help parents spend more quality time with their kids in a fun and collaborative way.**

We believe that:
- Every child deserves to be the hero of their own story
- Reading together creates magical bonding moments
- Technology should bring families closer, not apart
- Life lessons are best learned through adventures (not lectures!)

## ✨ Features

### 🎨 Personalized Stories
- Your child's name woven throughout the narrative
- Age-appropriate vocabulary and themes
- Choose from fun topics like "The Day Gravity Went on Strike" or "My Pet Dragon's Bad Day"

### 🖼️ AI-Generated Illustrations
- Beautiful, consistent character art throughout the story
- Multiple art styles: Disney Magic, Studio Ghibli, Watercolor Dreams, and more!
- Character consistency powered by Gemini 2.5 Flash Image

### 🌍 Bilingual Support
- English and Ukrainian (more languages coming!)
- Perfect for multicultural families

### 📖 Print-Ready PDF
- Download as a beautiful 10×8" picture book
- Professional typography and layout
- Ready to print and treasure forever!

### 🔒 Privacy First
- Your API key stays on YOUR device
- We never store personal data on servers
- Open source = full transparency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free [Google AI Studio](https://aistudio.google.com/) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/CONE-RED/kids.git
cd kids

# Install dependencies
npm install

# Set up the database
npm run db:push

# Start the magic!
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start creating stories!

## 🎮 How It Works

1. **Get Your Magic Wand** 🪄
   - Grab a free Gemini API key (takes 2 minutes!)

2. **Tell Us About Your Hero** 👧👦
   - Name, age, and optionally who's giving this gift

3. **Pick an Adventure** 🗺️
   - Choose from topics with sneaky life lessons built-in

4. **Choose Your Art Style** 🎨
   - From whimsical cartoon to elegant watercolor

5. **Watch the Magic Happen** ✨
   - AI writes a unique story with 10 illustrated pages

6. **Read Together & Download** 📚
   - Flip through online or download a print-ready PDF

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **AI**: Google Gemini 2.5 Flash (text) + Gemini 2.5 Flash Image (illustrations)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite + Drizzle ORM
- **i18n**: next-intl (EN/UK)
- **PDF**: jsPDF
- **State**: Zustand

## 📁 Project Structure

```
storyforge-ai/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── lib/
│   │   ├── gemini/      # AI integration
│   │   ├── db/          # Database queries
│   │   └── utils/       # PDF generation, etc.
│   └── i18n/            # Internationalization
├── config/
│   └── prompts.ts       # Story & image prompts
├── messages/            # Translations (en.json, uk.json)
└── public/generated/    # Generated story images
```

## 🎨 Available Art Styles

| Style | Description |
|-------|-------------|
| 🎬 Disney Magic | Classic animated fairy tale vibes |
| 🌸 Studio Ghibli | Soft anime with magical atmosphere |
| 🖌️ Watercolor Dream | Flowing colors like a painting |
| 🎭 Whimsical Cartoon | Bright, playful, and fun |
| 🧱 Clay World | Like playdough sculptures |
| 💥 Comic Book | Bold lines, dynamic action |
| 👾 Pixel Adventure | Retro video game aesthetics |
| ✏️ Minimalist | Clean and modern |

## 🌟 Story Topics & Lessons

Each topic comes with a sneaky life lesson:

- 🥦 **The Vegetable Rebellion** → Healthy eating
- 🐉 **My Pet Dragon's Bad Day** → Managing emotions
- 📚 **The Homework-Eating Monster** → Responsibility
- 👵 **Grandma's Magical Powers** → Respecting elders
- ⬇️ **The Day Gravity Went on Strike** → Problem-solving
- 🤖 **Robot's First Day at School** → Making friends
- 🧚 **The Tooth Fairy's Side Job** → Money basics
- 🏴‍☠️ **Pirates Who Couldn't Swim** → Facing fears

## 💰 Cost

- **API Cost**: ~$0.50-0.80 per story (Google's pricing)
- **Free Tier**: ~50 stories/day with Google's free tier
- **StoryForge**: Always free and open source!

## 🤝 Contributing

We'd love your help making StoryForge even more magical!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas We'd Love Help With
- 🌍 More language translations
- 📖 New story topics
- 🎨 Custom art style presets
- 📱 Mobile app version
- 🔊 Text-to-speech narration

## 📜 License

MIT License - Use it, share it, make it better!

See [LICENSE](LICENSE) for details.

## 💜 Credits

Created with love by [Dima Levin](https://linkedin.com/in/leeevind)

Built for parents who believe that the best gift you can give your child is your time.

---

<p align="center">
  <strong>Because every child deserves to be the hero of their own story.</strong>
</p>

<p align="center">
  ⭐ Star this repo if you believe in quality family time! ⭐
</p>
