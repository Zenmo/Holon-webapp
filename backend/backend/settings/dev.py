from .base import *

DEBUG = True

ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
INSTALLED_APPS += [
    "drf_yasg",
]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": os.environ.get("DB_PORT"),
        "NAME": os.environ.get("DB_NAME"),
        "CONN_MAX_AGE": 300,
        "ATOMIC_REQUESTS": True,
    }
}
