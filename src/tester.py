# tester.py

import requests

r = requests.post(
    url="http://localhost:8000/wt/api/nextjs/v2/holon/",
    json={
        "interactive_elements": [],
        "scenario": 1,
    },
)


# for key, value in r.json()["dashboard_results"]["local"].items():
#     print(key, type(value))
