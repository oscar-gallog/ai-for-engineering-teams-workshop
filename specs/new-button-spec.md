# Feature: Button Component

## Context
- Primary interactive element for the Customer Intelligence Dashboard
- Used throughout the dashboard for triggering actions: form submissions, navigation, confirmations, and data operations
- Part of the shared design system requiring visual consistency across all views
- Supports three semantic variants to communicate action intent to users

## Requirements

### Functional Requirements
- Accept a `label` prop to render button text
- Accept an `onClick` callback triggered on user click
- Accept a `variant` prop to control visual style (`primary`, `secondary`, `danger`)
- Support a `loading` state that displays a spinner and prevents interaction
- Support a `disabled` state that prevents interaction
- Default variant to `primary` when not specified

### User Interface Requirements
- Variants:
  - `primary`: solid blue background (`bg-blue-600`), white text — for main CTAs
  - `secondary`: outlined with border (`border border-gray-300`), transparent background — for secondary actions
  - `danger`: solid red background (`bg-red-600`), white text — for destructive or irreversible actions
- Loading state: display an inline CSS/SVG spinner, disable pointer events, and set reduced opacity
- Disabled state: reduced opacity (`opacity-50`), `cursor-not-allowed`, no hover effect
- Hover and focus ring styles for all interactive variants
- Maximum width of `200px` (`max-w-[200px]`)
- Consistent `rounded-md` border radius across all variants

### Data Requirements
- Props interface:
  - `label: string` — button text content
  - `onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void` — click handler
  - `variant?: 'primary' | 'secondary' | 'danger'` — defaults to `'primary'`
  - `loading?: boolean` — shows spinner and disables interaction
  - `disabled?: boolean` — disables interaction
  - `type?: 'button' | 'submit' | 'reset'` — defaults to `'button'`
  - `className?: string` — allows consumer style overrides

### Integration Requirements
- Used across the dashboard in forms, modals, toolbars, and card actions
- Composable within any layout context
- TypeScript `ButtonProps` interface exported from the component file

## Constraints

### Technical Stack
- React 19
- TypeScript with strict mode
- Tailwind CSS for all styling

### Performance Requirements
- Zero layout shift on state transitions (loading, disabled)
- No unnecessary re-renders — stable callback references expected from consumers

### Design Constraints
- Maximum width: `200px`
- Consistent `rounded-md` border radius
- Consistent padding using Tailwind spacing scale (`px-4 py-2`)
- Focus ring must meet WCAG 2.1 AA contrast requirements
- Spinner must be CSS/SVG only — no external icon library dependency

### Accessibility
- `aria-label` support for icon-only or ambiguous button contexts
- `aria-disabled` set when `disabled` or `loading` is `true`
- `aria-busy` set when `loading` is `true`
- Visible focus outline on keyboard navigation (not suppressed without replacement)
- Button `type` defaults to `'button'` to prevent accidental form submission

### File Structure and Naming
- Component file: `components/Button.tsx`
- Props interface: `ButtonProps` exported from the component file
- Follow project naming conventions (PascalCase for components)

### Security Considerations
- No `dangerouslySetInnerHTML` usage
- Proper TypeScript types to prevent misuse

## Acceptance Criteria

- [ ] Renders `primary` variant with solid blue background and white text
- [ ] Renders `secondary` variant with border outline and transparent background
- [ ] Renders `danger` variant with solid red background and white text
- [ ] Defaults to `primary` variant when no variant prop is provided
- [ ] Displays the `label` prop as button text
- [ ] Calls `onClick` handler when clicked in interactive state
- [ ] Disabled state prevents click and shows `opacity-50` with `cursor-not-allowed`
- [ ] Loading state displays a CSS/SVG spinner and prevents click
- [ ] `aria-disabled` is set when `disabled` or `loading` is `true`
- [ ] `aria-busy` is set when `loading` is `true`
- [ ] Focus ring is visible on keyboard navigation
- [ ] Button does not exceed `200px` maximum width
- [ ] `ButtonProps` TypeScript interface is exported from the component file
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
- [ ] Follows project code style and conventions
