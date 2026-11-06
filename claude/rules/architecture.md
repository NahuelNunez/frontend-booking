---
paths:
  - "src/**/*.{ts,tsx}"
---

# State, API, and Forms

## State ownership

- Keep state as close as possible to the components and feature that own it.
- Use local state for local UI interactions; use URL state for shareable/navigation-related filters, sorting, and pagination when appropriate.
- Use Context for appropriate application-level dependencies or low-frequency shared state, not as a default global store.
- Add or use a state-management library only when real app needs justify it. Do not introduce Redux, Zustand, or similar libraries by default.
- Avoid duplicating server data in local/global stores when an existing server-state solution owns it.
- Avoid storing derived values and keep transitions predictable.
- Keep feature-owned state in that feature unless there is a clear cross-feature requirement.

## API boundaries

- Keep HTTP requests out of presentation components. Feature-specific endpoints and operations belong to the owning feature's API module.
- Shared API infrastructure may own the HTTP client, base configuration, headers, transport-level error normalization, and shared interceptors; it must not become a giant business service.
- Use existing API clients and server contracts. Do not invent endpoints, payloads, permissions, or response fields.
- Type request and response contracts. Remember that TypeScript types disappear at runtime; validate untrusted responses when correctness or security requires it.
- Map API responses to UI/domain models at a clear boundary when their shapes differ.
- Handle cancellation, duplicate requests, race conditions, retries, and cache invalidation according to the existing data-fetching library and use case.
- Distinguish expected failures (validation, unauthenticated, forbidden, not found, conflict, network) from unexpected failures when the user experience or recovery differs.
- Do not expose raw server errors or stack traces to users.

## Forms and validation

- Follow the project's established form and schema libraries. Do not add another library without a concrete need.
- Validate input at boundaries; client-side validation improves UX but never replaces server-side validation.
- Use schemas for complex, reused, or boundary validation where appropriate. Avoid schema ceremony for trivial inputs.
- Associate controls with accessible labels and show actionable field-level messages.
- Represent idle, submitting, success, and error states accurately. Prevent accidental duplicate submission where needed.
- Preserve user-entered values after recoverable errors when appropriate.
- Normalize values only where domain/API contracts require it; do not silently change user input.

## UI state completeness

For async screens, consider initial/loading, success, empty, partial, error, and retry states as applicable. Do not show a perpetual spinner for an empty result or silently render nothing after a failure.

## Zod and Schema Validation

- Use Zod for runtime validation of untrusted data where appropriate.
- Install Zod once as a project dependency.
- Keep feature-specific schemas inside the owning feature.
- Place genuinely reusable, domain-independent schemas in shared code.
- Name schema files descriptively, such as `login.schema.ts`.
- Export schemas explicitly.
- Infer TypeScript types from schemas using `z.infer<typeof schema>`
  rather than duplicating equivalent type declarations.
- Use `safeParse()` when validation failure is an expected outcome
  that should be handled without exceptions.
- Use `parse()` when throwing a validation error is appropriate.
- Use `parseAsync()` or `safeParseAsync()` for schemas with asynchronous
  refinements or transforms.
- Validate API responses at appropriate external boundaries when runtime
  correctness matters; TypeScript types alone do not validate runtime data.
- Keep form validation, domain rules, and API response validation clearly
  separated when their responsibilities differ.
- Do not create one global schema file for unrelated features.
- Never treat client-side validation as a replacement for server-side validation.
