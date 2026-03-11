'use client';

import { useState, useMemo } from 'react';
import { Alert, AlertPriority } from '../lib/alertTypes';
import PredictiveIntelligencePanel from './PredictiveIntelligencePanel';

export interface AlertsDashboardWidgetProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  loading?: boolean;
  error?: string;
}

export default function AlertsDashboardWidget({
  alerts,
  onDismiss,
  loading = false,
  error,
}: AlertsDashboardWidgetProps) {
  const [localDismissed, setLocalDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setLocalDismissed((prev) => new Set([...prev, id]));
    onDismiss?.(id);
  };

  const activeAlerts = useMemo(
    () => alerts.filter((a) => !a.dismissed && !localDismissed.has(a.id)),
    [alerts, localDismissed]
  );

  const highCount = activeAlerts.filter((a) => a.priority === 'high').length;
  const medCount = activeAlerts.filter((a: Alert) => (a.priority as AlertPriority) === 'medium').length;

  if (loading) {
    return (
      <div className="rounded-lg shadow p-6 bg-white border border-gray-200">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading alerts…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 p-6 bg-red-50">
        <p className="text-red-700 text-sm">Failed to load alerts: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary badges */}
      {activeAlerts.length > 0 && (
        <div className="flex gap-2">
          {highCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {highCount} high
            </span>
          )}
          {medCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              {medCount} medium
            </span>
          )}
        </div>
      )}

      <PredictiveIntelligencePanel alerts={alerts} onDismiss={handleDismiss} />
    </div>
  );
}
