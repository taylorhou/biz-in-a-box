# biz-in-a-box Protocol Spec (v0.3)

This document defines the base protocol for `biz-in-a-box`.

## 1) Scope

`biz-in-a-box` is an append-only, hash-chained journal format for entity records.

- One repo = one entity
- One line = one JSON entry (`journal.ndjson`)
- Financial entries must satisfy double-entry constraints

## 2) Required Entry Fields

Each entry MUST include:

- `id` (string; globally unique, ULID recommended)
- `time` (ISO-8601 UTC event timestamp)

## 3) Optional Common Fields

- `recorded_at` (ISO-8601 UTC write timestamp)
- `labels` (string[])
- `description` (string)
- `attachments` (array)
- `created_by` (actor id)
- `prev_hash` (64-char lowercase hex SHA-256)
- `hash` (64-char lowercase hex SHA-256)

## 4) Financial Entry Fields

If `labels` contains `financial`, entry MUST include:

- `debits`: `[{ account: string, amount: number }]`
- `credits`: `[{ account: string, amount: number }]`

Constraint:

- `sum(debits.amount) == sum(credits.amount)`

## 5) System Labels

Base system labels:

- `financial`
- `correction` (requires `supersedes`)
- `transfer` (requires `from`, `to`)
- `historical`
- `imported`
- `opening-balance`

## 6) Hashing Rules

- Hash algorithm: SHA-256 (full 64 hex chars)
- Genesis `prev_hash`: `0000000000000000000000000000000000000000000000000000000000000000`
- Entry hash input: canonical JSON of the entry excluding `hash`

Canonicalization (v0.3):

- Sort object keys lexicographically at every nesting level
- Preserve array order as written
- Serialize as JSON UTF-8 bytes

## 7) Validation Rules (Base)

Base validator enforces:

1. Required fields (`id`, `time`)
2. `financial` balance checks
3. `correction` requires `supersedes`
4. `transfer` requires `from` + `to`
5. Hash chain continuity and hash correctness
6. If `recorded_at - time > 7 days`, require `historical` or `imported` label

## 8) File Set

Required repository files:

- `journal.ndjson`
- `entity.yaml`
- `accounts.yaml`
- `labels.yaml`
- `access.yaml`
- `validate.js`

Optional but recommended:

- `snapshots/`
- `FORK.md`
- `verticals/`

## 9) Backward Compatibility

- New fields may be added without breaking old readers.
- Existing field semantics cannot be redefined in base protocol.
- Vertical forks may add labels/fields but must keep base rules valid.

## 10) Planned v0.3.1 Additions

- `specVersion`
- CAS append protocol (`expected_prev_hash`)
- Idempotency key convention (`idempotency_key`)
