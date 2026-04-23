---
title: "When Databases Tremble: A Self-Hosting Odyssey"
date: 2026-04-04
categories: [Technology]
tags: [server]
lang: en
---

> *The complete implementation, including Cloudflare Worker code, resides on my Chinese blog at [www.exyone.me](https://www.exyone.me/archives/database-backup-cloudflare-error-page).*
{: .prompt-info }

Self-hosting is a siren's call — irresistible, occasionally perilous. My migration from cloud servers to home infrastructure began with optimism, then promptly reminded me why backups exist.

## The Database Near-Miss

The first casualty: peace of mind.

Post-migration, my database — the repository of years of writing, comments, and painstaking configuration — teetered on the brink of oblivion. Only a preemptive backup in BT Panel prevented catastrophe. The "data is life" mantra, previously abstract, became viscerally real.

The lesson crystallized: **BT Panel(aaPanel)'s database backups are insufficient**. Halo's built-in full backups, capturing both database and files, offer genuine resilience. Partial backups promise recovery while delivering disappointment.

## The Double Failure

No sooner had the database stabilized than the network infrastructure collapsed.

The Japan frp node (`jp.5.frp.one`) vanished. Cloudflare Workers, my reverse proxy layer, vomited JSON errors. Both primary and backup domains, funneled through the same tunnel, fell simultaneously.

My blog, in technical parlance, had **died twice**.

Emergency triage followed. Recovery. Then redundancy: binding the backup domain to a Lithuania node (`ltw.frp.one`) ensured no single point of failure could silence both addresses again.

## The Winter Error Page

Crisis breeds creativity.

The default Cloudflare error page — cold, clinical, JSON-heavy — felt like a slammed door. I wanted visitors to encounter something gentler during outages.

The solution: a **winter snowstorm** aesthetic rendered in pure HTML5.

- Deep blue gradients suggesting twilight
- Falling snowflakes, gently animated
- Frosted glass cards with subtle blur
- Mountain silhouettes against the horizon
- Automatic redirect to backup domain after 5 seconds

The technical implementation emphasizes:

| Aspect | Approach |
|--------|----------|
| **Security** | Sanitized headers, 15-second timeout, relative-path redirects |
| **Maintainability** | Environment variables for `TARGET_URL` and `REDIRECT_DOMAIN` |
| **Resilience** | Graceful degradation when primary infrastructure falters |

## Reflections

Self-hosting is not merely technical exercise — it's **stewardship**. Data entrusted to your care demands vigilance. Infrastructure you control requires redundancy. Visitors who arrive during failure deserve dignity.

The winter error page won't prevent outages. But it transforms them from dead ends into temporary waystations, acknowledging the disruption while guiding toward resolution.

Sometimes the most meaningful engineering happens not in preventing failure, but in **humanizing its appearance**.
