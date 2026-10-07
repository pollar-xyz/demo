import { spawnSync, execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(
  readFileSync(path.join(root, "pollar-sdk-source.json"), "utf8"),
);
const output = path.join(root, ".pollar-sdk");
const sdk = process.env.POLLAR_SDK_PATH
  ? path.resolve(process.env.POLLAR_SDK_PATH)
  : path.join(output, "source");
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(command + " failed (" + result.status + ")");
}
if (!/^[a-f0-9]{40}$/.test(source.revision))
  throw new Error("Pin a full SDK commit.");
if (!process.env.POLLAR_SDK_PATH) {
  mkdirSync(sdk, { recursive: true });
  if (!existsSync(path.join(sdk, ".git"))) {
    run("git", ["init"], sdk);
    run("git", ["remote", "add", "origin", source.repository], sdk);
  }
  run("git", ["fetch", "--depth=1", "origin", source.revision], sdk);
  run("git", ["checkout", "--detach", source.revision], sdk);
}
const git = (...args) =>
  execFileSync("git", args, { cwd: sdk, encoding: "utf8" }).trim();
if (git("rev-parse", "HEAD") !== source.revision)
  throw new Error("SDK checkout must match pollar-sdk-source.json.");
if (git("status", "--porcelain", "--untracked-files=no"))
  throw new Error("SDK checkout has uncommitted changes.");
if (!process.env.POLLAR_SDK_PATH || !existsSync(path.join(sdk, "node_modules")))
  run("npm", ["ci", "--legacy-peer-deps"], sdk);
for (const name of ["core", "react"]) {
  run("npm", ["run", "build", "-w", "@pollar/" + name], sdk);
  const from = path.join(sdk, "packages", name);
  const to = path.join(output, "packages", name);
  mkdirSync(to, { recursive: true });
  cpSync(path.join(from, "dist"), path.join(to, "dist"), { recursive: true });
  cpSync(path.join(from, "package.json"), path.join(to, "package.json"));
  if (existsSync(path.join(from, "NOTICE")))
    cpSync(path.join(from, "NOTICE"), path.join(to, "NOTICE"));
  writeFileSync(
    path.join(to, "dist/pollar-source.json"),
    JSON.stringify(source, null, 2) + "\n",
  );
}
console.log("Prepared ramp SDK from", source.revision);
