from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register
from django.templatetags.static import static
from django.utils.html import format_html
from api.models.scenario import Scenario

from wagtail.core import hooks


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


modeladmin_register(ScenarioAdmin)


@hooks.register("insert_global_admin_js", order=100)
def global_admin_js():
    """Add /static/css/custom.js to the admin."""
    return format_html('<script src="{}"></script>', static("/js/custom.js"))
