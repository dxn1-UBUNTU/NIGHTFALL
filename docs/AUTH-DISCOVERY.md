# Authentication discovery

NIGHTFALL identifies login/auth surfaces without attempting credential attacks. It uses URL heuristics, page language, form structure, password inputs, identity fields, hidden token-like inputs, and script-referenced authentication routes.

For each password input the tool records a selector such as `#password` or `[name="password"]`. These fields are marked `LOCKED` and are excluded from automated payload testing by default.

Non-password query and form fields are represented as test points. The safe payload corpus can be used against suitable query parameters for reflection/parser analysis; form submission is not automated in this release to avoid unintended state changes.
