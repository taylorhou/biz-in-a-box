# nano-biz

A stupidly simple, agent-native operating system for a business.

One append-only journal. A chart of accounts. Nothing else.

AI agents can read the entire history at once and derive anything — P&L, cash flow, burn rate, audit trails, reports. No BI stack. No dashboards to maintain. No vendor lock-in.

---

## The model

Every business action is a journal entry with four fields:

| Field | Required | Notes |
|-------|----------|-------|
| `time` | ✅ | ISO 8601 UTC |
| `labels` | optional | drives validation behavior |
| `description` | optional | freeform or structured payload |
| `attachments` | optional | file paths or URLs for evidence |

That's it.

---

## Labels drive behavior

- **`financial`** → description must include balanced debits and credits referencing `accounts.yaml`
- **`correction`** / **`reversal`** → marks a correcting entry, must include `supersedes` ref
- Everything else (`sales`, `hiring`, `legal`, `ops`, `support`, etc.) → freeform, no extra validation

---

## Example entries

**Operational entry:**
```json
{
  "id": "01JP4X2K8Z0000000001",
  "time": "2026-02-21T10:43:00Z",
  "labels": ["hiring"],
  "description": "Offer accepted — Sarah Chen, Head of Sales, start date 2026-03-10",
  "attachments": ["docs/offers/sarah-chen-offer.pdf"],
  "created_by": "taylor@example.com",
  "prev_hash": "0000000000000000",
  "hash": "a3f2c1..."
}
```

**Financial entry:**
```json
{
  "id": "01JP4X2K8Z0000000002",
  "time": "2026-02-21T11:00:00Z",
  "labels": ["financial", "sales"],
  "description": "Client payment received — Acme Corp invoice #1042",
  "debits":  [{ "account": "1000-cash",    "amount": 5000.00 }],
  "credits": [{ "account": "4000-revenue", "amount": 5000.00 }],
  "attachments": ["docs/invoices/inv-1042.pdf"],
  "created_by": "agent:sage",
  "prev_hash": "a3f2c1...",
  "hash": "9b7d44..."
}
```

**Correction entry:**
```json
{
  "id": "01JP4X2K8Z0000000003",
  "time": "2026-02-21T11:15:00Z",
  "labels": ["financial", "correction"],
  "description": "Reversal of entry 01JP4X2K8Z0000000002 — wrong revenue account",
  "supersedes": "01JP4X2K8Z0000000002",
  "debits":  [{ "account": "4000-revenue", "amount": 5000.00 }],
  "credits": [{ "account": "1000-cash",    "amount": 5000.00 }],
  "created_by": "taylor@example.com",
  "prev_hash": "9b7d44...",
  "hash": "cc12e8..."
}
```

---

## Rules (non-negotiable)

1. **Append-only** — no edits, no deletes, ever
2. **Double-entry** — `financial` entries must have debits == credits
3. **Hash chain** — each entry hashes its own content + previous entry's hash
4. **Corrections by reversal** — wrong entry? Add a new one labeled `correction` that undoes it
5. **One repo = one business** — multi-entity lives at the agent orchestration layer

---

## Files

```
journal.ndjson     # the source of truth — one JSON object per line
accounts.yaml      # chart of accounts
labels.yaml        # label registry + validation rules
validate.js        # ~100 line validator
```

---

## Multi-entity

Each business is its own repo. Consolidation, inter-company eliminations, and roll-ups happen via agents that read multiple repos and reconcile standardized account codes and labels. No cross-repo complexity bleeds into the core.

---

## For agents

- **Reading:** ingest `journal.ndjson` line-by-line, parse each as JSON
- **Writing:** validate locally, append to journal, verify hash chain integrity
- **Deriving:** ask the LLM — "given this journal, produce a P&L for Q1 2026"
- **Auditing:** re-derive hash chain from first entry; any tampering breaks the chain

---

## Philosophy

Configuration layers exist because modifying source code was expensive.  
Abstraction layers exist because humans can't hold entire business histories in their heads.  

LLMs changed both constraints.  

This is the minimal sufficient structure. Fork it. Make it yours. The LLM handles the rest.

---

## License

MIT
