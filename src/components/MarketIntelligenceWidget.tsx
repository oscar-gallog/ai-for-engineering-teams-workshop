'use client';

import { useState, useEffect, useCallback } from 'react';
import { MarketIntelligenceData } from '../lib/marketIntelligenceService';

export interface MarketIntelligenceWidgetProps {
  company?: string;
}

const sentimentConfig = {
  positive: { label: 'Positive', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  neutral: { label: 'Neutral', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  negative: { label: 'Negative', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function MarketIntelligenceWidget({ company: companyProp = '' }: MarketIntelligenceWidgetProps) {
  const [companyInput, setCompanyInput] = useState(companyProp);
  const [data, setData] = useState<MarketIntelligenceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/market-intelligence/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const json = await res.json() as MarketIntelligenceData;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load market intelligence');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when company prop changes
  useEffect(() => {
    if (companyProp) {
      setCompanyInput(companyProp);
      fetchData(companyProp);
    }
  }, [companyProp, fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(companyInput);
  };

  const sentimentLabel = data?.sentiment?.label ?? 'neutral';
  const config = sentimentConfig[sentimentLabel] ?? sentimentConfig.neutral;

  return (
    <div className="rounded-lg shadow p-6 bg-white border border-gray-200">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Market Intelligence</h3>

      {/* Company input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
          placeholder="Enter company name…"
          aria-label="Company name"
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading || !companyInput.trim()}
          className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 mb-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 bg-gray-100 rounded w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Data */}
      {!loading && data && (
        <div className="space-y-4">
          {/* Sentiment indicator */}
          <div className={`flex items-center gap-2 rounded-md px-3 py-2 ${config.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
            <span className={`text-sm font-medium ${config.text}`}>
              {config.label} sentiment
            </span>
            <span className={`ml-auto text-xs ${config.text}`}>
              {Math.round(Math.abs(data.sentiment.score) * 100)}% confidence
            </span>
          </div>

          {/* Meta */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{data.newsCount} article{data.newsCount !== 1 ? 's' : ''} found</span>
            <span>Updated {formatDate(data.lastUpdated)}</span>
          </div>

          {/* Headlines */}
          {data.headlines.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Top Headlines</p>
              <ul className="space-y-3">
                {data.headlines.map((h, i) => (
                  <li key={i} className="border-l-2 border-gray-200 pl-3">
                    <p className="text-sm text-gray-800 leading-snug">{h.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {h.source} · {formatDate(h.publishedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !data && !error && (
        <p className="text-sm text-gray-400 text-center py-4">
          Enter a company name to see market intelligence
        </p>
      )}
    </div>
  );
}
