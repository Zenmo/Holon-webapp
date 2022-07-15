from rest_framework.decorators import api_view
from rest_framework.response import Response
from holon.serializers import CalculationSerializer
from holon.models import Calculation

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


@api_view(["GET"])
def calculationView(request):
    """
    Connects the AnyLogic Cloud API to the open model demo.
    """

    inputs = Calculation.objects.all()
    serializer = CalculationSerializer(inputs)

    return Response(MOCK_RESULTS)
