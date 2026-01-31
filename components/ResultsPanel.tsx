'use client'

import { ScoredResult } from '@/utils/deepdiveLogic'
import { ThumbsUp, ThumbsDown, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'

interface ResultsPanelProps {
  results: ScoredResult[]
  report: any
  query: string
}

export default function ResultsPanel({ results, report, query }: ResultsPanelProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No results found. Try a different query.</p>
      </div>
    )
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'from-signal-positive/10 to-signal-positive/5 border-signal-positive/20'
      case 'negative':
        return 'from-signal-negative/10 to-signal-negative/5 border-signal-negative/20'
      default:
        return 'from-slate-800/50 to-slate-800/30 border-slate-700/50'
    }
  }

  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'badge-positive'
      case 'negative':
        return 'badge-negative'
      default:
        return 'badge-neutral'
    }
  }

  const getScoreIcon = (score: number) => {
    return score > 0 ? (
      <TrendingUp className="w-5 h-5 text-signal-positive" />
    ) : score < 0 ? (
      <TrendingDown className="w-5 h-5 text-signal-negative" />
    ) : null
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Report Summary */}
      <div className="glass rounded-lg p-6 border border-slate-700 fade-in">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-2">Analysis Report</h2>
            <p className="text-slate-400">Query: <span className="text-slate-200 font-semibold">"{query}"</span></p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-400">{report.summary.totalResults}</div>
              <div className="text-xs text-slate-400">Total Results</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${report.summary.averageScore > 0 ? 'text-signal-positive' : report.summary.averageScore < 0 ? 'text-signal-negative' : 'text-slate-400'}`}>
                {report.summary.averageScore > 0 ? '+' : ''}{report.summary.averageScore}
              </div>
              <div className="text-xs text-slate-400">Avg Score</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-signal-positive">{report.summary.sentiment_distribution.positive}</div>
              <div className="text-xs text-slate-400">Positive</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-signal-negative">{report.summary.sentiment_distribution.negative}</div>
              <div className="text-xs text-slate-400">Negative</div>
            </div>
          </div>

          {/* Top Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* Positive Signals */}
            <div className="bg-signal-positive/10 border border-signal-positive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="w-4 h-4 text-signal-positive" />
                <span className="text-sm font-semibold text-signal-positive">Top Positive Signals</span>
              </div>
              <div className="space-y-2">
                {report.topSignals.positive.length > 0 ? (
                  report.topSignals.positive.map((signal: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300">{signal.term}</span>
                      <span className="text-signal-positive font-semibold">×{signal.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No positive signals found</p>
                )}
              </div>
            </div>

            {/* Negative Signals */}
            <div className="bg-signal-negative/10 border border-signal-negative/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown className="w-4 h-4 text-signal-negative" />
                <span className="text-sm font-semibold text-signal-negative">Top Negative Signals</span>
              </div>
              <div className="space-y-2">
                {report.topSignals.negative.length > 0 ? (
                  report.topSignals.negative.map((signal: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300">{signal.term}</span>
                      <span className="text-signal-negative font-semibold">×{signal.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No negative signals found</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
            <div className="text-sm font-semibold text-primary-300 mb-1">Recommendation</div>
            <p className="text-sm text-slate-300">{report.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Individual Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">Detailed Results</h3>
        {results.map((result, idx) => (
          <div
            key={idx}
            className={`glass border rounded-lg p-5 transition hover:border-primary-500/50 fade-in bg-gradient-to-br ${getSentimentColor(result.analysis.sentiment)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary-400 hover:text-primary-300 transition flex items-center gap-2 group"
                >
                  {result.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </div>
              <div className={`${getSentimentBadgeClass(result.analysis.sentiment)} whitespace-nowrap`}>
                {result.analysis.sentiment.charAt(0).toUpperCase() + result.analysis.sentiment.slice(1)}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 mb-4 line-clamp-2">{result.description}</p>

            {/* Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getScoreIcon(result.analysis.score)}
                <span className="text-sm font-semibold">
                  Score: <span className={result.analysis.score > 0 ? 'text-signal-positive' : result.analysis.score < 0 ? 'text-signal-negative' : 'text-slate-400'}>
                    {result.analysis.score > 0 ? '+' : ''}{result.analysis.score}
                  </span>
                </span>
              </div>
            </div>

            {/* Signals */}
            <div className="space-y-2">
              {result.analysis.positiveSignals.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.analysis.positiveSignals.map((signal, sidx) => (
                    <span key={sidx} className="badge-positive">
                      ✓ {signal}
                    </span>
                  ))}
                </div>
              )}
              {result.analysis.negativeSignals.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.analysis.negativeSignals.map((signal, sidx) => (
                    <span key={sidx} className="badge-negative">
                      ✗ {signal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* URL */}
            <div className="text-xs text-slate-500 mt-4 truncate">
              {result.url}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
