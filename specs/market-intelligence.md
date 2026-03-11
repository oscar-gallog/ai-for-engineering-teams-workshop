# Feature: Market Intelligence Widget

### Context
- Market intelligence widget for the Customer Intelligence Dashboard providing real-time sentiment and news analysis for customer companies
- Three-layer architecture: API route, service layer, and UI component
- Integrates into the main dashboard alongside `CustomerCard`, `CustomerSelector`, and `CustomerHealthDisplay`
- Receives company name from the currently selected customer to display relevant market data

### Requirements

#### Functional Requirements — API Layer
- Next.js API route at `/api/market-intelligence/[company]`
- Mock data generation for reliable, predictable results (no external API calls)
- Validate and sanitize company name input
- Return consistent JSON: `{ sentiment, newsCount, lastUpdated, headlines[] }`
- Realistic API delay simulation for authentic loading UX

#### Functional Requirements — Service Layer
- `MarketIntelligenceService` class with caching (10-minute TTL)
- Custom `MarketIntelligenceError` class for centralized error handling
- Pure function implementations for testability
- Mock data generator produces company-specific headlines and sentiment scores

#### Functional Requirements — UI Component
- `MarketIntelligenceWidget` component matching existing widget patterns
- Input field for company name with validation (pre-filled from selected customer)
- Color-coded sentiment indicator: green (positive), yellow (neutral), red (negative)
- Display news article count and last updated timestamp
- Show top 3 headlines with source and publication date
- Loading and error states consistent with other dashboard widgets

#### Data Requirements
- Consumes selected customer's company name from `CustomerSelector` state
- Mock data includes: sentiment score, news count, timestamp, and headline objects
- Headlines contain: title, source, publication date

#### Integration Requirements
- Sits in the main Dashboard component grid alongside existing widgets
- Receives company name via props from selected customer data
- Same prop passing and state management patterns as other widgets
- Maintains responsive grid layout and consistent spacing

### Constraints
- **Tech stack**: Next.js 15 (App Router with Route Handlers), React 19, TypeScript (strict mode), Tailwind CSS
- **File structure**:
  - API route: `src/app/api/market-intelligence/[company]/route.ts`
  - Service: `src/lib/marketIntelligenceService.ts`
  - Component: `src/components/MarketIntelligenceWidget.tsx`
- **Performance**: 10-minute cache TTL on service layer; simulated API delay for realistic UX; error boundaries for graceful failure
- **Design**: matches existing widget styling, color coding (green/yellow/red), typography, spacing, and layout patterns
- **Responsive**: mobile (320px+), tablet (768px+), desktop (1024px+) — consistent with dashboard grid
- **Security**: company name parameter validation to prevent injection; input sanitization; error messages leak no sensitive information; mock data avoids external API vulnerabilities

### Acceptance Criteria
- [ ] API route at `/api/market-intelligence/[company]` returns valid JSON with sentiment, news count, last updated, and headlines
- [ ] Company name input is validated and sanitized on both client and server
- [ ] Service layer caches responses with 10-minute TTL
- [ ] `MarketIntelligenceError` is thrown for invalid inputs and service failures
- [ ] Widget displays color-coded sentiment indicator (green/yellow/red)
- [ ] Top 3 headlines render with source and publication date
- [ ] News count and last updated timestamp are displayed
- [ ] Loading state shows while fetching data
- [ ] Error state renders gracefully with user-friendly message
- [ ] Widget integrates into dashboard grid with consistent spacing and responsive layout
- [ ] Company name auto-populates from selected customer
- [ ] All TypeScript interfaces are defined and exported
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
