# Security Policy

Thanks for helping keep `biz-in-a-box` safe.

## Scope

Current code and spec in this repo, including:
- `validate.js`
- canonical hash behavior
- docs/spec mismatches that could cause unsafe implementations

## Report a vulnerability

Please report privately first (do not open a public issue with exploit details):

- Open a private security advisory on GitHub (preferred)
- Or contact maintainer: Taylor Hou

Include:
- impact
- reproduction steps
- affected files/versions
- suggested remediation (if known)

## Threat model (v0.x)

Known risks under active hardening:
- multi-writer race conditions without CAS append
- missing signatures/non-repudiation in minimal deployments
- attachment mutability if content hashes are not enforced

See `ROADMAP.md` for planned mitigations.

## Disclosure policy

- We acknowledge reports quickly
- We prioritize fixes by severity and exploitability
- We publish transparent patch notes after remediation
