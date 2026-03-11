'use client';

import React, {
  Suspense,
  lazy,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { DashboardProvider, useDashboardContext } from '../context/DashboardContext';
import { DashboardErrorBoundary } from './error-boundaries/DashboardErrorBoundary';
import { WidgetErrorBoundary } from './error-boundaries/WidgetErrorBoundary';
import ExportToolbar from './ExportToolbar';
import { mockCustomers } from '../data/mock-customers';
import { mockAlerts } from '../data/mock-alerts';
import { Customer } from '../data/mock-customers';
import { exportCustomers } from '../lib/exportUtils';
import { ExportFormat } from '../lib/exportUtils';

// ─── Lazy-loaded widgets ──────────────────────────────────────────────────────
const CustomerSelector = lazy(() => import('./CustomerSelector'));
const CustomerHealthDisplay = lazy(() => import('./CustomerHealthDisplay'));
const MarketIntelligenceWidget = lazy(() => import('./MarketIntelligenceWidget'));
const AlertsDashboardWidget = lazy(() => import('./AlertsDashboardWidget'));

// ─── Widget loading skeleton ─────────────────────────────────────────────────
function WidgetSkeleton({ label }: { label: string }) {
  return (
    <div className="rounded-xl shadow-md bg-white border border-gray-200 p-6 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <span className="sr-only">Loading {label}…</span>
    </div>
  );
}

// ─── Export rate limit (5 per minute) ────────────────────────────────────────
function useExportRateLimit(max = 5) {
  const timestamps = useRef<number[]>([]);
  return useCallback(() => {
    const now = Date.now();
    timestamps.current = timestamps.current.filter((t) => now - t < 60_000);
    if (timestamps.current.length >= max) return false;
    timestamps.current.push(now);
    return true;
  }, [max]);
}

// ─── Inner dashboard (requires context) ──────────────────────────────────────
function DashboardInner() {
  const { selectedCustomer, setSelectedCustomer, addExportRecord } = useDashboardContext();
  const [liveMessage, setLiveMessage] = useState('');
  const canExport = useExportRateLimit(5);

  const announce = useCallback((msg: string) => {
    setLiveMessage('');
    requestAnimationFrame(() => setLiveMessage(msg));
  }, []);

  const handleSelectCustomer = useCallback(
    (customer: Customer) => {
      setSelectedCustomer(customer);
      announce(`Selected ${customer.name} from ${customer.company}`);
    },
    [setSelectedCustomer, announce]
  );

  const handleExport = useCallback(
    async (format: ExportFormat, dateRange: string) => {
      if (!canExport()) {
        announce('Export rate limit reached. Please wait a minute.');
        return;
      }
      try {
        exportCustomers(mockCustomers, format, dateRange);
        addExportRecord({ format, reportType: 'customers', rowCount: mockCustomers.length });
        announce(`Exported ${mockCustomers.length} customers as ${format.toUpperCase()}`);
      } catch (e) {
        announce('Export failed. Please try again.');
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    },
    [canExport, addExportRecord, announce]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        window.location.reload();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const customerAlerts = useMemo(
    () =>
      selectedCustomer
        ? mockAlerts.filter((a) => a.customerId === selectedCustomer.id)
        : mockAlerts,
    [selectedCustomer]
  );

  return (
    <>
      {/* Skip link */}
      <a
        href="#dashboard-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
          focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:rounded focus:shadow focus:text-blue-700 focus:text-sm font-medium"
      >
        Skip to main content
      </a>

      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* Header / nav */}
        <nav
          aria-label="Dashboard navigation"
          className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
        >
          <h1 className="text-xl font-bold text-gray-900">Customer Intelligence Dashboard</h1>
          <ExportToolbar onExport={handleExport} />
        </nav>

        <main id="dashboard-content" className="p-4 md:p-6 space-y-6">
          {/* Customer selector section */}
          <section aria-label="Customer selection" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Select Customer</h2>
            <WidgetErrorBoundary widgetName="Customer Selector">
              <Suspense fallback={<WidgetSkeleton label="Customer Selector" />}>
                <CustomerSelector
                  customers={mockCustomers}
                  onSelectCustomer={handleSelectCustomer}
                />
              </Suspense>
            </WidgetErrorBoundary>
          </section>

          {/* Widgets grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="Dashboard widgets"
          >
            {/* Health Display */}
            <section aria-label="Customer health score">
              <WidgetErrorBoundary widgetName="Customer Health">
                <Suspense fallback={<WidgetSkeleton label="Customer Health" />}>
                  <CustomerHealthDisplay
                    customerId={selectedCustomer?.id ?? ''}
                    loading={false}
                  />
                </Suspense>
              </WidgetErrorBoundary>
            </section>

            {/* Market Intelligence */}
            <section aria-label="Market intelligence">
              <WidgetErrorBoundary widgetName="Market Intelligence">
                <Suspense fallback={<WidgetSkeleton label="Market Intelligence" />}>
                  <MarketIntelligenceWidget company={selectedCustomer?.company ?? ''} />
                </Suspense>
              </WidgetErrorBoundary>
            </section>

            {/* Predictive Alerts */}
            <section aria-label="Predictive alerts">
              <WidgetErrorBoundary widgetName="Predictive Alerts">
                <Suspense fallback={<WidgetSkeleton label="Predictive Alerts" />}>
                  <AlertsDashboardWidget alerts={customerAlerts} />
                </Suspense>
              </WidgetErrorBoundary>
            </section>
          </div>

          {/* Selected customer detail */}
          {selectedCustomer && (
            <aside aria-label="Selected customer details" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-base font-semibold text-gray-900 mb-1">{selectedCustomer.name}</h2>
              <p className="text-sm text-gray-600">{selectedCustomer.company}</p>
              {selectedCustomer.email && (
                <p className="text-xs text-gray-400 mt-0.5">{selectedCustomer.email}</p>
              )}
            </aside>
          )}
        </main>
      </div>
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function DashboardOrchestrator() {
  return (
    <DashboardErrorBoundary>
      <DashboardProvider>
        <DashboardInner />
      </DashboardProvider>
    </DashboardErrorBoundary>
  );
}
