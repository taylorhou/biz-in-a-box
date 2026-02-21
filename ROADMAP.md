# ROADMAP (Consensus-Driven)

This roadmap reflects external model critique across technical architecture,
adoption/security, and accounting controls.

## Positioning (Now)

- **Mission:** replace legacy ERP and accounting software with an open, agent-native system of record.
- **Execution strategy:** ship protocol hardening first, then controls and vertical depth to complete replacement.

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

## Launch Gate

- **Go now** for OSS launch with explicit replacement intent.
- Ship in phases (`v0.3` → `v0.6`) to earn production trust while maintaining aggressive replacement trajectory.
