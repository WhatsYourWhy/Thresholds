# Thresholds audit: proposed fixes

## Typo fix

- **Threshold sigil header text**: The sigil page header reads “Threshold Signal,” which appears to be a typo given the page title and README references to “sigil.” Update the header to “Threshold Sigil” for consistency.【F:Sigil/threshold.html†L78-L92】【F:README.md†L33-L36】

## Bug fix

- **Static test server path resolution**: The test server joins `root` with a request path that still includes a leading `/`. `path.join(root, safePath)` ignores `root` when `safePath` is absolute, resulting in false 403s for legitimate files. Strip the leading slash before joining so `/Sigil/threshold.html` is served correctly.【F:tests/sigil.spec.js†L16-L55】

## Documentation discrepancy

- **Query parameter naming mismatch**: `Sigil/sigil-threshold.txt` lists “threads,” but the actual parameter is `iterations` (per the sigil implementation and README). Update the hint text to use the real parameter name to avoid confusion.【F:Sigil/sigil-threshold.txt†L1-L3】【F:Sigil/threshold.html†L103-L176】【F:README.md†L56-L74】

## Test improvement

- **Reduce timing flakiness in the Playwright test**: The test waits a fixed 900 ms before sampling pixels. Replace the timeout with a polling wait (e.g., `expect.poll` or `page.waitForFunction`) that detects when the canvas contains non-background pixels, making the test faster and less flaky across environments.【F:tests/sigil.spec.js†L71-L124】
