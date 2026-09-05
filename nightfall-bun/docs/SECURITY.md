# Security boundary

NIGHTFALL does not provide a mechanism to remove scope restrictions from an active scan. The engine checks scope before enqueuing a URL, before DNS discovery is accepted, and before an HTTP request is sent.

High-impact classes such as credential stuffing, secret extraction, destructive payloads, persistence, exploit chaining and automatic takeover claims are out of scope for the shipped scanner.
