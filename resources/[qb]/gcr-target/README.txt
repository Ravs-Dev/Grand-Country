GCR QB-TARGET (HOLD ALT + 2-STAGE LEFT CLICK)

1. BACK UP your qb-target resource.
2. Extract this package anywhere.
3. On Windows open a terminal and run:
   py apply_patch.py "C:\path\to\resources\[qb]\qb-target"
   (Replace the example with your actual qb-target folder.)
4. In FiveM server console run: restart qb-target

Controls:
- Hold Left ALT: show target eye.
- Look at a target: eye turns orange and options show.
- First left click: focus/unlock NUI cursor; menu remains visible.
- Next left click ON an option: execute that specific action.
- Release ALT: close targeting. ESC also closes it.

Test within the game. This patch was prepared against the main branch source
inspected on Oct 9, 2026; behavior has not been verified in a live FiveM server.

Important: if your custom target uses an incompatible old client.lua or if your
resource is named something else, install it against the correct source.
Backups are stored as .gcr-backup beside modified files.
