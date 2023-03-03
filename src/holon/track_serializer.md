
## Implementation of wildcard JSON
Merits:
1. Assumes an JSON array of length **exactly** 1
2. Can override existing keys without throwing an error, there are **no protected fields**.

```python
# AnyLogicModelSerializer

def to_representation(self, instance):
    representation = super(AnyLogicModelSerializer, self).to_representation(instance)

    if representation["wildcard_JSON"] is not None:
        wildcard = representation.pop("wildcard_JSON")[0]

        for key, value in wildcard.items():
            representation[key] = value

    return representation
```

### Before
```json
[
    {
        "id": "ope4",
        "contracts": [],
        "category": "OPERATORGRID",
        "group": null,
        "subgroup": null,
        "wildcard_JSON": [
            {
                "custom_value_field1": 1,
                "custom_value_field2": 2,
                "custom_value_field3": 3,
                "custom_value_field4": 4
            }
        ],
        "parent_actor": null
    },
]
```
### After
```json
[
        {
            "id": "ope4",
            "contracts": [],
            "category": "OPERATORGRID",
            "group": null,
            "subgroup": null,
            "parent_actor": null,
            "custom_value_field1": 1,
            "custom_value_field2": 2,
            "custom_value_field3": 3,
            "custom_value_field4": 4
        },
]
```