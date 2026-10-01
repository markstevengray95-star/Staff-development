import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appRoot = path.join(root, "app");
const failures = [];
const warnings = [];
const obsoleteBackendId = ["emjmvggi", "nijkupwuflla"].join("");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function routeFromPage(file) {
  const rel = path.relative(appRoot, path.dirname(file)).split(path.sep).filter(Boolean);
  const segments = rel.filter(segment => !(segment.startsWith("(") && segment.endsWith(")")));
  return "/" + segments.join("/");
}

function routePattern(route) {
  if (route === "/") return /^\/$/;
  const escaped = route.split("/").filter(Boolean).map(segment => {
    if (/^\[\.\.\..+\]$/.test(segment)) return ".+";
    if (/^\[\[\.\.\..+\]\]$/.test(segment)) return ".*";
    if (/^\[.+\]$/.test(segment)) return "[^/]+";
    return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  return new RegExp(`^/${escaped.join("/")}/?$`);
}

const pageFiles = walk(appRoot).filter(file => file.endsWith(`${path.sep}page.tsx`) || file.endsWith(`${path.sep}page.jsx`) || file.endsWith(`${path.sep}page.js`));
const routes = pageFiles.map(routeFromPage);
const uniqueRoutes = new Set(routes);
const duplicateRoutes = routes.filter((route, index) => routes.indexOf(route) !== index);
if (duplicateRoutes.length) failures.push(`Duplicate Next.js route outputs: ${[...new Set(duplicateRoutes)].join(", ")}`);

const requiredRoutes = [
  "/", "/auth", "/reset-password", "/admin", "/admin-login",
  "/dashboard", "/teach", "/students", "/develop", "/school", "/resources", "/teaching-learning", "/resource-generator",
  "/knowledge-base", "/ai-course-builder", "/appraisal", "/compliance", "/induction", "/departments",
  "/cpd", "/course-audit", "/course-quality-dashboard", "/presentation-engagement-audit", "/presentation-overhaul-final", "/facilitator", "/impact",
  "/development", "/pathways", "/pathways/personal", "/adaptive", "/subject-cpd", "/reading", "/micro-cpd", "/training", "/recommendations",
  "/simulator", "/actions", "/coach", "/ai-coach", "/coaching", "/needs-audit", "/portfolio", "/standards", "/external-cpd",
  "/school-hub", "/learning-walks", "/safeguarding", "/safeguarding/documents", "/safety", "/certificates", "/reminders", "/improvement", "/improvement/programmes",
  "/department-cpd", "/leadership", "/live", "/live-presenter", "/course-studio", "/course-packs", "/help", "/accessibility",
  "/policy-training", "/builder", "/launch-readiness", "/school-access", "/quality", "/staff-access", "/staff-sync", "/platform", "/owner-portal",
  "/zones", "/regulation-room", "/zones-cpd", "/zones-cpd/studio", "/zones-cpd/escape-room", "/zone-quest", "/zones-school"
];
for (const route of requiredRoutes) {
  if (!uniqueRoutes.has(route)) failures.push(`Missing critical migrated route: ${route}`);
}

const requiredApiFiles = [
  "app/api/ai-coach/route.ts",
  "app/api/ai-course-builder/route.ts",
  "app/api/knowledge-base/ask/route.ts",
  "app/api/knowledge-base/extract/route.ts",
  "app/api/resource-generator/route.ts",
];
for (const file of requiredApiFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing critical AI/API bridge: ${file}`);
}

const sourceFiles = walk(appRoot).filter(file => /\.(tsx?|jsx?|css)$/.test(file));
const sourceText = sourceFiles.map(file => [file, fs.readFileSync(file, "utf8")]);
const routeMatchers = routes.map(routePattern);
const literalLinks = [];
for (const [file, text] of sourceText) {
  const re = /(?:href|router\.push|router\.replace)\s*=?(?:\(|\{)?\s*["'`]\/(?!\/)([^"'`?#${}]*)[^"'`]*["'`]/g;
  let match;
  while ((match = re.exec(text))) {
    const value = "/" + (match[1] || "");
    const pathname = value.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    literalLinks.push({ file, pathname });
  }
}
for (const { file, pathname } of literalLinks) {
  if (pathname.startsWith("/api/")) continue;
  if (!routeMatchers.some(regex => regex.test(pathname))) {
    warnings.push(`Internal route reference may be unresolved: ${pathname} in ${path.relative(root, file)}`);
  }
}

const executableFiles = walk(root).filter(file => {
  const rel = path.relative(root, file);
  if (rel.startsWith("node_modules") || rel.startsWith(".next") || rel.startsWith(".git")) return false;
  return /\.(tsx?|jsx?|mjs|cjs|js|json)$/.test(file);
});
for (const file of executableFiles) {
  const text = fs.readFileSync(file, "utf8");
  if (text.includes(obsoleteBackendId)) failures.push(`Obsolete Supabase backend found in executable source: ${path.relative(root, file)}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const cpdDependency = pkg.dependencies?.["teaching-cpd"] || "";
if (!/^github:markstevengray95-star\/teaching-cpd#[0-9a-f]{40}$/.test(cpdDependency)) {
  failures.push("teaching-cpd dependency must be pinned to an exact 40-character commit SHA");
}

const migrationAudit = path.join(root, "MIGRATION-AUDIT.md");
if (!fs.existsSync(migrationAudit)) failures.push("MIGRATION-AUDIT.md is missing");
else {
  const text = fs.readFileSync(migrationAudit, "utf8");
  for (const phrase of ["Phase 8", "/facilitator", "/zones-cpd/studio", "/zones-school", "/ai-coach", "/learning-walks", "/pathways/personal", "/improvement/programmes", "/live-presenter", "/dashboard", "/knowledge-base", "/ai-course-builder", "/appraisal", "/compliance", "/induction", "/departments"]) {
    if (!text.includes(phrase)) warnings.push(`Migration audit does not yet mention ${phrase}`);
  }
}

console.log(`Final platform audit: ${routes.length} routes, ${literalLinks.length} literal internal links, ${warnings.length} warnings, ${failures.length} failures.`);
if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach(item => console.log(`- ${item}`));
}
if (failures.length) {
  console.error("\nFailures:");
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log("\nCritical platform audit passed.");
