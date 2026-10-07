import { createRequire } from "node:module";
import { readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "package.json"));
const expected = JSON.parse(
  readFileSync(path.join(root, "pollar-sdk-source.json"), "utf8"),
);
for (const name of ["core", "react"]) {
  const entry = require.resolve("@pollar/" + name);
  const built = JSON.parse(
    readFileSync(path.join(path.dirname(entry), "pollar-source.json"), "utf8"),
  );
  if (
    built.revision !== expected.revision ||
    built.repository !== expected.repository
  )
    throw new Error("Stale @pollar/" + name + "; run pnpm run bootstrap.");
}
const core = require("@pollar/core");
for (const name of [
  "getRampRoutes",
  "continueRamp",
  "signRampAction",
  "registerRampSigningHandler",
])
  if (typeof core.PollarClient.prototype[name] !== "function")
    throw new Error("Missing ramp API: " + name);
const expectedCore = realpathSync(require.resolve("@pollar/core"));
for (const name of [
  "react",
  "privy-adapter",
  "stellar-wallets-kit-adapter",
  "accesly-adapter",
]) {
  const from = createRequire(require.resolve("@pollar/" + name));
  if (realpathSync(from.resolve("@pollar/core")) !== expectedCore)
    throw new Error("@pollar/" + name + " resolves another core instance.");
}
console.log(
  "Demo uses one core instance and ramp SDK commit",
  expected.revision,
);
