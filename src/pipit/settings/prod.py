"""
Write prod settings here, or override base settings
"""
from pipit.sentry import initialize_sentry
from pipit.settings.base import *  # NOQA


DEBUG = False

DATABASES["default"]["CONN_MAX_AGE"] = get_env("DATABASE_CONN_MAX_AGE", default=60)

CSRF_TRUSTED_ORIGINS = [
    get_env("DOMAIN_HOST"),
]

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "cache_table",
    },
    "renditions": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "cache_table_rendition",
        "TIMEOUT": 600,
        "OPTIONS": {
            "MAX_ENTRIES": 1000,
        },
    },
}

STATIC_ROOT = os.path.join(BASE_DIR, "static")

STATICFILES_STORAGE = "pipit.storages.AzureStaticStorage"
DEFAULT_FILE_STORAGE = "pipit.storages.AzureMediaStorage"

STATIC_LOCATION = get_env("CUSTOM_STATIC_LOCATION", "static")
MEDIA_LOCATION = get_env("CUSTOM_MEDIA_LOCATION", "media")

AZURE_ACCOUNT_NAME = get_env("AZURE_ACCOUNT_NAME")
AZURE_CUSTOM_DOMAIN = f"{AZURE_ACCOUNT_NAME}.blob.core.windows.net"

STATIC_URL = f"https://{AZURE_CUSTOM_DOMAIN}/{STATIC_LOCATION}/"
MEDIA_URL = f"https://{AZURE_CUSTOM_DOMAIN}/{MEDIA_LOCATION}/"

# Enable caching of templates in production environment
TEMPLATES[0]["OPTIONS"]["loaders"] = [  # type: ignore[index]
    (
        "django.template.loaders.cached.Loader",
        [
            "django.template.loaders.filesystem.Loader",
            "django.template.loaders.app_directories.Loader",
        ],
    )
]

# This ensures that Django will be able to detect a secure connection
# properly on Heroku.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Prevent Man in the middle attacks with HTTP Strict Transport Security
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Block content that appears to be an XSS attack in certain browsers
SECURE_BROWSER_XSS_FILTER = True

# Use a secure cookie for the session cookie
SESSION_COOKIE_SECURE = True

# Use a secure cookie for the CSRF cookie
CSRF_COOKIE_SECURE = True

# Sentry
SENTRY_DSN = get_env("SENTRY_DSN", "")
SENTRY_ENVIRONMENT = get_env("SENTRY_ENVIRONMENT", "production")
initialize_sentry(SENTRY_DSN, SENTRY_ENVIRONMENT)

# Log to console to get logging output from docker
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "formatters": {
        "verbose": {
            "format": "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            "datefmt": "%d/%b/%Y %H:%M:%S",
        },
    },
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
        },
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "WARNING"),
        },
    },
}
