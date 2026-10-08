import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import ts from "typescript";
const output = ts.transpileModule(
  readFileSync("src/lib/portfolio.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const baseline = process.argv[2] ?? "42e9f6449f1e6c5610d8d7ada8e886fec28fae05";
const migrated = { exports: {} };
runInNewContext(output, migrated);
for (const [file, name] of [
  ["Projects", "PROJECTS_DATA"],
  ["Skills", "SKILLS_DATA"],
  ["Timeline", "TIMELINE_DATA"],
]) {
  const original = execFileSync(
    "git",
    ["show", `${baseline}:src/components/${file}.tsx`],
    { encoding: "utf8" },
  );
  const match = original.match(
    new RegExp(`const ${name}: [^=]+ = (\\[.*?\\n\\]);`, "s"),
  );
  const array = match[1].replace(/\n    icon: \w+,/g, "");
  const source = runInNewContext(`(${array})`);
  assert.deepEqual(
    JSON.parse(JSON.stringify(migrated.exports[name])),
    JSON.parse(JSON.stringify(source)),
  );
  console.log(
    `PASS preserved all ${source.length} ${file.toLowerCase()} entries, descriptions, assets, and links`,
  );
}
