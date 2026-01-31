'use client'

import { useState } from 'react'
import { Brain, AlertCircle } from 'lucide-react'
import SearchForm from '@/components/SearchForm'
import ResultsPanel from '@/components/ResultsPanel'
import type { ScoredResult } from '@/utils/deepdiveLogic'

interface SearchState {
  results: ScoredResult[]
  report: any
  query: string
  count: number
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchState, setSearchState] = useState<SearchState | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string, count: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/deepdive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, count }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred')
      }

      setSearchState({
        results: data.results || [],
        report: data.report,
        query,
        count: data.count || 0,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      setSearchState(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary-400" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">DeepDive Intelligence</h1>
            <p className="text-xs sm:text-sm text-slate-400">AI-powered web search analysis with signal scoring</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl">
          {/* Title */}
          {!searchState && (
            <div className="text-center mb-12 fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Search Intelligence Redefined
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Analyze web search results with AI-powered sentiment scoring. Detect positive and negative signals instantly.
              </p>
            </div>
          )}

          {/* Search Form */}
          <div className="mb-12 fade-in">
            <SearchForm onSubmit={handleSearch} isLoading={isLoading} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 fade-in">
              <div className="glass rounded-lg p-4 border border-signal-negative/50 bg-signal-negative/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-signal-negative mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-signal-negative mb-1">Error</h3>
                  <p className="text-sm text-slate-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {searchState && (
            <div className="fade-in">
              <ResultsPanel
                results={searchState.results}
                report={searchState.report}
                query={searchState.query}
              />
            </div>
          )}

          {/* Empty State */}
          {!searchState && !error && !isLoading && (
            <div className="text-center py-12 px-6 glass rounded-lg border border-slate-700">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 max-w-md mx-auto">
                Enter a search query above to start analyzing web results. DeepDive will score each result for positive and negative signals.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
          <p>
            Powered by <a href="https://brave.com/search/api/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Brave Search API</a>
            {' '} • Built with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Next.js 14</a>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            © 2024 DeepDive Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
