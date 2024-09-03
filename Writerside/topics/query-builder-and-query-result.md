# Query Builder and Query Result

This page explains the structure, meaning, and operation of the query builder and its responses.

## Query Builder

The query builder is a class that helps to construct a record level query from various sources, and transform or run the query. It's highly flexible and is the core part of the record level query system in Cafe Variome.

### Data Structure

An example JSON structure of the query builder can be:

```json
{
    "subject": {
        "gender": "any",
        "age": {
            "min": 16,
            "max": 99
        },
        "ageFirstDiagnosis": {
            "min": 0,
            "max": 79
        },
        "ageFirstSymptoms": {
            "min": 24,
            "max": 99
        },
        "affectedOnly": true,
        "familyType": {
            "singletons": true,
            "trio": false,
            "family": false
        }
    },
    "hpo": {
        "terms": [
            "0000969",
            "0010741",
            "0002075"
        ],
        "similarity": 0.5,
        "minimumMatch": 2,
        "useOrphanet": true
    },
    "ordo": {
        "terms": [
            "1234",
            "5678"
        ],
        "similarity": 0.5,
        "matchScale": 0.7,
        "useHPO": true
    },
    "genes": {
        "alleles": [
            {
                "gene": "APOE",
                "alleles": ["e3", "e4"]
            }
        ]
    },
    "snomed": {
        "terms": [
            "194891000000101",
            "439389002"
        ],
        "minimumMatch": 1
    },
    "variants": {
        "genes": [
            "SEC1P",
            "SEBOX"
        ],
        "reactome": [
            "R-HSA-44482",
            "R-HSA-77387"
        ],
        "mutation": ["lossOfStart"],
        "maxAf": 5,
        "useLocalAf": true
    },
    "sources": {
        "sources": ["5065179a-d608-4aba-8728-2f131ec68127"]
    },
    "eav": [
        {
            "attribute": "Attribute 1",
            "relation": "numericEquals",
            "value": 20
        }
    ]
}
```
