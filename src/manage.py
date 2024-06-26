#!/usr/bin/env python

import os
import sys
import inspect
import dotenv

from django.core.management import execute_from_command_line
from django.conf import settings


def if_exists_load_env(name: str) -> None:
    current_frame = inspect.currentframe()
    if not current_frame:
        return

    inspect_file = inspect.getfile(current_frame)
    env_path = os.path.dirname(os.path.abspath(inspect_file))
    env_file = "{env_path}/{name}".format(env_path=env_path, name=name)

    if os.path.exists(env_file):
        dotenv.load_dotenv(env_file, override=True)


def enable_pycharm_debugger():
    if settings.PYCHARM_IP and settings.PYCHARM_PORT:
        import pydevd_pycharm

        # we could do this on a per-request basis if convenient.
        pydevd_pycharm.settrace(
            settings.PYCHARM_IP,
            port=settings.PYCHARM_PORT,
            stdoutToServer=True,
            stderrToServer=True,
        )


def enable_vscode_debugger():
    # enable vs code remote debugging
    # https://github.com/Microsoft/PTVS/issues/1057
    if settings.DEBUG and settings.VS_CODE_REMOTE_DEBUG and os.environ.get("RUN_MAIN"):
        import ptvsd

        ptvsd.enable_attach(address=("0.0.0.0", 5678))


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pipit.settings.prod")

    if_exists_load_env(".env")
    if_exists_load_env(".env.local")

    enable_pycharm_debugger()
    enable_vscode_debugger()

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
