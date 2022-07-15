from rest_framework.decorators import api_view
from rest_framework.response import Response

MOCK_RESULTS = {
    "local": {
        "affordability": "5817",
        "reliability": "?",
        "renewability": "5",
        "selfconsumption": "60",
    },
    "national": {
        "affordability": "5817",
        "reliability": "?",
        "renewability": "5",
        "selfconsumption": "60",
    },
}


MOCK_REQUEST = {
    "neighbourhood1": {"evadoptation": 70, "solarpanels": 40, "heatpumps": 0},
    "neighbourhood2": {"evadoptation": 70, "solarpanels": 60},
    "heatholon": False,
    "windholon": False,
}


@api_view(["GET"])
def calculationView(request):
    """
    Connects the AnyLogic Cloud API to the open model demo.

    Current implementation accepts:


    """

    return Response(MOCK_RESULTS)
