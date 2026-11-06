# Project Instructions — React + TypeScript

## Mission
Build a clear, maintainable React application organized around its business capabilities using Screaming Architecture. The directory structure should help a developer understand what the product does before they understand its technology.

## First: inspect, then act
- Before changing code, inspect the relevant files, repository structure, `package.json`, lockfile, TypeScript/build/lint/test configuration, and existing patterns.
- Confirm the actual package manager and available scripts from the lockfile and `package.json`. Never invent commands, dependencies, endpoints, or project conventions.
- For a new project, establish the minimal architecture and quality tooling before implementing features. For an existing project, preserve working conventions unless the task requires a change.
- For substantial work, state a brief plan, the affected features/files, boundary decisions, and verification steps before implementation. Proceed without unnecessary approval for clear, low-risk changes; ask before destructive, irreversible, or materially ambiguous decisions.

## Non-negotiable principles
- Organize by business capability, not by global technical buckets. Keep feature-specific UI, state, workflows, validation, types, and API operations inside their owning feature.
- Keep related behavior together; keep unrelated responsibilities separate. Prefer the simplest design that meets the requirements.
- Respect dependency boundaries. `shared` must not import `features` or `app`. Features must not reach into another feature's private files. Application composition belongs in `app`.
- Do not create layers, folders, hooks, interfaces, factories, repositories, or abstractions without a concrete need.
- Do not place all business logic in components, all state in a global store, or all API operations in one global service.
- Follow the detailed rules in `.claude/rules/` when they match the files being changed. Follow `module-documentation.md` to create or maintain a bilingual `README.md` inside each meaningful business module. Follow `project-tracking.md` to maintain the bilingual changelog, project status, and important architecture decisions.

## Default source layout
Adapt this to the actual business domain and keep only directories that are needed.

```text
src/
  app/                 # app setup, router, providers, layouts
  features/
    <business-feature>/ # owns feature UI, behavior, data access, validation, types
      README.md          # bilingual guide explaining how this feature/module works
      components/
      pages/
      hooks/
      api/
      schemas/
      types/
      tests/
      index.ts          # intentional public exports
  shared/
    components/        # domain-independent UI
    hooks/             # genuinely reusable hooks
    api/               # shared HTTP transport/configuration
    lib/               # technical integrations/helpers
    types/
    constants/
  assets/
  styles/
  main.tsx
```

This is a guide, not a mandate. Small features may use fewer folders; larger features may split by responsibility. Name features after real business capabilities (for example, `products`, `orders`, or `billing`), never hypothetical ones.

## Working agreements
- Use TypeScript and preserve strict type safety. Do not use `any`, suppress compiler/linter errors, or add unsafe assertions as shortcuts.
- Reuse established libraries and patterns. Do not add a library, replace tooling, redesign unrelated UI, or migrate the project without evidence and justification.
- Treat browser input, URL parameters, environment variables, persisted data, and API responses as untrusted boundaries.
- Keep secrets out of frontend code. Client-exposed environment variables are public after bundling.
- Preserve existing behavior unless the requested change requires otherwise. Keep changes focused and reviewable.
- Never run destructive Git commands, discard user changes, force-push, or overwrite data without explicit authorization. Inspect `git status` and the diff; do not revert unrelated work.
- Do not claim a command, test, build, or check passed unless it was actually run and passed.

## Documentation and continuity
- Each meaningful business module (normally `src/features/<feature>/`) must have its own `README.md` explaining how the module works, in English and Spanish in the same file. Create or update it alongside meaningful module implementation changes, as defined in `.claude/rules/module-documentation.md`.
- After meaningful completed changes, update `CHANGELOG.md` and, when project status or next steps changed, `docs/PROJECT_STATUS.md`. Write these records in both English and Spanish as specified by `.claude/rules/project-tracking.md`.
- Keep `CLAUDE.md` and `.claude/rules/` for stable instructions, not as a running task log. Record only major durable architectural decisions in `docs/decisions/`.
- Read existing records and preserve their history; never claim unverified progress or tests.

## Definition of done
1. The requested behavior works and relevant edge cases are considered.
2. Changes respect feature ownership and public interfaces.
3. Types, loading/empty/error/success states, and accessibility are handled where relevant.
4. Appropriate tests are added or updated, especially for changed business rules and bug fixes.
5. Run the available relevant checks (tests, typecheck, lint, build); report any checks that could not be run and why.
6. Review the diff for accidental changes, duplication, dead code, security issues, and architectural violations.
7. Report what changed, important decisions, checks actually run, and remaining risks.
