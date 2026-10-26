import os
import re

base = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti"
with open(os.path.join(base, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

m = re.search(r"const BIRDS = (\{.*?\n  \});", html, re.DOTALL)
if m:
    print("BIRDS block found!")
    assets = re.findall(r'"((?:assets_mobile|assets_pokemon|audio)/[^"]+)"', m.group(1))
    missing = 0
    for a in sorted(set(assets)):
        clean_a = a.split("?")[0]
        p = os.path.join(base, clean_a.replace("/", os.sep))
        exists = os.path.exists(p)
        if not exists:
            print(f"[MISSING] {a}")
            missing += 1
        else:
            print(f"[OK] {a}")
    if missing == 0:
        print("\nALL ASSETS ARE PERFECTLY PRESENT ON DISK!")
    else:
        print(f"\n{missing} ASSETS MISSING!")
else:
    print("BIRDS block NOT found")
