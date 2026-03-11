/**
 * Health Score Calculator
 * Pure function library for calculating customer health scores.
 * Multi-factor weighted scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
 */

// ─── Custom Error ───────────────────────────────────────────────────────────

export class HealthCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HealthCalculationError';
  }
}

// ─── Input Interfaces ────────────────────────────────────────────────────────

export interface PaymentData {
  /** Days since last successful payment (0 = paid today) */
  daysSinceLastPayment: number;
  /** Average payment delay in days over the last 12 months */
  averagePaymentDelay: number;
  /** Current overdue amount in currency units (0 = no overdue) */
  overdueAmount: number;
}

export interface EngagementData {
  /** Average logins per week over the last 30 days */
  loginFrequencyPerWeek: number;
  /** Number of distinct features used in the last 30 days */
  featureUsageCount: number;
  /** Number of support tickets opened in the last 30 days */
  supportTicketsLast30Days: number;
}

export interface ContractData {
  /** Days until contract renewal (negative = already expired) */
  daysUntilRenewal: number;
  /** Annual contract value in currency units */
  contractValue: number;
  /** Whether the customer has upgraded their plan in the last 90 days */
  recentUpgrade: boolean;
}

export interface SupportData {
  /** Average ticket resolution time in hours */
  averageResolutionTimeHours: number;
  /** Customer satisfaction score 0–10 */
  satisfactionScore: number;
  /** Number of escalated tickets in the last 90 days */
  escalationCount: number;
}

// ─── Output Interfaces ───────────────────────────────────────────────────────

export type RiskLevel = 'healthy' | 'warning' | 'critical';

export interface HealthScoreBreakdown {
  paymentScore: number;
  engagementScore: number;
  contractScore: number;
  supportScore: number;
}

export interface HealthScoreResult {
  /** Overall health score 0–100 */
  score: number;
  /** Risk tier classification */
  riskLevel: RiskLevel;
  /** Individual factor scores (each 0–100) */
  breakdown: HealthScoreBreakdown;
}

// ─── Factor Scoring Functions ────────────────────────────────────────────────

/**
 * Calculates payment health sub-score (0–100).
 * Penalizes overdue payments, long delays, and unpaid amounts.
 */
export function calculatePaymentScore(data: PaymentData): number {
  if (data.daysSinceLastPayment < 0) {
    throw new HealthCalculationError('daysSinceLastPayment must be >= 0');
  }
  if (data.averagePaymentDelay < 0) {
    throw new HealthCalculationError('averagePaymentDelay must be >= 0');
  }
  if (data.overdueAmount < 0) {
    throw new HealthCalculationError('overdueAmount must be >= 0');
  }

  // Days since last payment: ideal <= 35 days (monthly billing + grace), worst = 120+
  const recencyScore = Math.max(0, 100 - Math.max(0, data.daysSinceLastPayment - 35) * 1.5);

  // Average delay: 0 days = 100, 30+ days = 0
  const delayScore = Math.max(0, 100 - data.averagePaymentDelay * 3.33);

  // Overdue: 0 = 100, any overdue = penalty (caps at 0)
  const overdueScore = data.overdueAmount > 0 ? Math.max(0, 50 - Math.log10(data.overdueAmount + 1) * 20) : 100;

  return Math.round((recencyScore * 0.4 + delayScore * 0.4 + overdueScore * 0.2) * 10) / 10;
}

/**
 * Calculates engagement health sub-score (0–100).
 * Rewards frequent logins, broad feature usage, and low support burden.
 */
export function calculateEngagementScore(data: EngagementData): number {
  if (data.loginFrequencyPerWeek < 0) {
    throw new HealthCalculationError('loginFrequencyPerWeek must be >= 0');
  }
  if (data.featureUsageCount < 0) {
    throw new HealthCalculationError('featureUsageCount must be >= 0');
  }
  if (data.supportTicketsLast30Days < 0) {
    throw new HealthCalculationError('supportTicketsLast30Days must be >= 0');
  }

  // Login frequency: 5+ logins/week = 100, 0 = 0
  const loginScore = Math.min(100, data.loginFrequencyPerWeek * 20);

  // Feature usage: 10+ features = 100, 0 = 0
  const featureScore = Math.min(100, data.featureUsageCount * 10);

  // Support tickets: 0 = 100, 5+ = 0 (high tickets signal friction)
  const ticketScore = Math.max(0, 100 - data.supportTicketsLast30Days * 20);

  return Math.round((loginScore * 0.5 + featureScore * 0.3 + ticketScore * 0.2) * 10) / 10;
}

/**
 * Calculates contract health sub-score (0–100).
 * Rewards upcoming renewals with headroom and recent upgrades.
 */
export function calculateContractScore(data: ContractData): number {
  if (data.contractValue < 0) {
    throw new HealthCalculationError('contractValue must be >= 0');
  }

  // Days until renewal: expired (<0) = 0, 365+ days = 100
  let renewalScore: number;
  if (data.daysUntilRenewal < 0) {
    renewalScore = 0;
  } else if (data.daysUntilRenewal >= 365) {
    renewalScore = 100;
  } else {
    renewalScore = (data.daysUntilRenewal / 365) * 100;
  }

  // Contract value bonus: enterprise accounts get extra resilience
  const valueBonus = data.contractValue >= 50000 ? 10 : data.contractValue >= 10000 ? 5 : 0;

  // Upgrade bonus: recent upgrade signals positive trajectory
  const upgradeBonus = data.recentUpgrade ? 15 : 0;

  return Math.min(100, Math.round((renewalScore + valueBonus + upgradeBonus) * 10) / 10);
}

/**
 * Calculates support health sub-score (0–100).
 * Rewards fast resolution, high satisfaction, and zero escalations.
 */
export function calculateSupportScore(data: SupportData): number {
  if (data.satisfactionScore < 0 || data.satisfactionScore > 10) {
    throw new HealthCalculationError('satisfactionScore must be between 0 and 10');
  }
  if (data.averageResolutionTimeHours < 0) {
    throw new HealthCalculationError('averageResolutionTimeHours must be >= 0');
  }
  if (data.escalationCount < 0) {
    throw new HealthCalculationError('escalationCount must be >= 0');
  }

  // Resolution time: <= 4h = 100, 48h+ = 0
  const resolutionScore = Math.max(0, 100 - Math.max(0, data.averageResolutionTimeHours - 4) * 2.27);

  // Satisfaction: 0–10 mapped to 0–100
  const satisfactionScore = data.satisfactionScore * 10;

  // Escalation penalty: 0 escalations = 100, 3+ = 0
  const escalationScore = Math.max(0, 100 - data.escalationCount * 33.3);

  return Math.round((resolutionScore * 0.3 + satisfactionScore * 0.5 + escalationScore * 0.2) * 10) / 10;
}

/**
 * Combines all factor scores into a single health score with risk classification.
 * Weights: Payment 40%, Engagement 30%, Contract 20%, Support 10%
 */
export function calculateHealthScore(
  payment: PaymentData,
  engagement: EngagementData,
  contract: ContractData,
  support: SupportData
): HealthScoreResult {
  const paymentScore = calculatePaymentScore(payment);
  const engagementScore = calculateEngagementScore(engagement);
  const contractScore = calculateContractScore(contract);
  const supportScore = calculateSupportScore(support);

  const score = Math.round(
    (paymentScore * 0.4 + engagementScore * 0.3 + contractScore * 0.2 + supportScore * 0.1) * 10
  ) / 10;

  let riskLevel: RiskLevel;
  if (score >= 71) {
    riskLevel = 'healthy';
  } else if (score >= 31) {
    riskLevel = 'warning';
  } else {
    riskLevel = 'critical';
  }

  return {
    score,
    riskLevel,
    breakdown: { paymentScore, engagementScore, contractScore, supportScore },
  };
}
