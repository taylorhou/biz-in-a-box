#!/usr/bin/env node
/**
 * nano-biz validator
 * Validates journal.ndjson for:
 *   - required fields
 *   - double-entry balance on financial entries
 *   - correction entries have supersedes ref
 *   - hash chain integrity
 *
 * Usage:
 *   node validate.js [journal.ndjson]
 *   echo $? → 0 = valid, 1 = errors found
 */

import { createHash } from "crypto";
import { readFileSync } from "fs";

const file = process.argv[2] || "journal.ndjson";
const lines = readFileSync(file, "utf8").trim().split("\n").filter(Boolean);

let errors = [];
let prevHash = "0000000000000000";
let i = 0;

function sum(lines) {
  return lines.reduce((acc, l) => acc + (l.amount || 0), 0);
}

function hashEntry(entry) {
  const { hash: _h, ...rest } = entry;
  const canonical = JSON.stringify(rest, Object.keys(rest).sort());
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
}

for (const line of lines) {
  i++;
  let entry;

  try {
    entry = JSON.parse(line);
  } catch (e) {
    errors.push(`Line ${i}: invalid JSON`);
    continue;
  }

  const loc = `Entry ${i} (${entry.id || "no-id"})`;

  // Required fields
  if (!entry.id)   errors.push(`${loc}: missing id`);
  if (!entry.time) errors.push(`${loc}: missing time`);

  // Financial label validation
  if (entry.labels?.includes("financial")) {
    if (!entry.debits?.length)  errors.push(`${loc}: financial entry missing debits`);
    if (!entry.credits?.length) errors.push(`${loc}: financial entry missing credits`);

    const debitTotal  = Math.round(sum(entry.debits  || []) * 100);
    const creditTotal = Math.round(sum(entry.credits || []) * 100);

    if (debitTotal !== creditTotal) {
      errors.push(`${loc}: debits (${debitTotal/100}) ≠ credits (${creditTotal/100})`);
    }
  }

  // Correction label validation
  if (entry.labels?.includes("correction")) {
    if (!entry.supersedes) {
      errors.push(`${loc}: correction entry missing supersedes ref`);
    }
  }

  // Hash chain
  if (entry.prev_hash !== undefined && entry.prev_hash !== prevHash) {
    errors.push(`${loc}: prev_hash mismatch (expected ${prevHash}, got ${entry.prev_hash})`);
  }

  if (entry.hash) {
    const expected = hashEntry({ ...entry, prev_hash: prevHash });
    if (entry.hash !== expected) {
      errors.push(`${loc}: hash invalid (expected ${expected}, got ${entry.hash})`);
    }
    prevHash = entry.hash;
  } else {
    prevHash = hashEntry({ ...entry, prev_hash: prevHash });
  }
}

if (errors.length === 0) {
  console.log(`✅ ${i} entries — valid`);
  process.exit(0);
} else {
  console.error(`❌ ${errors.length} error(s) in ${i} entries:`);
  errors.forEach(e => console.error("  " + e));
  process.exit(1);
}
