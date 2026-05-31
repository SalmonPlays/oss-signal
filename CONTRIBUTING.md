# Contributing

Thanks for helping improve `oss-signal`.

## Development

```bash
npm install
npm run check
```

The project intentionally keeps runtime dependencies at zero. If a new dependency is useful, explain why the standard library is not enough in the pull request.

## Pull Requests

Before opening a pull request:

- Add or update tests for behavior changes.
- Run `npm run check`.
- Keep rule messages actionable for maintainers.
- Update `README.md` when command behavior changes.

## Rule Design

Rules should measure repository maintenance readiness, not personal preference. A good rule has:

- A clear maintainer burden it reduces
- A deterministic local signal
- A specific fix message
- A focused test
