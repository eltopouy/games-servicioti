import os
from google import genai
from PIL import Image

env_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\clima_blogger_automation\.env"
api_key = ""
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip()

client = genai.Client(api_key=api_key)
assets_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"

birds = ["tordo", "benteveo", "cardenal", "chingolo", "cotorra", "zorzal", "tero", "gaviota"]

for b in birds:
    f_path = os.path.join(assets_dir, f"{b}_reposo_trans.webp")
    if not os.path.exists(f_path):
        continue
    im = Image.open(f_path)
    res = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=[im, "Responde en 1 linea: ¿Este pajaro tiene una rama o tronco de madera debajo de sus patas, o esta parado solo sobre sus patitas/garras en el aire limpio?"]
    )
    print(f"{b}: {res.text.strip()}")
