#!/usr/bin/env python3
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # If WEBSITE_HOSTNAME is defined as an environment variable, then we're running on Azure App Service

    # When running on Azure App Service you should use the production settings.
    settings_module = (
        "backend.settings.production"
        if "WEBSITE_HOSTNAME" in os.environ
        else "backend.settings.dev"
    )
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
