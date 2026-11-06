---
paths:
  - "src/**/*"
  - "package.json"
  - "vite.config.*"
  - "tsconfig*.json"
  - ".env*"
---
# Security, Configuration, and Dependencies

## Security and privacy
- Treat user input, URL parameters, API responses, browser storage, imported files, and environment values as untrusted.
- Never put secrets, private keys, credentials, or server-only tokens in source code or client-exposed environment variables. Variables bundled into a frontend build are public.
- Do not render untrusted HTML or use unsafe DOM APIs without a reviewed, safe sanitization strategy.
- Avoid exposing personal data, tokens, request headers, or sensitive payloads in logs, URLs, analytics, and error messages.
- Do not treat a hidden route or client-side role check as authorization. The server must enforce authentication and authorization.
- Do not add storage for authentication credentials without understanding the threat model and current backend contract. Prefer established secure auth patterns; never claim browser storage is protected from same-origin scripts.
- Validate and constrain external URLs, file types, file sizes, and other risky inputs when applicable.
- Preserve security-related headers, validation, and error handling. Never weaken a protection to make a test or feature easier.

## Configuration
- Follow the project's existing environment-variable naming and validation approach.
- Document required variable names and safe example values in an environment example file when useful; never commit real secrets.
- Validate required configuration early and fail with a clear developer-facing message.
- Do not assume environment variables are available in the browser unless the bundler explicitly exposes them.

## Dependencies
- Inspect the package manager and lockfile first; use the matching package manager.
- Prefer installed dependencies and platform capabilities before adding a package.
- Before adding a dependency, justify its value, compatibility, maintenance status, size, and security implications at a level appropriate to the change.
- Do not add overlapping libraries or update unrelated dependencies as part of a feature task.
- Never delete or casually regenerate a lockfile. Keep dependency and lockfile changes consistent.
- Do not use deprecated or unsafe APIs without a documented compatibility reason.
