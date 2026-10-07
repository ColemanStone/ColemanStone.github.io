# Color War on the web

The published game is in this folder. The sibling `ColorWarGame-website` folder is the original export, not the active version.

## Files to edit

- `index.html`: Pygbag loader and webpage markup. Its first script contains **Python**, not JavaScript. Do not run an HTML/JavaScript formatter over that script.
- `mobile.css`: responsive page layout and touch-sized buttons.
- `controls.js`: queues button actions and displays simulation status.
- `source/assets/ColorWarGame.py`: simulation, save/load, and the bridge to webpage controls.

The browser loads Python from `src.tar.gz` (or `src.apk` on itch hosting). After editing files inside `source`, run from the repository root:

```sh
python3 colorwar/rebuild.py
```

Commit the source and both rebuilt archives together. Changes to HTML, CSS, or JavaScript do not need repacking. The game still downloads its Python runtime from the Pygbag CDN.

## Check before publishing

Preview with `python3 -m http.server 8000`, then open `http://localhost:8000/colorwar/`.

1. Start the game and wait for the webpage controls to become enabled.
2. Pause and resume, then save a world.
3. Start a new world and load the saved one. Confirm the map is restored.
4. Check a narrow phone screen and landscape orientation.
5. Test Safari on an actual iPhone. Desktop viewport emulation does not verify iOS behavior.

The web version uses full-size webpage controls; desktop Python launches retain the original Pygame toolbar. Both call the same simulation actions. Saving uses one local browser slot and does not sync between devices.
