/**
 * DeepDive Intelligence - Scoring Logic
 * Analyzes search results for positive/negative signals
 */

export interface SignalAnalysis {
  positiveSignals: string[];
  negativeSignals: string[];
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface ScoredResult {
  title: string;
  url: string;
  description: string;
  analysis: SignalAnalysis;
  timestamp: string;
}

// Positive indicators (higher weight = stronger signal)
const POSITIVE_KEYWORDS = {
  high_impact: [
    'breakthrough', 'revolutionary', 'innovative', 'success', 'achieved',
    'growth', 'expansion', 'investment', 'partnership', 'funded',
    'leader', 'leading', 'pioneer', 'award', 'certified',
    'trusted', 'secure', 'reliable', 'optimized', 'advanced',
  ],
  medium_impact: [
    'improve', 'progress', 'develop', 'launch', 'introduce',
    'enhance', 'strengthen', 'upgrade', 'modern', 'update',
    'adopt', 'support', 'strengthen', 'expand', 'boost',
  ],
};

// Negative indicators (higher weight = stronger signal)
const NEGATIVE_KEYWORDS = {
  high_impact: [
    'failure', 'collapse', 'bankrupt', 'fraud', 'scandal',
    'scam', 'lawsuit', 'violation', 'hack', 'breach',
    'critical', 'dangerous', 'toxic', 'illegal', 'shutdown',
    'recall', 'suspended', 'banned', 'risk', 'catastrophic',
  ],
  medium_impact: [
    'problem', 'issue', 'concern', 'warning', 'decline',
    'loss', 'struggle', 'challenge', 'difficulty', 'threatened',
    'vulnerable', 'weak', 'fail', 'error', 'bug',
    'complaint', 'negative', 'poor', 'bad', 'worse',
  ],
};

/**
 * Analyzes text (title + description) for positive/negative signals
 */
export function analyzeSignals(title: string, description: string): SignalAnalysis {
  const text = `${title} ${description}`.toLowerCase();
  const positiveSignals: string[] = [];
  const negativeSignals: string[] = [];
  
  let positiveScore = 0;
  let negativeScore = 0;

  // Check positive keywords
  Object.entries(POSITIVE_KEYWORDS).forEach(([weight, keywords]) => {
    const scoreMultiplier = weight === 'high_impact' ? 2 : 1;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        positiveSignals.push(keyword);
        positiveScore += scoreMultiplier;
      }
    });
  });

  // Check negative keywords
  Object.entries(NEGATIVE_KEYWORDS).forEach(([weight, keywords]) => {
    const scoreMultiplier = weight === 'high_impact' ? 2 : 1;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        negativeSignals.push(keyword);
        negativeScore += scoreMultiplier;
      }
    });
  });

  // Calculate normalized score (-100 to +100)
  const diff = positiveScore - negativeScore;
  const normalizer = Math.max(positiveScore, negativeScore, 1);
  const score = Math.round((diff / normalizer) * 100);

  // Determine sentiment
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 15) sentiment = 'positive';
  else if (score < -15) sentiment = 'negative';

  return {
    positiveSignals: [...new Set(positiveSignals)],
    negativeSignals: [...new Set(negativeSignals)],
    score,
    sentiment,
  };
}

/**
 * Scores multiple search results and ranks them
 */
export function scoreResults(results: Array<{ title: string; description: string; url: string }>): ScoredResult[] {
  return results
    .map(result => ({
      ...result,
      analysis: analyzeSignals(result.title, result.description),
      timestamp: new Date().toISOString(),
    }))
    .sort((a, b) => b.analysis.score - a.analysis.score);
}

/**
 * Generates a summary report of all results
 */
export function generateReport(scoredResults: ScoredResult[]) {
  const totalResults = scoredResults.length;
  const positive = scoredResults.filter(r => r.analysis.sentiment === 'positive').length;
  const negative = scoredResults.filter(r => r.analysis.sentiment === 'negative').length;
  const neutral = scoredResults.filter(r => r.analysis.sentiment === 'neutral').length;
  
  const avgScore = totalResults > 0
    ? Math.round(scoredResults.reduce((sum, r) => sum + r.analysis.score, 0) / totalResults)
    : 0;

  const allPositiveSignals: string[] = [];
  const allNegativeSignals: string[] = [];
  
  scoredResults.forEach(result => {
    allPositiveSignals.push(...result.analysis.positiveSignals);
    allNegativeSignals.push(...result.analysis.negativeSignals);
  });

  const topPositiveSignals = countAndSort(allPositiveSignals).slice(0, 5);
  const topNegativeSignals = countAndSort(allNegativeSignals).slice(0, 5);

  return {
    summary: {
      totalResults,
      averageScore: avgScore,
      sentiment_distribution: { positive, negative, neutral },
    },
    topSignals: {
      positive: topPositiveSignals,
      negative: topNegativeSignals,
    },
    recommendation:
      avgScore > 30
        ? 'Highly Positive - Strong positive signals detected'
        : avgScore > 0
        ? 'Slightly Positive - More positive than negative signals'
        : avgScore < -30
        ? 'Highly Negative - Strong negative signals detected'
        : avgScore < 0
        ? 'Slightly Negative - More negative than positive signals'
        : 'Neutral - Balanced positive and negative signals',
  };
}

/**
 * Helper function to count and sort signals by frequency
 */
function countAndSort(signals: string[]): Array<{ term: string; count: number }> {
  const counts = new Map<string, number>();
  signals.forEach(signal => {
    counts.set(signal, (counts.get(signal) || 0) + 1);
  });
  
  return Array.from(counts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Test function for scoring logic
 */
export function runTests() {
  console.log('🧪 Running DeepDive Scoring Tests...\n');

  // Test 1: Positive signals
  const positive = analyzeSignals(
    'Revolutionary AI Breakthrough Achieves Success',
    'Innovative technology partnership funded by leading investors'
  );
  console.log('Test 1 - Positive Signals:', positive);
  console.assert(positive.sentiment === 'positive', 'Should be positive');

  // Test 2: Negative signals
  const negative = analyzeSignals(
    'Company Faces Bankruptcy and Fraud Scandal',
    'Critical security breach exposes customer data'
  );
  console.log('Test 2 - Negative Signals:', negative);
  console.assert(negative.sentiment === 'negative', 'Should be negative');

  // Test 3: Neutral signals
  const neutral = analyzeSignals(
    'Company Releases New Product',
    'Updates features and announces changes'
  );
  console.log('Test 3 - Neutral Signals:', neutral);
  console.assert(neutral.sentiment === 'neutral', 'Should be neutral');

  // Test 4: Full scoring
  const results = scoreResults([
    {
      title: 'Tech Giant Achieves Breakthrough',
      description: 'Revolutionary innovation from leading company',
      url: 'https://example.com/1',
    },
    {
      title: 'Startup Faces Critical Challenges',
      description: 'Company struggles with major problems',
      url: 'https://example.com/2',
    },
  ]);
  console.log('\nTest 4 - Full Results:', results);

  // Test 5: Report generation
  const report = generateReport(results);
  console.log('\nTest 5 - Report:', report);

  console.log('\n✅ All tests completed!\n');
}
