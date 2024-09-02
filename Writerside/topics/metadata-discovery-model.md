# Metadata Discovery Model

Cafe Variome V3 can consume metadata, store them, serve them, and finally, query on them in a federated way. This guide explains the model of metadata that CV3 accepts, and the principles behind using metadata functions.

## Concept of metadata

Generally, metadata refers to the "data about data." For example, information about a dataset, or about a record inside a dataset. In CV3, the definition is slightly different: metadata refers to the general information on a data collection, either inside CV3 or hosted somewhere. The information about a subject does not differentiate between data and metadata, and is all stored inside a data source. Examples of metadata include:

- Name, email or address of the contacting PI
- Name, email or URL for the data publisher
- The license this dataset is released under
- The use conditions or agreement for the data
- ...

In general, any information about a collection of data, including dataset, catalog, cohort, etc. can be stored in CV3. This is done via a concept called **Meta Source**.

## Meta-sources

A meta-source is a single document representing a dataset or a collection of subject records. Internally, it's stored directly in the database and inside the same collection. It can link to a source inside CV3, meaning that the metadata recorded is for that data source; or it may refer to something outside the system entirely, meaning that the administrators of this installation are aware of the data, has metadata about it, but cannot or unwilling to host the data in CV3.

In principle, the metadata recorded in the system is open for discovery, so there will be no authentication needed for accessing these metadata. All formats generated by CV3 for these metadata, for example, a FAIR Data Point, will also be open to the public.

### Meta source types

Meta-sources are designed to be flexible, and can contain extra information with custom fields. There are also
pre-defined meta-source models, which fit a commonly used metadata model for a resource type. They can be selected
according to the type of data being described, and the metadata collected.

We currently have the following pre-defined metadata models:

- EPND Cohort: The cohort model used by the [European Platform for Neurodegenerative Disease](https://epnd.org/) to register their collaborative cohorts. An official catalog of cohorts can be found at [EPND Cohort Catalog](https://discover.epnd.org/).
- Dataset: A collection of **records** that is based on a certain relevance. For example, a data source inside CV3 is a dataset. The dataset is atomic, meaning that it cannot be further divided into smaller datasets, and all permission and requests are done to the entire dataset.
- Data collection: A collection of **records** that is based on a certain relevance, but can be further divided into smaller collections. For example, all data generated in research over the past decade. Users are expected to have only partial access to it, and can request access to a subset of the data.
- Catalog: A collection of **dataset** information. Each entry in a catalog should describe a dataset or data collection. Nested catalog is allowed, for example, "catalog of catalogs."
- Biobank: A collection of biological samples collected from patients. Usually collected based on a certain criteria, for example, a disease or a geographical location.
- Registry: A patient registry containing information about patients, usually clinical information, but any information about patients can be stored in a registry.
- Guideline: A collection of guidelines for a certain disease set or a certain type of data collection. For example, a guideline for a certain type of data collection, or a guideline for a certain disease.
- Custom: A custom type that is not covered by the above types. This is the general type, and can be used to describe any type of data collection that is not covered by the above types.

Please be aware that the type of meta-source is used in several places to filter and describe the result, so only classify a target as a type if it fits. For example, a special collection of records may resemble to a dataset but may be different from a traditional understanding of a dataset. In this case, the custom type should be selected instead of selecting one that resembles the data type.

### Meta-source fields

The structure of the metadata follows a general model, where there's a basic model, and other types may extend the basic model with more detailed fields. Not all fields in the model are required. For a basic model, aka the *Custom* type, it expects the following fields:

```json
{
  "sourceID": "UUID",
  "sourceName": "string",
  "sourceType": "string",
  "publisher": {
    "publisherType": "string",
    "name": "string",
    "contactEmail": "string",
    "contactName": "string",
    "url": "string",
    "location": "string"
  },
  "resourceURLs": [
    "string"
  ],
  "description": "string",
  "releaseLicense": "license URL",
  "themes": [
    "theme URL"
  ],
  "language": "language code",
  "customFields": {
    "key": "value",
    "key2": [
      "value1",
      "value2"
    ]
  }
}
```

Most of the fields are self-explanatory, but some need to be highlighted:

- The source ID is a UUID4 generated by the system. However, if the inputting metadata contains some form of
  hierarchical structure, and the ID is used to denote the parent-child relationship, the ID may be included in manual uploading file. It has to be in UUID4 format for the system to accept, and has to be unique.
- The release license refers to the license which this resource is released under. It can be a common open source
  license, which the front end UI will have built in reference for easy access; or a custom license published somewhere on internet, which this URL should reference to.
- The themes refers to the FDP themes, if any. It’s a schema for a FAIR Data Point representation, which is a RDF data structure.
- The language code is a 2 character code adhere to ISO639-1 standard, in lower case. The front end uses a public API to populate this field automatically.
- The custom fields are key-value pairs (or key-\[values\] pairs) that are fully customisable. They are designed to contain the custom meta data in a searchable form.

This metadata model is also used in other meta source types, where the metadata is similar or same in structure. Namely:

#### Catalog

Since catalog contains multiple datasets, it requires a dedicated field to store the URLs, and to make them searchable. Aside from the basic fields, it has:

```json
{
  "datasetIDs": [
    "UUID"
  ]
}
```

A catalog stored this way can only point to datasets stored locally.

**A feature is on the road map to ingest FDP data representation from an external source, and generate the corresponding meta-source locally.**

#### Cohort

The cohort model extends the base model to contain more information, specifically the ones deemed necessary in EPND project. Aside from the fields explained above, it also have:

```json
{
  "cohortDetails": {
    "centerName": "string",
    "siteType": "string",
    "country": "string",
    "yearStart": 0,
    "ongoing": true
  },
  "collectedTypes": {
    "participants": {
      "diseases": [],
      "numberOfSubjects": 0
    },
    "bioSamples": [],
    "images": [],
    "cognitiveData": []
  },
  "datasetIDs": []
}
```

For details on what these field means and how to properly populate them, refer to metadata upload guide. The `datasetIDs` field allows for interlinking metadata entry of datasets that are part of this cohort.

#### Dataset

The dataset model describes a collection of subject data, generated to facilitate a study. It focuses on the data types present in the dataset, and allows multiple versions of the dataset to reside in the same entry:

```json
{
  "datasetVersions": [
    {
      "datasetDetails": {
        "versionID": "UUID",
        "versionCode": "v1.0.0",
        "keywords": [
          "keyword 1"
        ],
        "publishedDate": "2024-01-01",
        "updateDate": "2024-01-02"
      },
      "datasetContent": {
        "numberOfSubjects": 100,
        "minAge": 18,
        "maxAge": 35,
        "countries": [
          "UK",
          "US"
        ],
        "diseases": [
          "ad",
          "pd"
        ],
        "sex": [
          "male",
          "female"
        ],
        "clinical": [
          "lifeStyleInfo"
        ],
        "markers": [
          "amyloid"
        ],
        "images": [
          "mri"
        ],
        "electrophysiology": [
          "eeg"
        ],
        "dataTypes": [
          "demographics"
        ]
      }
    }
  ]
}
```

The information about each version is stored in the `datasetVersions` field, which is a list. Each version contains the details of the version, and the content of the dataset. Semantic versioning is recommended to enable version comparison and search.

#### Data collection

The data collection model describe a group of record level data that is collected over time on a wide range of subjects, and may be divided into smaller sub-collections for research, analysis and permission control. This model is added because in some real-world researches, the data generated is stored together, and only segmented on request, so can't be represented with finite atomic datasets. Thus, it is very similar to dataset, but does not have multiple versions.

```json
{
  "dataCollectionDetails": {
    "keywords": [
      "keyword 1"
    ],
    "publishedDate": "2024-01-01",
    "updateDate": "2024-01-02"
  },
  "dataCollectionContent": {
    "numberOfSubjects": 100,
    "minAge": 18,
    "maxAge": 35,
    "countries": [
      "UK",
      "US"
    ],
    "diseases": [
      "ad",
      "pd"
    ],
    "sex": [
      "male",
      "female"
    ],
    "clinical": [
      "lifeStyleInfo"
    ],
    "markers": [
      "amyloid"
    ],
    "images": [
      "mri"
    ],
    "electrophysiology": [
      "eeg"
    ],
    "dataTypes": [
      "demographics"
    ]
  }
}
```

## Relationship between meta sources

Metadata sources can be related to each other, forming a hierarchy or a graph of metadata. The relationships can be described as:

## Relationship between meta sources and data sources

Meta sources are designed to store metadata; thus internally, they possess relationships between each other, mainly the "**belong to**" relationship. For example: