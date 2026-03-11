# Feature: Button Component

## Context
- Reusable interactive element for the Customer Intelligence Dashboard
- Used across the application for user actions: navigation, form submission, triggering modals, etc.
- Supports multiple visual variants to communicate intent (primary actions, secondary actions, destructive actions)
- Accessible and keyboard-navigable for all users

## Requirements

### Functional Requirements
- Trigger an `onClick` callback when clicked
- Support `disabled` state that prevents interaction
- Support `loading` state that shows a spinner and prevents interaction
- Render as a `<button>` element by default
- Optionally render as an anchor (`<a>`) when an `href` prop is provided

### User Interface Requirements
- Variants:
  - `primary`: solid blue background, white text — for main CTAs
  - `secondary`: outlined with border, transparent background — for secondary actions
  - `destructive`: solid red background, white text — for irreversible actions
  - `ghost`: no border/background, text-only — for low-emphasis actions
- Sizes:
  - `sm`: compact, suitable for inline or tight-space use
  - `md` (default): standard size for most contexts
  - `lg`: prominent, for hero or full-width actions
- Disabled state: reduced opacity, `not-allowed` cursor, no hover effect
- Loading state: shows a spinner icon, hides label, disables pointer events
- Hover and focus ring styles for all interactive variants
- Full-width option via `fullWidth` prop

### Data Requirements
- Props:
  - `variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'` — defaults to `'primary'`
  - `size?: 'sm' | 'md' | 'lg'` — defaults to `'md'`
  - `disabled?: boolean`
  - `loading?: boolean`
  - `fullWidth?: boolean`
  - `onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void`
  - `type?: 'button' | 'submit' | 'reset'` — defaults to `'button'`
  - `href?: string` — renders as `<a>` tag when provided
  - `children: React.ReactNode`
  - `className?: string` — allows consumer overrides

### Integration Requirements
- Used throughout the dashboard for all interactive controls
- Composable — works inside forms, cards, modals, and toolbars
- Properly typed TypeScript props, all exported from the component file

## Constraints

### Technical Stack
- Next.js 15 (App Router)
- React 19
- TypeScript with strict mode
- Tailwind CSS for styling

### Performance Requirements
- Zero layout shift on state transitions (disabled, loading)
- No unnecessary re-renders — stable prop references

### Design Constraints
- Consistent border-radius (`rounded-md`) across all variants
- Consistent padding using Tailwind spacing scale
- Focus ring must meet WCAG 2.1 AA contrast requirements
- Spinner must be purely CSS/SVG — no external icon library dependency

### Accessibility
- `aria-disabled` set when `disabled` or `loading` is true
- `aria-busy` set when `loading` is true
- Focus visible outline (not hidden with `outline-none` without replacement)
- Button type defaults to `'button'` to avoid accidental form submission

### File Structure and Naming
- Component file: `components/Button.tsx`
- Props interface: `ButtonProps` exported from component file
- Follow project naming conventions (PascalCase for components)

### Security Considerations
- `href` prop should not accept `javascript:` URLs
- No dangerouslySetInnerHTML usage

## Acceptance Criteria

- [ ] Renders all four variants (`primary`, `secondary`, `destructive`, `ghost`) with correct styles
- [ ] Renders all three sizes (`sm`, `md`, `lg`) with correct padding and font size
- [ ] Disabled state prevents click and shows correct visual treatment
- [ ] Loading state shows spinner, hides label text, and prevents click
- [ ] `fullWidth` prop makes button span 100% of its container
- [ ] Renders as `<a>` element when `href` is provided
- [ ] `onClick` is called on click when not disabled or loading
- [ ] Proper TypeScript interfaces defined and exported
- [ ] Focus ring visible on keyboard navigation
- [ ] `aria-disabled` and `aria-busy` attributes set correctly
- [ ] No console errors or warnings
- [ ] Passes TypeScript strict mode checks
- [ ] Follows project code style and conventions
