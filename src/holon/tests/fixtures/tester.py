import numpy as np
import requests

url = "https://holontool.nl/wt/api/nextjs/v2/holon/"

results = []
values = np.linspace(0, 100, 25)
for i in range(25):

    print(f"calling for the {i}th time")
    r = requests.post(
        url=url,
        json={
            "interactive_elements": [{"interactive_element": 3,"value":values[i]}],
            "scenario": 1
        }
    )
    print(f"got response {i}")
    response = r.json()['cost_benefit_results']['overview']
    results.append(response)