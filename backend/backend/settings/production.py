from .base import *

ALLOWED_HOSTS = [os.environ["WEBSITE_HOSTNAME"]] if "WEBSITE_HOSTNAME" in os.environ else []
CSRF_TRUSTED_ORIGINS = (
    ["https://" + os.environ["WEBSITE_HOSTNAME"]] if "WEBSITE_HOSTNAME" in os.environ else []
)
CORS_ALLOWED_ORIGINS = (
    ["https://" + os.environ["WEBSITE_HOSTNAME"]] if "WEBSITE_HOSTNAME" in os.environ else []
)

DEBUG = False

# WhiteNoise configuration
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # Add whitenoise middleware after the security middleware
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DBNAME"],
        "HOST": os.environ["DBHOST"],
        "USER": os.environ["DBUSER"],
        "PASSWORD": os.environ["DBPASS"],
    }
}
