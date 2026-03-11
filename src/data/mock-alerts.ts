/**
 * Mock alert data for workshop demonstration.
 * Pre-generated alerts covering all alert types and priority levels.
 */

import { Alert } from '../lib/alertTypes';

export const mockAlerts: Alert[] = [
  {
    id: 'alert_2_payment_risk_1',
    customerId: '2',
    type: 'payment_risk',
    priority: 'high',
    message: 'Payment risk detected: Payment overdue by 15 days',
    triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    context: {
      healthScore: 45,
      daysSinceLastPayment: 45,
      overdueAmount: 2400,
      arr: 12000,
    },
    recommendedActions: [
      'Contact account owner immediately',
      'Review payment history and outstanding invoices',
      'Offer flexible payment plan if needed',
    ],
    dismissed: false,
    priorityScore: 72,
  },
  {
    id: 'alert_3_engagement_cliff_1',
    customerId: '3',
    type: 'engagement_cliff',
    priority: 'high',
    message: 'Engagement cliff: login frequency dropped 65% vs 30-day average',
    triggeredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    context: {
      healthScore: 15,
      loginDropPercent: 65,
      arr: 6000,
    },
    recommendedActions: [
      'Schedule a check-in call with the primary user',
      'Send targeted re-engagement campaign',
      'Review recent product changes that may have caused friction',
    ],
    dismissed: false,
    priorityScore: 65,
  },
  {
    id: 'alert_8_contract_expiration_risk_1',
    customerId: '8',
    type: 'contract_expiration_risk',
    priority: 'high',
    message: 'Contract expires in 45 days with health score 35',
    triggeredAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    context: {
      healthScore: 35,
      daysUntilContractExpiration: 45,
      arr: 8000,
    },
    recommendedActions: [
      'Initiate renewal conversation immediately',
      'Address health issues before renewal discussion',
      'Prepare value demonstration based on usage data',
    ],
    dismissed: false,
    priorityScore: 68,
  },
  {
    id: 'alert_2_support_ticket_spike_1',
    customerId: '2',
    type: 'support_ticket_spike',
    priority: 'medium',
    message: 'Support ticket spike: 5 tickets in the last 7 days',
    triggeredAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    context: {
      healthScore: 45,
      supportTicketsLast7Days: 5,
      hasEscalation: false,
      arr: 12000,
    },
    recommendedActions: [
      'Review open tickets and prioritise resolution',
      'Offer dedicated support session to unblock issues',
      'Identify if tickets share a root cause',
    ],
    dismissed: false,
    priorityScore: 43,
  },
  {
    id: 'alert_5_feature_adoption_stall_1',
    customerId: '5',
    type: 'feature_adoption_stall',
    priority: 'medium',
    message: 'Feature adoption stall: no new feature usage in 32 days for a growing account',
    triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    context: {
      healthScore: 60,
      daysSinceLastFeatureUsage: 32,
      arr: 36000,
    },
    recommendedActions: [
      'Send feature adoption tips and tutorials',
      'Schedule a product tour to highlight underused features',
      'Review onboarding completion status',
    ],
    dismissed: false,
    priorityScore: 46,
  },
];

export default mockAlerts;
