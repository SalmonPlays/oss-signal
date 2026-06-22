#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const npmExecPath = process.env.npm_execpath;
if (!npmExecPath) {
  throw new Error("verify-package must run through npm so npm_execpath is available");
}

const output = execFileSync(process.execPath, [
  npmExecPath,
  "pack",
  "--dry-run",
  "--json",
  "--ignore-scripts"
], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"]
});

const [pack] = JSON.parse(output);
const files = new Set(pack.files.map((file) => file.path));
const errors = [];

check(pack.size <= 500_000, `compressed package is ${pack.size} bytes`);
check(pack.unpackedSize <= 750_000, `unpacked package is ${pack.unpackedSize} bytes`);
check(pack.files.length <= 120, `package contains ${pack.files.length} files`);
check(![...files].some((file) => file.endsWith(".png")), "package contains PNG site assets");
check(![...files].some((file) => file.startsWith("docs/outreach/")), "package contains outreach drafts");

for (const required of [
  "action.yml",
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "REVIEWER_PACKET.md",
  "docs/release-manifest.json",
  "docs/schema/inventory-output.schema.json",
  "docs/schema/json-output.schema.json",
  "docs/schema/rules-catalog.schema.json",
  "docs/schema/trend-output.schema.json",
  "scripts/verify-evidence.js",
  "scripts/verify-package.js",
  "scripts/verify-reviewer-ready.js",
  "src/action.js",
  "src/cli.js",
  "src/index.js"
]) {
  check(files.has(required), `package is missing ${required}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `PASS package contents: ${pack.files.length} files, ${pack.size} bytes compressed, ${pack.unpackedSize} bytes unpacked`
  );
}

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}
