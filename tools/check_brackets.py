import re

with open(r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html", "r", encoding="utf-8") as f:
    text = f.read()

scripts = re.findall(r"<script>(.*?)</script>", text, re.DOTALL)
js = scripts[0]
lines = js.split("\n")

stack = []
for i, line in enumerate(lines):
    # remove single line comments
    clean = re.sub(r"//.*", "", line)
    for col, ch in enumerate(clean):
        if ch == "{":
            stack.append((i + 1, col + 1))
        elif ch == "}":
            if len(stack) == 0:
                print(f"Extra closing bracket at line {i+1}: {line}")
            else:
                stack.pop()

print("Remaining open brackets in stack:", len(stack))
if stack:
    for item in stack:
        print(f"Unclosed opening bracket at line {item[0]}, col {item[1]}: {lines[item[0]-1]}")
