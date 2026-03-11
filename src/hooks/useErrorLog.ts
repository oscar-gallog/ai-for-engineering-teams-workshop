'use client';

import { useDashboardContext, ErrorLogEntry } from '../context/DashboardContext';

export interface UseErrorLogReturn {
  errors: ErrorLogEntry[];
  addError: (entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => void;
  clearErrors: () => void;
}

export function useErrorLog(): UseErrorLogReturn {
  const { errorLog, addError, clearErrors } = useDashboardContext();
  return { errors: errorLog, addError, clearErrors };
}
