import json

# fp = "../peter-dupliceter-datamodel-fixture.json"
# fp_out = "../peter-dupliceter-datamodel-fixture_clean_keys.json"

fp = "../jorrit/ref/tvw-PRESCALEUP.json"
fp_out = "../jorrit/ref/tvw-CLEANSMALL.json"

BASE_INT = 444000  # change me!

relations = set(
    [
        "actor",
        "anylogic_model_configuration",
        "contractScope",
        "gridconnection",
        "gridnode",
        "group",
        "input",
        "interactive_element_option",
        "owner_actor",
        "parent_electric",
        "parent_heat",
        "parent",
        "payload",
        "pk",
        "related_config",
        "related_interactive_element",
        "rule",
        "scenario",
        "subgroup",
    ]
)

with open(fp, "r") as _infile:
    db = json.load(_infile)


for object in db:
    for key, value in object.items():
        if isinstance(value, int):
            relations.add(key)

        if key == "fields":
            for field, field_value in value.items():
                if "ptr" in field:
                    relations.add(field)

print("relations found:")
for r in relations:
    print(r)


for object in db:
    for r in relations:
        try:
            object[r] += BASE_INT
        except:
            pass
    for r in relations:
        try:
            object["fields"][r] += BASE_INT
        except:
            pass


with open(fp_out, "w") as _outfile:
    json.dump(db, _outfile)
