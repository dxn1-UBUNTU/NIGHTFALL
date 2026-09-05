# Domain takeover candidates

NIGHTFALL checks every discovered in-scope hostname for suspicious CNAME relationships. It records CNAME targets, provider suffixes, and response fingerprints associated with deprovisioned services.

A result is always a **candidate**, not proof of exploitability. NIGHTFALL never attempts to create, claim, register, or modify a third-party resource. Manual verification of DNS ownership and the provider account is required.
