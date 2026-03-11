'use client';

import { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
  fcp: number | null;   // First Contentful Paint (ms)
  lcp: number | null;   // Largest Contentful Paint (ms)
  cls: number | null;   // Cumulative Layout Shift (score)
  tti: number | null;   // Time to Interactive (ms, approximated)
}

export function usePerformanceMetrics(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    tti: null,
  });
  const clsRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observers: PerformanceObserver[] = [];

    try {
      // FCP
      const fcpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics((m) => ({ ...m, fcp: Math.round(entry.startTime) }));
          }
        }
      });
      fcpObs.observe({ type: 'paint', buffered: true });
      observers.push(fcpObs);
    } catch { /* not supported */ }

    try {
      // LCP
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const last = entries[entries.length - 1];
          setMetrics((m) => ({ ...m, lcp: Math.round(last.startTime) }));
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObs);
    } catch { /* not supported */ }

    try {
      // CLS
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!e.hadRecentInput && e.value !== undefined) {
            clsRef.current += e.value;
            setMetrics((m) => ({ ...m, cls: Math.round(clsRef.current * 1000) / 1000 }));
          }
        }
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObs);
    } catch { /* not supported */ }

    // TTI approximation via long tasks
    try {
      const ttiStart = performance.now();
      const ttiObs = new PerformanceObserver(() => {
        setMetrics((m) => ({ ...m, tti: Math.round(performance.now() - ttiStart) }));
      });
      ttiObs.observe({ type: 'longtask', buffered: true });
      observers.push(ttiObs);
    } catch { /* not supported */ }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return metrics;
}
