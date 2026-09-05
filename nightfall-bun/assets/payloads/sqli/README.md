# SQL parser/error canaries

Non-auth-bypass parser-boundary probes designed to reveal database error disclosure or notable response differentials without data extraction.

Every `.json` file is an independent probe artifact. Files are loaded lazily, one at a time, in stage order.
