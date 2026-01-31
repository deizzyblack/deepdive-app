# 🧠 DeepDive Intelligence

**AI-powered web search analysis with positive/negative signal scoring**

A full-stack Next.js 14 application that analyzes search results from Brave Search API and scores them based on sentiment signals (positive/negative indicators). Features a minimal, professional UI built with TailwindCSS and is ready for one-click Vercel deployment.

---

## ✨ Features

- **🔍 Smart Search**: Query-based web search using Brave Search API
- **📊 Sentiment Analysis**: Automatic scoring of results (positive/negative signals)
- **📈 Signal Extraction**: Identifies and ranks keywords indicating sentiment
- **🎯 Detailed Reports**: Summary statistics and top signal detection
- **🚀 Production-Ready**: TypeScript, proper error handling, optimized for Vercel
- **🎨 Professional UI**: Dark theme with TailwindCSS, responsive design
- **⚡ Fast & Minimal**: Lightweight dependencies, optimized bundle size

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Search API**: Brave Search API
- **Deployment**: Vercel
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## 📦 Project Structure

```
deepdive-app/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main page component (client)
│   └── globals.css          # Global styles & animations
├── pages/
│   └── api/
│       └── deepdive.ts      # API endpoint (POST /api/deepdive)
├── components/
│   ├── SearchForm.tsx       # Search input & controls
│   └── ResultsPanel.tsx     # Results display & report
├── utils/
│   └── deepdiveLogic.ts     # Scoring logic & signal analysis
├── public/                  # Static assets (if needed)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # TailwindCSS config
├── postcss.config.js        # PostCSS config
├── next.config.js           # Next.js config
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variables template
└── README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Brave Search API key (get one at https://api.search.brave.com/)

### Local Development

1. **Clone or extract the project**
   ```bash
   cd deepdive-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your Brave Search API key**
   ```bash
   # Edit .env.local
   BRAVE_SEARCH_API_KEY=your_api_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BRAVE_SEARCH_API_KEY` | ✅ Yes | API key from Brave Search |
| `NEXT_PUBLIC_MAX_RESULTS` | ❌ No | Default: 20 |
| `NEXT_PUBLIC_API_TIMEOUT` | ❌ No | Default: 30000ms |
| `DEBUG` | ❌ No | Enable debug logging |

**⚠️ Important**: Keep your API key secure. Never commit `.env.local` to version control.

---

## 🔌 API Endpoint

### POST `/api/deepdive`

Analyzes search results and returns scored data with sentiment analysis.

**Request:**
```json
{
  "query": "Tesla Q3 2024 earnings",
  "count": 20
}
```

**Response:**
```json
{
  "success": true,
  "query": "Tesla Q3 2024 earnings",
  "count": 15,
  "results": [
    {
      "title": "Tesla Reports Record Q3 Earnings",
      "url": "https://example.com",
      "description": "...",
      "analysis": {
        "positiveSignals": ["record", "growth"],
        "negativeSignals": [],
        "score": 85,
        "sentiment": "positive"
      },
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "report": {
    "summary": {
      "totalResults": 15,
      "averageScore": 42,
      "sentiment_distribution": {
        "positive": 10,
        "negative": 2,
        "neutral": 3
      }
    },
    "topSignals": {
      "positive": [
        { "term": "growth", "count": 5 },
        { "term": "success", "count": 3 }
      ],
      "negative": [
        { "term": "concern", "count": 1 }
      ]
    },
    "recommendation": "Highly Positive - Strong positive signals detected"
  }
}
```

**Error Responses:**
- `400`: Invalid query or parameters
- `401`: Invalid API key
- `429`: Rate limit exceeded
- `500`: Server error
- `504`: Request timeout

---

## 🧪 Scoring Logic

### How It Works

The `deepdiveLogic.ts` module analyzes text (title + description) for sentiment keywords:

1. **Positive Keywords** (2 priority levels)
   - High Impact: breakthrough, revolutionary, success, leader, etc.
   - Medium Impact: improve, progress, develop, launch, etc.

2. **Negative Keywords** (2 priority levels)
   - High Impact: failure, fraud, scandal, hack, lawsuit, etc.
   - Medium Impact: problem, concern, decline, struggle, etc.

3. **Scoring Formula**
   - Raw score = positive_count - negative_count
   - Normalized score = (raw / max) × 100 (range: -100 to +100)

4. **Sentiment Classification**
   - **Positive**: score > 15
   - **Negative**: score < -15
   - **Neutral**: -15 to +15

### Example Score Breakdown

```
Title: "Company Achieves Breakthrough with New Product"
Description: "Revolutionary technology launches successfully"

Positive signals detected: breakthrough(2), revolutionary(1), success(1) = +4
Negative signals detected: none = 0

Score: (4 - 0) / 4 × 100 = +100
Sentiment: POSITIVE
```

---

## 🧪 Testing

### Run Scoring Tests

```bash
npm run type-check  # Type checking
```

To run the test suite for scoring logic:

```javascript
// In browser console or Node.js
import { runTests } from './utils/deepdiveLogic'
runTests()
```

This will run 5 test cases:
- ✅ Positive signals detection
- ✅ Negative signals detection
- ✅ Neutral signals detection
- ✅ Full result scoring
- ✅ Report generation

---

## 🚢 Deployment (Vercel)

### One-Click Deployment

1. **Push to GitHub** (recommended)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/deepdive-app
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Enter GitHub URL
   - Click Import

3. **Configure Environment**
   - Go to **Settings** → **Environment Variables**
   - Add `BRAVE_SEARCH_API_KEY` with your API key
   - Click Save

4. **Deploy**
   - Vercel will automatically detect Next.js
   - Click **Deploy**
   - Wait for build to complete (~2-3 minutes)

5. **Done!**
   - Access your app at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables
```

---

## 📊 Performance

- **Build Size**: ~150KB (optimized)
- **First Load**: <1s (with optimal conditions)
- **API Response**: 2-5s (depends on Brave Search API)
- **Vercel Edge Runtime**: Supported
- **Cold Start**: <500ms

### Optimization Tips

- Results are sorted by score (best matches first)
- CSS is minified and tree-shaken
- JavaScript is code-split by Next.js automatically
- API calls are cached where possible

---

## 🔐 Security

- ✅ Environment variables not exposed to client
- ✅ API key kept server-side only
- ✅ HTTPS enforced on Vercel
- ✅ Input validation on API endpoint
- ✅ CORS-safe (same-origin only)
- ✅ No sensitive data in localStorage

### Best Practices

1. **Never share your API key** - keep it in `.env.local`
2. **Use rate limiting** - Brave Search has quotas
3. **Monitor usage** - Check Brave Search dashboard regularly
4. **Add authentication** - For production, consider adding user auth
5. **Enable analytics** - Track usage patterns

---

## 🐛 Troubleshooting

### "Invalid API key" Error
- ✅ Check `.env.local` has correct key
- ✅ Verify key is active at https://api.search.brave.com/
- ✅ Restart dev server after updating `.env.local`

### "Rate limit exceeded"
- ✅ Wait before making new requests
- ✅ Check Brave Search quota usage
- ✅ Upgrade API plan if needed

### "No results found"
- ✅ Try a different/more specific query
- ✅ Check Brave Search API status
- ✅ Verify network connectivity

### Build Fails on Vercel
- ✅ Ensure all environment variables are set
- ✅ Check Node.js version (should be 18+)
- ✅ Clear Vercel cache and redeploy
- ✅ Check build logs in Vercel dashboard

---

## 📚 API Documentation

### Signal Keywords (Extensible)

To add custom keywords, edit `utils/deepdiveLogic.ts`:

```typescript
const POSITIVE_KEYWORDS = {
  high_impact: [
    'your_custom_keyword',
    // ... more keywords
  ],
};
```

Restart dev server to apply changes.

---

## 🎯 Future Enhancements

- [ ] Real-time results streaming
- [ ] Custom keyword profiles
- [ ] Export results to PDF/CSV
- [ ] Comparison mode (multiple queries)
- [ ] Trend analysis over time
- [ ] WebSocket for live updates
- [ ] Multi-language support
- [ ] Advanced filters & sorting

---

## 📄 License

MIT - Use freely in personal and commercial projects

---

## 🤝 Contributing

Pull requests welcome! To contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

- **Brave Search API Docs**: https://api.search.brave.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs

---

## 🙏 Acknowledgments

- Built with [Next.js 14](https://nextjs.org/)
- Powered by [Brave Search API](https://brave.com/search/api/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

---

**Made with ❤️ for intelligent web search analysis**
# redeploy Sat Jan 31 06:15:38 +03 2026
