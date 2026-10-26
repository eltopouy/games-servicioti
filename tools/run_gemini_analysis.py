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

bg_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile\pinamar_mediodia_gemini.webp"
im = Image.open(bg_path)

prompt = """Analiza con absoluta precision esta ilustracion del paisaje de Pinamar (Costa de Oro, Canelones, Uruguay).
Dimensiones: 2048 x 1152.
Necesito que determines las coordenadas exactas X (de 0 a 100 de izquierda a derecha) e Y (de 0 a 100 de arriba a abajo) donde debe apoyarse la base o patas de cada una de estas aves uruguayas:

Aves:
1. hornero: Hornero comun. Debe posarse apoyado de pie en una rama horizontal, poste de madera o cumbre, SIN nido de barro.
2. tero: Tero uruguayo. Debe estar apoyado firmemente en el suelo o pasto / banquina terrosa.
3. benteveo: Benteveo. En una rama de arbol o pino claramente visible.
4. cotorra: Cotorra verde. En la copa o rama alta de pino o eucalipto.
5. cardenal: Cardenal de copete rojo. En rama de arbusto o ceibo con follaje.
6. zorzal: Zorzal colorado. En el cesped/pasto picoteando o en rama baja.
7. chingolo: Chingolo. Sobre el poste del alambrado o valla de madera.
8. gaviota: Gaviota cocinera. En el cielo volando libremente en la zona abierta superior, o sobre la arena.
9. tordo: Tordo renegrido (ave completamente negra). En cable o poste o banquina de pasto.

Devuelve UNICAMENTE un JSON valido con esta estructura:
{
  "analisis_elementos": "descripcion de los arboles, valla, postes, casas y suelo visibles",
  "perchas": {
    "hornero": {"pctX": 35.0, "pctY": 45.0, "descripcion": "apoyado en..."},
    "tero": {"pctX": 55.0, "pctY": 88.0, "descripcion": "en el pasto al borde de la calle..."},
    "benteveo": {"pctX": 18.0, "pctY": 50.0, "descripcion": "..."},
    "cotorra": {"pctX": 25.0, "pctY": 18.0, "descripcion": "..."},
    "cardenal": {"pctX": 68.0, "pctY": 42.0, "descripcion": "..."},
    "zorzal": {"pctX": 80.0, "pctY": 78.0, "descripcion": "..."},
    "chingolo": {"pctX": 30.0, "pctY": 68.0, "descripcion": "..."},
    "gaviota": {"pctX": 75.0, "pctY": 20.0, "descripcion": "volando en cielo abierto..."},
    "tordo": {"pctX": 45.0, "pctY": 75.0, "descripcion": "en valla o suelo..."}
  }
}
"""

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=[im, prompt]
)

print(response.text)
with open(r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\tools\analisis_perchas.json", "w", encoding="utf-8") as f:
    f.write(response.text)
