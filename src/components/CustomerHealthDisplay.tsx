'use client';

import { useState } from 'react';
import {
  calculateHealthScore,
  PaymentData,
  EngagementData,
  ContractData,
  SupportData,
  HealthScoreResult,
  RiskLevel,
} from '../lib/healthCalculator';

export interface CustomerHealthDisplayProps {
  customerId: string;
  paymentData?: PaymentData;
  engagementData?: EngagementData;
  contractData?: ContractData;
  supportData?: SupportData;
  loading?: boolean;
  error?: string;
}

const riskColors: Record<RiskLevel, { bg: string; text: string; border: string; label: string }> = {
  healthy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Healthy' },
  warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Warning' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Critical' },
};

const factorLabels = [
  { key: 'paymentScore', label: 'Payment', weight: '40%', color: 'bg-blue-500' },
  { key: 'engagementScore', label: 'Engagement', weight: '30%', color: 'bg-purple-500' },
  { key: 'contractScore', label: 'Contract', weight: '20%', color: 'bg-orange-500' },
  { key: 'supportScore', label: 'Support', weight: '10%', color: 'bg-teal-500' },
] as const;

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        role="progressbar"
        aria-valuenow={Math.round(score)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

const defaultPayment: PaymentData = { daysSinceLastPayment: 30, averagePaymentDelay: 0, overdueAmount: 0 };
const defaultEngagement: EngagementData = { loginFrequencyPerWeek: 3, featureUsageCount: 5, supportTicketsLast30Days: 1 };
const defaultContract: ContractData = { daysUntilRenewal: 180, contractValue: 10000, recentUpgrade: false };
const defaultSupport: SupportData = { averageResolutionTimeHours: 8, satisfactionScore: 7, escalationCount: 0 };

export default function CustomerHealthDisplay({
  customerId,
  paymentData = defaultPayment,
  engagementData = defaultEngagement,
  contractData = defaultContract,
  supportData = defaultSupport,
  loading = false,
  error,
}: CustomerHealthDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading health data…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 p-6 bg-red-50">
        <p className="text-red-700 text-sm">Failed to load health data: {error}</p>
      </div>
    );
  }

  let result: HealthScoreResult | null = null;
  let calcError: string | null = null;
  try {
    result = calculateHealthScore(paymentData, engagementData, contractData, supportData);
  } catch (e) {
    calcError = e instanceof Error ? e.message : 'Calculation failed';
  }

  if (calcError || !result) {
    return (
      <div className="rounded-lg border border-red-200 p-6 bg-red-50">
        <p className="text-red-700 text-sm">Health score calculation error: {calcError}</p>
      </div>
    );
  }

  const colors = riskColors[result.riskLevel];

  return (
    <div className={`rounded-lg border p-6 bg-white shadow-sm ${colors.border}`} data-customer-id={customerId}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Customer Health</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
          {colors.label}
        </span>
      </div>

      {/* Overall score */}
      <div className="flex items-end gap-2 mb-4">
        <span className={`text-4xl font-bold ${colors.text}`}>{Math.round(result.score)}</span>
        <span className="text-gray-400 text-sm mb-1">/ 100</span>
      </div>

      <ScoreBar
        score={result.score}
        color={result.riskLevel === 'healthy' ? 'bg-green-500' : result.riskLevel === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}
      />

      {/* Expand/collapse breakdown */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
        aria-expanded={expanded}
        aria-controls="health-breakdown"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {expanded ? 'Hide breakdown' : 'Show factor breakdown'}
      </button>

      {expanded && (
        <div id="health-breakdown" className="mt-4 space-y-3">
          {factorLabels.map(({ key, label, weight, color }) => {
            const score = result!.breakdown[key];
            return (
              <div key={key}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>
                    {label} <span className="text-gray-400">({weight})</span>
                  </span>
                  <span className="font-medium">{Math.round(score)}</span>
                </div>
                <ScoreBar score={score} color={color} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
