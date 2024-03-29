# make sure that the server is running (in src folder run `python manage.py runserver`` )

import requests
import json
from pathlib import Path

# change this to the desired ID
SCENARIO_ID = 1
folder = "anylogiclocal"
FOLDER = Path(__file__).parent / folder
FOLDER.mkdir(exist_ok=True)


r = requests.get(f"http://localhost:8000/wt/api/nextjs/v2/datamodel/{SCENARIO_ID}/")

dicto = r.json()

outputs = ["actors", "gridconnections", "gridnodes", "policies"]
for output in outputs:
    with open(FOLDER / f"{output}.txt", "w") as outfile:
        outfile.write(json.dumps(dicto[output], indent=4))
