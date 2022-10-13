from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register
from .models import Slider


class SliderAdmin(ModelAdmin):
    model = Slider
    base_url_path = "sliders"
    menu_label = "Sliders"
    menu_icon = "pilcrow"
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    add_to_admin_menu = True
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name",)


modeladmin_register(SliderAdmin)
