from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register

from holon.models.asset import EnergyAsset
from holon.models.factor import Factor
from holon.models.gridconnection import GridConnection
from holon.models.asset import EnergyAsset
from holon.models.scenario import Scenario
from django.templatetags.static import static
from django.utils.html import format_html
from wagtail import hooks


class FactorAdmin(ModelAdmin):
    model = Factor
    base_url_path = "factors"
    menu_label = "Factors"
    menu_icon = "doc-full"
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True


class GridconnectionAdmin(ModelAdmin):
    model = GridConnection
    base_url_path = "gridconnections"
    menu_label = "Gridconnections"
    menu_icon = "list-ul"
    menu_order = 201
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True


class AssetAdmin(ModelAdmin):
    model = EnergyAsset
    base_url_path = "assets"
    menu_label = "Assets"
    menu_icon = "list-ol"
    menu_order = 202
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True


class ScenarioAdmin(ModelAdmin):
    model = Scenario
    base_url_path = "scenario"
    menu_label = "Scenario (v2)"
    menu_icon = "cogs"
    menu_order = 199
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True


# modeladmin_register(FactorAdmin)
# modeladmin_register(GridconnectionAdmin)
# modeladmin_register(AssetAdmin)
modeladmin_register(ScenarioAdmin)


@hooks.register("insert_editor_js")
def editor_js():
    return format_html(
        '<script type="module" src="{}"></script>',
        static("js/holon_chooser.js"),
    )
