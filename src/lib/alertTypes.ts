/**
 * TypeScript interfaces for the Predictive Intelligence alerts system.
 */

export type AlertPriority = 'high' | 'medium';

export type AlertType =
  | 'payment_risk'
  | 'engagement_cliff'
  | 'contract_expiration_risk'
  | 'market_sentiment_crisis'
  | 'support_ticket_spike'
  | 'feature_adoption_stall'
  | 'market_headwind';

export interface AlertContext {
  healthScore?: number;
  healthScoreDrop?: number;
  daysSinceLastPayment?: number;
  overdueAmount?: number;
  loginDropPercent?: number;
  daysUntilContractExpiration?: number;
  supportTicketsLast7Days?: number;
  hasEscalation?: boolean;
  daysSinceLastFeatureUsage?: number;
  marketSentiment?: 'positive' | 'neutral' | 'negative';
  marketSentimentScore?: number;
  arr?: number;
  [key: string]: unknown;
}

export interface Alert {
  id: string;
  customerId: string;
  type: AlertType;
  priority: AlertPriority;
  message: string;
  triggeredAt: string; // ISO 8601
  context: AlertContext;
  recommendedActions: string[];
  dismissed: boolean;
  priorityScore: number;
}

export interface AlertRule {
  type: AlertType;
  priority: AlertPriority;
  evaluate: (profile: CustomerRiskProfile) => boolean;
  buildAlert: (profile: CustomerRiskProfile, id: string) => Alert;
}

export interface CustomerRiskProfile {
  customerId: string;
  healthScore: number;
  previousHealthScore?: number;
  previousHealthScoreTimestamp?: string; // ISO 8601
  daysSinceLastPayment: number;
  overdueAmount: number;
  loginFrequencyPerWeek: number;
  loginFrequencyBaseline: number; // 30-day average logins/week
  daysUntilContractExpiration: number;
  arr: number; // Annual Recurring Revenue
  supportTicketsLast7Days: number;
  hasEscalatedTicket: boolean;
  daysSinceLastFeatureUsage: number;
  isGrowingAccount: boolean; // whether ARR grew in last 90 days
  marketSentiment?: 'positive' | 'neutral' | 'negative';
  marketSentimentScore?: number;
  marketSentimentTrend?: number[]; // last 14 data points, newest last
  existingAlertTypes?: AlertType[]; // for deduplication
  lastAlertTimestamps?: Partial<Record<AlertType, string>>; // for cooldown
}

export class AlertEvaluationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlertEvaluationError';
  }
}
