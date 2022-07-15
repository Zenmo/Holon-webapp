from rest_framework.decorators import api_view
from rest_framework.response import Response
from holon.anylogic import handle_request

@api_view(["GET"])
def calculationView(request):
    """
    Connects the AnyLogic Cloud API to the open model demo.

    Current implementation accepts a JSON formatted as:
        dict [ dict, dict, bool, bool]

    Example:
    >>> import requests
    >>> import json
    >>> MOCK_REQUEST = {
    >>>     "neighbourhood1": {"evadoptation": 70, "solarpanels": 40, "heatpumps": 0},
    >>>     "neighbourhood2": {"evadoptation": 70, "solarpanels": 60},
    >>>     "heatholon": False,
    >>>     "windholon": False,
    >>> }
    >>> base_url = "http://localhost:8000/calculation/"
    >>> payload = MOCK_REQUEST
    >>> r = requests.get(url=base_url, json=payload)
    >>> results = r.json()
    >>> print(json.dumps(results, i))
    {
        "local": {
            "affordability": "5817",
            "reliability": "?",
            "renewability": "5",
            "selfconsumption": "60"
        },
        "national": {
            "affordability": "5817",
            "reliability": "?",
            "renewability": "5",
            "selfconsumption": "60"
        }
    }
    """

    results = handle_request(request.data)

    return Response(results)
