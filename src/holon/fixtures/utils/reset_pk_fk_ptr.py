import json

fp = "../peter-datamodel-fixture.json"
fp_out = "../peter-datamodel-fixture_clean_keys.json"

fp = "../datamodel-tvw-fixture.json"
fp_out = "../datamodel-tvw-fixture_clean_keys.json"

BASE_INT = 321000  # change me!

relations = set(
    [
        "group",
        "subgroup",
        "payload",
        "pk",
        "gridconnection",
        "parent_heat",
        "owner_actor",
        "actor",
        "gridnode",
        "parent",
        "contractScope",
        "parent_electric",
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