from storages.backends.azure_storage import AzureStorage

from pipit.settings import get_env


class AzureMediaStorage(AzureStorage):
    account_name = get_env("AZURE_ACCOUNT_NAME")
    account_key = get_env("AZURE_STORAGE_KEY")
    azure_container = "media"
    expiration_secs = None


class AzureStaticStorage(AzureStorage):
    account_name = get_env("AZURE_ACCOUNT_NAME")
    account_key = get_env("AZURE_STORAGE_KEY")
    azure_container = "static"
    expiration_secs = None
