# Contributing

Thanks for contributing to `biz-in-a-box`.

## Principles

- Keep the base protocol minimal
- Push domain complexity to vertical forks
- Preserve backward compatibility where possible
- Prefer explicit, auditable behavior over magic

## Local checks

```bash
npm run validate
```

## PR guidelines

Please include:
- problem statement
- proposed change
- why it belongs in **base** vs a vertical fork
- migration/compatibility impact

## Base vs Vertical rule

Add to **base** only if it is universal across industries.

If it is domain-specific (dentistry, PM workflows, HVAC billing, etc.), add it in a vertical fork and reference it in `verticals/`.

## Good first contributions

- spec clarity improvements in `SPEC.md`
- validator invariants that improve safety without bloat
- docs/examples for migration and reconciliation
- fork registry entries in `verticals/`
