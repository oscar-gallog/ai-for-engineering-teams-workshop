'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Customer } from '../data/mock-customers';
import { MarketIntelligenceData } from '../lib/marketIntelligenceService';
import { ExportFormat } from '../lib/exportUtils';

export interface ErrorLogEntry {
  id: string;
  message: string;
  component?: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ExportHistoryEntry {
  id: string;
  format: ExportFormat;
  reportType: string;
  rowCount: number;
  timestamp: string;
}

export interface DashboardContextValue {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  marketCache: Map<string, MarketIntelligenceData>;
  setMarketCache: React.Dispatch<React.SetStateAction<Map<string, MarketIntelligenceData>>>;
  errorLog: ErrorLogEntry[];
  addError: (entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => void;
  clearErrors: () => void;
  exportHistory: ExportHistoryEntry[];
  addExportRecord: (entry: Omit<ExportHistoryEntry, 'id' | 'timestamp'>) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [marketCache, setMarketCache] = useState<Map<string, MarketIntelligenceData>>(new Map());
  const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistoryEntry[]>([]);

  const addError = useCallback((entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => {
    setErrorLog((prev) => [
      { ...entry, id: `err_${Date.now()}_${Math.random()}`, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const clearErrors = useCallback(() => setErrorLog([]), []);

  const addExportRecord = useCallback((entry: Omit<ExportHistoryEntry, 'id' | 'timestamp'>) => {
    setExportHistory((prev) => [
      { ...entry, id: `exp_${Date.now()}`, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        selectedCustomer,
        setSelectedCustomer,
        marketCache,
        setMarketCache,
        errorLog,
        addError,
        clearErrors,
        exportHistory,
        addExportRecord,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboardContext must be used inside DashboardProvider');
  }
  return ctx;
}
