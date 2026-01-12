# API E2E Starter Kit (TypeScript + Jest + Supertest)

A **pragmatic E2E API testing starter kit** for Node.js, built for **real, deployed environments**.

This is **not a testing framework**.
It’s a **clean baseline** for teams who want to write readable, maintainable end-to-end API tests without over-engineering.

---

## What this is

- A **starter kit** for **true E2E API testing**
- Designed for **deployed environments** (staging / prod-like)
- Built with **TypeScript + Jest + Supertest**
- Uses a **service-based abstraction** (similar to Page Objects in UI tests)
- Optimized for **clarity, diagnostics, and long-term maintainability**

If you’ve ever thought:
> “Our API E2E tests work, but they’re hard to read and harder to maintain”

— this kit is for you.

Integration tests should stay **simple and boring**.
This kit is intentionally focused on **E2E only**.

---

## Core philosophy

**Business intent over HTTP mechanics.**

Tests should read like this:

```ts
await user
  .fetchMyProfile()
  .verifyProfileIsAccessible()
  .verifyBasicProfileDetails();
```

## Project structure

```graphql
api-e2e/
├── config/        # env & profile configuration
├── core/          # HTTP, response, reporting, diagnostics
├── services/      # API service objects (assertions live here)
├── specs/         # E2E scenarios (no HTTP, no assertions)
└── README.md
```

## Rule of thumb

- Specs may only import services — nothing else.

## Getting started

1. Specs orchestrate scenarios

```ts
test('user can view their profile', async () => {
  await user
    .fetchMyProfile()
    .verifyBasicProfileDetails();
});
```

2. Services own actions & assertions

Services:

- perform API calls
- perform assertions
- handle reporting
- provide fluent chaining

```ts
verifyEmail(expected: string): this {
  report.step(`Verify email is ${expected}`, () => {
    this.assert(() => {
      expect(this.apiResponse.body.email).toBe(expected);
    });
  });
  return this;
}
```

3. Core handles infrastructure

- The core/ layer:
- wraps Supertest
- normalizes responses
- captures diagnostics
- handles reporting

No business logic lives here.

## Authentication (Keycloak)

This starter kit includes a Keycloak-compatible AuthService, using:

- OAuth2 password grant (E2E only)
- `/protocol/openid-connect/token`
- token caching per role
- form-encoded requests

Auth is treated as setup, not validation.

```ts
const auth = new AuthService(client);
const token = await auth.loginAs('standard-user');
```

## Reporting vs Diagnostics

This kit makes a clear distinction:

### Reporting

- Human-readable test steps
- Visible in test reports
- Coarse-grained (business intent)

### Optional & opt-in

- Diagnostics
- Full request/response dump
- Triggered only on failure
- Printed once
- Designed for CI debugging

No noisy logs. No reruns needed.

## Why TypeScript (and no custom JSON mapping)

- Supertest already parses JSON
- TypeScript types are compile-time only
- Assertions validate shape & meaning
- No serializers, no DTOs, no mapping layers

This avoids hiding contract bugs behind deserialization logic.

## Running tests

### Install dependencies

```bash
npm install
```

### Run E2E tests

```bash
TEST_ENV=staging npm test
```

### Optional flags

```bash
DEBUG_HTTP=true
TRACE_STEPS=true
ENABLE_REPORTING=false
```

## When to use this

Use this starter kit if:

- you test real APIs
- you care about readability
- multiple people read test failures
- CI diagnostics matter
- you want a clean baseline

Do NOT use this if:

- you only write unit tests
- you only test controllers in isolation
- you want maximum abstraction or configurability

## License

MIT
