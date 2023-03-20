"""
Write local settings here, or override base settings
"""
from pipit.settings.base import *  # NOQA

MIDDLEWARE += [
    "opencensus.ext.django.middleware.OpencensusMiddleware",
]
ALLOWED_HOSTS = ["localhost", "*.azurewebsites.net"]
APPLICATION_INSIGHTS_CONNECTION_STRING = "InstrumentationKey=bb6563f2-f484-443e-9a27-09168b466be3;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/"
OPENCENSUS = {
    "TRACE": {
        "SAMPLER": "opencensus.trace.samplers.ProbabilitySampler(rate=1)",
        "EXPORTER": f"""opencensus.ext.azure.trace_exporter.AzureExporter(
                  connection_string='${APPLICATION_INSIGHTS_CONNECTION_STRING}',
        )""",
    }
}
WAGTAILADMIN_BASE_URL = "http://localhost:8000"

MEDIA_ROOT = "/media/"

INSTALLED_APPS += ("wagtail.contrib.styleguide",)

VS_CODE_REMOTE_DEBUG = get_env_bool("VS_CODE_REMOTE_DEBUG", default=False)
DEBUG = True
TEMPLATES[0]["OPTIONS"]["debug"] = DEBUG  # type: ignore[index]

CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Allow weak local passwords
AUTH_PASSWORD_VALIDATORS = []

INTERNAL_IPS = get_env("INTERNAL_IPS", default="").split(",")

# Add django debug toolbar when using local version
if get_env_bool("DEBUG_TOOLBAR", default=True):
    DEBUG_TOOLBAR_PATCH_SETTINGS = False

    INSTALLED_APPS += ["debug_toolbar", "django_extensions"]

    MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]

    DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": "pipit.settings.local.show_toolbar"}


# Allow django-debug-bar under docker
def show_toolbar(request):
    return False
