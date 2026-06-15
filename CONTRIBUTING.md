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

## Recognition

Merged contributor PRs, concrete maintainer feedback, public trial runs, and
accepted external fixes are recognized in public evidence docs when relevant.
See [docs/community-engagement.md](docs/community-engagement.md).

The project does not do star-for-star, follow-for-follow, reciprocal PRs, or
repeated comment bumps. Stars are appreciated, but they are not counted as
adoption evidence.

## Rule Design

Rules should measure repository maintenance readiness, not personal preference. A good rule has:

- A clear maintainer burden it reduces
- A deterministic local signal
- A specific fix message
- A focused test
