from storages.backends.azure_storage import AzureStorage

from pipit.settings import get_env


class AzureMediaStorage(AzureStorage):
    account_name = get_env("AZURE_ACCOUNT_NAME")  # Must be replaced by your <storage_account_name>
    account_key = get_env("AZURE_STORAGE_KEY")  # Must be replaced by your <storage_account_key>
    azure_container = "media"
    expiration_secs = None
