/**
 * Export utilities for CSV and JSON download.
 * File naming convention: {report-type}_{date-range}_{timestamp}.{ext}
 */

import { Customer } from '../data/mock-customers';

export class ExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportError';
  }
}

export type ExportFormat = 'csv' | 'json';

function buildFileName(reportType: string, dateRange: string, format: ExportFormat): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `${reportType}_${dateRange}_${timestamp}.${format}`;
}

function escapeCsv(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function objectsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(',')),
  ];
  return lines.join('\n');
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCustomers(
  customers: Customer[],
  format: ExportFormat,
  dateRange = 'all'
): void {
  if (customers.length === 0) {
    throw new ExportError('No customer data to export');
  }

  const rows = customers.map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
    healthScore: c.healthScore,
    email: c.email ?? '',
    subscriptionTier: c.subscriptionTier ?? '',
    domains: (c.domains ?? []).join('; '),
    createdAt: c.createdAt ?? '',
    updatedAt: c.updatedAt ?? '',
  }));

  const filename = buildFileName('customers', dateRange, format);

  if (format === 'json') {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
  } else {
    const blob = new Blob([objectsToCsv(rows)], { type: 'text/csv' });
    downloadBlob(blob, filename);
  }
}
