from .base_page import BasePageFactory
from ..pages.sandbox import SandboxPage


class SandboxPageFactory(BasePageFactory):
    class Meta:
        model = SandboxPage
