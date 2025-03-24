# Data Indices

Cafe Variome V3 uses dynamic query interface, which would show or hide elements that are relevant to types of queries based on what's available in the database. For this to happen, it regularly indexes the databases, then generates and propagates the indices to the entire network.

## Record Level Indices

Record level indices are stored in `RecordIndex` objects. They follow the format of:

```json
{
  "capability": {
    "subject": true,
    "genes": true,
    "hpo": true,
    "ordo": true,
    "snomed": true,
    "variant": true,
    "source": true,
    "eav": true,
    "subjectCapability": {
      "age": true,
      "gender": true,
      "familyType": true,
      "affected": true
    }
  },
  "recordCount": 100,
  "eavIndex": {
    "attributes": {
      "patient_type": "Patient Type",
      "visits-to-hospital": "Visits to Hospital"
    },
    "values": {
      "clinicalTrial": "Clinical Trial",
      "selfVisit": "Self Visit"
    },
    "mappings": {
      "patient_type": [
        "clinicalTrial",
        "selfVisit"
      ]
    }
  }
}
```

### Capability

The `capability` field captures the type of data available in the database. In the example above, it reports that it has subject data (demographic data), (<tooltip term="HPO">HPO</tooltip>) terms, Gene codes, (<tooltip term="OIDC">OIDC</tooltip>) terms, etc.

The demographic data is a bit special: almost all general purpose ontologies would contain terms for demographic descriptions, so when used together, they may cause confusion. For example, if the subject gender is stored in (<tooltip term="NCIT">NCIT</tooltip>) terms, while the user searched on (<tooltip term="SNOMED">SNOMED</tooltip>) terms, the system won't automatically convert the expression. And since the demographic filters are frequently used, we added the generic `subject` filter to handle the translation. The `subjectCapability` reports the detailed filter supported by the database.

### Record Count

The record count indicates how many subjects are there in the described resource (could be a source, an instance, a network, etc.). This is used to calculate scores, such as response quality, differential privacy, etc.

### EAV Index

Since the system cannot capture all possible data models out there, we added a generic EAV (Entity, Attribute, Value) model to each subject, and designed a query system to search on those fields. The `eavIndex` field is designed to record what possible attributes are there, what are their corresponding values, and what would the display name be. The query interface will populate from this information.

Within the `eavIndex` object, there are three fields:

- `attributes`: a key-value pair of attribute name and display name. The attribute name is the field name stored in the database, and also the one would appear in `Subject` object if the detailed subject information is reported to the frontend. However, the users will only be able to see the display name of the field, as the frontend handles the translation.
- `values`: a key-value pair of possible values for the attribute and their display name. This is used to populate the dropdowns or checkboxes in the query interface.
- `mappings`: The corresponding relationship between attributes and values. Each attribute is presented as a key in this dictionary, and the value is an array of possible values (both are their actual field name instead of display name). The mapping should only be present if the attribute is an alphanumeric field, and the values are categorical. If the mapping is present, the frontend will assume the field can only contain one (or more) of the given values, and will only show a dropdown or selection box, or a free text box for regex search. If the field is not present in the mapping, the frontend will assume the field is a numerical field, and will show a free text box and numerical operators such as `>`, `<`, `=`, etc.
