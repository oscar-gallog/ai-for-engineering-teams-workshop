# Feature: Customer Health Monitoring

### Context
- Unified customer health monitoring system for the Customer Intelligence Dashboard combining health scoring with predictive alerting
- Health score calculator provides a 0-100 quantitative assessment of customer relationship health across multiple factors
- Predictive alerts engine proactively monitors customer data for risk patterns and generates prioritized warnings
- Integrates into the main dashboard alongside `CustomerCard`, `CustomerSelector`, and `MarketIntelligenceWidget`
- Consumed by CSMs (Customer Success Managers) for daily account monitoring and churn prevention

### Requirements

#### Functional Requirements — Health Score Calculator
- Calculate customer health scores on a 0-100 scale
- Multi-factor weighted scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
- Risk level classification: Healthy (71-100), Warning (31-70), Critical (0-30)
- Individual scoring functions for each factor (`calculatePaymentScore`, `calculateEngagementScore`, `calculateContractScore`, `calculateSupportScore`)
- Main `calculateHealthScore` function that combines all factor scores
- Input validation with descriptive error messages for all data inputs
- Edge case handling for new customers, missing data, and partial inputs
- Pure functions with no side effects for predictable testing

#### Functional Requirements — Predictive Alerts Engine
- Multi-tier alert priority system: High Priority (immediate action), Medium Priority (monitor closely)
- Rule-based triggering with configurable thresholds and conditions
- Alert prioritization considering customer value (ARR) and workload balancing
- Cooldown periods to prevent alert spam and fatigue
- Deduplication logic to prevent duplicate alerts for the same customer/issue
- Alert history tracking and audit trail

#### High Priority Alert Rules
- **Payment Risk**: payment overdue >30 days OR health score drops >20 points in 7 days
- **Engagement Cliff**: login frequency drops >50% compared to 30-day average
- **Contract Expiration Risk**: contract expires in <90 days AND health score <50

#### Medium Priority Alert Rules
- **Support Ticket Spike**: >3 support tickets in 7 days OR escalated ticket
- **Feature Adoption Stall**: no new feature usage in 30 days for growing accounts

#### Data Input Requirements
- **Payment history**: days since last payment, average payment delay, overdue amounts
- **Engagement metrics**: login frequency, feature usage count, support tickets
- **Contract information**: days until renewal, contract value, recent upgrades
- **Support data**: average resolution time, satisfaction scores, escalation counts
- **Historical snapshots**: previous health scores and timestamps for trend detection

#### UI Component: CustomerHealthDisplay
- Overall health score with color-coded visualization (green/yellow/red matching card scheme)
- Expandable breakdown showing individual factor scores and weights
- Loading and error states consistent with other dashboard widgets
- Real-time updates when customer selection changes in `CustomerSelector`

#### UI Component: AlertsDashboardWidget
- Real-time alert display integrated into the main dashboard grid
- Alert priority visualization with color coding (red for high, yellow for medium)
- Alert detail panels with recommended actions and context
- Alert dismissal and action tracking interface
- Badge count showing unresolved alerts

#### Integration Requirements
- Health scores feed into the alerts engine as a primary data source for rule evaluation
- Both components integrate with `CustomerSelector` for real-time updates on selection change
- Color coding consistent with `CustomerCard` health indicators
- Follows established dashboard component patterns for loading and error states
- Alert state synchronization across dashboard sessions

### Constraints
- **Tech stack**: Next.js 15 (App Router), React 19, TypeScript (strict mode), Tailwind CSS
- **File structure**:
  - Health calculator: `src/lib/healthCalculator.ts`
  - Alert rules engine: `src/lib/alerts.ts`
  - Health display: `src/components/CustomerHealthDisplay.tsx`
  - Alerts widget: `src/components/AlertsDashboardWidget.tsx`
- **Architecture**: pure functions with no side effects in library files; custom error classes extending `Error`
- **Typing**: TypeScript interfaces for all data structures, input types, alert types, and return types
- **Documentation**: JSDoc comments explaining business logic, mathematical formulas, and alert rule rationale
- **Performance**: efficient algorithms for real-time dashboard updates; caching for repeated health calculations; optimized rule evaluation for hundreds of customers; minimal latency on alert processing
- **Responsive design**: mobile (320px+), tablet (768px+), desktop (1024px+) — consistent with dashboard grid
- **Security**: input validation for all customer data and rule parameters; no sensitive customer data exposure in alert messages; rate limiting on alert generation; audit trail logging for triggered alerts

### Acceptance Criteria

#### Health Score Calculator
- [ ] `calculateHealthScore` returns a score between 0-100 for valid inputs
- [ ] Individual factor functions return correct sub-scores
- [ ] Weighted combination matches spec: Payment 40%, Engagement 30%, Contract 20%, Support 10%
- [ ] Risk levels classified correctly: Healthy (71-100), Warning (31-70), Critical (0-30)
- [ ] Input validation rejects invalid data with descriptive error messages
- [ ] Handles edge cases: new customers with no history, missing/partial data, zero values
- [ ] All calculator functions are pure (no side effects) and deterministic

#### Predictive Alerts Engine
- [ ] All five alert rules trigger correctly at defined thresholds
- [ ] High priority alerts fire for payment risk, engagement cliff, and contract expiration risk
- [ ] Medium priority alerts fire for support ticket spikes and feature adoption stalls
- [ ] Deduplication prevents duplicate alerts for the same customer and issue type
- [ ] Cooldown periods suppress repeated alerts within configured windows
- [ ] Alert prioritization correctly weights customer ARR and urgency
- [ ] All alert functions are pure and deterministic

#### UI and Integration
- [ ] `CustomerHealthDisplay` shows overall score with correct color coding
- [ ] Factor breakdown is expandable and shows individual scores
- [ ] `AlertsDashboardWidget` displays alerts sorted by priority
- [ ] Alert detail panels show recommended actions
- [ ] Alert dismissal and tracking works correctly
- [ ] Both widgets update in real-time when customer selection changes
- [ ] Loading and error states render correctly for both components
- [ ] Responsive layout maintained across all breakpoints

#### Quality
- [ ] Comprehensive unit tests cover calculations, alert rules, edge cases, and validation
- [ ] TypeScript interfaces exported for all data structures
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
