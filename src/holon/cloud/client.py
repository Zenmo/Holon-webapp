from anylogiccloudclient.client.cloud_client import CloudClient


client = CloudClient("7a3563c1-ea1c-41d6-8009-b7abfd93f7ba", "https://engine.holontool.nl")


model = client.get_model_by_name("Base_5dec")
client.get_model_version_by_number(model, 1)
