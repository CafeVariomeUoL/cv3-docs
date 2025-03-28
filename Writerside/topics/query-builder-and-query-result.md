# Query Builder and Query Result

<primary-label ref="backend"/>

This page describes the structure, purpose, and functionality of the query builder, as well as the meaning of its responses.

## Query Builder

The query builder is a class designed to help construct record-level queries from various sources and then transform or execute those queries. It is highly flexible and forms the core component of the record-level query system in Cafe Variome.

### Data Structure

An example JSON structure of the query builder could be:

<code-block src="json/RecordQueryBuilder.maximum.json" collapsed-title="RecordQueryBuilder.maximum.json" collapsible="true" lang="json" />

A detailed explanation of each filter is provided below:

### Subject Filter

The subject filter is used to query common demographic data within the system. Since this data is typically stored using various terminology standards, the subject filter provides a unified interface to simplify queries and makes it easier for users to identify query options in the UI. Its structure is as follows:

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

This contains basic demographic filters on gender, age, age of first diagnosis, age of first symptoms, affected status, and family type.

### HPO Filter

The <tooltip term="HPO">HPO</tooltip> filter is used to query phenotypic data with <tooltip term="HPO">HPO</tooltip> terms. Its structure is as follows:

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

Its structure accepts one or more <tooltip term="HPO">HPO</tooltip> IDs, specified using only the numerical part of the ID, without the `HP:` prefix. It also allows you to specify a similarity score, which expands the provided terms to include similar ones, based on the Semantic Similarity functionality available through our Biomedical Term Service.

The minimum match parameter defines how many of the **original** terms must match. For example, if three terms are provided and the minimum match is set to 2, then at least two of the three original terms (or two of the three sets of expanded terms) must match for a record to be included in the results.

The `useOrphanet` flag indicates whether Orphanet terms should also be used to match patients. With the <tooltip term="HOOM model">HOOM model</tooltip>, <tooltip term="HPO">HPO</tooltip> and <tooltip term="OIDC">OIDC</tooltip>, terms can be mapped to each other, enabling records containing either term type to be returned.

### ORDO Filter

The <tooltip term="ORDO">ORDO</tooltip> filter is used to query disease data with Orphanet terms. Its structure is as follows:

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

Its structure takes one or more <tooltip term="ORDO">ORDO</tooltip> IDs, with only the numerical ID. The rest are very similar to <tooltip term="HPO">HPO</tooltip> filter, as they are connected together with the <tooltip term="HOOM model">HOOM model</tooltip>.

## Query Logic

The query API used by CV3 allows advanced query logic by putting the match target in a different position.

### AND logic between filters

All filters that are independent of each other use **AND** logic. For example, if an HPO filter and an <tooltip term="ORDO">ORDO</tooltip> filter are applied simultaneously, the results must match **both** the <tooltip term="HPO">HPO</tooltip> and <tooltip term="ORDO">ORDO</tooltip> terms.

Specifically, some filters allow multiple instances of the same filter type. For example, multiple <tooltip term="HPO">HPO</tooltip> filters can be applied at once. These multiple filters are also combined using AND logic. If two <tooltip term="HPO">HPO</tooltip> filters are provided:

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

This structure means - Find records that:

- Match at least 2 terms from the first <tooltip term="HPO">HPO</tooltip> filter, **AND**
- Match at least 2 terms from the second <tooltip term="HPO">HPO</tooltip> filter.

### OR logic within filters

All terms within a filter are **OR** logic. For example, if 3 <tooltip term="HPO">HPO</tooltip> terms are provided:

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

This means that the record only need to match with "0000001" **OR** "0000002" **OR
** "0000003" to be included in the result.

### Filter default behavior

#### Empty default to "any"

Any filter that contains an empty value (e.g., an empty <tooltip term="HPO">HPO</tooltip> code or 0/100 for age) is treated as if the filter was **not provided**. This means the filter is not applied, and the record can have any value for that field.

Note that CV3 does not support filter-level negation. For example, if a <tooltip term="HPO">HPO</tooltip> filter is not applied, a subject with or without an HPO field, or with any value in the <tooltip term="HPO">HPO</tooltip> field, may be included. This is **different from negation, where a subject must not contain any HPO term**.

#### Filter default to soft match

If a filter is provided, but the data is completely absent from the source, the filter will be ignored. This is known as soft match behavior, where the filter is not applied if the data is not present. Specifically, soft match occurs only when the entire source lacks that particular field. For example, in a collection:

```json
[
  {
    "subjectId": "_",
    "HPO": [
      "0000001",
      "0000002"
    ]
  },
  {
    "subjectId": "_"
  }
]
```

<tooltip term="ORDO">ORDO</tooltip> information is missing in every record. If an <tooltip term="ORDO">ORDO</tooltip> filter is provided, it will be ignored. However, some records have <tooltip term="HPO">HPO</tooltip> data; so if a <tooltip term="HPO">HPO</tooltip> filter is provided, any records that do not have <tooltip term="HPO">HPO</tooltip> information will not be included. The latter case is considered
**information missing**, instead of **filter not supported**.

The default soft match behavior can be overridden by providing an advanced filter that specifies the desired query behavior. In the `advanced` filter, the `requiredFilters` field defines which filters are mandatory, and this will disable the soft match for those fields.