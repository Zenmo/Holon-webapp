import importlib
from django.db import models
import inspect
from jinja2 import Template
from pathlib import Path

## GLOBALS
MODS = [
    ("actor", "Actor"),
    ("contract", "Contract"),
    ("gridconnection", "GridConnection"),
    ("asset", "EnergyAsset"),
    ("gridnode", "GridNode"),
    ("policy", "Policy"),
]

fp_serializer = Path("holon/serializers").resolve()
fp_subseries = fp_serializer / "datamodel_subseries.py"
fp_top = fp_serializer / "datamodel_top.py"

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

template_string = """
###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_framework import serializers
{% for module in outputs %}
{% if module.subclasses|length > 0 %}
from {{ module.module }} import (
{% for subclass in module.subclasses %}{% if not loop.last %}        {{ subclass }},
{% else %}        {{ subclass }}{% endif %}{% endfor %}
)
{% endif %}{% endfor %}
{% for module in outputs %}{% if module.subclasses|length > 0 %}{% for subclass in module.subclasses %}
class {{ subclass }}Serializer(serializers.ModelSerializer):

    class Meta:
        model = {{ subclass }}
        fields = '__all__'

{% endfor %}{% endif %}{% endfor %}
"""

template = Template(template_string)
with open(fp_subseries, "w") as outfile:
    outfile.write(template.render(outputs=outputs))


template_main_string = """
###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_polymorphic.serializers import PolymorphicSerializer
{% for module in outputs %}
{% if module.subclasses|length > 0 %}
from {{ subseris_py_filename }} import (
{% for subclass in module.subclasses %}{% if not loop.last %}        {{ subclass }},
{% else %}        {{ subclass }}{% endif %}{% endfor %}
)
{% endif %}{% endfor %}
{% for module in outputs %}{% if module.subclasses|length > 0 %}
class {{ module.main_class }}PolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
{% for subclass in module.subclasses %}{% if not loop.last %}        {{ subclass }}: {{ subclass }}Serializer,
{% else %}        {{ subclass }}: {{ subclass }}Serializer{% endif %}{% endfor %}
    }
{% endif %}{% endfor %}
"""

template = Template(template_main_string)
with open(fp_top, "w") as outfile:
    outfile.write(template.render(subseris_py_filename=fp_subseries.stem, outputs=outputs))
