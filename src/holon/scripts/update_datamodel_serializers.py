import black
from black import WriteBack
from black.parsing import InvalidInput
import importlib
from django.db import models
import inspect
from jinja2 import Template
from pathlib import Path
from holon.models.scenario import BuiltEnvironmentGridConnection


def pprint(msg: str) -> None:
    return print("[update_datamodel_serializers] " + msg)


def run():
    ## GLOBALS
    MODS = [
        ("contract", "Contract"),
        ("asset", "EnergyAsset"),
        ("actor", "Actor"),
        ("gridconnection", "GridConnection"),
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
    pprint("Autoserializer activated bleep bloop \U0001f916")
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
                    has_insulation_label = isinstance(
                        object, BuiltEnvironmentGridConnection
                    ) or issubclass(object, BuiltEnvironmentGridConnection)

                    subclasses.append(
                        {"name": object.__name__, "has_insulation_label": has_insulation_label}
                    )

        output = {"module": module_name, "main_class": main_class, "subclasses": subclasses}
        outputs.append(output)

    ## Write to files
    pprint("...Populating templates \U0001f4d1")
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
                template_main.render(
                    subserializers=fp_subserializers.stem,
                    outputs=outputs,
                    custom_serializer_module=custom_serializer_module,
                )
            )

    pprint("...Formatting \U0001f9d0")
    try:
        mode = black.Mode(line_length=100)
        black.format_file_in_place(fp_mapper, mode=mode, fast=False, write_back=WriteBack.YES)
        black.format_file_in_place(
            fp_subserializers, mode=mode, fast=False, write_back=WriteBack.YES
        )
        pprint("Done! \U0001f973")
    except InvalidInput as e:
        pprint(
            "\U00002757 formatting failed, probably the output is not functional Python \U00002757"
        )
        pprint(str(e))
        pprint(
            "\U00002757 formatting failed, probably the output is not functional Python \U00002757"
        )
