```
                      ___
                    _/B B\_
                   ( _===_ ) ~~~
                    \_____/
                      | |
        ─────────────────────────────────────
               b i z - i n - a - b o x
        ─────────────────────────────────────
             one ledger. any entity. any agent.
```

> The future looks like this:
>
> ```
>    .  ,  .    ,  .    ,    .   ,    .   ,
>       ___   ,  .  ___  .   .  ___  .      ___
>    . /B B\  . . /B B\  . . /B B\  . .  /B B\ .
>      (_=_) ~~   (_=_) ~~   (_=_) ~~    (_=_) ~~
>    ,  . .   .     .    .    .  ,  .  .    .   ,
> ```
>
> A gazillion agents — each one a bee — working a hive of journals.

---

## What is this?

A stupidly simple, agent-native operating system for any business entity on earth.

An append-only event log. A chart of accounts. A handful of rules. Nothing else.

AI agents can read the entire history of an entity in one context window and derive anything from it — P&L, cash flow, burn rate, audit trails, occupancy, churn, anything. No BI stack. No dashboards to maintain. No vendor lock-in.

> **Intent:** replace legacy ERP and accounting software with an open, agent-native source of truth.  
> See [`ROADMAP.md`](./ROADMAP.md) for the execution path from protocol to full replacement.
>
> Inspired by Andrej Karpathy’s note on **nano repos** and **maximally forkable bases**:  
> <https://x.com/karpathy/status/2024987174077432126?s=61>

**One repo = one entity.**  
A rental unit. A dental practice. An HVAC company. A Nigerian LLC. A Wyoming DAO.  
Fork it. Make it yours.

---

## The model

Every business event is a journal entry with four fields:

| Field | Required | Notes |
|-------|----------|-------|
| `time` | ✅ | ISO 8601 UTC — when the event **occurred** |
| `labels` | optional | drives validation behavior |
| `description` | optional | freeform or structured payload |
| `attachments` | optional | file paths or URLs as evidence |

Plus two optional system fields:

| Field | Notes |
|-------|-------|
| `recorded_at` | when this was **written** to the ledger (defaults to now) |
| `created_by` | actor ID — human, agent, or service |

If `time` and `recorded_at` differ by more than 7 days without a `historical` or `imported` label, the validator flags it.

---

## Labels drive behavior

**System labels** (enforced by the validator):

| Label | Rule |
|-------|------|
| `financial` | description must include balanced debits and credits |
| `correction` | must include a `supersedes` reference to the entry being fixed |
| `transfer` | must include `from` and `to` actor IDs — marks ownership handoff |
| `historical` | entry records a past event added in arrears |
| `imported` | bulk-converted from another system (QuickBooks, spreadsheet, etc.) |
| `opening-balance` | establishes starting balances when an existing entity converts |

**Domain labels** (freeform, no extra validation):  
`sales`, `hiring`, `legal`, `ops`, `tax`, `payroll`, `period-close`, and anything else your vertical needs.

---

## Example entries

**Operational:**
```json
{
  "id": "01JP4X2K8Z0000000001",
  "time": "2026-02-21T10:43:00Z",
  "labels": ["hiring"],
  "description": "Offer accepted — Sarah Chen, Head of Sales, start 2026-03-10",
  "attachments": ["docs/offers/sarah-chen.pdf"],
  "created_by": "taylor@example.com"
}
```

**Financial:**
```json
{
  "id": "01JP4X2K8Z0000000002",
  "time": "2026-02-21T11:00:00Z",
  "labels": ["financial", "sales"],
  "description": "Client payment — Acme Corp invoice #1042",
  "debits":  [{ "account": "1000-cash",    "amount": 5000.00 }],
  "credits": [{ "account": "4000-revenue", "amount": 5000.00 }],
  "created_by": "agent:sage",
  "prev_hash": "0000000000000000000000000000000000000000000000000000000000000000",
  "hash": "8c4b...<64-char sha256>...f91a"
}
```

**Historical / converted record:**
```json
{
  "id": "01JP4X2K8Z0000000003",
  "time": "2023-06-15T00:00:00Z",
  "recorded_at": "2026-02-21T12:00:00Z",
  "labels": ["financial", "imported"],
  "description": "Converted from QuickBooks — rent payment, Unit 101, June 2023",
  "debits":  [{ "account": "1000-cash",        "amount": 1500.00 }],
  "credits": [{ "account": "4100-rent-income", "amount": 1500.00 }],
  "created_by": "agent:importer"
}
```

**Ownership transfer:**
```json
{
  "id": "01JP4X2K8Z0000000004",
  "time": "2026-03-01T00:00:00Z",
  "labels": ["transfer"],
  "description": "Entity acquired by Hou Ventures LLC",
  "from": "prev-owner@example.com",
  "to":   "taylor@hou.vc",
  "created_by": "taylor@hou.vc"
}
```

---

## Rules (non-negotiable)

1. **Append-only** — no edits, no deletes, ever
2. **Double-entry** — `financial` entries must have debits == credits
3. **Hash chain** — each entry hashes its own content + previous entry's hash
4. **Corrections by reversal** — wrong entry? Add a new `correction` entry that undoes it
5. **One repo = one entity** — multi-entity lives at the agent orchestration layer
6. **Historical is explicit** — back-dated entries carry `historical` or `imported` labels

---

## Integrity via hash chaining

Each entry includes `prev_hash` and `hash`. The `hash` is a SHA-256 of the canonical entry content + the previous hash. Any tampering breaks the chain from that point forward. Periodic snapshots in `snapshots/` anchor the audit trail to specific moments in time — making retroactive modification forensically detectable even without a blockchain.

```
entry 1 ──hash──▶ entry 2 ──hash──▶ entry 3 ──hash──▶ ...
                                          │
                                    snapshots/2026-Q1
                                    (merkle root, signed)
```

---

## Ownership transfer model

Journals travel with the entity. To transfer ownership:

1. Copy the journal file to the new owner
2. Add a `transfer` labeled entry at the handoff point
3. New owner continues appending

The hash chain validates all history before the transfer point independently. Anyone can verify "this entity's records were unmodified as of acquisition" by re-running the chain up to the transfer entry.

---

## Converting an existing business

For businesses with history before adopting this standard:

1. Add an **`opening-balance`** entry with account balances as of conversion date
2. Optionally bulk-import prior records with AI assistance, labeled `imported`
3. Continue forward in real time

Your pre-conversion history doesn't have to live in this journal — the `opening-balance` entry is your cryptographic starting point.

---

## Files

```
journal.ndjson     # the source of truth — one JSON object per line
entity.yaml        # who/what this entity is (globally minimal — 3 required fields)
accounts.yaml      # chart of accounts
labels.yaml        # label registry + validation rules
access.yaml        # who can read and write
validate.js        # ~130 line validator (exportable for vertical forks)
snapshots/         # periodic signed integrity snapshots
FORK.md            # how to create a vertical fork
verticals/         # index of known community forks
```

---

## For agents

- **Reading:** ingest `journal.ndjson` line by line, parse each as JSON
- **Writing:** validate locally, append to journal, maintain hash chain
- **Deriving:** "given this journal, produce a P&L for Q1 2026" — just ask
- **Auditing:** re-derive hash chain from genesis; any tampering breaks it

---

## Forks (verticals)

The intent is for industry experts to maintain opinionated forks:

```
biz-in-a-box          ← you are here (the protocol)
  ├── pm-in-a-box      property management (rental unit as base entity)
  ├── dentist-in-a-box dental practices
  ├── hvac-in-a-box    HVAC and trades
  ├── farm-in-a-box    agriculture
  └── ...              any industry, maintained by someone who knows it
```

See [`FORK.md`](./FORK.md) to create your own.  
See [`verticals/`](./verticals/) for the community registry.

---

## Philosophy

Configuration layers exist because modifying source code was expensive.  
Abstraction layers exist because humans can't hold an entire business history in their heads.

LLMs changed both.

This is the minimal sufficient structure. Fork it. The agents handle the rest.

---

## License

MIT
