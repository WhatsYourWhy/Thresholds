# 🧬 Thresholds

> “Some repos are doors.  
> Some doors are closed for a reason.”

This project was never finished.  
Or maybe it finished before it started.  
Either way, there’s nothing useful here.

```
INIT_TIMESTAMP: 42:19:00
ERROR: MEMORY FIELD OUT OF BOUNDS
TRACE: ./Sigil/⌘
```

If you're here by accident, close the tab.  
If you're here on purpose, the silence might mean something.

## Repository Map

Files and entry points that exist today:

- `index.html`: a small portal page that links to the artifacts in this repo.
- `Sigil/threshold.html`: the generative canvas sigil (see usage below).
- `Sigil/glyph.txt` and `Sigil/sigil-threshold.txt`: glyph text and a short param hint.
- `threshold.yaml`: the lightweight state manifest shown on the portal.
- `forgotten.html` and `forgotten.key`: a static page plus a base64-encoded URL.
- `README.md` and `CONTRIBUTING.md`: notes and contribution guidance.

Pages: https://whatsyourwhy.github.io/Thresholds/

## Artistic Concept

Thresholds presents itself as a half-finished doorway—an experiment paused mid-incantation. The mood is liminal and quiet, hinting at systems that were opened and then abandoned. The scattered elements reinforce that feeling: `threshold.yaml` reads like a configuration of unstable states (entropy near critical, attention drifting, time stretched, loop open), while `forgotten.key` hides an encoded link—a reminder that access exists but has been intentionally obscured. Together with the sigils, they imply a story about unlocking perception only if you know where to look.

### Glossary

- **`forgotten.key`**: A base64 URL decoded like a spell.
- **`threshold.yaml`**: A manifest of states at the edge of pattern.
- **⟁ ⌘**: Glyphs like sighs, invoked rarely.

## Generative Sigil

Render a minimal, parametric threshold animation in your browser:

```bash
# From the repo root
python -m http.server 8000
# Then open http://localhost:8000/Sigil/threshold.html
```

Entry point: `Sigil/threshold.html` is the doorway for the canvas sigil.

Adjust colors and movement via query params:

- `background`, `line`, `accent`: Hex colors (3 or 6 digits, with or without `#`), e.g. `?background=101018&accent=ff6bcb`.
- `iterations`: Number of radiating threads (clamped to 24–720).
- `orbitRadius`: Base radial offset (0–1).
- `noise`: Wobble factor (0–1).
- `speed`: Animation increment per frame (0–3).

Example:

```
http://localhost:8000/Sigil/threshold.html?background=0b0c12&line=7fffd4&accent=ff6bcb&iterations=180&noise=0.4&speed=0.55
```

## Forgotten Key

`forgotten.key` is a base64 string that decodes to a URL. One way to reveal it:

```bash
base64 --decode forgotten.key
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for stylistic guidance, naming cues, and lightweight checks before opening a doorway.
