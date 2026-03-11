export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface HealthIndicatorProps {
  /** Numeric score 0–100. If provided, status is derived automatically. */
  score?: number;
  /** Explicit status override. Takes precedence over score if both are provided. */
  status?: HealthStatus;
  /** Show the numeric score alongside the status label. Default: false */
  showScore?: boolean;
  /** Compact mode renders only the icon/dot without a text label. Default: false */
  compact?: boolean;
  /** Additional Tailwind classes for the wrapper element. */
  className?: string;
}

function deriveStatus(score?: number): HealthStatus {
  if (score === undefined || score === null || typeof score !== 'number' || isNaN(score) || score < 0 || score > 100) {
    return 'unknown';
  }
  if (score >= 75) return 'healthy';
  if (score >= 50) return 'warning';
  return 'critical';
}

const statusConfig: Record<HealthStatus, { label: string; wrapperClass: string; textClass: string; icon: React.ReactNode }> = {
  healthy: {
    label: 'Healthy',
    wrapperClass: 'bg-green-100 text-green-600',
    textClass: 'text-green-600',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  warning: {
    label: 'Warning',
    wrapperClass: 'bg-yellow-100 text-yellow-600',
    textClass: 'text-yellow-600',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  critical: {
    label: 'Critical',
    wrapperClass: 'bg-red-100 text-red-600',
    textClass: 'text-red-600',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
  },
  unknown: {
    label: 'Unknown',
    wrapperClass: 'bg-gray-100 text-gray-500',
    textClass: 'text-gray-500',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function HealthIndicator({
  score,
  status,
  showScore = false,
  compact = false,
  className = '',
}: HealthIndicatorProps) {
  const resolvedStatus: HealthStatus = status ?? deriveStatus(score);
  const config = statusConfig[resolvedStatus];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center min-w-[24px] min-h-[24px] rounded-full transition-colors duration-200 ${config.wrapperClass} ${className}`}
        aria-label={config.label}
      >
        {config.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium transition-colors duration-200 ${config.wrapperClass} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="font-bold">{score}</span>
      )}
    </span>
  );
}
