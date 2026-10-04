# Color War — original simulation for the web

This adapts `src/ColorWarGame.py`, not the simplified simulation. It retains the original territory simulation, 200 initial factions, personalities, diplomacy, fusion, mergers, mutations, rebellions, disasters, regeneration, and world events.

## Add it to ColemanStone.github.io

1. Unzip `ColorWarGame-website.zip`.
2. Copy its `colorwar` folder into the published root of the `ColemanStone.github.io` repository, alongside the existing homepage.
3. Add `<a href="/colorwar/">Play Color War</a>` to the homepage.
4. Commit and push these files. Once GitHub Pages deploys, visit `https://colemanstone.github.io/colorwar/`.

No Python server is required. The first visit downloads a Python browser runtime from the Pygbag CDN, so loading can take time. This is not an offline bundle.

## Controls and differences

- The simulation starts automatically after clicking the loading page.
- **Save / Load** use one save slot in this browser on this website. Clearing site data removes the save; it does not sync between devices. Desktop `.cwgsave` imports and downloads are not included in this browser version.
- **New Game** starts a new world; **Pause / Resume** stops and resumes it.
- The browser uses a 200 × 116 cell grid in a 1200 × 746 canvas, instead of sizing the simulation to the desktop monitor. This reduces browser workload while retaining 200 initial factions.
- This is the original mechanics as implemented in the repository. Some original behavior names are labels rather than distinct implemented strategies.

## Build from source

Use Python 3.12+ in a virtual environment:

```
pip install -r requirements-web.txt
python -m pygbag --build src
```

Copy the contents of `src/build/web/` into your website's `colorwar/` directory. Keep all generated files together. Test over HTTP rather than opening the HTML file directly:

```
python -m http.server 8000 --directory src/build/web
```

Then visit `http://localhost:8000`.

## Validation

```
pip install pytest
python -m pytest tests -q
```

Tests cover the existing color blending/theme checks, 105 cycles of the original simulation, browser-save round-tripping through a storage substitute, rejected invalid saves, claim-age resets when ownership changes, and toolbar input. Browser testing also verified startup, live simulation, Pause, Save, New Game, and Load.

## Implementation notes

The original background simulation now yields one tick at a time to an async Pygame loop. New Game replaces that iterator instead of launching extra threads. This fixes the blank startup and concurrent simulation loops. Dominant-faction calculations move outside the per-cell loop, respawn attempts are bounded, changed-cell ages reset correctly, and the map redraws after events. Desktop save loading uses `ast.literal_eval` instead of executable `eval`.

The browser toolbar is drawn using Pygame directly, avoiding pygame_gui font resources that fail in the browser runtime. Desktop launches retain pygame_gui. Pygbag supplies its compatible browser pygame-ce runtime.
