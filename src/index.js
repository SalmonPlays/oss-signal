import { promises as fs } from "node:fs";
import path from "node:path";

const COMMUNITY_FILES = [
  {
    id: "readme",
    label: "README",
    weight: 12,
    paths: ["README.md", "README"],
    why: "A clear README is the front door for users and contributors.",
    fix: "Add setup, usage, contribution, support, and project status sections to README.md."
  },
  {
    id: "license",
    label: "License",
    weight: 10,
    paths: ["LICENSE", "LICENSE.md", "COPYING"],
    why: "A license tells downstream users what they may legally do with the code.",
    fix: "Add an OSI-approved license file such as MIT, Apache-2.0, BSD-3-Clause, or MPL-2.0."
  },
  {
    id: "contributing",
    label: "Contributing guide",
    weight: 9,
    paths: ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
    why: "Maintainers get better issues and pull requests when expectations are documented.",
    fix: "Add CONTRIBUTING.md with local setup, test commands, review expectations, and release notes guidance."
  },
  {
    id: "security",
    label: "Security policy",
    weight: 9,
    paths: ["SECURITY.md", ".github/SECURITY.md"],
    why: "Responsible disclosure needs a private, documented path.",
    fix: "Add SECURITY.md with supported versions, reporting instructions, and response expectations."
  },
  {
    id: "code-of-conduct",
    label: "Code of conduct",
    weight: 6,
    paths: ["CODE_OF_CONDUCT.md", ".github/CODE_OF_CONDUCT.md"],
    why: "Community norms reduce ambiguity during difficult interactions.",
    fix: "Add CODE_OF_CONDUCT.md, for example the Contributor Covenant."
  },
  {
    id: "changelog",
    label: "Changelog",
    weight: 6,
    paths: ["CHANGELOG.md", "HISTORY.md", "RELEASES.md"],
    why: "Users need a durable place to understand release impact.",
    fix: "Keep CHANGELOG.md with dated release entries and migration notes."
  },
  {
    id: "support",
    label: "Support policy",
    weight: 4,
    paths: ["SUPPORT.md", ".github/SUPPORT.md"],
    why: "Support boundaries help maintainers avoid turning every request into unpaid consulting.",
    fix: "Add SUPPORT.md describing where to ask questions, what is in scope, and expected response times."
  }
];

const AUTOMATION_FILES = [
  {
    id: "ci",
    label: "Continuous integration",
    weight: 12,
    matcher: (tree) => tree.some((file) => file.startsWith(".github/workflows/") && /\.ya?ml$/i.test(file)),
    why: "CI catches regressions before maintainers merge changes.",
    fix: "Add a GitHub Actions workflow that runs linting and tests on pushes and pull requests."
  },
  {
    id: "tests",
    label: "Tests",
    weight: 10,
    matcher: (tree) => tree.some((file) => /(^|\/)(test|tests|spec|__tests__)\//i.test(file) || /\.(test|spec)\.[cm]?[jt]sx?$/i.test(file)),
    why: "Tests make review safer and lower the cost of outside contributions.",
    fix: "Add focused tests for public behavior and document the test command."
  },
  {
    id: "issue-templates",
    label: "Issue templates",
    weight: 5,
    matcher: (tree) => tree.some((file) => file.startsWith(".github/ISSUE_TEMPLATE/") || file === ".github/ISSUE_TEMPLATE.md"),
    why: "Issue templates collect the facts maintainers need to reproduce and triage.",
    fix: "Add bug report and feature request templates under .github/ISSUE_TEMPLATE/."
  },
  {
    id: "pull-request-template",
    label: "Pull request template",
    weight: 5,
    matcher: (tree) => tree.includes(".github/PULL_REQUEST_TEMPLATE.md") || tree.includes("PULL_REQUEST_TEMPLATE.md"),
    why: "PR templates nudge contributors to include tests, docs, and review context.",
    fix: "Add .github/PULL_REQUEST_TEMPLATE.md with a short checklist."
  },
  {
    id: "dependabot",
    label: "Dependency update automation",
    weight: 5,
    matcher: (tree) => tree.includes(".github/dependabot.yml") || tree.includes(".github/dependabot.yaml"),
    why: "Automated dependency updates reduce security and compatibility drift.",
    fix: "Add .github/dependabot.yml for the package ecosystems used in the repository."
  },
  {
    id: "codeql",
    label: "Static security analysis",
    weight: 4,
    matcher: (tree) => tree.some((file) => file.startsWith(".github/workflows/") && /codeql|security/i.test(file)),
    why: "Static analysis finds common vulnerability patterns before releases.",
    fix: "Add a CodeQL or equivalent security scanning workflow."
  }
];

const PACKAGE_FILES = [
  {
    id: "package-json",
    label: "Node package metadata",
    weight: 5,
    matcher: (tree) => tree.includes("package.json"),
    why: "Package metadata makes installation, testing, and release automation discoverable.",
    fix: "Add package.json with name, description, license, scripts, repository, and engines fields."
  },
  {
    id: "lockfile",
    label: "Dependency lockfile",
    weight: 4,
    matcher: (tree) => tree.some((file) => ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "uv.lock", "poetry.lock", "Pipfile.lock", "Cargo.lock", "go.sum"].includes(file)),
    why: "Lockfiles make CI and contributor setup reproducible.",
    fix: "Commit the lockfile for application-style projects, or document why this library intentionally omits one."
  }
];

const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "vendor",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".venv",
  "__pycache__"
]);

export async function auditRepository(root, options = {}) {
  const absoluteRoot = path.resolve(root ?? ".");
  const tree = await listRepositoryFiles(absoluteRoot, options);
  const fileSet = new Set(tree);
  const checks = [
    ...COMMUNITY_FILES.map((rule) => checkPathRule(rule, fileSet)),
    ...AUTOMATION_FILES.map((rule) => checkMatcherRule(rule, tree)),
    ...PACKAGE_FILES.map((rule) => checkMatcherRule(rule, tree))
  ];

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = checks.filter((check) => check.passed).reduce((sum, check) => sum + check.weight, 0);
  const score = totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);

  return {
    tool: "oss-signal",
    version: "0.1.0",
    root: absoluteRoot,
    generatedAt: new Date().toISOString(),
    score,
    grade: gradeForScore(score),
    summary: summarizeChecks(checks),
    checks,
    recommendations: checks
      .filter((check) => !check.passed)
      .sort((a, b) => b.weight - a.weight)
      .map(({ id, label, weight, why, fix }) => ({ id, label, weight, why, fix }))
  };
}

export function renderMarkdown(report) {
  const lines = [
    "# OSS Signal Report",
    "",
    `Repository: \`${report.root}\``,
    `Generated: ${report.generatedAt}`,
    "",
    `Score: **${report.score}/100** (${report.grade})`,
    "",
    "## Summary",
    "",
    `- Passed: ${report.summary.passed}`,
    `- Failed: ${report.summary.failed}`,
    `- Total checks: ${report.summary.total}`,
    "",
    "## Checks",
    "",
    "| Status | Check | Why it matters |",
    "| --- | --- | --- |"
  ];

  for (const check of report.checks) {
    lines.push(`| ${check.passed ? "PASS" : "FAIL"} | ${escapeTable(check.label)} | ${escapeTable(check.why)} |`);
  }

  lines.push("", "## Recommended Next Steps", "");
  if (report.recommendations.length === 0) {
    lines.push("No missing checks. Keep the report current as the repository evolves.");
  } else {
    for (const recommendation of report.recommendations) {
      lines.push(`- **${recommendation.label}** (${recommendation.weight} pts): ${recommendation.fix}`);
    }
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

export async function listRepositoryFiles(root, options = {}) {
  const maxFiles = options.maxFiles ?? 20000;
  const files = [];

  async function walk(currentDir, relativeDir = "") {
    if (files.length >= maxFiles) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      if (error.code === "EACCES" || error.code === "ENOENT") {
        return;
      }
      throw error;
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (files.length >= maxFiles) {
        return;
      }
      const relativePath = path.posix.join(relativeDir, entry.name);
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!DEFAULT_IGNORE_DIRS.has(entry.name)) {
          await walk(fullPath, relativePath);
        }
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  await walk(root);
  return files;
}

function checkPathRule(rule, fileSet) {
  const matchedPath = rule.paths.find((candidate) => fileSet.has(candidate));
  return {
    id: rule.id,
    label: rule.label,
    weight: rule.weight,
    passed: Boolean(matchedPath),
    evidence: matchedPath ? [matchedPath] : [],
    why: rule.why,
    fix: rule.fix
  };
}

function checkMatcherRule(rule, tree) {
  const passed = rule.matcher(tree);
  return {
    id: rule.id,
    label: rule.label,
    weight: rule.weight,
    passed,
    evidence: passed ? findEvidence(rule.id, tree) : [],
    why: rule.why,
    fix: rule.fix
  };
}

function findEvidence(id, tree) {
  if (id === "ci" || id === "codeql") {
    return tree.filter((file) => file.startsWith(".github/workflows/")).slice(0, 5);
  }
  if (id === "tests") {
    return tree.filter((file) => /(^|\/)(test|tests|spec|__tests__)\//i.test(file) || /\.(test|spec)\.[cm]?[jt]sx?$/i.test(file)).slice(0, 5);
  }
  if (id === "issue-templates") {
    return tree.filter((file) => file.startsWith(".github/ISSUE_TEMPLATE/") || file === ".github/ISSUE_TEMPLATE.md").slice(0, 5);
  }
  if (id === "pull-request-template") {
    return tree.filter((file) => file === ".github/PULL_REQUEST_TEMPLATE.md" || file === "PULL_REQUEST_TEMPLATE.md").slice(0, 5);
  }
  if (id === "dependabot") {
    return tree.filter((file) => file === ".github/dependabot.yml" || file === ".github/dependabot.yaml").slice(0, 5);
  }
  if (id === "package-json") {
    return tree.includes("package.json") ? ["package.json"] : [];
  }
  if (id === "lockfile") {
    return tree.filter((file) => ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "uv.lock", "poetry.lock", "Pipfile.lock", "Cargo.lock", "go.sum"].includes(file)).slice(0, 5);
  }
  return [];
}

function summarizeChecks(checks) {
  const passed = checks.filter((check) => check.passed).length;
  return {
    total: checks.length,
    passed,
    failed: checks.length - passed
  };
}

function gradeForScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|");
}
