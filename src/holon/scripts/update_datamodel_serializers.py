import importlib
from django.db import models
import inspect
from jinja2 import Template
from pathlib import Path


def run():
    ## GLOBALS
    MODS = [
        ("actor", "Actor"),
        ("contract", "Contract"),
        ("gridconnection", "GridConnection"),
        ("asset", "EnergyAsset"),
        ("gridnode", "GridNode"),
        ("policy", "Policy"),
    ]

    fp_serializer = Path("holon/serializers/datamodel").resolve()
    fp_templates = Path("holon/scripts/templates").resolve()
    fp_subserializers = fp_serializer / "subserializers.py"
    fp_mapper = fp_serializer / "mapper.py"
    custom_serializer_module = "custom"

    outputs = []

    ## LOOP
    for module_name, main_class in MODS:
        module_name = f"holon.models.{module_name}"

        module = importlib.import_module(module_name)

        subclasses = []

        for object in module.__dict__.values():
            if inspect.isclass(object):
                is_model = issubclass(object, models.Model)
                is_this_module = object.__module__ == module_name
                is_not_main_cls = object.__name__ != main_class

                if is_model and is_this_module and is_not_main_cls:
                    subclasses.append(object.__name__)

        outputs.append({"module": module_name, "main_class": main_class, "subclasses": subclasses})

    ## Write to files
    with open(fp_templates / "subserializers.py.j2", "r") as infile:
        template_string_sub = infile.read()
        template_sub = Template(template_string_sub)
        with open(fp_subserializers, "w") as outfile:
            outfile.write(
                template_sub.render(
                    outputs=outputs, custom_serializer_module=custom_serializer_module
                )
            )

    with open(fp_templates / "mapper.py.j2", "r") as infile:
        template_string_main = infile.read()
        template_main = Template(template_string_main)
        with open(fp_mapper, "w") as outfile:
            outfile.write(
                template_main.render(subserializers=fp_subserializers.stem, outputs=outputs)
            )
