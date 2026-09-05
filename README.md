# NIGHTFALL 0.4.1 — Bun Edition

NIGHTFALL is a terminal security assessment workstation for systems you own or have explicit permission to assess. The design goal is a clean, keyboard-driven TUI with a real attack-surface map underneath it.

## What is new in 0.4

- Domain-root authorization with automatic subdomain scoping; accepted subdomains are independently resolved, checked, and crawled within the host budget.
- Passive certificate-transparency discovery plus optional, bounded DNS wordlist discovery.
- Every discovered subdomain is resolved, checked, queued, and independently crawled until the configured host budget is exhausted.
- Login/authentication surface discovery: route heuristics, forms, password field metadata, CSRF-like hidden fields, username/email fields, script-referenced auth routes, likely auth actions, and a dedicated test-point map.
- Test-point mapping: query parameters and non-password form fields are recorded as potential controlled-test locations.
- Passive dangling-service/domain-takeover candidate detection through DNS CNAME + provider fingerprints. NIGHTFALL never attempts to claim an orphaned resource.
- Progressive, file-backed canary corpus: 2,304 JSON probe files loaded one at a time.
- Findings preserve the exact probe ID and file path that generated a signal.
- Rich TUI with Dashboard, Surface Map, Hosts, Auth, Findings, Probes, Scan Queue, Settings, History, Logs, Help.
- JSON + Markdown report bundles.
- No AI dependency.

## Safety

NIGHTFALL is safe-by-default and authorization-scoped. Before a target scan begins, the target apex/root domain must be in `authorizedRoots` or explicitly authorized through the TUI confirmation gate. All discovered hosts are restricted to that authorized domain suffix. Private-network access is disabled by default.

Password fields are **discovery-only by default**. NIGHTFALL records where the field is and what form owns it, but it does not inject probes into password fields or perform credential attacks.

The shipped XSS and SQLi corpora are non-executing / non-auth-bypass canaries intended to identify reflection and parser/error behavior. No destructive exploitation, credential theft, persistence, or automated WAF-bypass behavior is included.

## Run

```bash
bun install
bun src/main.ts
```

Then just run:

```bash
nightfall
```

Use `a` from the Targets screen to add an authorized root, then `Enter` to start discovery.

## Headless

```bash
NIGHTFALL_AUTHORIZED_ROOTS=example.test bun src/main.ts --url https://example.test --headless
```

The environment variable is intentionally explicit because headless scans must not silently authorize arbitrary hosts.

## Keymap

`q` quit • `Tab`/`Shift+Tab` move screens • `j/k` or arrows navigate • `Enter` select/start • `a` add target • `d` start discovery • `r` refresh current view • `s` save settings • `[`/`]` payload budget • `+/-` concurrency • `?` help • `Esc` close modal.
