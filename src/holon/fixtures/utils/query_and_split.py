# make sure that the server is running (in src folder run `python manage.py runserver`` )

import json
from pathlib import Path

import requests

# change this to the desired ID
SCENARIO_ID = 321001
folder = "anylogiclocal"
FOLDER = Path(__file__).parent / folder
FOLDER.mkdir(exist_ok=True)

local = False

if local:
    url = f"http://localhost:8000/wt/api/nextjs/v2/datamodel/{SCENARIO_ID}/"
else:
    url = f"https://holontool.nl/wt/api/nextjs/v2/datamodel/{SCENARIO_ID}/"


r = requests.get(url)

dicto = r.json()

outputs = ["actors", "gridconnections", "gridnodes", "policies"]
for output in outputs:
    with open(FOLDER / f"{output}.txt", "w") as outfile:
        outfile.write(json.dumps(dicto[output], indent=4))
