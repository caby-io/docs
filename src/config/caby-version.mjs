// The version every %CABY_VERSION% token renders as: the newest version published to
// ghcr as both images and the helm chart. Deliberately not stored in the repo.
//
//   CABY_VERSION=0.2.0   pin a build (rollback, offline work, a PR preview)
//
// Deploys resolve this in the workflow (.github/actions/caby-version) and pass
// CABY_VERSION in, so the lookup below is the local-dev path. Reading the registry
// rather than caby's releases is what keeps the docs from advertising a tag nobody
// can pull yet; edge builds are out of scope.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// everything a reader of the install pages has to pull
const artifacts = [
  "caby-io/caby-service",
  "caby-io/caby-web",
  "caby-io/charts/caby",
];
const semver = /^(\d+)\.(\d+)\.(\d+)$/;

// lets an offline `pnpm dev` keep working; never committed, never authoritative
const cacheUrl = new URL(
  "../../node_modules/.cache/caby-version.json",
  import.meta.url,
);

function readCache() {
  try {
    return semver.exec(JSON.parse(readFileSync(cacheUrl, "utf8")).caby)?.[0];
  } catch {
    return undefined;
  }
}

function writeCache(caby) {
  try {
    mkdirSync(dirname(fileURLToPath(cacheUrl)), { recursive: true });
    writeFileSync(cacheUrl, `${JSON.stringify({ caby }, null, 2)}\n`);
  } catch {
    // a read-only or missing node_modules is not worth failing a build over
  }
}

async function json(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GET ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// anonymous pull token per artifact — the same datasource renovate reads
async function releasedTags(repo) {
  const { token } = await json(
    `https://ghcr.io/token?scope=repository:${repo}:pull&service=ghcr.io`,
  );
  // tags come back in lexical order, so digits land on the first page ahead of `edge`
  const { tags } = await json(`https://ghcr.io/v2/${repo}/tags/list?n=100`, {
    authorization: `Bearer ${token}`,
  });
  return (tags ?? []).filter((tag) => semver.test(tag));
}

const rank = (version) =>
  semver
    .exec(version)
    .slice(1)
    .map(Number)
    .reduce((a, n) => a * 1e5 + n, 0);

async function publishedEverywhere() {
  const [service, ...rest] = await Promise.all(artifacts.map(releasedTags));
  const shared = service.filter((tag) =>
    rest.every((tags) => tags.includes(tag)),
  );
  const version = shared.sort((a, b) => rank(a) - rank(b)).at(-1);
  if (!version) {
    throw new Error("no version is published as both images and chart yet");
  }
  return version;
}

export async function resolveCabyVersion({ log = () => {} } = {}) {
  const override = process.env.CABY_VERSION?.trim();
  if (override) {
    if (!semver.test(override)) {
      throw new Error(`CABY_VERSION is not a version: ${override}`);
    }
    log(`${override} (CABY_VERSION)`);
    return override;
  }

  try {
    const version = await publishedEverywhere();
    writeCache(version);
    log(`${version} (published to ghcr)`);
    return version;
  } catch (error) {
    const cached = readCache();
    if (cached) {
      log(`${cached} (cached — ${error.message})`);
      return cached;
    }
    throw new Error(
      `could not resolve caby's version: ${error.message}. Set CABY_VERSION to build without the registry.`,
    );
  }
}
