from datetime import datetime


class HolonLogger:
    def __init__(self, name: str) -> None:
        self.name = name

    def log_print(self, msg: str):
        """Print with endpoint name and timestamp prepended"""

        time = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        print(f"[{self.name}] [{time}]: {msg}")
