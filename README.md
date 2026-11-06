# taps.store

The public Tap Store registry: `registry.json` lists the taps every TAPs can install. See [CONTRIBUTING.md](CONTRIBUTING.md) to publish yours in one pull request.

TAPs reads the raw file:

`https://raw.githubusercontent.com/kojo-jeffery/taps.store/main/registry.json`

Entries marked `builtin` ship inside TAPs itself and are never installed. Nothing is `verified` until the TAPs owner says how.

MIT licensed.
