# Feature: CustomerSelector Component

### Context
- Main customer selection interface for the Customer Intelligence Dashboard
- Container component that renders a grid of `CustomerCard` components
- Users need to quickly find and select customers from a list of 100+
- Enables business analysts to browse, search, and pick a customer to view detailed information

### Requirements

#### Functional Requirements
- Display a grid of `CustomerCard` components showing name, company, and health score
- Search/filter customers by name or company in real time
- Visual selection state: highlight the currently selected customer card
- Persist selection across page interactions (e.g., navigating away and back)
- Handle empty states: no customers found, no search results

#### User Interface Requirements
- Search input at the top with placeholder text and clear button
- Responsive grid layout adapting columns to screen size
- Clear visual distinction for the selected card (border, background, or outline)
- Smooth filtering with no perceptible delay for up to 100+ customers
- Loading state while data is being fetched or filtered

#### Data Requirements
- Consumes `Customer[]` from `src/data/mock-customers.ts`
- Passes individual `Customer` objects to `CustomerCard` via props
- Tracks selected customer ID in component state
- Filters applied client-side against `name` and `company` fields

#### Integration Requirements
- Renders `CustomerCard` components from `src/components/CustomerCard.tsx`
- Exposes an `onSelectCustomer` callback prop to notify parent of selection changes
- Props-based data flow; receives customer list and selection handler from parent

### Constraints
- **Tech stack**: Next.js 15 (App Router), React 19, TypeScript (strict mode), Tailwind CSS
- **Performance**: must handle 100+ customers without jank; debounce search input if needed; virtualize list if performance degrades
- **Responsive breakpoints**: 1 column (mobile 320px+), 2 columns (tablet 768px+), 3 columns (desktop 1024px+)
- **File structure**: `src/components/CustomerSelector.tsx`, props interface named `CustomerSelectorProps` (PascalCase)
- **Security**: sanitize search input; no sensitive data in client-side logs

### Acceptance Criteria
- [ ] Renders a grid of `CustomerCard` components from customer data
- [ ] Search input filters customers by name or company in real time
- [ ] Selected customer is visually highlighted
- [ ] Selection persists across page interactions
- [ ] Responsive grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- [ ] Empty state displayed when no customers match the search
- [ ] `CustomerSelectorProps` interface is defined and exported
- [ ] `onSelectCustomer` callback fires with the selected customer
- [ ] Handles 100+ customers without performance degradation
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
