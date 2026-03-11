'use client';

import { useState, useMemo, useCallback } from 'react';
import { Customer } from '../data/mock-customers';
import CustomerCard from './CustomerCard';

export interface CustomerSelectorProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  loading?: boolean;
}

export default function CustomerSelector({
  customers,
  onSelectCustomer,
  loading = false,
}: CustomerSelectorProps) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const handleSelect = useCallback(
    (customer: Customer) => {
      setSelectedId(customer.id);
      onSelectCustomer(customer);
    },
    [onSelectCustomer]
  );

  const handleClear = useCallback(() => setQuery(''), []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or company…"
          aria-label="Search customers"
          className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-white text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-gray-500 text-sm gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading customers…
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-sm gap-2">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
          {query ? `No customers match "${query}"` : 'No customers available'}
        </div>
      )}

      {/* Customer grid */}
      {!loading && filtered.length > 0 && (
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((customer) => (
            <li key={customer.id}>
              <div
                className={[
                  'rounded-lg transition-all duration-150',
                  selectedId === customer.id
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : '',
                ].join(' ')}
              >
                <CustomerCard customer={customer} onClick={handleSelect} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Result count */}
      {!loading && customers.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {customers.length} customer{customers.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
