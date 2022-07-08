from .base import *

DEBUG = True

ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
INSTALLED_APPS += ["drf_yasg",]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "USER": os.environ.get("SQL_USER"),
        "PASSWORD": os.environ.get("SQL_PASSWORD"),
        "HOST": os.environ.get("SQL_HOST"),
        "PORT": os.environ.get("SQL_PORT"),
        "NAME": os.environ.get("SQL_DATABASE"),
        "CONN_MAX_AGE": 300,
        "ATOMIC_REQUESTS": True,
    }
}
