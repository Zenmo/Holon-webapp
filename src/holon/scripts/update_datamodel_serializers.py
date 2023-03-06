import black
from black import WriteBack
import importlib
from django.db import models
import inspect
from jinja2 import Template
from pathlib import Path


def pprint(msg: str) -> None:
    return print("[update_datamodel_serializers] " + msg)


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
    pprint("Autoserializer activated bleep bloop \U0001F916")
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
    pprint("...Populating templates \U0001F4C3")
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

    pprint("...Formatting \U0001F9D0")
    mode = black.Mode(line_length=100)
    black.format_file_in_place(fp_mapper, mode=mode, fast=False, write_back=WriteBack.YES)
    black.format_file_in_place(fp_subserializers, mode=mode, fast=False, write_back=WriteBack.YES)

    pprint("Done! \U0001F973")
