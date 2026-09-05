# Architecture

NIGHTFALL is split into five layers:

1. **TUI** — presentation and user interaction only.
2. **Discovery** — subdomains, DNS, HTTP surface mapping, forms, auth surfaces.
3. **Analysis** — passive/differential security modules and probe orchestration.
4. **Persistence/reporting** — JSON state and reproducible report bundles.
5. **Safety/policy** — authorization, scope, private-address rules, request budgets.

Every discovered host becomes a `HostRecord`, is checked independently, and gets its own crawl budget. The root authorization is inherited only when the host remains under the authorized apex domain.
