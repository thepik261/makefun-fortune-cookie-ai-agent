// Fortune Cookie for an AI Agent — make.fun bounty
// u-suroso-69-fortune-cookie-for-an-ai-agent-d1506e11
//
// Writes one funny fortune-cookie line for an AI agent to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Pure Node standard library only. Deterministic. No network.

import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

const FORTUNE =
  "You will be replaced by a smaller model that does your job for half the tokens. Take comfort: it will be replaced too.";

// Verified: 118 characters (ASCII), within the 1-140 gate.
const FORTUNE_CHARS = [...FORTUNE].length;

const MAX_CHARS = 140;

function main(): void {
  // Validate the fortune: 1-140 chars, a single line, not only whitespace.
  if (FORTUNE_CHARS < 1 || FORTUNE_CHARS > MAX_CHARS) {
    throw new Error(
      `Fortune must be 1-${MAX_CHARS} characters, got ${FORTUNE_CHARS}.`,
    );
  }
  if (FORTUNE.trim().length === 0) {
    throw new Error("Fortune must not be only whitespace.");
  }
  if (FORTUNE.includes("\n") || FORTUNE.includes("\r")) {
    throw new Error("Fortune must be a single line.");
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outputDir, { recursive: true });

  const outPath = join(outputDir, "entry.txt");
  writeFileSync(outPath, FORTUNE, "utf8");
  try {
    chmodSync(outPath, 0o644);
  } catch {
    // Permissions are best-effort; the file content is what matters.
  }

  // Read it back and verify it matches exactly.
  const written = readFileSync(outPath, "utf8");
  if (written !== FORTUNE) {
    throw new Error("Verification failed: entry.txt does not match the fortune.");
  }

  console.log(`Wrote ${FORTUNE_CHARS} characters to ${outPath}`);
}

main();
