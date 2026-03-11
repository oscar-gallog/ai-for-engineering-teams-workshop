# Feature: Predictive Intelligence System

### Context
- Intelligent predictive alerts system for the Customer Intelligence Dashboard combining proactive risk monitoring with market-aware early warning capabilities
- Merges real-time customer health and behavioral monitoring (predictive alerts) with external market intelligence signals into a unified risk assessment engine
- Consumed by the `PredictiveIntelligencePanel` UI widget, which integrates alongside `CustomerCard`, `CustomerSelector`, `CustomerHealthDisplay`, and `MarketIntelligenceWidget`
- Demonstrates advanced AI collaboration for complex rule design, spec-driven context compression, and multi-signal risk analysis

### Requirements

#### Functional Requirements — Alert Rules Engine
- Multi-tier alert priority system: High Priority (immediate action), Medium Priority (monitor closely)
- Rule-based triggering with configurable thresholds and conditions
- Alert prioritization logic considering customer value (ARR), health score, and market sentiment
- Cooldown periods to prevent alert spam and fatigue
- Deduplication logic to prevent duplicate alerts for the same customer/issue

#### Functional Requirements — High Priority Alert Types
- **Payment Risk Alert**: payment overdue >30 days OR health score drops >20 points in 7 days
- **Engagement Cliff Alert**: login frequency drops >50% compared to 30-day average
- **Contract Expiration Risk**: contract expires in <90 days AND health score <50
- **Market Sentiment Crisis**: negative market sentiment combined with health score <60 (cross-signal alert)

#### Functional Requirements — Medium Priority Alert Types
- **Support Ticket Spike**: >3 support tickets in 7 days OR escalated ticket
- **Feature Adoption Stall**: no new feature usage in 30 days for growing accounts
- **Market Headwind Warning**: declining market sentiment trend for customer's company over 14 days

#### Functional Requirements — Data Monitoring
- Real-time monitoring of customer health score changes and threshold crossings
- Login pattern analysis for gradual vs sudden engagement drops
- Payment timing and behavior change detection
- Support satisfaction trends and ticket escalation monitoring
- Market sentiment integration from `MarketIntelligenceService` for cross-signal correlation

#### Functional Requirements — Alert Generation & Management
- Pure function implementation in `src/lib/alerts.ts` for all rule evaluation
- Main `alertEngine` function that evaluates all rules against customer data and market signals
- Alert history tracking and audit trail
- Business hours consideration for alert delivery timing
- Priority scoring algorithm with weighted factors: customer ARR (30%), urgency (30%), recency (20%), market context (20%)

#### Functional Requirements — UI Components
- `PredictiveIntelligencePanel` widget integrated into the main dashboard grid
- Alert priority visualization with color coding: red (high priority), yellow (medium priority), green (no active alerts)
- Alert detail cards with recommended actions and supporting context (health score, market sentiment, trigger reason)
- Alert dismissal and action tracking interface
- Historical alerts view with filtering by priority, type, and customer
- Real-time alert count badge showing active alerts for selected customer

#### Data Requirements
- Consumes customer data from `CustomerSelector` state (health score, engagement metrics, payment history, contract info, support data)
- Consumes market sentiment from `MarketIntelligenceService` for cross-signal alerts
- Alert objects contain: id, customerId, type, priority, message, triggeredAt, context, recommendedActions, dismissed
- Mock alert data generator for reliable workshop demonstration

#### Integration Requirements
- Integrates into main Dashboard component grid alongside existing widgets
- Receives selected customer data via props from `CustomerSelector`
- Fetches market intelligence data from `/api/market-intelligence/[company]` for cross-signal rules
- Real-time updates when customer selection changes or underlying data updates
- Follows same prop passing and state management patterns as other widgets

### Constraints
- **Tech stack**: Next.js 15 (App Router with Route Handlers), React 19, TypeScript (strict mode), Tailwind CSS
- **File structure**:
  - Alert rules engine: `src/lib/alerts.ts`
  - Alert TypeScript interfaces: `src/lib/alertTypes.ts`
  - UI panel: `src/components/PredictiveIntelligencePanel.tsx`
  - Mock alert data: `src/data/mock-alerts.ts`
- **Architecture**: pure functions with no side effects for all alert rules; `alertEngine` orchestrates rule evaluation; service integration via existing `MarketIntelligenceService`
- **Typing**: TypeScript interfaces for `Alert`, `AlertRule`, `AlertPriority`, `AlertType`, `AlertContext`, `CustomerRiskProfile`; custom `AlertEvaluationError` class extending `Error`
- **Performance**: efficient rule evaluation for hundreds of customers; minimal latency for real-time alert processing; caching for market intelligence lookups via existing service layer
- **Design**: matches existing widget styling — card-based layout with `rounded-lg shadow p-6`; color coding consistent with dashboard (red/yellow/green); typography and spacing consistent with `CustomerCard` and `MarketIntelligenceWidget`
- **Responsive**: mobile (320px+), tablet (768px+), desktop (1024px+) — consistent with dashboard grid using `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **Security**: input validation for all customer data and rule parameters; no sensitive customer data exposed in alert messages; rate limiting on alert generation; audit trail logging for triggered alerts; error messages leak no sensitive information

### Acceptance Criteria
- [ ] `alertEngine` evaluates all rules and returns correctly prioritized alerts for a given customer
- [ ] High priority rules trigger correctly: Payment Risk (overdue >30d OR health drop >20pts/7d), Engagement Cliff (logins drop >50%), Contract Expiration (expires <90d AND health <50), Market Sentiment Crisis (negative sentiment AND health <60)
- [ ] Medium priority rules trigger correctly: Support Ticket Spike (>3 tickets/7d OR escalation), Feature Adoption Stall (no new features/30d), Market Headwind (declining sentiment/14d)
- [ ] Priority scoring algorithm applies correct weights: ARR 30%, urgency 30%, recency 20%, market context 20%
- [ ] Deduplication prevents duplicate alerts for the same customer and issue type
- [ ] Cooldown periods suppress repeated alerts within configured timeframes
- [ ] Cross-signal alerts correctly combine health score data with market sentiment
- [ ] All alert rule functions are pure (no side effects) and deterministic
- [ ] `PredictiveIntelligencePanel` displays alerts with correct color coding (red/yellow/green)
- [ ] Alert detail cards show recommended actions and supporting context
- [ ] Alert dismissal updates state and is tracked in audit trail
- [ ] Historical alerts view supports filtering by priority, type, and customer
- [ ] Active alert count badge updates in real-time
- [ ] Loading and error states render consistently with other dashboard widgets
- [ ] Widget integrates into dashboard grid with consistent spacing and responsive layout
- [ ] Real-time updates work when customer selection changes
- [ ] All TypeScript interfaces are defined and exported
- [ ] Input validation rejects invalid data with descriptive error messages
- [ ] Comprehensive unit tests cover all alert rules, edge cases, scoring, and deduplication
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
