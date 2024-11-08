# Query Builder and Query Result

This page explains the structure, meaning, and operation of the query builder and its responses.

## Query Builder

The query builder is a class that helps to construct a record level query from various sources, and transform or run the query. It's highly flexible and is the core part of the record level query system in Cafe Variome.

### Data Structure

An example JSON structure of the query builder can be:

<include from="library.md" element-id="json-record_query_builder-maximum"></include>

The detailed explanation of each filter is as follows:

### Subject Filter

The subject filter is used to query common demographic data within the system. Because they are usually stored in various terms, the subject filter provides a unified interface to query them, and an easier way for user to see on the UI what to query on. The structure:

```json
{
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
}
```

Contains basic demographic filters on gender, age, age of first diagnosis, age of first symptoms, affected status, and family type.

### HPO Filter

The HPO filter is used to query phenotypic data with Human Phenotype Ontology (HPO) terms. The structure:

```json
{
  "terms": [
    "0000969",
    "0010741",
    "0002075"
  ],
  "similarity": 0.5,
  "minimumMatch": 2,
  "useOrphanet": true
}
```

Takes one or more HPO IDs, with only the numerical ID part without `HP:` prefix. It also allows specifying a similarity score, which is used to expand the terms to similar terms, based on our Semantic Similarity functionality provided with Biomedical Term Service.

The minimum match specifies how many of the **original ** terms must be matched. For the above 3 terms, if the minimum match is set to 2, then 2 out of the 3 original terms, or 2 sets out of 3 sets of expanded terms, must match for a record to be included in the result.

The `useOrphanet` flag specifies whether to use Orphanet terms to match with patients. With the HOOM model, HPO and ORDO terms can be mapped to one another, allowing records containing either to be returned.

### ORDO Filter

The ORDO filter is used to query disease data with Orphanet terms. The structure:

```json
{
  "terms": [
    "1234",
    "5678"
  ],
  "similarity": 0.5,
  "matchScale": 0.7,
  "useHPO": true
}
```

Takes one or more ORDO IDs, with only the numerical ID. The rest is very similar to HPO filter, as they are connected together with the HOOM model.

## Query Logic

The query API used by CV3 allows advanced query logic by putting the match target in different position.

### AND logic between filters

All filters that are independent to another are AND logic filters. For example, if HPO filter and ORDO filters are used at the same time, the result must be matched to **both** HPO and ORDO terms.

Specially, some filters allowing multiple instances of the same type. For example, HPO filters can be provided multiple times. They are also AND logic between each other. If 2 HPO filters are provided:

```json
{
  "hpo": [
    {
      "terms": [
        "0000001",
        "0000002",
        "0000003"
      ],
      "similarity": 0.5,
      "minimumMatch": 2,
      "useOrphanet": true
    },
    {
      "terms": [
        "0000004",
        "0000005",
        "0000006"
      ],
      "similarity": 0.5,
      "minimumMatch": 2,
      "useOrphanet": true
    }
  ]
}
```

The meaning of the structure is:

Find records that:
- Matches at least 2 terms from the first HPO filter, **AND**
- Matches at least 2 terms from the second HPO filter.

### OR logic within filters

All terms within a filter are OR logic. For example, if 3 HPO terms are provided:

```json
{
  "hpo": [
    {
      "terms": [
        "0000001",
        "0000002",
        "0000003"
      ],
      "similarity": 0.5,
      "minimumMatch": 1,
      "useOrphanet": true
    }
  ]
}
```

This means that the record only need to match with "0000001" **OR** "0000002" **OR** "0000003" to be included in the result.

### Filter default behavior

#### Empty default to "any"

For any filter that contains an empty value (for example, empty HPO code or 0/100 for age), they are considered empty, and equivalent to **not provided**. This means that the filter is not applied, and the record can have any value for that field.

Please note that CV3 do not support filter level negation. For example, if HPO filter is not applied, a subject with or without HPO field, or with anything in HPO field, may be included. This behavior is **different from negation, where a subject must not contain any HPO term**.

#### Filter default to soft match

If a filter is provided, however, the data is completely not present within the source, the filter will be ignored. This is a soft match behavior, where the filter is not applied if the data is not present. Specifically, soft match will only be applied if the entire source does not have that field. For example, for a collection:

```json
[
  {
    "subjectId": "_",
    "HPO": ["0000001", "0000002"]
  },
  {
    "subjectId": "_"
  }
]
```

ORDO information is missing in every record. If an ORDO filter is provided, it will be ignored. However, some records have HPO information; so if HPO filter is provided, any records that do not have HPO information will not be included. The latter case is considered **information missing**, instead of **filter not supported**.

The default soft match can be overridden by providing an `advanced` filter, instructing the query behavior. Within the advanced filter, the `requiredFilters` field details which filters are mandatory, and the soft match will be turned off for that field.
