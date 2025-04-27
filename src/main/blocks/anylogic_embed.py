from wagtail.blocks import StructBlock, CharBlock


class AnyLogicEmbed(StructBlock):
    """
    AnyLogic embedded model
    """

    cloudUrl = CharBlock(
        required=True,
        help_text="https://anylogic.zenmo.com",
        description="",
    )
    modelId = CharBlock(
        required=True,
        help_text="Model UUID. We will use the latest version.",
    )
    apiKey = CharBlock(
        required=True,
        default="17e0722f-25c4-4549-85c3-d36509f5c710",
        help_text="""
            API key belonging to an AnyLogic user.
            The default API key belongs to user publiek@zenmo.com.
            Make sure this user has access to the model
            """,
    )

    class Meta:
        icon = "media"
