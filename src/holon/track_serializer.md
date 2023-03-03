## Implementation of wildcard JSON

Merits:

1. Assumes an JSON array of length **exactly** 1
2. Can override existing keys without throwing an error, there are **no protected fields**.

```python
# AnyLogicModelSerializer(serializer.ModelSerializer)

def to_representation(self, instance):
    representation = super(AnyLogicModelSerializer, self).to_representation(instance)

    # unpack wildcard json to level key:vaue pairs
    if representation["wildcard_JSON"] is not None:
        wildcard = representation.pop("wildcard_JSON")[0]

        for key, value in wildcard.items():
            representation[key] = value

    # remove if null
    else:
        _ = representation.pop("wildcard_JSON")

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
  }
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
  }
]
```

## Implementation of custom id's (scoped to models)

```python
# ActorSerializer(AnyLogicModelSerializer)
id = serializers.SerializerMethodField()

def get_id(self, obj):
    return f"{obj.category.lower()[:3]}{obj.id}"
```

### Before

```json
{
  "id": 5,
  "contracts": [],
  "parent_actor": null,
  "category": "HOLONENERGY",
  "group": null,
  "subgroup": null
}
```

### After

```json
{
  "id": "hol5",
  "contracts": [],
  "parent_actor": null,
  "category": "HOLONENERGY",
  "group": null,
  "subgroup": null
}
```

## Resolve parent_actors to same custom id's (scoped to models)

```python
id = serializers.SerializerMethodField()
parent_actor = serializers.SerializerMethodField()

def get_id(self, obj):
    return f"{obj.category.lower()[:3]}{obj.id}"

def get_parent_actor(self, obj):
    # get related actor
    if obj.parent_actor is not None:
        obj = Actor.objects.get(id=obj.parent_actor.id)
        return self.get_id(obj)
    else:
        return obj.parent_actor
```

### Before

```json
{
    "id": "con7",
    "contracts": [
        {
            "id": "c2",
            "contractType": "FIXED",
            "contractScope": "ENERGYSUPPLIER",
            "energyCarrier": "ELECTRICITY",
            "annualFee_eur": 0.0
        }
    ],
    "parent_actor": 5,
    "category": "CONNECTIONOWNER",
    "group": "COMMERCIAL",
    "subgroup": null
},
```

### After

```json
{
    "id": "con7",
    "contracts": [
        {
            "id": "c2",
            "contractType": "FIXED",
            "contractScope": "ENERGYSUPPLIER",
            "energyCarrier": "ELECTRICITY",
            "annualFee_eur": 0.0
        }
    ],
    "parent_actor": "hol5",
    "category": "CONNECTIONOWNER",
    "group": "COMMERCIAL",
    "subgroup": null
},
```

## Feature

### Before

```json

```

### After

```json

```
