# ReplyAI — AI Customer Support Chatbot

> Deploy an AI support agent on any website in minutes. Your customers get instant answers 24/7.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square)
![Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-00e699?style=flat-square)
![Drizzle](https://img.shields.io/badge/ORM-Drizzle-c5f74f?style=flat-square)

## What is ReplyAI?

ReplyAI is a SaaS platform that lets businesses embed an AI-powered support chatbot on their website using a single script tag. The chatbot is trained on your own knowledge base and answers customer questions instantly.

## Features

- 🤖 **AI Chatbot Widget** — Embed on any website with one script tag
- 📚 **Knowledge Base** — Train your bot with websites, text, and PDFs
- 🎨 **Customizable Appearance** — Change colors and welcome messages
- 💬 **Conversation History** — View all visitor conversations in your dashboard
- 🔐 **Secure Auth** — Organization-based authentication via Scalekit
- 👥 **Team Management** — Invite team members to your workspace
- 📊 **Sections** — Create topic-based sections with custom tones and rules

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| AI | OpenAI GPT-4o-mini |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Auth | Scalekit |
| Styling | Tailwind CSS |
| Web Scraping | Firecrawl |

## Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/ani232003/ai-support-chat.git
cd ai-support-chat
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root:
```env
SCALEKIT_ENVIRONMENT_URL=your_scalekit_url
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret
SCALEKIT_REDIRECT_URI=http://localhost:3000/api/auth/callback
DATABASE_URL=your_neon_database_url
FIRECRAWL_API_KEY=your_firecrawl_key
OPEN_AI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
```

**4. Push database schema**
```bash
npm run db:push
```

**5. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How to Embed

Add this script tag to any website:

```html
<script 
  src="https://yourdomain.com/widget.js" 
  data-id="YOUR_CHATBOT_ID">
</script>
```

Get your chatbot ID from the **Chatbot** page in your dashboard.

## Project Structure

```
app/
├── api/
│   ├── auth/          # Authentication routes
│   ├── chat/          # AI chat endpoint
│   ├── knowledge/     # Knowledge base CRUD
│   ├── sections/      # Sections CRUD
│   ├── conversations/ # Conversation history
│   └── widget/        # Widget session & config
├── dashboard/         # Dashboard pages
├── embed/             # Embeddable chat UI
└── test/              # Widget test page
```