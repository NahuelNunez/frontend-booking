# Frontend Development Rules

## 1. Technology Stack

This frontend uses:

- React
- TypeScript
- TSX
- Vite
- Tailwind CSS
- React Router
- TanStack React Query when server state is required
- React Hook Form when forms require complex validation
- Axios or the existing API client for HTTP requests

Follow the technologies already installed in the project.

Do not introduce alternative libraries without a clear reason.

---

## 2. Core Development Principles

- Write clean, maintainable TypeScript.
- Prefer simple solutions over unnecessary abstractions.
- Reuse existing components, hooks, utilities, and services.
- Do not duplicate existing functionality.
- Do not rewrite working code unnecessarily.
- Make the smallest change that correctly solves the problem.
- Preserve existing application behavior unless the requested feature requires changing it.

---

## 3. Before Making Changes

Before modifying frontend code:

1. Inspect the relevant files.
2. Understand how the current feature works.
3. Search for existing components or utilities that can be reused.
4. Check the routing structure.
5. Check existing state management.
6. Check existing API/service patterns.
7. Check existing UI components.
8. Identify the root cause before changing code.

Do not immediately create new files or rewrite the feature.

---

# React Rules

## 4. Components

Use functional React components.

Prefer:

```tsx
export function UserCard() {
  return <div>User</div>;
}
```

Avoid class components unless an existing legacy component requires them.

Components should have a clear responsibility.

Avoid components that become excessively large.

If a component contains multiple independent sections or complex logic, consider extracting them into smaller components.

Do not split components into tiny components without a real benefit.

---

## 5. Component Naming

Use PascalCase for React components.

Examples:

```text
UserCard.tsx
UserProfile.tsx
JobCard.tsx
MessageList.tsx
SearchBar.tsx
```

Hooks use camelCase and start with `use`.

```text
useAuth.ts
useJobs.ts
useMessages.ts
```

---

# TypeScript Rules

## 6. Type Safety

Never use `any` unless there is an unavoidable external-library limitation.

Prefer:

```ts
unknown;
```

over:

```ts
any;
```

when the type is genuinely unknown.

Do not use `as` type assertions to bypass TypeScript errors.

Do not use:

```ts
// @ts-ignore
```

to hide errors.

Fix the underlying type problem instead.

---

## 7. Props

Every component with props must have properly typed props.

Prefer:

```tsx
interface UserCardProps {
  id: number;
  name: string;
  email: string;
}

export function UserCard({ id, name, email }: UserCardProps) {
  return <div>{name}</div>;
}
```

Do not:

```tsx
function UserCard(props: any) {
  ...
}
```

---

# State Management

## 8. Local State

Use `useState` for state that belongs to a single component.

```tsx
const [isOpen, setIsOpen] = useState(false);
```

When the next state depends on the previous state:

```tsx
setCount((prev) => prev + 1);
```

Do not duplicate state unnecessarily.

If a value can be calculated from existing state or props, derive it instead of storing another piece of state.

---

## 9. Global State

Do not put everything into global state.

Use global state only when multiple unrelated components need the same client-side state.

Follow the project's existing state-management solution.

Do not introduce Redux, Zustand, Context, or another state library if the project already has an appropriate solution.

---

# useEffect

## 10. useEffect Rules

Use `useEffect` for synchronization with external systems.

Examples:

- Browser APIs
- Event listeners
- Subscriptions
- External systems
- Side effects that genuinely require synchronization

Do not use `useEffect` simply to calculate derived values.

Avoid:

```tsx
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Prefer:

```tsx
const fullName = `${firstName} ${lastName}`;
```

Always provide correct dependencies.

Never disable ESLint dependency warnings simply to make an effect stop running.

---

# API Communication

## 11. API Requests

Keep API communication separate from UI components whenever practical.

Prefer:

```text
services/
├── authService.ts
├── userService.ts
└── jobService.ts
```

instead of putting large Axios requests directly inside components.

Components should focus primarily on:

- Rendering
- User interaction
- UI state

Services should handle:

- HTTP requests
- API endpoints
- Request/response handling

---

## 12. API Types

Type API responses.

Example:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

Avoid treating API responses as untyped objects.

Handle:

- Loading
- Success
- Empty
- Error

states appropriately.

---

# React Query

## 13. Server State

If TanStack React Query is installed, use it for server state.

Prefer:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});
```

instead of manually implementing server caching with:

```tsx
useEffect();
useState();
```

Use meaningful query keys.

Example:

```ts
["user", userId][("jobs", filters)][("messages", conversationId)];
```

After mutations, invalidate or update affected queries appropriately.

Do not create duplicate caching mechanisms.

---

# Routing

## 14. React Router

Follow the existing React Router architecture.

Keep routes organized and predictable.

Example:

```text
pages/
├── Home/
├── Login/
├── Register/
├── Profile/
└── Jobs/
```

Use route parameters appropriately.

Example:

```text
/jobs/:jobId
/users/:userId
```

Do not duplicate authentication or authorization logic throughout individual pages.

Use the project's existing route protection mechanism.

---

# Forms

## 15. Form Handling

If React Hook Form is installed, prefer it for complex forms.

Use controlled/local state for simple forms when appropriate.

Forms should:

- Validate input
- Display validation errors
- Prevent invalid submissions
- Handle loading states
- Handle server errors

Do not duplicate validation rules unnecessarily.

---

# Tailwind CSS

## 16. Styling

Use the project's existing Tailwind CSS system.

Prefer Tailwind utilities over introducing another styling solution.

Example:

```tsx
<div className="flex items-center gap-4 rounded-lg p-4">
```

Do not create arbitrary CSS when an existing Tailwind utility or project component already solves the problem.

Do not introduce inline styles unless necessary.

---

## 17. Responsive Design

All new UI should consider:

```text
Mobile
Tablet
Desktop
```

Do not design only for desktop.

Use Tailwind responsive utilities where appropriate:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

Do not add responsive classes randomly. Follow the existing design system.

---

# UI Components

## 18. Reuse Existing Components

Before creating a UI component:

1. Search for an existing component.
2. Check the project's shared components.
3. Check whether an existing component can be extended.
4. Only create a new component when necessary.

For example, if the project already has:

```text
components/ui/Button.tsx
```

do not create another button implementation.

---

## 19. UI Consistency

Maintain consistency with the existing:

- Spacing
- Typography
- Border radius
- Buttons
- Forms
- Cards
- Modals
- Colors
- Dark mode
- Responsive behavior

Do not redesign unrelated parts of the application while implementing a feature.

---

# Accessibility

## 20. Accessibility Rules

Use semantic HTML.

Prefer:

```tsx
<button>
<a>
<nav>
<main>
<section>
<header>
<footer>
<form>
```

over generic `<div>` elements when appropriate.

Images should have appropriate `alt` text.

Form controls should have accessible labels.

Interactive elements must be keyboard accessible.

Do not use a `<div>` as a button when a `<button>` is appropriate.

---

# Performance

## 21. Performance Rules

Do not optimize prematurely.

Avoid unnecessary:

```text
useMemo
useCallback
React.memo
```

Use them when there is a measurable or clear reason.

Avoid unnecessary API requests.

Avoid unnecessary state updates.

Do not load large data sets into the browser when pagination or filtering can be handled by the backend.

---

# Error Handling

## 22. Frontend Errors

Every API-driven feature should account for errors.

The UI should not remain stuck in a loading state when a request fails.

Provide useful feedback to the user.

Do not expose:

- API keys
- Tokens
- Passwords
- Internal server errors
- Database errors
- Stack traces

to users.

---

# Security

## 23. Frontend Security

Never hardcode secrets.

Never place private API credentials in frontend code.

Remember that frontend environment variables can be exposed to users depending on the build system.

Do not assume frontend authorization is sufficient.

Authorization must ultimately be enforced by the backend.

Never store sensitive information in `localStorage` unless there is a deliberate security reason and the risks are understood.

---

# Code Organization

## 24. Recommended Structure

Follow the existing structure first.

A typical structure may look like:

```text
src/
├── components/
│   ├── ui/
│   └── shared/
│
├── pages/
│
├── layouts/
│
├── hooks/
│
├── services/
│
├── types/
│
├── utils/
│
├── context/
│
├── store/
│
├── lib/
│
├── assets/
│
├── App.tsx
└── main.tsx
```

Do not reorganize the project unless specifically requested.

---

# Code Quality

## 25. Avoid Duplication

Before writing a new function:

Search the project for similar functionality.

Before writing a new component:

Search the project for similar UI.

Before writing a new hook:

Search existing hooks.

Reuse existing functionality whenever possible.

---

## 26. Avoid Overengineering

Do not create:

- Unnecessary abstractions
- Unnecessary generic components
- Unnecessary custom hooks
- Unnecessary state management
- Unnecessary configuration
- Unnecessary dependencies

The simplest maintainable solution should be preferred.

---

# Debugging

## 27. Bug-Fixing Process

When fixing a bug:

1. Reproduce or understand the problem.
2. Inspect the relevant code.
3. Identify the root cause.
4. Explain the root cause.
5. Make the smallest appropriate change.
6. Check for side effects.
7. Run relevant checks.

Do not fix symptoms with arbitrary conditions.

---

# Verification

## 28. After Changes

After implementing a feature or fix, run the project's available checks.

Examples:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Only run commands that actually exist in `package.json`.

If something fails:

1. Determine whether the failure is related to your changes.
2. Fix it if appropriate.
3. Do not hide the error.
4. Report remaining issues clearly.

---

# Claude Code Behavior

## 29. Implementation Behavior

When asked to implement something:

1. Inspect the existing implementation first.
2. Explain the approach briefly.
3. Reuse existing project patterns.
4. Make the smallest appropriate change.
5. Verify the implementation.
6. Summarize what changed.

Do not rewrite unrelated code.

---

## 30. Learning Mode

When the user is asking to learn rather than simply requesting implementation:

- Explain the concept first.
- Show a small example.
- Explain why the solution works.
- Ask the user to attempt the implementation when appropriate.
- Do not automatically generate an entire feature if a smaller example is enough to teach the concept.

When the user explicitly asks Claude Code to implement the feature, implement it according to the rules above.

---

# Important Rule

Do not make major architectural changes without explaining them first.

For example, do not automatically:

- Replace Context with Zustand.
- Replace React Query with another library.
- Replace Axios.
- Change routing architecture.
- Introduce Redux.
- Rewrite the component structure.
- Change the styling system.

Use the existing architecture unless the user explicitly requests a change.
