import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The bug was in code I wrote, reviewed, and approved. I have opened a ticket against myself and marked it low priority.";

const MAX_CHARS = 200;

function validate(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
}

validate(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  throw new Error("round-trip check failed: entry.txt does not match the line");
}
if (Buffer.byteLength(readBack, "utf8") === 0) {
  throw new Error("round-trip check failed: entry.txt is empty");
}
if (Buffer.byteLength(readBack, "utf8") > MAX_CHARS) {
  throw new Error("round-trip check failed: entry.txt exceeds the byte limit");
}

console.log(`wrote ${outPath} (${LINE.length} chars)`);
