# Contributing to Thresholds

Thresholds is intentionally liminal. Contributions should feel like whispers between doors rather than routine commits. Keep language and naming evocative, mystical, and slightly uncanny. Avoid mundane labels; favor threshold-aware terms that hint at portals, echoes, or sigils.

## Stylistic Constraints

- **Tone**: Write prose that is quiet, invitational, and a bit haunted. Avoid corporate phrasing.
- **Naming**: Choose names that sound like artifacts (e.g., `liminal-thread`, `soft-sigil`, `echo-step`). Refrain from bland or hyper-technical identifiers.
- **Narrative cues**: Small hints are welcome—short descriptions that imply a ritual or doorway. Keep them subtle.

## Proposing New Artifacts

1. Sketch the intent in a short note within the file or adjacent `README` block: what threshold it explores, what sense it should evoke.
2. Place the artifact where it aligns with its form:
   - Visual or interactive pieces belong in `Sigil/`.
   - Textual lore or glossaries live near the root alongside `README.md` and `threshold.yaml`.
   - Keys, seeds, or encoded hints should be clearly named but still thematic (e.g., `whisper.key`).
3. If adding something entirely new, include a minimal usage or preview snippet so others can witness it without guesswork.

## Preferred Organization

- Keep root files sparse and purposeful: manifest-like configs (`*.yaml`), keys, and top-level guidance.
- Keep each sigil or visual experiment self-contained under `Sigil/`, including any supporting assets.
- Avoid sprawling subfolders; depth should feel intentional, like descending steps rather than clutter.

## Lightweight Checks

There is no enforced toolchain, but contributors are encouraged to run quick sanity passes:

- For HTML/CSS/JS changes: `npx prettier@latest --check Sigil/threshold.html`
- For general review: serve locally to confirm the atmosphere holds: `python -m http.server 8000` and open `http://localhost:8000/Sigil/threshold.html`

If you add new scripts, include a one-line command to exercise them.
