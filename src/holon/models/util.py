import json
from pathlib import Path
from django.db.models import Model

base_path = Path(__file__).parent.parent / "services" / "jsons"
base_path.mkdir(exist_ok=True, parents=True)


def write_payload_to_jsons(payload_dict: dict, name: str) -> None:
    for key, json_output in payload_dict.items():
        variable_filename = f"{name}_{key}.json"
        fp = base_path / variable_filename
        with open(fp, "w") as outfile:
            json.dump(json_output, outfile, indent=2)


def all_subclasses(cls) -> list[Model]:
    return set(cls.__subclasses__()).union(
        [s for c in cls.__subclasses__() for s in all_subclasses(c)]
    )


def duplicate_model(obj, attrs={}):
    obj.pk = None

    for key, value in attrs.items():
        setattr(obj, key, value)

    obj.save()
    return obj


from django.db.migrations.operations.models import ModelOptionOperation


class RemoveModelBasesOptions(ModelOptionOperation):
    def __init__(self, name):
        super().__init__(name)

    def deconstruct(self):
        kwargs = {
            "name": self.name,
        }
        return (self.__class__.__qualname__, [], kwargs)

    def state_forwards(self, app_label, state):
        from ..models.filter import Filter

        model_state = state.models[app_label, self.name_lower]
        model_state.bases = (Filter,)
        state.reload_model(app_label, self.name_lower, delay=True)

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        pass

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        pass

    def describe(self):
        return "Remove bases from the model %s" % self.name

    @property
    def migration_name_fragment(self):
        return "remove_%s_bases" % self.name_lower
