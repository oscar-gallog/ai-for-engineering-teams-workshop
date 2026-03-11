# Feature: DashboardOrchestrator Component

### Context
- Top-level orchestration layer for the Customer Intelligence Dashboard, responsible for composing all widgets, managing shared state, and enforcing production-ready resilience patterns
- Wraps `CustomerSelector`, `CustomerCard`, `CustomerHealthDisplay`, and `MarketIntelligenceWidget` inside a unified error boundary hierarchy with graceful degradation
- Provides data export capabilities (CSV/JSON) across all widget data sources and a centralized performance/error monitoring surface
- Acts as the single integration point for accessibility compliance, security hardening, and deployment readiness across the entire dashboard

### Requirements

#### Functional Requirements — Error Handling and Resilience
- `DashboardErrorBoundary` at the application level catches unhandled errors and renders a full-page fallback with retry action
- `WidgetErrorBoundary` wraps each child widget independently so a single widget failure does not cascade
- Custom error classes (`DashboardError`, `WidgetError`, `ExportError`) with severity levels (critical, warning, info) and structured context
- Automatic retry mechanism: up to 3 retries with exponential back-off before showing permanent error state
- Error logging service collects error type, component stack, timestamp, and user context; exposes logs via `useErrorLog` hook
- Development mode displays full stack traces; production mode shows user-friendly messages only

#### Functional Requirements — Data Export
- Export toolbar with format selector (CSV, JSON) and date range picker
- Customer data export: selected customer or all customers, with configurable field selection
- Health score report export: current scores plus historical trend data per customer
- Market intelligence export: sentiment summaries, headline archive, and trend data
- Progress indicator during export with cancel support for large datasets
- File naming convention: `{report-type}_{date-range}_{timestamp}.{ext}` (e.g., `health-scores_2026-01_1710100800.csv`)
- Export audit log records user, timestamp, format, row count, and filters applied

#### Functional Requirements — Performance Optimization
- `React.memo` on all child widgets with custom comparators to prevent unnecessary re-renders
- `React.lazy` + `Suspense` boundaries for code-splitting each widget into its own chunk
- `useMemo` for derived dashboard state (filtered customers, computed aggregates)
- `useCallback` for event handlers passed as props to child widgets
- Virtual scrolling for the customer list when dataset exceeds 50 rows
- Performance observer tracks FCP, LCP, CLS, and TTI; surfaces metrics via `usePerformanceMetrics` hook

#### Functional Requirements — Accessibility
- Semantic `<main>`, `<nav>`, `<section>`, and `<aside>` landmarks with descriptive `aria-label` attributes
- Skip link targeting `#dashboard-content` as the first focusable element
- `aria-live="polite"` region announces widget loading completions, error states, and export progress
- Keyboard shortcuts: `Alt+E` opens export menu, `Alt+R` retries failed widgets, `Escape` closes modals
- Focus trap inside export modal; focus returns to trigger element on close
- All interactive elements meet WCAG 2.1 AA contrast ratio (4.5:1 text, 3:1 large text / UI components)

#### Functional Requirements — Security
- Content Security Policy meta tag: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`
- All user inputs (search queries, export filters, date ranges) sanitized before use
- Export payloads validated server-side; client-side rate limit of 5 exports per minute
- Error messages and logs never expose stack traces, file paths, or internal identifiers in production
- `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` headers configured in `next.config.ts`

#### Data Requirements
- Consumes shared `selectedCustomer` state from `CustomerSelector`
- Aggregates widget data through a `DashboardContext` provider exposing: selected customer, health scores, market intelligence cache, error log, and export history
- Export data sourced from `mock-customers.ts`, health score calculations, and `MarketIntelligenceService` cache
- Performance metrics stored in-memory via `useRef`; no persistence required

#### Integration Requirements
- Renders as the root component in `src/app/page.tsx`, replacing the current showcase layout
- Composes all existing widgets (`CustomerSelector`, `CustomerCard`, `CustomerHealthDisplay`, `MarketIntelligenceWidget`) without modifying their internal APIs
- Responsive CSS Grid layout: 1 column on mobile (320px+), 2 columns on tablet (768px+), 3 columns on desktop (1024px+)
- Consistent spacing (`gap-6`), border radius (`rounded-xl`), and shadow (`shadow-md`) matching existing widget styling

### Constraints
- **Tech stack**: Next.js 15 (App Router), React 19, TypeScript (strict mode), Tailwind CSS
- **File structure**:
  - Orchestrator: `src/components/DashboardOrchestrator.tsx`
  - Error boundaries: `src/components/error-boundaries/DashboardErrorBoundary.tsx`, `src/components/error-boundaries/WidgetErrorBoundary.tsx`
  - Export utilities: `src/lib/exportUtils.ts`
  - Export toolbar: `src/components/ExportToolbar.tsx`
  - Dashboard context: `src/context/DashboardContext.tsx`
  - Custom hooks: `src/hooks/useErrorLog.ts`, `src/hooks/usePerformanceMetrics.ts`
  - Security headers: `next.config.ts` (headers configuration)
- **Performance**: initial page load < 3 s; FCP < 1.5 s; LCP < 2.5 s; CLS < 0.1; TTI < 3.5 s; widget renders < 16 ms; 60 fps interactions
- **Design**: follows existing dashboard color palette, typography, and spacing; dark/light widget cards on white/gray background
- **Responsive**: mobile (320px+), tablet (768px+), desktop (1024px+)
- **Security**: no external scripts; CSP enforced; all inputs sanitized; rate limiting on exports; no sensitive data in client logs
- **Accessibility**: WCAG 2.1 AA compliance; full keyboard navigation; screen reader compatible; skip links and live regions

### Acceptance Criteria
- [ ] `DashboardOrchestrator` renders all four widgets in a responsive grid layout
- [ ] `DashboardErrorBoundary` catches application-level errors and shows a full-page fallback with retry button
- [ ] `WidgetErrorBoundary` isolates individual widget failures — remaining widgets continue to function
- [ ] Retry mechanism attempts up to 3 retries with exponential back-off before showing permanent error state
- [ ] Error log captures error type, component stack, timestamp, and is accessible via `useErrorLog`
- [ ] Production error messages are user-friendly with no stack traces or internal paths
- [ ] Export toolbar allows CSV and JSON export with date range and field selection
- [ ] Exported files follow naming convention `{type}_{range}_{timestamp}.{ext}`
- [ ] Export progress indicator displays during generation with cancel support
- [ ] Export rate limited to 5 per minute on the client
- [ ] All widgets wrapped in `React.lazy` / `Suspense` for code splitting
- [ ] `React.memo` with custom comparators prevents unnecessary widget re-renders
- [ ] Virtual scrolling activates for customer lists exceeding 50 rows
- [ ] `usePerformanceMetrics` hook reports FCP, LCP, CLS, and TTI
- [ ] Semantic landmarks (`main`, `nav`, `section`) with `aria-label` attributes are present
- [ ] Skip link navigates focus to `#dashboard-content`
- [ ] `aria-live` region announces loading completions, errors, and export progress
- [ ] Keyboard shortcuts (`Alt+E`, `Alt+R`, `Escape`) function correctly
- [ ] Focus trap works inside export modal; focus returns to trigger on close
- [ ] CSP and security headers configured in `next.config.ts`
- [ ] All user inputs sanitized before processing
- [ ] `DashboardContext` provides selected customer, error log, and export history to children
- [ ] All TypeScript interfaces are defined and exported
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
