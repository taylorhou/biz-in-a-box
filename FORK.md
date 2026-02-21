# Forking biz-in-a-box

Anyone can fork this into a vertical. The point is for every industry to have
its own opinionated, community-maintained version — built on the same primitive.

## Who should fork

If you know your industry deeply and see how this pattern applies, fork it.
A dentist. A property manager. An HVAC company. A law firm. A farmer.
Your fork becomes the standard for your vertical.

## What a vertical adds

Your fork extends the base with domain-specific defaults. Typically:

- **`accounts.yaml`** — chart of accounts for your industry
- **`labels.yaml`** — domain labels with optional validation rules
- **`entity.yaml`** — industry-specific `meta` fields (with examples)
- **`validate.js`** — import base validator, add your own rules on top
- **`README.md`** — replace with your vertical's docs
- **`examples/`** — sample journal entries that make sense for your domain

## What a vertical never changes

- The core journal format (`time`, `labels`, `description`, `attachments`)
- System labels (`financial`, `correction`, `historical`, `imported`, `opening-balance`, `transfer`)
- Two-timestamp model (`time` vs `recorded_at`)
- Hash chain mechanics
- `entity.yaml` required fields (`id`, `name`, `type`)
- `access.yaml` permission model

These are the protocol. If you change them, your fork is incompatible with the ecosystem.

## How to fork

```bash
# 1. Fork on GitHub (use the Fork button)

# 2. Clone your fork
git clone https://github.com/you/your-vertical-in-a-box
cd your-vertical-in-a-box

# 3. Customize
#    - Edit accounts.yaml for your industry COA
#    - Edit labels.yaml to add domain labels
#    - Update entity.yaml meta examples
#    - Extend validate.js
#    - Write examples/ with real journal entries
#    - Rewrite README.md for your vertical

# 4. Validate your examples
node validate.js examples/sample.ndjson

# 5. Publish and list your fork (see below)
```

## Extending the validator

```js
// your-vertical-in-a-box/validate.js
import { validateEntry, hashEntry } from '../biz-in-a-box/validate.js';
// or after publishing base as npm package:
// import { validateEntry, hashEntry } from 'biz-in-a-box';

export function validateVerticalEntry(entry, prevHash, index) {
  // Run base validation first
  const result = validateEntry(entry, prevHash, index);

  // Add your domain rules
  if (entry.labels?.includes('appointment')) {
    if (!entry.provider) result.errors.push(`Entry ${index}: [appointment] missing provider`);
    if (!entry.patient)  result.errors.push(`Entry ${index}: [appointment] missing patient`);
  }

  return result;
}
```

## List your fork in the registry

Submit a PR to add your fork to [`verticals/`](./verticals/) with a one-page file:

```md
# dentist-in-a-box
Maintainer: @yourhandle
Repo: https://github.com/you/dentist-in-a-box
Status: active
Labels added: appointment, insurance-claim, procedure, rx, recall
Accounts added: 4100-exam, 4200-procedure, 4300-whitening, 5100-lab-fees
```

That's it. Your fork is now discoverable by anyone in your industry.
