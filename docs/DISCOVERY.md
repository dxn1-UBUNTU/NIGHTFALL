# Discovery model

Discovery is intentionally layered:

- **Certificate Transparency:** passive hostname discovery from public certificates.
- **Page/asset extraction:** hostnames seen in HTML, redirects, CSP, robots, and sitemaps.
- **Optional DNS wordlist:** explicit opt-in, bounded concurrency, and rate-limited. This is disabled by default.
- **DNS verification:** A/AAAA/CNAME records are collected for each discovered hostname.
- **HTTP verification:** reachable HTTPS/HTTP endpoints are checked with bounded response size.
- **Crawl queue:** every reachable in-scope host is crawled separately.
- **Surface extraction:** URLs, links, forms, query parameters, route families, auth/login clues.
- **Takeover candidates:** CNAME/provider/error fingerprints only; no resource claiming.

Password fields are reported as metadata and excluded from automated probe injection.
