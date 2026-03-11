'use client';

import { Customer } from '../src/data/mock-customers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Health score thresholds as specified in the Customer Intelligence Dashboard. */
const HEALTH_THRESHOLDS = {
  POOR_MAX: 30,    // 0–30  → red   (Poor)
  MODERATE_MAX: 70, // 31–70 → yellow (Moderate)
  // 71–100 → green (Good)
} as const;

const MAX_DOMAINS_SHOWN = 1 as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HealthTier = 'poor' | 'moderate' | 'good';

interface HealthConfig {
  tier: HealthTier;
  label: string;
  /** Tailwind classes for the pill wrapper */
  pillClass: string;
  /** Tailwind classes for the score text */
  scoreClass: string;
  /** Tailwind classes for the dot indicator */
  dotClass: string;
}

/** Props for the CustomerCard component. */
export interface CustomerCardProps {
  /** The customer data object to display. */
  customer: Customer;
  /**
   * Optional click handler. Receives the full customer object so the parent
   * can navigate or open a detail panel without accessing component internals.
   */
  onClick?: (customer: Customer) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deriveHealthConfig(score: number): HealthConfig {
  if (score <= HEALTH_THRESHOLDS.POOR_MAX) {
    return {
      tier: 'poor',
      label: 'Poor',
      pillClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      scoreClass: 'text-red-700 dark:text-red-400',
      dotClass: 'bg-red-500',
    };
  }
  if (score <= HEALTH_THRESHOLDS.MODERATE_MAX) {
    return {
      tier: 'moderate',
      label: 'Moderate',
      pillClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      scoreClass: 'text-yellow-700 dark:text-yellow-400',
      dotClass: 'bg-yellow-500',
    };
  }
  return {
    tier: 'good',
    label: 'Good',
    pillClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    scoreClass: 'text-green-700 dark:text-green-400',
    dotClass: 'bg-green-500',
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface HealthBadgeProps {
  score: number;
}

function HealthBadge({ score }: HealthBadgeProps) {
  const config = deriveHealthConfig(score);

  return (
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      {/* Numeric score */}
      <span
        className={`text-2xl font-bold tabular-nums leading-none ${config.scoreClass}`}
        aria-label={`Health score: ${score} out of 100`}
      >
        {score}
      </span>
      {/* Status pill */}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.pillClass}`}
        role="status"
        aria-label={`Health status: ${config.label}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotClass}`}
          aria-hidden="true"
        />
        {config.label}
      </span>
    </div>
  );
}

interface DomainRowProps {
  domains: string[];
}

function DomainRow({ domains }: DomainRowProps) {
  const primaryDomain = domains[0];
  const extraCount = domains.length - MAX_DOMAINS_SHOWN;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div
        className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
        aria-label={`Monitored domain${domains.length > 1 ? 's' : ''}: ${domains.join(', ')}`}
      >
        {/* Globe icon */}
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
          />
        </svg>

        <span className="truncate">{primaryDomain}</span>

        {extraCount > 0 && (
          <span
            className="flex-shrink-0 text-gray-400 dark:text-gray-500"
            title={domains.slice(MAX_DOMAINS_SHOWN).join(', ')}
          >
            +{extraCount} more
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * CustomerCard displays a single customer's name, company, email, health score,
 * and monitored domains in a compact, clickable card format.
 *
 * - Color-coded health: red (0–30), yellow (31–70), green (71–100)
 * - Fully keyboard-accessible via role="button" and Enter/Space handling
 * - Responsive from 320px+; max-width 400px as per spec
 * - Dark-mode compatible via Tailwind dark: variants
 *
 * @example
 * ```tsx
 * <CustomerCard
 *   customer={customer}
 *   onClick={(c) => router.push(`/customers/${c.id}`)}
 * />
 * ```
 */
export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const { name, company, email, healthScore, domains } = customer;

  function handleClick() {
    onClick?.(customer);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(customer);
    }
  }

  const isInteractive = typeof onClick === 'function';

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? `View details for ${name} at ${company}` : undefined}
      className={[
        // Sizing
        'w-full max-w-[400px] min-h-[120px]',
        // Visual
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'rounded-xl p-4 shadow-sm',
        // Interaction
        isInteractive
          ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top row: identity + health badge */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: customer identity */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate leading-snug">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
            {company}
          </p>
          {email != null && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
              {email}
            </p>
          )}
        </div>

        {/* Right: health score badge */}
        <HealthBadge score={healthScore} />
      </div>

      {/* Bottom row: domain information */}
      {domains != null && domains.length > 0 && (
        <DomainRow domains={domains} />
      )}
    </div>
  );
}
