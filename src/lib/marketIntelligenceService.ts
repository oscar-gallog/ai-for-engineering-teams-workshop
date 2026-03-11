/**
 * Market Intelligence Service
 * Caches market data with a 10-minute TTL and delegates to mock data generation.
 */

import { generateMockMarketData, calculateMockSentiment } from '../data/mock-market-intelligence';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MarketHeadline {
  title: string;
  source: string;
  publishedAt: string;
}

export interface MarketIntelligenceData {
  company: string;
  sentiment: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  newsCount: number;
  lastUpdated: string;
  headlines: MarketHeadline[];
}

export class MarketIntelligenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarketIntelligenceError';
  }
}

// ─── Cache ────────────────────────────────────────────────────────────────────

interface CacheEntry {
  data: MarketIntelligenceData;
  expiresAt: number;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry>();

// ─── Input validation ─────────────────────────────────────────────────────────

function sanitizeCompanyName(company: string): string {
  // Strip anything that isn't alphanumeric, space, dot, dash, ampersand
  return company.replace(/[^a-zA-Z0-9 .\-&]/g, '').trim();
}

function validateCompanyName(company: string): void {
  if (!company || company.trim().length === 0) {
    throw new MarketIntelligenceError('Company name must not be empty');
  }
  if (company.length > 200) {
    throw new MarketIntelligenceError('Company name must not exceed 200 characters');
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class MarketIntelligenceService {
  /**
   * Fetches market intelligence for the given company.
   * Returns cached data if still within TTL; otherwise generates fresh mock data.
   */
  static async getMarketIntelligence(rawCompany: string): Promise<MarketIntelligenceData> {
    validateCompanyName(rawCompany);
    const company = sanitizeCompanyName(rawCompany);
    const cacheKey = company.toLowerCase();

    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // Simulate realistic async latency
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

    const mockData = generateMockMarketData(company);
    const sentiment = calculateMockSentiment(mockData.headlines);

    const data: MarketIntelligenceData = {
      company,
      sentiment,
      newsCount: mockData.articleCount,
      lastUpdated: new Date().toISOString(),
      headlines: mockData.headlines.slice(0, 3),
    };

    cache.set(cacheKey, { data, expiresAt: Date.now() + TTL_MS });
    return data;
  }

  /** Clears the entire in-memory cache (useful for testing). */
  static clearCache(): void {
    cache.clear();
  }

  /** Returns remaining TTL in ms for a cached company, or 0 if not cached. */
  static getCacheTtl(company: string): number {
    const key = sanitizeCompanyName(company).toLowerCase();
    const entry = cache.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.expiresAt - Date.now());
  }
}
