'use client';

import { useState, useRef, useEffect } from 'react';
import { ExportFormat } from '../lib/exportUtils';

export interface ExportToolbarProps {
  onExport: (format: ExportFormat, dateRange: string) => Promise<void> | void;
  disabled?: boolean;
}

const DATE_RANGES = [
  { label: 'All time', value: 'all' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'This year', value: '2026' },
];

export default function ExportToolbar({ onExport, disabled = false }: ExportToolbarProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [dateRange, setDateRange] = useState('all');
  const [exporting, setExporting] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport(format, dateRange);
    } finally {
      setExporting(false);
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="relative" ref={modalRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open export menu"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
          bg-white border border-gray-300 text-gray-700 hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Export options"
          className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Export Data</h4>

          <label className="block text-xs text-gray-600 mb-1">Format</label>
          <div className="flex gap-2 mb-3">
            {(['csv', 'json'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${
                  format === f
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="block text-xs text-gray-600 mb-1">Date range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white text-gray-700
              focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
          >
            {DATE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-2 text-sm font-medium rounded-md bg-blue-600 text-white
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {exporting ? 'Exporting…' : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      )}
    </div>
  );
}
