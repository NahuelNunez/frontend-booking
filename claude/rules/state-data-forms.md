---
paths:
  - "src/**/*.{ts,tsx}"
---
# React and TypeScript Standards

## TypeScript
- Prefer strict, explicit types at public boundaries and for important business concepts.
- Use `unknown` plus narrowing for untrusted values; do not use `any` to bypass the compiler.
- Avoid unjustified `as` casts, non-null assertions, `@ts-ignore`, and `@ts-expect-error`. If an exception is essential, explain the invariant or issue being suppressed and keep it narrow.
- Use discriminated unions for mutually exclusive states. Model impossible states out where practical.
- Avoid duplicating types already inferable from a validation schema, API contract, or existing model.
- Use domain-specific names. Avoid vague types such as `Data`, `Item`, `Payload`, or `Response` when a precise name is possible.
- Prefer immutable updates and `const` by default.

## Components
- Use function components and modern React patterns supported by the project's installed version.
- Give each component one clear primary responsibility. Extract complex UI or logic when it improves understanding, not merely to reduce line count.
- Use explicit prop types and descriptive names. Avoid giant prop APIs and boolean-prop explosions; compose simpler components when warranted.
- Keep feature-specific components inside their feature. Keep shared components free of business-specific assumptions.
- Use semantic HTML and stable, meaningful keys when rendering lists.
- Avoid deeply nested ternaries and large conditional JSX blocks. Use early returns or small named components where clearer.
- Do not create a component or custom hook for every trivial expression.

## Hooks and rendering
- Follow the Rules of Hooks; never call hooks conditionally or inside loops/nested functions.
- Keep custom hooks cohesive and name them for the behavior they expose.
- Do not use `useEffect` for values that can be derived during render, or to mirror state unnecessarily.
- Use effects to synchronize with external systems and clean up listeners, subscriptions, timers, and resources when appropriate.
- Do not suppress hook dependencies to silence lint errors. Fix stale closures and effect design at the source.
- Avoid redundant state. Derive values from existing state where possible.
- Do not mutate React state or props.
- Use `useMemo` and `useCallback` when there is a measured or clear referential-stability need, not by default.
- Handle async operations and component unmount/race behavior appropriately using the project's established patterns.

## Code style
- Follow existing formatter, linter, and file naming conventions.
- Prefer readable control flow over clever one-liners.
- Use named exports for reusable modules unless the existing framework/convention calls for default exports (for example, some route conventions).
- Keep functions focused. Extract pure functions for reusable calculations or business rules when doing so improves tests and comprehension.
- Do not add comments that merely restate code. Add comments for intent, constraints, non-obvious tradeoffs, or domain rules.
