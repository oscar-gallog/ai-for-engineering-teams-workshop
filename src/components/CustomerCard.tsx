'use client';

import { Customer } from '../data/mock-customers';

export interface CustomerCardProps {
  customer: Customer;
  onClick?: (customer: Customer) => void;
}

function getHealthColor(score: number): { bg: string; text: string; ring: string } {
  if (score <= 30) {
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500' };
  }
  if (score <= 70) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500' };
  }
  return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500' };
}

function getHealthLabel(score: number): string {
  if (score <= 30) return 'Critical';
  if (score <= 70) return 'Warning';
  return 'Healthy';
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const { name, company, healthScore, email, domains } = customer;
  const health = getHealthColor(healthScore);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(customer)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(customer);
        }
      }}
      className="w-full max-w-[400px] min-h-[120px] bg-white border border-gray-200 rounded-lg p-4 shadow-sm
        hover:shadow-md hover:border-gray-300 transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-600 truncate">{company}</p>
          {email && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{email}</p>
          )}
        </div>

        <div className={`flex-shrink-0 flex flex-col items-center rounded-lg px-2.5 py-1.5 ${health.bg}`}>
          <span className={`text-lg font-bold ${health.text}`}>{healthScore}</span>
          <span className={`text-[10px] font-medium ${health.text}`}>{getHealthLabel(healthScore)}</span>
        </div>
      </div>

      {domains && domains.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span className="truncate">{domains[0]}</span>
            {domains.length > 1 && (
              <span className="flex-shrink-0 text-gray-400">+{domains.length - 1} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
