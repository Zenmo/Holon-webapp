from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register

from api.models.scenario import Scenario
from holon.models.factor import Factor


class FactorAdmin(ModelAdmin):
    model = Factor
    base_url_path = "factors"
    menu_label = "Factors"
    menu_icon = "doc-full"
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True


modeladmin_register(FactorAdmin)
