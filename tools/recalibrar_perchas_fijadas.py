import os
import json
from google import genai
from PIL import Image

env_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\clima_blogger_automation\.env"
api_key = ""
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip()

client = genai.Client(api_key=api_key)

base_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti"
mediodia_img = Image.open(os.path.join(base_dir, "assets_mobile", "pinamar_mediodia_gemini.webp"))
costa_img = Image.open(os.path.join(base_dir, "assets_mobile", "pinamar_costa_gemini.webp"))

prompt_template = """Eres un experto en ornitologia y composicion visual para videojuegos infantiles.
Observa esta ilustracion panoramica 16:9 de Pinamar, Uruguay (2048 x 1152).
TODOS los pajaritos estan de pie sobre sus patitas (sprites en pose posada, reposando o cantando).
REGLA ESTRICTA Y ABSOLUTA: NINGUN PAJARITO PUEDE QUEDAR FLOTANDO EN EL AIRE. Todos deben estar fisicamente asentados y apoyados en algo solido:
- Una rama solida de arbol o arbusto
- Un cable o alambre de alambrado o tendido electrico
- La punta o travesaño de un poste o columna
- El suelo firme (calle de balasto, pasto, arena de playa)

En especial la GAVIOTA COCINERA: no esta volando, esta de pie. Debe posarse apoyada en el suelo arenoso de la calle/playa, o sobre un cable/travesaño de poste, o en el piso.

Determina las coordenadas X (0 a 100) e Y (0 a 100) exactas para las 9 aves uruguayas:
1. cotorra
2. hornero
3. benteveo
4. gaviota
5. cardenal
6. zorzal
7. chingolo
8. tero
9. tordo

Devuelve UNICAMENTE un JSON valido con esta estructura:
{
  "fondo": "{NOMBRE_FONDO}",
  "perchas": {
    "cotorra": {"pctX": 0.0, "pctY": 0.0, "soporte": "descripcion del cable/rama/poste donde se apoya"},
    "hornero": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "benteveo": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "gaviota": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "cardenal": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "zorzal": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "chingolo": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "tero": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."},
    "tordo": {"pctX": 0.0, "pctY": 0.0, "soporte": "..."}
  }
}
"""

print("Analizando Pinamar Mediodia...")
res_mediodia = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=[mediodia_img, prompt_template.replace("{NOMBRE_FONDO}", "mediodia")]
)

print("Analizando Pinamar Costa...")
res_costa = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=[costa_img, prompt_template.replace("{NOMBRE_FONDO}", "costa")]
)

with open(os.path.join(base_dir, "tools", "perchas_calibradas_mediodia.json"), "w", encoding="utf-8") as f:
    f.write(res_mediodia.text)

with open(os.path.join(base_dir, "tools", "perchas_calibradas_costa.json"), "w", encoding="utf-8") as f:
    f.write(res_costa.text)

print("¡Analisis de Vision completado con exito!")
