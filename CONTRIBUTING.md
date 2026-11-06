# Publishing to the Tap Store

The Store is this file, `registry.json`: one JSON array anyone can add to. Publishing is one pull request:

1. Fork this repo and add your entry to `registry.json` (keep the array sorted by `id`; copy a starter entry and change every field).
2. Open the PR. A GitHub Action fetches your `tapsJson` URL and checks it against the manifest rules (id, name, version, runtime, pages, abilities shaped like the repo's own starters).
3. When the Action is green and the entry is merged, every TAPs shows your tap under Community within a day (Settings › Store › Refresh fetches it at once).

Entry fields:

- `id`: lowercase letters, digits and dashes, starting with a letter. Must match the `id` inside your taps.json.
- `name`, `version`, `description`: shown on your Store card. The description is one or two sentences.
- `author`: your name or handle.
- `repo`: the HTTPS clone URL of the repo holding your tap.
- `subdir`: optional path inside the repo when the tap is not at the root (as the starters are).
- `tags`: up to six short search words.
- `runtime`: `bun`, `node`, `frankenphp`, `static` or `self`. Must match your taps.json.
- `tapsJson`: the raw HTTPS URL of your taps.json (so TAPs and the Action can read the manifest without cloning).
- `icon`: an HTTPS image URL, or `""` for the default glyph tile.
- `verified`: always `false` in a PR. Nothing is verified until the TAPs owner says how.

Rules: one entry per tap; HTTPS URLs only; no placeholders. A tap that phones home, mines, or asks for credentials it does not need is removed.
