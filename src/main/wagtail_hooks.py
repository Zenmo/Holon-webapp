import wagtail.admin.rich_text.editors.draftail.features as draftail_features
from django.utils.translation import gettext
from wagtail import hooks
from wagtail.admin.rich_text.converters import editor_html
from wagtail.rich_text import FeatureRegistry

from main.contentstate import term_link_entity

from main.handlers import TermLinkHTMLHandler, TermLinkElementHandler, TermLinkEditorHandler


@hooks.register("register_rich_text_features")
def register_stock_feature(features: FeatureRegistry):
    features.register_link_type(TermLinkHTMLHandler)
    """
    Registering the `stock` feature, which uses the `STOCK` Draft.js entity type,
    and is stored as HTML with a `<span data-stock>` tag.
    """
    feature_name = "term"
    type_ = "TERM"

    control = {
        "type": type_,
        "icon": "openquote",
        "description": gettext("Term"),
    }

    features.register_editor_plugin(
        "draftail",
        feature_name,
        draftail_features.EntityFeature(control, js=["main/term.js"]),
    )

    features.register_converter_rule(
        "editorhtml",
        feature_name,
        [
            editor_html.LinkTypeRule(feature_name, TermLinkEditorHandler),
        ],
    )

    features.register_converter_rule(
        "contentstate",
        feature_name,
        {
            "from_database_format": {
                'a[linktype="term"]': TermLinkElementHandler(type_),
            },
            "to_database_format": {"entity_decorators": {type_: term_link_entity}},
        },
    )

    features.default_features = ["h1", *features.default_features, "term"]
