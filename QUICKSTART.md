# ⚡ DeepDive Intelligence - Quick Start

Get up and running in **5 minutes**.

---

## 📋 Prerequisites

- Node.js 18+ (download: https://nodejs.org/)
- Brave Search API key (get free: https://api.search.brave.com/)

---

## 🚀 5-Minute Setup

### 1️⃣ Clone/Extract Project
```bash
cd deepdive-app
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create Environment File
```bash
cp .env.example .env.local
```

### 4️⃣ Add API Key
Edit `.env.local`:
```
BRAVE_SEARCH_API_KEY=your_key_here
```

Get your key:
1. Go to https://api.search.brave.com/
2. Sign up or login
3. Copy API key
4. Paste in `.env.local`

### 5️⃣ Start Development Server
```bash
npm run dev
```

✅ **Done!** Open http://localhost:3000

---

## 🧪 Test It

1. Enter search query: `"AI adoption trends 2024"`
2. Click "Analyze"
3. See results with sentiment scores
4. View report with top signals

---

## 🚢 Deploy to Vercel (2 minutes)

### Option A: Vercel Dashboard

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import repo
4. Add environment: `BRAVE_SEARCH_API_KEY=your_key`
5. Click Deploy ✅

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts
```

---

## 📁 Project Structure

```
deepdive-app/
├── app/page.tsx          ← Main UI
├── pages/api/deepdive.ts ← Search API
├── components/           ← UI components
├── utils/                ← Scoring logic
├── package.json          ← Dependencies
└── README.md            ← Full docs
```

---

## 🛠️ Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start prod server |
| `npm run type-check` | Check TypeScript errors |
| `npm run lint` | Lint code |

---

## 🔧 Troubleshooting

### "Cannot find module 'next'"
```bash
npm install
npm run dev
```

### "Invalid API key"
- [ ] Check `.env.local` exists
- [ ] Verify key is correct at https://api.search.brave.com/
- [ ] Restart dev server

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
# or kill process using port 3000
```

---

## 📖 Next Steps

1. **Read Full Docs**: See `README.md`
2. **Learn Scoring**: See `TEST_SCORING.md`
3. **Explore Code**: See `FOLDER_TREE.md`
4. **Deploy**: Follow Vercel section above

---

## 🎯 Key Features

✅ **Search** - Query using Brave Search API  
✅ **Analyze** - Score results for sentiment  
✅ **Report** - Get summary with top signals  
✅ **Deploy** - One-click to Vercel  
✅ **Dark Mode** - Professional UI with TailwindCSS  

---

## 💡 Example Queries

```
"Tesla Q3 2024 earnings"
"AI safety concerns risks"
"Apple breakthrough innovation"
"Economic recession predictions"
"Technology trends 2024"
```

---

## 📞 Need Help?

- **Brave Search**: https://api.search.brave.com/
- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **TailwindCSS**: https://tailwindcss.com/docs

---

**You're all set! Start searching now. 🚀**

---

For more details, see **README.md**
