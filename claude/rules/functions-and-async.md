---
paths:
  - "src/**/*.{ts,tsx}"
---
# Function Design, TypeScript, Async/Await, and React

These rules apply to application functions, utility functions, API functions, React components, event handlers, and custom hooks. Follow existing project conventions unless they conflict with correctness or React's rules.

## 1. General Function Design

- Give each function one clear responsibility and a name that describes its intent.
- Prefer readable control flow, early returns, and small named helpers over deeply nested conditions or clever one-liners.
- Keep functions close to the feature that owns their behavior. Keep domain-specific logic out of `shared/`.
- Keep pure business calculations free of React, DOM, network, storage, and other external side effects where practical.
- Prefer pure functions for calculations and transformations because they are straightforward to test.
- Avoid hidden inputs and outputs: do not rely on mutable module-level state or unexpected mutation of arguments.
- Do not mutate caller-owned objects, arrays, props, or state. Return a new value when transformation is needed.
- Avoid long parameter lists. When several related parameters travel together, consider a named options object; do not create an options object for every trivial function.
- Avoid boolean parameters that make call sites ambiguous, such as `saveUser(user, true)`. Prefer meaningful named operations or a discriminated options type when it improves clarity.
- Avoid overloads, generics, higher-order functions, factories, and abstractions unless they make a real API clearer or safely remove repeated logic.
- Avoid duplicate business rules. Establish a clear owner for each rule and reuse it through an intentional public API.
- Do not use the built-in `Function` type. Describe callable values with an explicit function signature.
- Do not create functions solely to wrap another function without adding meaningful naming, validation, composition, or separation of responsibility.

## 2. TypeScript Function Typing

- Type function parameters explicitly when inference does not provide a reliable type, especially at public module boundaries, domain boundaries, and external-data boundaries.
- Let TypeScript infer obvious local variable types and simple callback types. Do not annotate every expression redundantly.
- Add explicit return types to exported domain functions, public module APIs, complex business rules, and functions where the return contract should remain stable.
- For simple private functions, inference is acceptable when the implementation makes the return type obvious.
- Type asynchronous return contracts explicitly on important exported operations, for example `Promise<Product[]>` or `Promise<void>`, when this improves the API contract.
- Use `void` only for a function that intentionally provides no usable result. An `async` function with no useful result should normally be typed `Promise<void>`.
- Do not confuse `void` with `undefined` or `never`: use each only when its semantics fit.
- Use function types that describe their real arguments and return values, such as `(id: string) => Promise<User>`.
- Do not use `any`, `Function`, unsafe casts, or non-null assertions to bypass uncertainty. Use `unknown` and narrow the type.
- Model distinct outcomes with discriminated unions when that is clearer than loosely related optional properties.
- Use `readonly` or read-only collection types where they accurately express that a function will not mutate supplied data and this improves the contract.
- Keep types aligned with runtime behavior. TypeScript types do not validate HTTP responses, JSON, browser storage, or other runtime input.
- Do not pretend that a Promise's rejection type is declared by `Promise<T>`; TypeScript does not encode a checked error type in a standard Promise.

Example:

```ts
export type Product = {
  id: string;
  name: string;
};

export async function getProduct(id: string): Promise<Product> {
  // Delegate to the feature's API client and validate/map the response
  // according to the project's established API conventions.
  return productApi.getById(id);
}
```

The example is illustrative. Never invent `productApi` methods or response contracts when implementing a real project; inspect the actual code first.

## 3. Function Declaration Style and Naming

- Follow the established formatter and function style in the codebase; do not mix declarations and arrow functions arbitrarily.
- Use PascalCase for React component names and filenames where the project convention allows.
- Name custom hooks with the `use` prefix, such as `useProducts` or `useCheckoutForm`.
- Do not name ordinary utility functions with the `use` prefix.
- Use verb-oriented names for actions (`createOrder`, `validateAddress`, `loadProducts`) and noun-oriented names for values/types (`Product`, `CheckoutState`).
- Keep boolean function names clear (`isAvailable`, `hasPermission`, `canSubmit`).
- Event handlers should communicate the action (`handleSubmit`, `handleProductSelect`).
- Avoid vague names such as `processData`, `doAction`, or `handleStuff` when the real behavior can be named.

## 4. Async/Await and Promise Rules

- Use `async`/`await` for sequential asynchronous workflows when it makes the order and error handling easier to understand.
- An `async` function always returns a Promise. Its declared result type must therefore be `Promise<T>`, including `Promise<void>` when there is no useful result.
- Await a Promise when the current function needs its result, must handle its failure, or must ensure completion before proceeding.
- Do not start a Promise and forget to handle it. Avoid floating Promises and unhandled rejections.
- Do not mix `async`/`await` and long `.then()` chains within the same workflow without a clear reason. Use a consistent style that keeps control flow obvious.
- Do not add `async` to a function that does not need to await anything or return a Promise. Avoid unnecessary Promise wrapping.
- Do not use `await` on ordinary synchronous values.
- When work must be sequential because each step depends on the previous result, use `await` in sequence.
- When independent operations can safely run concurrently, use `Promise.all` and await the combined result rather than awaiting each operation one by one.
- Use `Promise.allSettled` only when partial success is a valid product requirement and each result will be handled explicitly. Do not use it to hide failures.
- Remember that `Promise.all` rejects when one input rejects; it does not automatically cancel the other operations.
- Do not use `array.forEach(async (...) => ...)` when the caller needs to wait for completion. Use `Promise.all(array.map(async ...))` for independent work or `for...of` with `await` for sequential work.
- Do not start concurrent writes or payments unless the operation is safe and the backend supports the intended behavior. Preserve ordering and idempotency requirements.
- Do not build arbitrary retries, timeouts, or cancellation abstractions for every Promise. Follow the existing API/data-fetching library and actual use case.

Examples:

```ts
// Independent operations: concurrent
const [profile, preferences] = await Promise.all([
  getProfile(userId),
  getPreferences(userId),
]);

// Dependent operations: sequential
const order = await createOrder(input);
await sendOrderConfirmation(order.id);
```

These examples illustrate execution order only. Add appropriate failure handling and compensation behavior for the application's real workflow.

## 5. Error Handling for Async Functions

- Handle errors at a boundary that can make a meaningful decision: an event handler, feature workflow, API adapter, route boundary, or shared error-handling layer.
- Catch an error only when you can recover, translate it, add useful context, or present appropriate feedback. Otherwise allow the established error boundary to handle it.
- Never use an empty `catch` block and never silently turn an error into success.
- In TypeScript, treat a caught error as `unknown`; narrow it with `instanceof Error` or a project-specific error-normalization function.
- Do not assume every thrown value is an `Error` instance.
- Do not display raw stack traces, credentials, tokens, or internal server details to users.
- Preserve the original cause or useful diagnostic context when translating an error, where supported by the project's conventions.
- Avoid logging the same error at every layer. Log or report it at the layer that has enough context, and avoid logging sensitive data.
- Do not convert failures into empty arrays, `null`, or default success-like values unless that behavior is explicitly correct for the feature.
- If the UI needs distinct failure states, model and render them explicitly rather than swallowing the rejection.

Example:

```ts
try {
  await saveProfile(input);
} catch (error: unknown) {
  const message = error instanceof Error
    ? error.message
    : "An unexpected error occurred.";

  setError(message);
}
```

This is a shape example, not permission to show raw internal error messages directly to end users. Normalize errors for the UI according to the application's error policy.

## 6. React Components Must Stay Synchronous in Client Applications

- In a conventional client-rendered React application (for example, a Vite SPA), React function components must not be declared `async` to fetch data during render.
- A client component should synchronously calculate and return its JSX. Perform asynchronous work in an event handler, a correctly designed Effect, or the project's established server-state/data-fetching mechanism.
- Do not call component functions directly as ordinary functions. Render components through JSX so React controls their lifecycle.
- Keep rendering pure: do not perform network requests, mutate global state, write to storage, or trigger other side effects during render.
- Do not mark a function `async` merely because it is a component or custom hook.
- Frameworks supporting React Server Components may have different server-component rules. Apply those only when the repository demonstrably uses that framework and server-component environment; do not assume they apply to a client component.

Correct client component shape:

```tsx
type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## 7. React Event Handlers and Async Actions

- Async work caused by a specific user action belongs in an event handler or a feature-level action/workflow called by that handler.
- Use `try`/`catch`/`finally` or an established mutation abstraction to maintain loading, error, and success states correctly.
- Always restore transient loading/submission state in `finally` when the same operation controls that state.
- Prevent duplicate submissions when repeated activation could create duplicate records, payments, or other harmful effects. Do not rely only on UI disabling for backend idempotency.
- Do not update success state until the operation has actually succeeded.
- Ensure errors from async event handlers are handled. React does not automatically make every rejected event-handler Promise a user-visible error state.
- Keep event handlers focused on coordinating the interaction; move substantial business workflows to a feature-owned function or mutation hook.
- Do not put the same request logic in multiple components. Extract it into the feature's API/workflow layer or use the existing data-fetching library.

Example:

```tsx
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    await saveForm(formValues);
    setStatus("success");
  } catch (error: unknown) {
    setError(toUserFacingMessage(error));
  } finally {
    setSubmitting(false);
  }
}
```

`toUserFacingMessage` represents a project-defined error-normalization function; use the actual established utility or implement a focused one if needed.

## 8. React Effects and Async Work

- Never pass an `async` callback directly to `useEffect` or `useLayoutEffect`. An Effect callback may return a cleanup function or nothing; an async callback returns a Promise.
- When an Effect needs asynchronous work, define and invoke an inner async function, or use the project's established data-fetching abstraction.
- Include all reactive values used by an Effect in its dependency list. Do not suppress dependency lint rules as a shortcut.
- Design cleanup for subscriptions, timers, event listeners, connections, and in-flight work as applicable.
- For `fetch`, use `AbortController` when cancellation is appropriate and supported, or ignore stale results with a clear cleanup guard. Follow the data-fetching library's cancellation model when using one.
- Prevent race conditions when the dependency changes while an earlier request remains in flight. Older responses must not overwrite newer results.
- Represent loading, success, empty, and error states as applicable. Do not leave the UI permanently loading after a failure.
- Do not use an Effect for an action that belongs directly to an event handler, such as submitting a form in response to a click.
- Do not use Effects to mirror one piece of React state into another when the value can be derived during render.
- Do not manually implement caching, request deduplication, background refresh, or complex server-state synchronization when an existing project library already provides those capabilities.

Illustrative pattern for direct `fetch` in an Effect:

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadProducts() {
    setStatus("loading");
    setError(null);

    try {
      const result = await fetchProducts({ signal: controller.signal });
      setProducts(result);
      setStatus(result.length === 0 ? "empty" : "success");
    } catch (error: unknown) {
      if (controller.signal.aborted) return;
      setError(toUserFacingMessage(error));
      setStatus("error");
    }
  }

  void loadProducts();

  return () => controller.abort();
}, [/* include real reactive dependencies */]);
```

Treat this as a pattern, not a reason to fetch manually in every component. Use the actual dependency list and existing data-fetching conventions. `void` alone does not handle errors; the invoked async function must catch expected failures or otherwise ensure rejection handling.

## 9. Hooks, Callbacks, and Async Restrictions

- Call React hooks only at the top level of a function component or custom hook, never conditionally or from an ordinary helper.
- Custom hooks must not be declared `async`. They must return their defined synchronous hook result; perform async work through effects, event handlers, or an established data-fetching hook.
- Do not call hooks inside async callbacks, event handlers, loops, or nested functions.
- Do not call a state setter and then assume the state variable has synchronously changed in the current closure. React state is a render snapshot.
- Do not use async functions as `useMemo` calculations; `useMemo` is for synchronous calculations. Do not use async state initializers to load remote data.
- When passing callbacks to a library with a `void` callback type, ensure any async rejection is handled. A callback typed `() => void` can still accidentally return a Promise in TypeScript contexts, so do not rely on the type alone to handle failures.
- Keep callback dependencies correct. Do not add `useCallback` by default; use it when referential stability matters for a memoized child, dependency, or library contract.

## 10. Async Data and State Ownership

- Prefer the project's established server-state library for remote data caching, retries, request deduplication, and invalidation.
- Keep request functions in the feature API layer and UI orchestration in the feature hook/page/component as appropriate.
- Avoid duplicating server data across React state, Context, and a query cache.
- Type data at API boundaries and validate untrusted runtime data when required.
- Model request status explicitly if separate states affect rendering or user actions.
- Do not interpret a network error as an empty successful response.
- Apply retries only when appropriate for the operation. Retrying non-idempotent writes can create duplicate side effects.
- Avoid polling or background refresh without a defined product requirement, appropriate cleanup, and reasonable resource usage.

## 11. Async Testing

- Test success, failure, loading, empty, and important concurrency/race conditions where applicable.
- Await the Promise or observable UI change in tests; do not let asynchronous assertions run after the test has finished.
- Do not use arbitrary long sleeps when the test framework offers async queries, fake timers, or deterministic synchronization.
- Mock network boundaries rather than internal implementation details when practical.
- Test that failed requests produce the correct visible state and that submission state is reset after errors.
- Test cancellation or stale-result behavior when those are meaningful risks.
- Never claim a test passed unless it was actually run successfully.

## 12. Async Code Review Checklist

Before finishing a change involving async work, verify:

- Is this operation triggered by a user event, an Effect, or a data-fetching abstraction, and is that the right place for it?
- Is every Promise awaited, returned, or explicitly handled?
- Are errors caught at the correct boundary and normalized appropriately?
- Is execution supposed to be sequential or concurrent?
- Could duplicate submission or a retry duplicate a side effect?
- Can a stale request overwrite newer data?
- Is cancellation or cleanup required?
- Are loading, success, empty, and error states consistent?
- Are return types and external data boundaries honest?
- Does the function have one clear responsibility and a name that communicates it?
- Do relevant tests cover the behavior and failure modes?
