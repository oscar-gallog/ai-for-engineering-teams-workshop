'use client';

import { useState, useMemo } from 'react';
import { Alert, AlertType, AlertPriority } from '../lib/alertTypes';

export interface PredictiveIntelligencePanelProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
}

const priorityConfig: Record<AlertPriority, { label: string; bg: string; text: string; border: string; dot: string }> = {
  high: { label: 'High', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  medium: { label: 'Medium', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
};

const typeLabels: Record<AlertType, string> = {
  payment_risk: 'Payment Risk',
  engagement_cliff: 'Engagement Cliff',
  contract_expiration_risk: 'Contract Expiration',
  market_sentiment_crisis: 'Market Sentiment Crisis',
  support_ticket_spike: 'Support Ticket Spike',
  feature_adoption_stall: 'Feature Adoption Stall',
  market_headwind: 'Market Headwind',
};

type FilterPriority = 'all' | AlertPriority;
type FilterType = 'all' | AlertType;

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function PredictiveIntelligencePanel({
  alerts,
  onDismiss,
}: PredictiveIntelligencePanelProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    onDismiss?.(id);
  };

  const active = useMemo(
    () =>
      alerts.filter(
        (a) =>
          !a.dismissed &&
          !dismissed.has(a.id) &&
          (filterPriority === 'all' || a.priority === filterPriority) &&
          (filterType === 'all' || a.type === filterType)
      ),
    [alerts, dismissed, filterPriority, filterType]
  );

  const allDismissed = useMemo(
    () => alerts.filter((a) => a.dismissed || dismissed.has(a.id)),
    [alerts, dismissed]
  );

  const activeCount = active.length;

  const noAlerts = activeCount === 0;

  return (
    <div className="rounded-lg shadow p-6 bg-white border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Predictive Alerts</h3>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            noAlerts ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {noAlerts ? 'No alerts' : `${activeCount} active`}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
          aria-label="Filter by priority"
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700
            focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All priorities</option>
          <option value="high">High only</option>
          <option value="medium">Medium only</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          aria-label="Filter by type"
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700
            focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All types</option>
          {Object.entries(typeLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* No alerts state */}
      {noAlerts && (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-green-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">All clear</p>
          <p className="text-xs text-gray-400">No active alerts for this customer</p>
        </div>
      )}

      {/* Alert list */}
      {!noAlerts && (
        <ul className="space-y-3">
          {active.map((alert) => {
            const cfg = priorityConfig[alert.priority];
            const isExpanded = expandedId === alert.id;

            return (
              <li
                key={alert.id}
                className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold ${cfg.text}`}>
                        {typeLabels[alert.type]}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatRelativeTime(alert.triggeredAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mt-0.5 leading-snug">{alert.message}</p>

                    {/* Expand/collapse actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Less' : 'Actions'}
                      </button>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="text-xs text-gray-400 hover:text-gray-600 focus:outline-none focus:underline"
                        aria-label={`Dismiss alert: ${alert.message}`}
                      >
                        Dismiss
                      </button>
                    </div>

                    {isExpanded && (
                      <ul className="mt-2 space-y-1">
                        {alert.recommendedActions.map((action, i) => (
                          <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                            <span className="text-gray-400 flex-shrink-0">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* History toggle */}
      {allDismissed.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
            aria-expanded={showHistory}
          >
            {showHistory ? 'Hide' : 'Show'} {allDismissed.length} dismissed alert{allDismissed.length !== 1 ? 's' : ''}
          </button>

          {showHistory && (
            <ul className="mt-2 space-y-1">
              {allDismissed.map((a) => (
                <li key={a.id} className="text-xs text-gray-400 line-through">
                  {typeLabels[a.type]} · {formatRelativeTime(a.triggeredAt)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
