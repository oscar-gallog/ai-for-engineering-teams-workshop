# Spec: HealthIndicator

## Feature: HealthIndicator

### Context
- **Purpose**: A visual indicator component that communicates the health/status of an entity (e.g., a customer account, service, or system) using a color-coded badge or icon. It provides at-a-glance feedback about whether something is in a good, warning, or critical state.
- **Role in the application**: Used as a sub-component within cards and list views (e.g., `CustomerCard`) to surface health score data without requiring the user to drill into details.
- **System fit**: Sits at the leaf level of the component hierarchy — it is purely presentational and receives all data via props. It does not fetch data or manage state.
- **Users**: End users viewing customer/account dashboards; it is also used by developers composing larger feature components.

---

### Requirements

#### Functional Requirements
- Display a health status derived from a numeric score or an explicit status string.
- Map score ranges (or explicit status values) to one of three health levels: `healthy`, `warning`, `critical`.
- Render a colored indicator (badge, dot, or icon + label) that visually differentiates each health level.
- Optionally display a numeric score alongside the status label.
- Support a compact (icon-only) and full (icon + label) display mode.

#### User Interface Requirements
- **Healthy** state: green color (`text-green-600`, `bg-green-100` or equivalent Tailwind classes).
- **Warning** state: yellow/amber color (`text-yellow-600`, `bg-yellow-100`).
- **Critical** state: red color (`text-red-600`, `bg-red-100`).
- **Unknown / no data** state: gray color (`text-gray-500`, `bg-gray-100`) with label "Unknown".
- Indicator includes an accessible icon (e.g., checkmark, warning triangle, X) paired with a text label in full mode.
- In compact mode, only the icon/dot is rendered with an `aria-label` describing the status.
- Smooth color transitions when status changes (CSS transition on background/text color).

#### Data Requirements

```typescript
type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

interface HealthIndicatorProps {
  /** Numeric score 0–100. If provided, status is derived automatically. */
  score?: number;
  /** Explicit status override. Takes precedence over score if both are provided. */
  status?: HealthStatus;
  /** Show the numeric score alongside the status label. Default: false */
  showScore?: boolean;
  /** Compact mode renders only the icon/dot without a text label. Default: false */
  compact?: boolean;
  /** Additional Tailwind classes for the wrapper element. */
  className?: string;
}
```

Score-to-status mapping (default):
- 75–100 → `healthy`
- 50–74 → `warning`
- 0–49 → `critical`
- `undefined` / `null` / out of range → `unknown`

#### Integration Requirements
- Used inside `CustomerCard` to display the customer's health score.
- Can be used standalone in tables, list items, or detail pages.
- No callbacks or event handlers required (read-only display component).
- No routing dependencies.

---

### Constraints

- **Technical stack**: Next.js 15, React 19, TypeScript, Tailwind CSS (no additional CSS files).
- **Performance**: Pure functional component with no side effects; renders synchronously. No lazy loading required.
- **Design constraints**:
  - Responsive: renders correctly at all breakpoints (375px mobile, 768px tablet, 1280px desktop) — component is inline/inline-flex and adapts to container width.
  - Accessibility: WCAG 2.1 AA — color alone must not be the only differentiator; icon + label (or `aria-label` in compact mode) must convey status.
  - Minimum touch target in compact mode: 24×24px.
- **File location**: `src/components/HealthIndicator.tsx`
- **Naming**: PascalCase component name (`HealthIndicator`), kebab-case file (`health-indicator.tsx`).
- **Security**: All props are typed; no user-generated HTML is rendered (no `dangerouslySetInnerHTML`). Score values outside 0–100 are treated as `unknown`.
- **No `any` types** in TypeScript.

---

### Acceptance Criteria

#### Core Functionality
- [ ] Renders a green indicator when `score` is between 75 and 100.
- [ ] Renders a yellow/amber indicator when `score` is between 50 and 74.
- [ ] Renders a red indicator when `score` is between 0 and 49.
- [ ] Renders a gray "Unknown" indicator when no `score` or `status` is provided.
- [ ] `status` prop overrides derived status from `score` when both are supplied.
- [ ] Displays numeric score when `showScore={true}`.
- [ ] Does not display numeric score when `showScore` is omitted or `false`.

#### Edge Cases
- [ ] Score of exactly `0` renders as `critical`.
- [ ] Score of exactly `100` renders as `healthy`.
- [ ] Score boundary values `50` and `75` render in the correct tier.
- [ ] Negative scores and scores above 100 render as `unknown`.
- [ ] `score={NaN}` renders as `unknown`.
- [ ] `status="unknown"` renders the gray unknown state regardless of score.

#### Display Modes
- [ ] Full mode (default) renders both icon and text label.
- [ ] Compact mode (`compact={true}`) renders only the icon/dot — no visible text label.
- [ ] Compact mode includes an `aria-label` attribute with the status text.

#### Responsive Design
- [ ] Displays correctly at 375px (mobile).
- [ ] Displays correctly at 768px (tablet).
- [ ] Displays correctly at 1280px (desktop).

#### Accessibility
- [ ] Color contrast ratios meet WCAG 2.1 AA (≥4.5:1 for text, ≥3:1 for UI components).
- [ ] Icon is either decorative (`aria-hidden="true"`) with adjacent visible text, or has a meaningful `aria-label`.
- [ ] Status is conveyed by more than color alone (icon shape or text label present).
- [ ] Component is compatible with screen readers (status text is announced).

#### TypeScript
- [ ] No `any` types used in the component or its props.
- [ ] All props are fully typed with the `HealthIndicatorProps` interface.
- [ ] `HealthStatus` type is exported for use by parent components.

#### Integration
- [ ] Renders correctly when embedded inside `CustomerCard`.
- [ ] `className` prop applies additional styles to the wrapper without breaking layout.
- [ ] No console errors or warnings when rendered with any valid prop combination.
