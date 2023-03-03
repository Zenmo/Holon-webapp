- [Exclude fields](#exclude-fields)
- [Implementation of wildcard JSON](#implementation-of-wildcard-json)
  - [Before](#before)
  - [After](#after)
- [Implementation of custom id's (scoped to models)](#implementation-of-custom-ids-scoped-to-models)
  - [Before](#before-1)
  - [After](#after-1)
- [Resolve parent\_actors to same custom id's (scoped to models)](#resolve-parent_actors-to-same-custom-ids-scoped-to-models)
  - [Before](#before-2)
  - [After](#after-2)
- [Resolve owner\_actor at gridconnection to custom ID's](#resolve-owner_actor-at-gridconnection-to-custom-ids)
  - [Before](#before-3)
  - [After](#after-3)
- [Feature](#feature)
  - [Before](#before-4)
  - [After](#after-4)

## Exclude fields

```python
EXCLUDE_FIELDS = ["polymorphic_ctype", "payload"]


class AnyLogicModelSerializer(serializers.ModelSerializer):
    def get_fields(self, exclude_fields=None):
        # list factory outside function scope please
        if exclude_fields is None:
            exclude_fields = []

        fields = super().get_fields()

        exclude_fields += EXCLUDE_FIELDS
        for field in exclude_fields:
            # providing a default prevents a KeyError
            # if the field does not exist
            fields.pop(field, default=None)

        return fields
```

Can be implemented at all children to specify class specific fields to exclude like so:

```python
class ContractSerializer(AnyLogicModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"c{obj.id}"

    def get_fields(self):
        return super().get_fields(
            exclude_fields=[
                "actor",
            ]
        )
```

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

## Resolve owner_actor at gridconnection to custom ID's

Implementation that points to the implementation at `ActorSerializer`

```python
class GridConnectionSerializer(AnyLogicModelSerializer):
    energyassets = EnergyAssetSerializer(many=True, read_only=True, source="energyasset_set")

    class Meta:
        model = GridConnection
        fields = "__all__"

    owner_actor = serializers.SerializerMethodField()

    def get_owner_actor(self, obj):
        # get related actor
        if obj.owner_actor is not None:
            obj = Actor.objects.get(id=obj.owner_actor.id)
            return ActorSerializer().get_id(obj)
        else:
            return obj.owner_actor
```

### Before

```json
"gridconnections": [
    {
        "id": 1,
        "energyassets": [
            {
                "id": 6,
                "name": "EHGV"
            },
            {
                "id": 8,
                "name": "Grid battery 10MWh"
            },
            {
                "id": 9,
                "name": "Building_gas_burner_60kW"
            },
            {
                "id": 10,
                "name": "Building solar panels 10 kWp"
            }
        ],
        "capacity_kw": 750.0,
        "charging_mode": "MAX_POWER",
        "battery_mode": "BALANCE",
        "nfATO_capacity_kw": 900.0,
        "nfATO_starttime": 18.0,
        "nfATO_endtime": 7.0,
        "owner_actor": 6,
        "parent_electric": 2,
        "parent_heat": null
    },
]
```

### After

```json
"gridconnections": [
    {
        "id": 1,
        "energyassets": [
            {
                "id": 6,
                "name": "EHGV"
            },
            {
                "id": 8,
                "name": "Grid battery 10MWh"
            },
            {
                "id": 9,
                "name": "Building_gas_burner_60kW"
            },
            {
                "id": 10,
                "name": "Building solar panels 10 kWp"
            }
        ],
        "capacity_kw": 750.0,
        "charging_mode": "MAX_POWER",
        "battery_mode": "BALANCE",
        "nfATO_capacity_kw": 900.0,
        "nfATO_starttime": 18.0,
        "nfATO_endtime": 7.0,
        "owner_actor": "con6",
        "parent_electric": 2,
        "parent_heat": null
    },
]
```

## Feature

### Before

```json

```

### After

```json

```
