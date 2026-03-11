# Feature: Health Score Calculator

### Context
- Comprehensive customer health scoring system for the Customer Intelligence Dashboard
- Provides predictive analytics for customer relationship health and churn risk
- Pure function library consumed by the `CustomerHealthDisplay` UI widget
- Scores feed into existing `CustomerCard` and `CustomerSelector` components for color-coded indicators

### Requirements

#### Functional Requirements
- Calculate customer health scores on a 0-100 scale
- Multi-factor weighted scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
- Risk level classification: Healthy (71-100), Warning (31-70), Critical (0-30)
- Individual scoring functions for each factor (payment, engagement, contract, support)
- Main `calculateHealthScore` function that combines all factor scores
- Input validation with descriptive error messages for all data inputs
- Edge case handling for new customers, missing data, and partial inputs

#### Data Input Requirements
- **Payment history**: days since last payment, average payment delay, overdue amounts
- **Engagement metrics**: login frequency, feature usage count, support tickets
- **Contract information**: days until renewal, contract value, recent upgrades
- **Support data**: average resolution time, satisfaction scores, escalation counts

#### UI Component: CustomerHealthDisplay
- Overall health score with color-coded visualization (matches card color scheme)
- Expandable breakdown showing individual factor scores and weights
- Loading and error states consistent with other dashboard widgets
- Real-time updates when customer selection changes in `CustomerSelector`

#### Integration Requirements
- Integrates with `CustomerSelector` for real-time score updates on selection change
- Color coding consistent with `CustomerCard` health indicators (red/yellow/green)
- Follows established dashboard component patterns for loading and error states

### Constraints
- **Tech stack**: Next.js 15 (App Router), React 19, TypeScript (strict mode), Tailwind CSS
- **Architecture**: pure functions with no side effects in `src/lib/healthCalculator.ts`; UI widget in `src/components/CustomerHealthDisplay.tsx`
- **Typing**: TypeScript interfaces for all data structures, input types, and return types; custom error classes extending `Error`
- **Documentation**: JSDoc comments explaining business logic and mathematical formulas
- **Performance**: efficient algorithms for real-time dashboard updates; caching for repeated calculations; minimal computational overhead
- **Responsive design**: breakpoints consistent with dashboard (mobile 320px+, tablet 768px+, desktop 1024px+)

### Acceptance Criteria
- [ ] `calculateHealthScore` returns a score between 0-100 for valid inputs
- [ ] Individual factor functions (`calculatePaymentScore`, `calculateEngagementScore`, `calculateContractScore`, `calculateSupportScore`) return correct sub-scores
- [ ] Weighted combination matches spec: Payment 40%, Engagement 30%, Contract 20%, Support 10%
- [ ] Risk levels classified correctly: Healthy (71-100), Warning (31-70), Critical (0-30)
- [ ] Input validation rejects invalid data with descriptive error messages
- [ ] Handles edge cases: new customers with no history, missing/partial data, zero values
- [ ] All functions are pure (no side effects) and deterministic
- [ ] `CustomerHealthDisplay` shows overall score with correct color coding
- [ ] Factor breakdown is expandable and shows individual scores
- [ ] Loading and error states render correctly
- [ ] Real-time updates work when customer selection changes
- [ ] TypeScript interfaces exported for all data structures
- [ ] Comprehensive unit tests cover calculations, edge cases, and validation
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
