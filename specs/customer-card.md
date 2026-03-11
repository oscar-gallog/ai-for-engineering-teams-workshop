# Feature: CustomerCard Component

### Context
- Individual customer display component for the Customer Intelligence Dashboard
- Used within the `CustomerSelector` container component to show multiple customers in a grid layout
- Provides at-a-glance customer information (name, company, health score, domains) for quick identification by business analysts
- Foundation component for domain health monitoring integration

### Requirements

#### Functional Requirements
- Display customer name, company name, and health score (0-100)
- Show customer domains (websites) for health monitoring context
- Display domain count when customer has multiple domains
- Visual health indicator with color coding based on score
- Clickable card to view detailed customer profile

#### User Interface Requirements
- Color-coded health indicators:
  - Red: 0-30 (critical/poor health)
  - Yellow: 31-70 (warning/moderate health)
  - Green: 71-100 (healthy/good health)
- Clear typography hierarchy: name > company > details
- Visual hover state to indicate clickability
- Clean, card-based design with domain information

#### Data Requirements
- Accepts a `Customer` object via props from `src/data/mock-customers.ts`
- Customer interface fields used: `id`, `name`, `company`, `healthScore`, `domains` (optional `string[]`)
- Supports customers with zero, one, or multiple domains

#### Integration Requirements
- Used within `CustomerSelector` container component
- Props-based data flow from parent component
- Properly typed TypeScript interfaces exported from component file

### Constraints
- **Tech stack**: Next.js 15 (App Router), React 19, TypeScript (strict mode), Tailwind CSS
- **Performance**: < 16ms render per card (60fps); no layout shift during load; use `React.memo` if needed
- **Responsive breakpoints**: mobile (320px+), tablet (768px+), desktop (1024px+)
- **Card sizing**: max width 400px, min height 120px, Tailwind spacing scale
- **File structure**: `src/components/CustomerCard.tsx`, props interface named `CustomerCardProps` (PascalCase)
- **Security**: sanitize displayed text to prevent XSS; no sensitive data in client-side logs; strict TypeScript types

### Acceptance Criteria
- [ ] Displays customer name, company, and health score correctly
- [ ] Shows customer domains with count for multiple domains
- [ ] Health score colors match spec: red (0-30), yellow (31-70), green (71-100)
- [ ] Responsive layout works on mobile (320px+), tablet (768px+), and desktop (1024px+)
- [ ] `CustomerCardProps` interface is defined and exported
- [ ] Card is clickable with visible hover state
- [ ] Component accepts typed props from parent
- [ ] Handles edge cases: missing domains, zero health score, long names/companies
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
- [ ] Follows project code style and naming conventions
