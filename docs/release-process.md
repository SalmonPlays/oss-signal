# Release Process

This process keeps `oss-signal` releases reproducible and easy to verify.

## Pre-Release

Run the full local check:

```bash
npm run check
```

Verify the public GitHub audit example:

```bash
npm run audit:github
```

Verify SARIF output:

```bash
node src/cli.js . --format sarif --output docs/examples/self-audit.sarif
node -e "const fs = require('fs'); const sarif = JSON.parse(fs.readFileSync('docs/examples/self-audit.sarif', 'utf8')); if (sarif.version !== '2.1.0') throw new Error('invalid SARIF');"
```

Verify inventory output:

```bash
node src/cli.js --inventory docs/examples/inventory-targets.txt --format markdown --output docs/examples/inventory-report.md
```

Inspect the npm tarball before publishing:

```bash
npm publish --dry-run
```

## Tag

The package version and tag must match:

```bash
node src/cli.js --version
git tag v$(node src/cli.js --version)
git push origin main --tags
```

## GitHub Release

Create a GitHub Release for the tag and use the release notes in `docs/release-notes/` when available.

For example, `v0.6.1` uses [docs/release-notes/v0.6.1.md](release-notes/v0.6.1.md).

## npm Publish

Manual publish path:

```bash
npm publish --access public
```

Automation path:

The tag-triggered [release workflow](../.github/workflows/release.yml) runs the same checks and verifies the package with `npm publish --dry-run`.

It publishes with provenance only when both release controls are configured:

- Repository secret `NPM_TOKEN` contains an npm automation token.
- Repository variable `NPM_PUBLISH_ENABLED` is set to `true`.

If either control is missing, the workflow prints a notice and stops after dry-run verification. This keeps tag verification useful when npm publishing is handled manually.

## Post-Release Verification

Check the registry version:

```bash
npm view oss-signal version dist-tags.latest --json
```

Run from a clean temporary directory:

```bash
tmpdir=$(mktemp -d)
cd "$tmpdir"
npm exec --yes --package=oss-signal -- oss-signal SalmonPlays/oss-signal --format json
```

Check the public Action tag:

```bash
git ls-remote --tags https://github.com/SalmonPlays/oss-signal.git
```

Download metrics can lag behind package publication. Treat npm download counts as delayed evidence, not immediate proof that a release worked.
