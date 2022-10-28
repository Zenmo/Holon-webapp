from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register

from .models import ScenarioTag


class ScenarioTagAdmin(ModelAdmin):
    model = ScenarioTag
    base_url_path = "scenariotags"
    menu_label = "Scenario tags"
    menu_icon = "doc-full"
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name",)


modeladmin_register(ScenarioTagAdmin)
