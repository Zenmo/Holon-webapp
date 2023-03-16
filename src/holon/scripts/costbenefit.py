def run():
    import json
    from pathlib import Path
    from holon.services import CostBenedict

    fp = Path(__file__).parent / "fixtures" / "outputs-anylogic-holon.json"

    with open(fp, "r") as infile:
        outcomes = json.load(infile)

        actors: dict = outcomes["actors"]

    def dprint(d: dict) -> None:
        print(json.dumps(d, indent=2))

    dprint(CostBenedict(actors=actors).determine_group_costs())
