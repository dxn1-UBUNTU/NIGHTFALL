# XSS-style reflection canaries

Non-executing reflection/context probes designed to reveal whether input is reflected and whether delimiter/encoding behavior changes across contexts.

Every `.json` file is an independent probe artifact. Files are loaded lazily, one at a time, in stage order.
