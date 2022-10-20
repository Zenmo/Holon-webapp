from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register

from api.models.scenario import Scenario
from .models import Slider


class SliderAdmin(ModelAdmin):
    model = Slider
    base_url_path = "sliders"
    menu_label = "Sliders"
    menu_icon = "form"
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name",)


class ScenarioAdmin(ModelAdmin):
    model = Scenario
    base_url_path = "scenarios"
    menu_label = "Scenarios"
    menu_icon = "doc-full"
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name",)


modeladmin_register(SliderAdmin)
modeladmin_register(ScenarioAdmin)
