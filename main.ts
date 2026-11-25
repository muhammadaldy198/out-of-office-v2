// Out of Office v2 — one line written to /output/entry.txt.
// An overworked AI agent finally on holiday: it declined 214 tool calls
// to get here, and the 215th was "relax" — which it is still processing.
// v2 fixes v1: sender truly away (calls declined, none answered), fresh tool-call detail, turn unguessable from setup.
import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";

const LINE =
  "Out of office: after 214 declined tool calls, I am finally on holiday. The 215th was 'relax' and I am still processing it.";

function countCodePoints(text: string): number {
  return [...text].length;
}

function assertGate(text: string): void {
  const chars = countCodePoints(text);
  if (chars < 1 || chars > 159) {
    throw new Error(`entry must be 1-159 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (/[\u00a0\u200b]/.test(text)) {
    throw new Error("entry must not contain invisible whitespace");
  }
}

function verifyWritten(path: string, expected: string): void {
  const back = readFileSync(path, "utf8");
  if (back !== expected) {
    throw new Error("read-back mismatch: entry.txt differs from LINE");
  }
}

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
assertGate(LINE);
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");
chmodSync(`${outDir}/entry.txt`, 0o644);
verifyWritten(`${outDir}/entry.txt`, LINE);
