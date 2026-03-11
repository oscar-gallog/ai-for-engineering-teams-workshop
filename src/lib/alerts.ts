/**
 * Predictive Intelligence Alerts Engine
 * Pure function implementation — no side effects.
 */

import {
  Alert,
  AlertRule,
  AlertType,
  CustomerRiskProfile,
  AlertEvaluationError,
} from './alertTypes';

// ─── Cooldown windows (ms) ───────────────────────────────────────────────────

const COOLDOWN_MS: Record<AlertType, number> = {
  payment_risk: 24 * 60 * 60 * 1000,           // 24 h
  engagement_cliff: 48 * 60 * 60 * 1000,        // 48 h
  contract_expiration_risk: 7 * 24 * 60 * 60 * 1000, // 7 days
  market_sentiment_crisis: 24 * 60 * 60 * 1000,
  support_ticket_spike: 24 * 60 * 60 * 1000,
  feature_adoption_stall: 7 * 24 * 60 * 60 * 1000,
  market_headwind: 3 * 24 * 60 * 60 * 1000,
};

// ─── Priority score calculation ──────────────────────────────────────────────

/**
 * Calculates a priority score 0–100 for sorting alerts.
 * Weights: ARR 30%, urgency 30%, recency 20%, market context 20%
 */
function calcPriorityScore(
  profile: CustomerRiskProfile,
  priority: 'high' | 'medium',
  marketContext: boolean
): number {
  // ARR factor: normalise to 0–1 assuming max meaningful ARR ~$1M
  const arrFactor = Math.min(1, (profile.arr || 0) / 1_000_000);

  // Urgency: high = 1, medium = 0.5
  const urgencyFactor = priority === 'high' ? 1 : 0.5;

  // Recency: always 1 since we just generated this alert
  const recencyFactor = 1;

  // Market context bonus
  const marketFactor = marketContext ? 1 : 0;

  return Math.round(
    (arrFactor * 30 + urgencyFactor * 30 + recencyFactor * 20 + marketFactor * 20)
  );
}

// ─── Alert Rules ─────────────────────────────────────────────────────────────

const alertRules: AlertRule[] = [
  // ── HIGH PRIORITY ──────────────────────────────────────────────────────────

  {
    type: 'payment_risk',
    priority: 'high',
    evaluate(profile) {
      const healthDrop =
        profile.previousHealthScore !== undefined
          ? profile.previousHealthScore - profile.healthScore
          : 0;
      return profile.daysSinceLastPayment > 30 || healthDrop > 20;
    },
    buildAlert(profile, id) {
      const healthDrop =
        profile.previousHealthScore !== undefined
          ? profile.previousHealthScore - profile.healthScore
          : 0;
      const reason =
        profile.daysSinceLastPayment > 30
          ? `Payment overdue by ${profile.daysSinceLastPayment - 30} days`
          : `Health score dropped ${healthDrop.toFixed(0)} points in 7 days`;
      return {
        id,
        customerId: profile.customerId,
        type: 'payment_risk',
        priority: 'high',
        message: `Payment risk detected: ${reason}`,
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          healthScoreDrop: healthDrop,
          daysSinceLastPayment: profile.daysSinceLastPayment,
          overdueAmount: profile.overdueAmount,
          arr: profile.arr,
        },
        recommendedActions: [
          'Contact account owner immediately',
          'Review payment history and outstanding invoices',
          'Offer flexible payment plan if needed',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'high', false),
      };
    },
  },

  {
    type: 'engagement_cliff',
    priority: 'high',
    evaluate(profile) {
      if (profile.loginFrequencyBaseline <= 0) return false;
      const dropPercent =
        ((profile.loginFrequencyBaseline - profile.loginFrequencyPerWeek) /
          profile.loginFrequencyBaseline) *
        100;
      return dropPercent > 50;
    },
    buildAlert(profile, id) {
      const dropPercent =
        profile.loginFrequencyBaseline > 0
          ? Math.round(
              ((profile.loginFrequencyBaseline - profile.loginFrequencyPerWeek) /
                profile.loginFrequencyBaseline) *
                100
            )
          : 0;
      return {
        id,
        customerId: profile.customerId,
        type: 'engagement_cliff',
        priority: 'high',
        message: `Engagement cliff: login frequency dropped ${dropPercent}% vs 30-day average`,
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          loginDropPercent: dropPercent,
          arr: profile.arr,
        },
        recommendedActions: [
          'Schedule a check-in call with the primary user',
          'Send targeted re-engagement campaign',
          'Review recent product changes that may have caused friction',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'high', false),
      };
    },
  },

  {
    type: 'contract_expiration_risk',
    priority: 'high',
    evaluate(profile) {
      return (
        profile.daysUntilContractExpiration < 90 &&
        profile.daysUntilContractExpiration >= 0 &&
        profile.healthScore < 50
      );
    },
    buildAlert(profile, id) {
      return {
        id,
        customerId: profile.customerId,
        type: 'contract_expiration_risk',
        priority: 'high',
        message: `Contract expires in ${profile.daysUntilContractExpiration} days with health score ${profile.healthScore}`,
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          daysUntilContractExpiration: profile.daysUntilContractExpiration,
          arr: profile.arr,
        },
        recommendedActions: [
          'Initiate renewal conversation immediately',
          'Address health issues before renewal discussion',
          'Prepare value demonstration based on usage data',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'high', false),
      };
    },
  },

  {
    type: 'market_sentiment_crisis',
    priority: 'high',
    evaluate(profile) {
      return (
        profile.marketSentiment === 'negative' && profile.healthScore < 60
      );
    },
    buildAlert(profile, id) {
      return {
        id,
        customerId: profile.customerId,
        type: 'market_sentiment_crisis',
        priority: 'high',
        message: `Market sentiment crisis: negative market signals combined with low health score (${profile.healthScore})`,
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          marketSentiment: profile.marketSentiment,
          marketSentimentScore: profile.marketSentimentScore,
          arr: profile.arr,
        },
        recommendedActions: [
          'Monitor market news closely for escalating issues',
          'Proactively reach out with support and value messaging',
          'Assess churn risk and prepare retention offer',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'high', true),
      };
    },
  },

  // ── MEDIUM PRIORITY ────────────────────────────────────────────────────────

  {
    type: 'support_ticket_spike',
    priority: 'medium',
    evaluate(profile) {
      return profile.supportTicketsLast7Days > 3 || profile.hasEscalatedTicket;
    },
    buildAlert(profile, id) {
      const reason = profile.hasEscalatedTicket
        ? 'escalated support ticket detected'
        : `${profile.supportTicketsLast7Days} tickets in the last 7 days`;
      return {
        id,
        customerId: profile.customerId,
        type: 'support_ticket_spike',
        priority: 'medium',
        message: `Support ticket spike: ${reason}`,
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          supportTicketsLast7Days: profile.supportTicketsLast7Days,
          hasEscalation: profile.hasEscalatedTicket,
          arr: profile.arr,
        },
        recommendedActions: [
          'Review open tickets and prioritise resolution',
          'Offer dedicated support session to unblock issues',
          'Identify if tickets share a root cause',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'medium', false),
      };
    },
  },

  {
    type: 'feature_adoption_stall',
    priority: 'medium',
    evaluate(profile) {
      return profile.isGrowingAccount && profile.daysSinceLastFeatureUsage >= 30;
    },
    buildAlert(profile, id) {
      return {
        id,
        customerId: profile.customerId,
        type: 'feature_adoption_stall',
        priority: 'medium',
        message: `Feature adoption stall: no new feature usage in ${profile.daysSinceLastFeatureUsage} days for a growing account`,
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          daysSinceLastFeatureUsage: profile.daysSinceLastFeatureUsage,
          arr: profile.arr,
        },
        recommendedActions: [
          'Send feature adoption tips and tutorials',
          'Schedule a product tour to highlight underused features',
          'Review onboarding completion status',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'medium', false),
      };
    },
  },

  {
    type: 'market_headwind',
    priority: 'medium',
    evaluate(profile) {
      if (!profile.marketSentimentTrend || profile.marketSentimentTrend.length < 2) {
        return false;
      }
      // Declining if later values are consistently lower
      const trend = profile.marketSentimentTrend;
      const half = Math.floor(trend.length / 2);
      const firstHalfAvg = trend.slice(0, half).reduce((a, b) => a + b, 0) / half;
      const secondHalfAvg = trend.slice(half).reduce((a, b) => a + b, 0) / (trend.length - half);
      return secondHalfAvg < firstHalfAvg - 0.1;
    },
    buildAlert(profile, id) {
      return {
        id,
        customerId: profile.customerId,
        type: 'market_headwind',
        priority: 'medium',
        message: 'Market headwind: declining sentiment trend over the last 14 days',
        triggeredAt: new Date().toISOString(),
        context: {
          healthScore: profile.healthScore,
          marketSentiment: profile.marketSentiment,
          marketSentimentScore: profile.marketSentimentScore,
          arr: profile.arr,
        },
        recommendedActions: [
          'Monitor industry news for customer-specific risks',
          'Prepare contingency retention messaging',
          'Evaluate impact on renewal likelihood',
        ],
        dismissed: false,
        priorityScore: calcPriorityScore(profile, 'medium', true),
      };
    },
  },
];

// ─── Alert Engine ─────────────────────────────────────────────────────────────

let _alertCounter = 0;

function generateAlertId(customerId: string, type: AlertType): string {
  _alertCounter += 1;
  return `alert_${customerId}_${type}_${_alertCounter}_${Date.now()}`;
}

/**
 * Evaluates all alert rules against a customer risk profile.
 * Applies deduplication and cooldown filtering.
 * Returns alerts sorted by priorityScore descending.
 */
export function alertEngine(profile: CustomerRiskProfile): Alert[] {
  if (!profile.customerId) {
    throw new AlertEvaluationError('CustomerRiskProfile must have a customerId');
  }

  const now = Date.now();
  const results: Alert[] = [];

  for (const rule of alertRules) {
    // Deduplication: skip if alert type already active for this customer
    if (profile.existingAlertTypes?.includes(rule.type)) {
      continue;
    }

    // Cooldown: skip if last alert of this type was too recent
    const lastTimestamp = profile.lastAlertTimestamps?.[rule.type];
    if (lastTimestamp) {
      const elapsed = now - new Date(lastTimestamp).getTime();
      if (elapsed < COOLDOWN_MS[rule.type]) {
        continue;
      }
    }

    try {
      if (rule.evaluate(profile)) {
        const id = generateAlertId(profile.customerId, rule.type);
        results.push(rule.buildAlert(profile, id));
      }
    } catch {
      // Individual rule failures do not block others
    }
  }

  // Sort by priorityScore descending, then high before medium
  return results.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'high' ? -1 : 1;
    }
    return b.priorityScore - a.priorityScore;
  });
}
