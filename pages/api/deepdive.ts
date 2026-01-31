/**
 * DeepDive Intelligence API Endpoint
 * Handles Brave Search API requests and returns scored results
 * 
 * POST /api/deepdive
 * Body: { query: string, count?: number }
 * Returns: { results: ScoredResult[], report: Report }
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { scoreResults, generateReport, type ScoredResult } from '@/utils/deepdiveLogic'

interface BraveSearchResult {
  title: string
  url: string
  description: string
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[]
  }
}

interface DeepDiveResponse {
  success: boolean
  results?: ScoredResult[]
  report?: any
  error?: string
  query?: string
  count?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeepDiveResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { query, count = 20 } = req.body

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query is required and must be a non-empty string.',
      })
    }

    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Count must be between 1 and 100.',
      })
    }

    // Check API key
    const apiKey = process.env.BRAVE_SEARCH_API_KEY
    if (!apiKey) {
      console.error('Missing BRAVE_SEARCH_API_KEY environment variable')
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: API key not configured.',
      })
    }

    // Call Brave Search API
    const braveResponse = await axios.get<BraveSearchResponse>(
      'https://api.search.brave.com/res/v1/web/search',
      {
        params: {
          q: query,
          count,
        },
        headers: {
          Accept: 'application/json',
          'X-Subscription-Token': apiKey,
        },
        timeout: 10000,
      }
    )

    // Extract and validate results
    const braveResults = braveResponse.data.web?.results || []

    if (braveResults.length === 0) {
      return res.status(200).json({
        success: true,
        results: [],
        report: {
          summary: {
            totalResults: 0,
            averageScore: 0,
            sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
          },
          topSignals: { positive: [], negative: [] },
          recommendation: 'No results found for this query.',
        },
        query,
        count: 0,
      })
    }

    // Score results using DeepDive logic
    const scoredResults = scoreResults(braveResults)

    // Generate report
    const report = generateReport(scoredResults)

    return res.status(200).json({
      success: true,
      results: scoredResults,
      report,
      query,
      count: scoredResults.length,
    })
  } catch (error) {
    console.error('DeepDive API Error:', error)

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Brave Search API key.',
        })
      }
      if (error.response?.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        })
      }
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          error: 'Request timeout. Brave Search API is slow to respond.',
        })
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to process search request. Please try again.',
    })
  }
}
