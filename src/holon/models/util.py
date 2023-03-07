import json
from pathlib import Path

from django.db.models import Model
from django.db import models

base_path = Path(__file__).parent.parent / "services" / "jsons"
base_path.mkdir(exist_ok=True, parents=True)


def write_payload_to_jsons(payload_dict: dict, name: str) -> None:
    for key, json_output in payload_dict.items():
        variable_filename = f"{name}_{key}.json"
        fp = base_path / variable_filename
        with open(fp, "w") as outfile:
            json.dump(json_output, outfile, indent=2)


def all_subclasses(cls) -> set[Model]:
    return set(cls.__subclasses__()).union(
        [s for c in cls.__subclasses__() for s in all_subclasses(c)]
    )


def duplicate_model(obj, attrs={}):
    obj.pk = None
    obj.id = None

    # for copying polymorphic models with multiple levels of inheritance
    # https://stackoverflow.com/a/74999379/19602496
    for field in obj._meta.get_fields(include_parents=True):
        if not isinstance(field, models.OneToOneField):
            continue

        # Test this is a pointer to something in our own inheritance tree
        if not isinstance(obj, field.related_model):
            continue

        setattr(obj, field.attname, None)

    # modify attributes
    for key, value in attrs.items():
        setattr(obj, key, value)

    obj.save()
    return obj
