'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { Search, Loader } from 'lucide-react'

interface SearchFormProps {
  onSubmit: (query: string, count: number) => Promise<void>
  isLoading: boolean
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(20)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      await onSubmit(query, count)
    }
  }

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (value >= 1 && value <= 100) {
      setCount(value)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Query Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-primary-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter search query (e.g., 'AI adoption trends 2024')..."
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 rounded-lg glass text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="count" className="text-sm font-medium text-slate-300">
              Results:
            </label>
            <input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={handleCountChange}
              disabled={isLoading}
              className="w-20 px-3 py-2 rounded-lg glass text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="text-xs text-slate-400">
          💡 Tip: More specific queries yield better signal analysis. Example: "Tesla Q3 2024 earnings"
        </div>
      </form>
    </div>
  )
}
