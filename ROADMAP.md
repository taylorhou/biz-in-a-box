# ROADMAP (Consensus-Driven)

This roadmap reflects external model critique across technical architecture,
adoption/security, and accounting controls.

## Positioning (Now)

- **Current position:** open ledger protocol / agent-native accounting substrate
- **Not yet:** full accounting-system replacement (QuickBooks/Xero/AppFolio parity)

## v0.3 — Protocol Hardening (Now)

- [x] Full SHA-256 hashes (64-char hex)
- [x] Canonicalized hashing (stable key ordering, nested objects)
- [x] Genesis hash standardized (`64` zeroes)
- [ ] `specVersion` field for entries and validators
- [ ] CAS append protocol (`expected_prev_hash`) for race-safe writes
- [ ] Idempotency key convention for retry-safe posting

## v0.4 — Authenticity & Tamper Hardening

- [ ] Per-entry signatures (Ed25519)
- [ ] Key IDs, rotation, revocation policy
- [ ] Periodic signed checkpoints in `snapshots/`
- [ ] Optional external root anchoring

## v0.5 — Money & Currency Safety

- [ ] Integer minor-unit amounts (`amount_minor`) as canonical
- [ ] Required `currency` on financial lines
- [ ] Decimal precision and rounding policy docs

## v0.6 — Minimal Control Layer

- [ ] Period close / lock semantics (`period-close` + lock rules)
- [ ] Required actor attribution for financial entries
- [ ] Attachment integrity hashes (not path-only evidence)

## Vertical Strategy

Keep base small. Push industry complexity to forks:

- `pm-in-a-box`
- `dentist-in-a-box`
- `hvac-in-a-box`
- etc.

## Go/No-Go Gate

- **Go now** for OSS protocol launch and community forks
- **No-go** on claiming full accounting replacement until v0.6 controls land
