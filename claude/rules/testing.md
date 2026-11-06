---
paths:
  - "**/*.{test,spec}.{ts,tsx,js,jsx}"
  - "tests/**/*"
  - "e2e/**/*"
---
# Testing Standards

- Use the testing framework already configured. Do not add or replace frameworks without a concrete reason.
- Test behavior and outcomes, not private implementation details or exact component internals.
- Cover business rules, validation, API mapping, key user workflows, error handling, permissions-related UI, and regression cases for fixed bugs.
- Prefer fast unit tests for pure logic, integration tests for components/modules working together, and end-to-end tests for a small number of critical user journeys.
- Keep tests deterministic, isolated, readable, and independent from production services/data.
- Mock external boundaries (network, clock, browser APIs) when needed; do not mock every internal function or make a test pass by mirroring the implementation.
- Use accessible queries for UI tests when supported by the test stack.
- Test loading, empty, success, validation, and error states where relevant.
- For a bug fix, add a regression test when feasible.
- Avoid arbitrary sleeps/timeouts. Await observable conditions and clean up timers/subscriptions appropriately.
- Do not delete, weaken, skip, or rewrite a failing test just to get a green run. Investigate the underlying failure and explain any justified exception.
- Never report tests as passing unless the relevant command actually completed successfully.
