# Phase 1 Validation — Hello Hono

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Server starts

```
npm run dev
```

Must start without errors. The terminal should show the server is listening (port 3000 or logged port).

### 3. Route returns an HTML home page

```
curl -s http://localhost:3000
```

HTTP status must be `200 OK`. Response body must be HTML and must contain:

- An `<h1>` element with the text `AgentClinic`
- A tagline (any short descriptive text; exact wording is implementation choice)

### 4. Hono version is pinned

`package.json` must list `hono` without a `^` or `~` range prefix.

### 5. Strict TypeScript is on

`tsconfig.json` must contain `"strict": true`.

### 6. Responsive design baseline

The HTML shell must include:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

`static/style.css` must contain at least one `@media (min-width: 640px)` block. No element may cause horizontal overflow on a 320 px viewport (verify by resizing the browser or running DevTools device emulation).

### 7. Tests pass

```
npm test
```

Must exit with code 0. Tests cover:

- `GET /` returns HTTP 200
- Response `Content-Type` contains `text/html`
- Response body contains `<h1>AgentClinic</h1>`
- Response body contains the tagline

## Not Required

- No CI pipeline required
- Browser rendering not checked (curl is sufficient)
