# 🧪 DeepDive Scoring Tests & Examples

Complete testing guide for the scoring logic and API endpoint.

---

## 📝 Unit Tests (Scoring Logic)

The `utils/deepdiveLogic.ts` file includes a `runTests()` function with 5 test cases.

### Running Tests

**Option 1: Browser Console**
```javascript
// Open DevTools (F12) and paste:
import('./utils/deepdiveLogic.js').then(m => m.runTests())
```

**Option 2: Node.js**
```bash
node -e "require('./utils/deepdiveLogic.ts').runTests()"
```

### Test Cases

#### Test 1: Positive Signals Detection ✅
```typescript
const input = {
  title: "Revolutionary AI Breakthrough Achieves Success",
  description: "Innovative technology partnership funded by leading investors"
}

// Expected output:
{
  sentiment: "positive",
  score: 85+ (high positive score),
  positiveSignals: ["breakthrough", "revolutionary", "success", "innovative", 
                    "partnership", "funded", "leading"],
  negativeSignals: []
}
```

**Use case**: Tech announcements, funding news, product launches

---

#### Test 2: Negative Signals Detection ✅
```typescript
const input = {
  title: "Company Faces Bankruptcy and Fraud Scandal",
  description: "Critical security breach exposes customer data"
}

// Expected output:
{
  sentiment: "negative",
  score: -85 (high negative score),
  positiveSignals: [],
  negativeSignals: ["bankruptcy", "fraud", "scandal", "critical", "breach"]
}
```

**Use case**: Crisis news, legal issues, security incidents

---

#### Test 3: Neutral Signals Detection ✅
```typescript
const input = {
  title: "Company Releases New Product",
  description: "Updates features and announces changes"
}

// Expected output:
{
  sentiment: "neutral",
  score: -5 to +5 (close to zero),
  positiveSignals: ["product"],
  negativeSignals: []
}
```

**Use case**: Regular updates, announcements without strong sentiment

---

#### Test 4: Full Result Scoring ✅
```typescript
// Input: Array of 2 results
const results = [
  {
    title: "Tech Giant Achieves Breakthrough",
    description: "Revolutionary innovation from leading company",
    url: "https://example.com/1"
  },
  {
    title: "Startup Faces Critical Challenges",
    description: "Company struggles with major problems",
    url: "https://example.com/2"
  }
]

// Expected output:
// - Results sorted by score (highest first)
// - Result 1: +80 (positive)
// - Result 2: -60 (negative)
```

---

#### Test 5: Report Generation ✅
```typescript
// Input: Scored results from Test 4

// Expected report:
{
  summary: {
    totalResults: 2,
    averageScore: 10, // (80 + -60) / 2
    sentiment_distribution: {
      positive: 1,
      negative: 1,
      neutral: 0
    }
  },
  topSignals: {
    positive: [
      { term: "breakthrough", count: 1 },
      { term: "revolutionary", count: 1 },
      { term: "leading", count: 1 }
    ],
    negative: [
      { term: "critical", count: 1 },
      { term: "challenges", count: 1 },
      { term: "struggles", count: 1 }
    ]
  },
  recommendation: "Slightly Positive - More positive than negative signals"
}
```

---

## 🔌 API Endpoint Tests

### Test Setup

**Prerequisites:**
- API key configured in `.env.local`
- Dev server running: `npm run dev`

### Test 1: Successful Search ✅

```bash
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Tesla Q3 2024 earnings",
    "count": 5
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "query": "Tesla Q3 2024 earnings",
  "count": 5,
  "results": [
    {
      "title": "...",
      "url": "...",
      "description": "...",
      "analysis": {
        "score": 45,
        "sentiment": "positive",
        "positiveSignals": ["earnings", "growth"],
        "negativeSignals": []
      },
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "report": { ... }
}
```

**Status**: `200 OK`

---

### Test 2: Invalid Query ❌

```bash
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "", "count": 5}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Query is required and must be a non-empty string."
}
```

**Status**: `400 Bad Request`

---

### Test 3: Invalid Count ❌

```bash
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 150}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Count must be between 1 and 100."
}
```

**Status**: `400 Bad Request`

---

### Test 4: Missing API Key ❌

```bash
# With no BRAVE_SEARCH_API_KEY environment variable
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 5}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Server configuration error: API key not configured."
}
```

**Status**: `500 Internal Server Error`

---

### Test 5: Invalid API Key ❌

```bash
# With an incorrect BRAVE_SEARCH_API_KEY
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 5}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid Brave Search API key."
}
```

**Status**: `401 Unauthorized`

---

### Test 6: Rate Limit ❌

```bash
# After exceeding API quota
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 5}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

**Status**: `429 Too Many Requests`

---

### Test 7: Timeout ⏱️

```bash
# If Brave Search API is very slow (>10s)
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 100}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Request timeout. Brave Search API is slow to respond."
}
```

**Status**: `504 Gateway Timeout`

---

### Test 8: No Results ⚪

```bash
curl -X POST http://localhost:3000/api/deepdive \
  -H "Content-Type: application/json" \
  -d '{"query": "xyzabc123impossible", "count": 5}'
```

**Expected Response:**
```json
{
  "success": true,
  "query": "xyzabc123impossible",
  "count": 0,
  "results": [],
  "report": {
    "summary": {
      "totalResults": 0,
      "averageScore": 0,
      "sentiment_distribution": { "positive": 0, "negative": 0, "neutral": 0 }
    },
    "topSignals": { "positive": [], "negative": [] },
    "recommendation": "No results found for this query."
  }
}
```

**Status**: `200 OK`

---

## 📊 Real-World Test Queries

Try these queries to see different signal distributions:

### Positive Sentiment
```bash
# Tech innovation
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "AI breakthrough 2024 success story", "count": 10}'

# Business growth
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "company expansion record profits growth", "count": 10}'

# Scientific achievement
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "Nobel Prize breakthrough discovery", "count": 10}'
```

### Negative Sentiment
```bash
# Crisis/scandal
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "company scandal lawsuit fraud investigation", "count": 10}'

# Market concerns
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "recession warning economic decline risk", "count": 10}'

# Security issues
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "security breach data hack vulnerability", "count": 10}'
```

### Neutral Sentiment
```bash
# Regular updates
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "product update new version release", "count": 10}'

# Announcements
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "conference announcement schedule", "count": 10}'
```

---

## 🛠️ Frontend Testing

### Manual UI Tests

1. **Input Validation**
   - [ ] Empty query shows error
   - [ ] Count < 1 shows error
   - [ ] Count > 100 shows error
   - [ ] Submit button disabled while loading

2. **Search Flow**
   - [ ] Type query
   - [ ] Adjust result count
   - [ ] Click "Analyze"
   - [ ] See loading spinner
   - [ ] Results appear after 2-5 seconds

3. **Results Display**
   - [ ] Results sorted by score (highest first)
   - [ ] Sentiment badges show correct color
   - [ ] Positive signals highlighted in green
   - [ ] Negative signals highlighted in red
   - [ ] Score shown with trend icon
   - [ ] Links are clickable and external

4. **Report Section**
   - [ ] Summary metrics show correct counts
   - [ ] Average score calculation correct
   - [ ] Sentiment distribution accurate
   - [ ] Top signals listed correctly
   - [ ] Recommendation matches sentiment

5. **Error Handling**
   - [ ] Network error shows message
   - [ ] Invalid API key shows message
   - [ ] Timeout shows message
   - [ ] Empty results shows "No results found"

---

## 📈 Performance Testing

### Load Testing

```bash
# Test with large result count
curl -X POST http://localhost:3000/api/deepdive \
  -d '{"query": "apple", "count": 100}'

# Monitor response time (should be <5s)
# Check browser DevTools Network tab
# Measure DOM painting time
```

### Bundle Size

```bash
npm run build
# Check .next/ folder size (should be ~150KB)
```

---

## ✅ Test Checklist

- [ ] Unit tests pass (runTests())
- [ ] API validation works (400 errors)
- [ ] Authentication works (401 errors)
- [ ] Rate limiting detected (429 errors)
- [ ] Timeout handling works (504 errors)
- [ ] Results sorted correctly
- [ ] Scores calculated accurately
- [ ] Report generation correct
- [ ] UI renders properly
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive

---

## 🚀 Debugging Tips

### Enable Debug Mode

```bash
# In .env.local
DEBUG=true

# In browser console
localStorage.debug = 'deepdive:*'
```

### Check API Response

```javascript
// Browser console
fetch('/api/deepdive', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'test', count: 5 })
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
```

### Test Scoring Logic Directly

```javascript
// Browser console
import { analyzeSignals } from './utils/deepdiveLogic'
console.log(analyzeSignals('Breakthrough Success', 'Revolutionary innovation'))
```

---

**Next**: See README.md for deployment guide
