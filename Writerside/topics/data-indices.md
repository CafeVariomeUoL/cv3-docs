# Data Indices

**Cafe Variome V3** utilises a dynamic query interface, which automatically displays or hides query elements based on the data available in the database. To achieve this, it regularly indexes the databases, generating indices that are then distributed across the entire network.

## Record Level Indices

Record level indices are stored in `RecordIndex` objects. They follow this format:

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

The `capability` field identifies the types of data available in the database. The example above shows that the database contains subject data (demographic data), <tooltip term="HPO">HPO</tooltip> terms, Gene codes, and <tooltip term="OIDC">OIDC</tooltip> terms, among others.

The demographic data is somewhat unique. Most general-purpose ontologies contain their own terms for demographic descriptions, which can cause confusion when multiple ontologies are used simultaneously. For instance, if subject gender is stored using <tooltip term="NCIT">NCIT</tooltip> terms, but the user searches using <tooltip term="SNOMED">SNOMED</tooltip> Clinical Terms, the system won't automatically translate between these different ontologies. Given that demographic filters are frequently utilised, we have introduced a generic `subject` filter to handle ontology translations. The `subjectCapability` field reports the specific demographic filters supported by the database.

### Record Count

The record count shows the number of subjects present in the specified resource (which could be a source, an instance, a network, etc.). This count is used to calculate scores, such as response quality and differential privacy metrics.

### EAV Index

Since the system cannot accommodate every possible data model, we've implemented a generic Entity-Attribute-Value (EAV) model for each subject and developed a query system to search these fields. The `eavIndex` field captures information about the attributes present, their possible values, and their corresponding display names. The query interface dynamically populates using this data.

The `eavIndex` object contains three fields:

- `attributes`: A key-value pair representing attribute names and their corresponding display names. The attribute name refers to the field stored in the database, which also appears in the `Subject` object when detailed subject information is returned to the frontend. However, users only see the user-friendly display name, as the frontend manages this translation.

- `values`: A key-value pair listing the possible attribute values and their display names. This information is used to populate dropdown menus or checkboxes within the query interface.

- `mappings`: Defines the relationships between attributes and their values. Each attribute appears as a key, and its value is an array of possible attribute values (using actual field names rather than display names). This mapping is only included for alphanumeric attributes with categorical values. When a mapping exists, the frontend assumes the attribute must contain one or more of the provided values and therefore displays a dropdown, checkbox selection, or a free-text box for regex searches. If an attribute isn't included in the mappings, the frontend assumes it is numerical and presents a free-text box alongside numerical operators (`>`, `<`, `=`, etc.).


<seealso>
    <category ref="related">
        <a href="data-model.md"/>
        <a href="mongodb-data-structure.md"/>
        <a href="subjects.md"/>
    </category>
</seealso>