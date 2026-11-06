---
paths:
  - "src/**/*"
  - "tests/**/*"
  - "e2e/**/*"
---
# Screaming Architecture and Module Boundaries

## Feature ownership
- A feature is a business capability or user-facing workflow, not a technical category.
- The owning feature contains its domain-specific pages/components, hooks, business rules, validation, types, API calls/adapters, and tests as needed.
- Keep files close to the behavior they implement. Extract into separate modules when it improves cohesion, reuse, or testing—not to satisfy a fixed folder template.
- Do not create empty directories or speculative features.

## Dependency direction
- `app` is the composition layer: it wires the router, providers, layouts, and feature entry points.
- `features/*` may depend on approved `shared/*` modules.
- `shared/*` must remain independent of `app/*` and `features/*`.
- One feature must not import another feature's private file. If cross-feature access is justified, use the owning feature's intentional public API (`index.ts` or a similarly explicit interface).
- Avoid circular dependencies. Do not solve cycles by adding indiscriminate barrel exports.
- Keep cross-feature collaboration small and explicit. If multiple features need the same business capability, decide whether there is a genuinely shared domain concept or whether one feature should expose a narrow public operation.
- Do not make every feature depend on every other feature. Prefer composition in `app` where possible.

## `shared` rules
Promote code to `shared` only when it is domain-independent and has a clear, reusable contract. A component is not shared simply because it is used twice. Do not place feature-specific types, business rules, constants, or API operations in shared folders.

## Business logic
- Put business rules in small, testable functions/modules that do not require React to execute whenever practical.
- Components should primarily render UI and coordinate user interaction; avoid embedding complex workflows in JSX.
- Keep domain decisions separate from transport details (HTTP, router, browser storage) when doing so improves clarity or testability.
- Avoid unnecessary Clean Architecture layers. Introduce domain/application/infrastructure boundaries only when real complexity or change pressure warrants them.
- Keep API response shapes separate from domain models when the shapes differ meaningfully; use explicit mappers instead of spreading mapping logic across components.

## Public interfaces
- Export only what consumers require. Feature internals are private by default.
- Public exports should be intentional, stable, typed, and documented when the contract is non-obvious.
- Avoid exporting everything just to simplify imports. Keep import graphs understandable.

## Change discipline
Before moving code, identify its true owner and all consumers. Preserve runtime behavior unless the task changes it. Avoid large-scale migrations bundled into unrelated feature work. When architecture is already inconsistent, improve the touched area and report broader issues separately.
