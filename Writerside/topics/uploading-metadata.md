# Uploading Metadata

To upload metadata into Cafe Variome, there are two different ways.

## Using the editing interface

The most straight forward way is to use the editing interface to (manually) create a new meta source. This is the
recommended approach when there are only several records to add.

> Document WIP.
> {style="warning"}

## Using the file uploader

If the metadata is large in quantity, or if the metadata is being exported from another system, it's better to use the
file uploader to upload the metadata. It does, however, requires the metadata to be in a specific format to allow direct
ingestion.

> The file uploader cannot override metadata entries. If you upload a new version of existing entry there will be duplications. Please remove the old entries before uploading the new ones.
> {style="warning"}

### Metadata file format

The metadata file to be uploaded should be in json format. It should be an array containing one or multiple objects,
each object being a meta source. The structure of the meta source should follow the [meta source model]({% link _
posts/2023-12-01-meta_data_model.md %}), but some fields can be omitted or left empty. The following is an example of a
metadata file:

```json
[
  {
    "sourceID": "8671ee9b-9175-41f0-b5f3-1dea241f46a7",
    "sourceName": "Some source",
    "sourceType": "custom",
    "publisher": {
      "publisherType": "individual",
      "name": "John Doe",
      "contactEmail": "john@example.com",
      "contactName": "John Doe",
      "url": "https://www.example.com",
      "location": "Somewhere"
    },
    "resourceURLs": [
      "https://www.example.com"
    ],
    "description": "A mock data source",
    "releaseLicense": "https://opensource.org/licenses/MIT",
    "language": "en",
    "connectionID": "7b5cb9a6-6244-40ee-9355-56c0901e679c",
    "customFields": {
      "Field 0": "Value 0"
    }
  }
]
```

### Fields and constraints

For the fields within the metadata model, some comes with constraints and format requirements. Here is a list of all
fields, what they are, and their constraints. For the ones **not** marked as optional, they are required, but may be
left empty (as an empty string) or 0 (as a number) unless otherwise specified. All field names are case sensitive.

For a metadata entry, it cannot contain any other fields, except the ones allowed in **customFields** or some similar
fields labeled as "custom". Any other fields will be ignored, and not stored or represented in any way.

#### Internal fields and manual assignment

The fields explained in the below sections are the fields that are meaningful as actual data. However, there are several
fields used internally within Cafe Variome to power specific features like interlinking of metadata entries. They are
not visible when using the editing interface. However, when uploading the file uploader, they may be manually assigned,
providing the data is **accurate** and the admin **knows what they are doing**. These fields are:

- **sourceID**: `string` `optional` The UUID of the source. If omitted, Cafe Variome will assign a UUID to the source.
  If present, it should be a valid UUID 4 string adhering to the UUID standard. This is used within each Cafe Variome
  instance (UUID may not be unique accross instances) to identify the source. It can be used to link one metadata entry
  to another, for example by filling the `datasetIDs` fields in cohort model.
- **connectionID**: `string` `optional` The UUID of a **data source** this metadata entry describes. This is usually
  only valid when the metadata describes a dataset, but in rare cases can be assigned to other metadata. This field is
  not recommended to assign directly, as there is no other ways to know the UUID of a data source except from checking
  the database.

Note that these fields are also present in the maximum examples below.

> Assigning `sourceID` and `connectionID` manually can lead to data inconsistency, and should be done with caution. Always make sure the ID is present before adding them to the metadata file. If there are only a small amount of IDs to assign, it's better to do it manually in the editing interface.
> {style="warning"}

#### Common fields

These are the fields that are present in all types of meta sources.

- **sourceName**: `string` The name of the source. **Cannot be empty**.
- **sourceType**: `string` The type of the source. This is very important, as it determines how this entry is
  interpreted. **Cannot be empty**. It's an enumeral field, can only be one of the following (case sensitive):
    - *custom*: A custom type that is not covered by the following types.
    - *cohort*: A EPND Cohort metadata model.
    - *catalog*: A catalog of datasets.
    - *biobank*: A collection of biological samples.
    - *registry*: A patient registry.
    - *guideline*: A guideline.
    - *dataset*: A collection of records.
    - *dataCollection*: A data collection.
- **resourceURLs**: `array[string]` `optional` The URLs of the source. They should be fully qualified URLs with schema (e.g. `https://example.com/). They should point to the main resource of the source, its description, or any point of interest that a requesting user may need.
- **publisher**: `object` The publisher of the resource. It's a nested JSON object, with the following fields:
    - **publisherType**: `string` The type of the publisher. It's an enumeral field, can only be one of the following (
      case sensitive):
        - *individual*: An individual person.
        - *organization*: An organization.
        - *agency*: An agency that is not the generator/owner of the resource, but is responsible for managing the resource.
        - *other*: Any other type of publisher.
    - **name**: `string` The name of the publisher. **Cannot be empty**.
    - **contactEmail**: `string` The contact email of the publisher. Cannot be empty.
    - **contactName**: `string` `optional` The contact name of the publisher, in case the publiser is not an individual.
    - **url**: `string` `optional` The URL of the publisher.
    - **location**: `string` `optional` The location of the publisher. A string containing free text, for example it can
      be `UK` or `Leicester, UK, Europe`.
- **description**: `string` `optional` The description of the source. Can be empty, but not recommended, as this is the
  main field that will be used to describe the source and used in free-text search.
- **themes**: `array[string]` `optional` The themes of the source. It's an array of strings, each string being a URI to
  a RDF data structure theme. Useful when custom theme is required when generating FDP data from this source. If
  omitted, the default theme will be used.
- **releaseLicense**: `string` `optional` The release license of the source. It should be a URL to the license, and if
  omitted, it will be considered "no license", meaning all rights reserved, no permission to use, modify, or distribute
  the data.
- **language**: `string` `optional` The language of the source. It should be a 2 character code adhere to ISO639-1
  standard, in lower case.
- **customFields**: `object` `optional` The custom fields of the source. It's a key-value or key\[values\] pairs, where
  the key is a string, and the value is a string or an array of strings. It's designed to contain the custom meta data
  in a searchable form. The key cannot contain special characters including dot`.`, dollar sign`$`, slash`/`, or
  backslash`\`. If a key is present, the value cannot be `null`, but can be an empty string or an empty array.

#### Cohort specific fields

These are the fields specific to the cohort type.

- **cohortDetails**: `object` The details of the cohort. It's a nested JSON object, with the following fields:
    - **siteType**: `string` The type of the site. It's an enumeral strings, being one of the following (case
      sensitive):
        - *singleSite*: A cohort that has only a single site.
        - *multiSite*: A cohort that has multiple sites.
        - *multiCountry*: A cohort that has multiple sites in multiple countries.
    - **country**: `string` The country of the cohort. It's a 2 character code adhere to ISO3166-1 standard, in upper
      case.
    - **yearStart**: `integer` The year the cohort started. It should be a 4 digit integer.
- **collectedTypes**: `object` `optional` The types of data collected for the cohort. It's a nested JSON object, with
  the following fields:
    - **participants**: `object` `optional` The participants amount of the cohort, and their conditions. It's a nested
      JSON object, with the following fields:
        - **diseases**: `array[string]` The diseases that the participants are categorized by. This field cannot be
          empty. An empty array will cause the entire **participants** object to be ignored. It's an array of enumeral
          strings, each can only be one of the following (case sensitive):
            - *controlGroup*: Control group participants.
            - *ad*: Alzheimer's disease.
            - *pd*: Parkinson's disease.
            - *irbd*: Isolated REM Sleep Behavior Disorder.
            - *dlb*: Dementia with Lewy Bodies.
            - *caa*: Cerebral Amyloid Angiopathy.
            - *ftd*: Frontotemporal Dementia.
            - *als*: Amyotrophic Lateral Sclerosis.
            - *psp*: Progressive Supranuclear Palsy.
            - *cbd*: Corticobasal Degeneration.
            - *msa*: Multiple System Atrophy.
            - *hd*: Huntington's Disease.
            - *ataxia*: Ataxia.
            - *other*: Other diseases not listed above.
        - **numberOfSubjects**: `integer` The number of subjects in the cohort. It's a number, and should be above 0. If
          it's 0, the entire **participants** object will be ignored.
    - **bioSamples**: `array[string]` `optional` The types of samples collected in the study. It's an array of enumeral
      strings, each being one of the following (case sensitive):
        - *csf*: Cerebrospinal fluid.
        - *serum*: Serum.
        - *plasma*: Plasma.
        - *dna*: DNA.
        - *saliva*: Saliva.
        - *urine*: Urine.
        - *stool*: Stool.
    - **images**: `array[string]` `optional` The types of images collected for the study. It's an array of enumeral
      strings, each being one of the following (case sensitive):
        - *mri*: MRI.
        - *petAmyloid*: PET Amyloid.
        - *petTau*: PET Tau.
        - *datScan*: DAT Scan.
        - *spect*: SPECT.
        - *ocular*: Ocular.
    - **cognitiveData**: `array[string]` `optional` The types of cognitive data collected for the study. It's an array
      of enumeral strings, each being one of the following (case sensitive):
        - *crossSectional*: Cross-sectional data.
        - *longitudinal*: Longitudinal data.
- **datasetIDs**: `array[string]` `optional` The UUIDs of the `dataset` type metadata entries that are related to this
  cohort. It's an array of strings, each being a UUID of a dataset metadata entry. The datasets have to be either
  present in the same file, or already uploaded to the system.

#### Dataset Specific fields

These are the fields specific to the dataset type.

- **datasetVersions**: `array[object]` The versions of the dataset. It's an array of nested JSON objects, each object
  being a representation of a version of the dataset. Each object has the following fields:
    - **datasetDetails**: `object` The details of the dataset. It's a nested JSON object, with the following fields:
        - **versionID**: `string` `optional` The UUID of the version. If omitted, Cafe Variome will assign a UUID to the
          version. If present, it should be a valid UUID 4 string. Either way it will always be present in the database.
        - **versionCode**: `string` `optional` The version number of the dataset. Semantic versioning is recommended.
          Using a format that does not fit with semantic versioning will disable the parsing, comparison and sorting of
          the versions.
        - **keywords**: `array[string]` `optional` The keywords of the dataset. It's an array of strings, each being a
          keyword.
        - **publishedDate**: `string` `optional` The date when the dataset is released. It should be a date string in
          the format of `YYYY-MM-DD`.
        - **updateDate**: `string` `optional` The update date of the dataset. It should be a date string in the format
          of `YYYY-MM-DD`.
    - **datasetContent**: `object` The information on the data content of the dataset. It's a nested JSON object, with
      the following fields:
        - **numberOfSubjects**: `integer` The amount of data records in the dataset. It should be a number, and should
          be above 0. It may be an approximated number, if the exact number is kept private for confidentiality reasons.
        - **minAge**: `integer` `optional` The minimum age of the participants in the dataset. It should be a number,
          and should be above 0.
        - **maxAge**: `integer` `optional` The maximum age of the participants in the dataset. It should be a number,
          and should be above 0.
        - **countries**: `array[string]` `optional` The countries of the participants in the dataset. It's an array of 2
          character codes adhere to ISO3166-1 standard, in upper case.
        - **diseases**: `array[string]` `optional` The diseases of the participants in the dataset. It's an array of
          enumerable strings, each can only be one of the following (case sensitive):
            - *controlGroup*: Control group participants.
            - *ad*: Alzheimer's disease.
            - *pd*: Parkinson's disease.
            - *irbd*: Isolated REM Sleep Behavior Disorder.
            - *dlb*: Dementia with Lewy Bodies.
            - *caa*: Cerebral Amyloid Angiopathy.
            - *ftd*: Frontotemporal Dementia.
            - *als*: Amyotrophic Lateral Sclerosis.
            - *psp*: Progressive Supranuclear Palsy.
            - *cbd*: Corticobasal Degeneration.
            - *msa*: Multiple System Atrophy.
            - *hd*: Huntington's Disease.
            - *ataxia*: Ataxia.
            - *other*: Other diseases not listed above.
        - **sex**: `array[string]` `optional` The genders covered in the dataset. It's an array of enumerable strings,
          each can only be one of the following (case sensitive):
            - *male*: Biological male.
            - *female*: Biological female.
            - *other* Biological other.
            - *undifferential*: Gender data is irrelevant to the data, or is not differentiated on purpose.
            - *unknown*: No information regarding the gender composition or collection status.
        - **clinical**: `array[string]` `optional` The clinical data collected within the dataset. It's an array of
          enumerable strings, each can only be one of the following (case sensitive):
            - *comorbidities*: Comorbidities.
            - *medicationUse*: Medication use.
            - *familyHistory*: Family history.
            - *ageOfSymptomOnset*: Age of symptom onset.
            - *clinicalDiagnosis*: Clinical diagnosis.
            - *exposure*: Exposure.
            - *lifeStyleInfo*: Life style information.
            - *vitalSigns*: Vital signs.
        - **markers**: `array[string]` `optional` The biological or digital markers collected within the dataset. It's
          an array of enumerable strings, each can only be one of the following (case sensitive):
            - *amyloid*: Amyloid protein markers.
            - *tau*: Tau protein markers.
            - *neurofilamentLightChain*: Neurofilament light chain protein markers.
            - *alphaSynuclein*: Alpha-synuclein protein markers.
            - *digitalMarkers*: Digital markers.
        - **images**: `array[string]` `optional` The types of images collected within the dataset. It's an array of
          enumerable strings, each can only be one of the following (case sensitive):
            - *mri*: MRI.
            - *petAmyloid*: PET Amyloid.
            - *petTau*: PET Tau.
            - *datScan*: DAT Scan.
            - *spect*: SPECT.
            - *ocular*: Ocular.
        - **electrophysiology**: `array[string]` `optional` The types of electrophysiology data collected within the
          dataset. It's an array of enumerable strings, each can only be one of the following (case sensitive):
            - *eeg*: EEG.
            - *meg*: MEG.
            - *erp*: ERP.
        - **dataTypes**: `array[string]` `optional` The types of data collected within the dataset. It's an array of
          enumerable strings, each can only be one of the following (case sensitive):
            - *demographics*: Demographics.
            - *clinical*: Clinical.
            - *lifestyle*: Lifestyle.
            - *functionalRatings*: Functional ratings.
            - *motor*: Motor.
            - *neuropsychiatric*: Neuropsychiatric.
            - *neuropsychological*: Neuropsychological.
            - *qualityOfLife*: Quality of life.
            - *sleepScales*: Sleep scales.
            - *digitalData*: Digital data.
            - *imaging*: Imaging.
            - *electrophysiology*: Electrophysiology.
            - *neuroPathology*: Neuro pathology.
            - *other*: Other.

#### Data collection Specific fields

These are the fields specific to the data collection type.

- **dataCollectionDetails**: `object` `optional` The details of the data collection. It's a nested JSON object, with the
  following fields:
    - **keywords**: `array[string]` `optional` The keywords of the dataset. It's an array of strings, each being a
      keyword.
    - **publishedDate**: `string` `optional` The date when the dataset is released. It should be a date string in the
      format of `YYYY-MM-DD`.
    - **updateDate**: `string` `optional` The update date of the dataset. It should be a date string in the format
      of `YYYY-MM-DD`.
- **dataCollectionContent**: `object` `optional` The information on the data content of the data collection. It's a
  nested JSON object, with the following fields:
    - **numberOfSubjects**: `integer` The amount of data records in the dataset. It should be a number, and should be
      above 0. It may be an approximated number, if the exact number is kept private for confidentiality reasons.
    - **minAge**: `integer` `optional` The minimum age of the participants in the dataset. It should be a number, and
      should be above 0.
    - **maxAge**: `integer` `optional` The maximum age of the participants in the dataset. It should be a number, and
      should be above 0.
    - **countries**: `array[string]` `optional` The countries of the participants in the dataset. It's an array of 2
      character codes adhere to ISO3166-1 standard, in upper case.
    - **diseases**: `array[string]` `optional` The diseases of the participants in the dataset. It's an array of
      enumerable strings, each can only be one of the following (case sensitive):
        - *controlGroup*: Control group participants.
        - *ad*: Alzheimer's disease.
        - *pd*: Parkinson's disease.
        - *irbd*: Isolated REM Sleep Behavior Disorder.
        - *dlb*: Dementia with Lewy Bodies.
        - *caa*: Cerebral Amyloid Angiopathy.
        - *ftd*: Frontotemporal Dementia.
        - *als*: Amyotrophic Lateral Sclerosis.
        - *psp*: Progressive Supranuclear Palsy.
        - *cbd*: Corticobasal Degeneration.
        - *msa*: Multiple System Atrophy.
        - *hd*: Huntington's Disease.
        - *ataxia*: Ataxia.
        - *other*: Other diseases not listed above.
    - **sex**: `array[string]` `optional` The genders covered in the dataset. It's an array of enumerable strings, each
      can only be one of the following (case sensitive):
        - *male*: Biological male.
        - *female*: Biological female.
        - *other* Biological other.
        - *undifferential*: Gender data is irrelevant to the data, or is not differentiated on purpose.
        - *unknown*: No information regarding the gender composition or collection status.
    - **clinical**: `array[string]` `optional` The clinical data collected within the dataset. It's an array of
      enumerable strings, each can only be one of the following (case sensitive):
        - *comorbidities*: Comorbidities.
        - *medicationUse*: Medication use.
        - *familyHistory*: Family history.
        - *ageOfSymptomOnset*: Age of symptom onset.
        - *clinicalDiagnosis*: Clinical diagnosis.
        - *exposure*: Exposure.
        - *lifeStyleInfo*: Life style information.
        - *vitalSigns*: Vital signs.
    - **markers**: `array[string]` `optional` The biological or digital markers collected within the dataset. It's an
      array of enumerable strings, each can only be one of the following (case sensitive):
        - *amyloid*: Amyloid protein markers.
        - *tau*: Tau protein markers.
        - *neurofilamentLightChain*: Neurofilament light chain protein markers.
        - *alphaSynuclein*: Alpha-synuclein protein markers.
        - *digitalMarkers*: Digital markers.
    - **images**: `array[string]` `optional` The types of images collected within the dataset. It's an array of
      enumerable strings, each can only be one of the following (case sensitive):
        - *mri*: MRI.
        - *petAmyloid*: PET Amyloid.
        - *petTau*: PET Tau.
        - *datScan*: DAT Scan.
        - *spect*: SPECT.
        - *ocular*: Ocular.
    - **electrophysiology**: `array[string]` `optional` The types of electrophysiology data collected within the
      dataset. It's an array of enumerable strings, each can only be one of the following (case sensitive):
        - *eeg*: EEG.
        - *meg*: MEG.
        - *erp*: ERP.
    - **dataTypes**: `array[string]` `optional` The types of data collected within the dataset. It's an array of
      enumerable strings, each can only be one of the following (case sensitive):
        - *demographics*: Demographics.
        - *clinical*: Clinical.
        - *lifestyle*: Lifestyle.
        - *functionalRatings*: Functional ratings.
        - *motor*: Motor.
        - *neuropsychiatric*: Neuropsychiatric.
        - *neuropsychological*: Neuropsychological.
        - *qualityOfLife*: Quality of life.
        - *sleepScales*: Sleep scales.
        - *digitalData*: Digital data.
        - *imaging*: Imaging.
        - *electrophysiology*: Electrophysiology.
        - *neuroPathology*: Neuro pathology.
        - *other*: Other.

### Metadata model examples

Here are some minimum and maximum examples of metadata model for different source types.

Minimum example for `custom` type:

```json
{
  "sourceName": "A minimum custom source",
  "sourceType": "custom",
  "publisher": {
    "publisherType": "individual",
    "name": "John Doe",
    "contactEmail": "john@example.com"
  },
  "resourceURLs": [
    "https://www.example.com"
  ]
}
```

Maximum example for `custom` type:

```json
{
  "sourceID": "8df136d8-7fb0-4bec-a72a-5deed972bbb6",
  "sourceName": "A maximum custom source",
  "sourceType": "custom",
  "publisher": {
    "publisherType": "organization",
    "name": "University of Leicester",
    "contactEmail": "brookeslab@le.ac.uk",
    "contactName": "John Doe",
    "url": "https://www.le.ac.uk",
    "location": "Leicester, UK, Europe"
  },
  "resourceURLs": ["https://www.example.com"],
  "description": "This is a maximum example of a custom source",
  "themes": [
    "https://example.com/theme1",
    "https://example.com/theme2"
  ],
  "releaseLicense": "https://opensource.org/licenses/MIT",
  "language": "en",
  "connectionID": "b1120b19-e631-46ad-915c-c964c8a278a2",
  "customFields": {
    "Some custom field": "Some value",
    "Another custom field": [
      "Value 1",
      "Value 2"
    ]
  }
}
```

Minimum example for `cohort` type:

```json
{
  "sourceName": "A minimum cohort",
  "sourceType": "cohort",
  "publisher": {
    "publisherType": "individual",
    "name": "John Doe",
    "contactEmail": "john@example.com"
  },
  "resourceURLs": ["https://www.example.com"],
  "cohortDetails": {
    "siteType": "singleSite",
    "country": "UK",
    "yearStart": 2023
  }
}
```

Maximum example for `cohort` type:

```json
{
  "sourceID": "a6e001cb-bb60-48b9-a47a-3dccee13c085",
  "sourceName": "A maximum cohort",
  "sourceType": "cohort",
  "publisher": {
    "publisherType": "organization",
    "name": "University of Leicester",
    "contactEmail": "brookeslab@le.ac.uk",
    "contactName": "John Doe",
    "url": "https://www.le.ac.uk",
    "location": "Leicester, UK, Europe"
  },
  "resourceURLs": ["https://www.example.com"],
  "description": "This is a maximum example of a cohort",
  "releaseLicense": "https://opensource.org/licenses/MIT",
  "language": "en",
  "themes": [
    "https://example.com/theme1",
    "https://example.com/theme2"
  ],
  "cohortDetails": {
    "siteType": "multiSite",
    "country": "UK",
    "yearStart": 2023
  },
  "collectedTypes": {
    "participants": {
      "diseases": [
        "controlGroup",
        "ad",
        "hd"
      ],
      "numberOfSubjects": 1000
    },
    "bioSamples": [
      "csf",
      "serum",
      "plasma",
      "dna",
      "saliva",
      "urine"
    ],
    "images": [
      "mri",
      "petTau",
      "datScan"
    ],
    "cognitiveData": [
      "crossSectional"
    ]
  },
  "connectionID": "6c3968af-3d29-4f81-8747-b2337c1cc01b",
  "datasetIDs": [
    "adbec8c2-9460-4814-9574-06a0dfe2efb5"
  ],
  "customFields": {
    "Some custom field": "Some value",
    "Another custom field": [
      "Value 1",
      "Value 2"
    ]
  }
}
```

Minimum example for `dataset` type:

```json
{
  "sourceName": "A minimum dataset",
  "sourceType": "dataset",
  "publisher": {
    "publisherType": "individual",
    "name": "John Doe",
    "contactEmail": "john@example.com"
  },
  "resourceURLs": ["https://www.example.com"],
  "datasetVersions": [
    {
      "datasetDetails": {
        "versionCode": "v1.0.0"
      },
      "datasetContent": {
        "numberOfSubjects": 100
      }
    }
  ]
}
```

Maximum example for `dataset` type:

```json
{
  "sourceID": "adbec8c2-9460-4814-9574-06a0dfe2efb5",
  "sourceName": "A maximum dataset",
  "sourceType": "dataset",
  "publisher": {
    "publisherType": "organization",
    "name": "University of Leicester",
    "contactEmail": "brookeslab@le.ac.uk",
    "contactName": "John Doe",
    "url": "https://www.le.ac.uk",
    "location": "Leicester, UK, Europe"
  },
  "resourceURLs": ["https://www.example.com"],
  "description": "This is a maximum example of a custom source",
  "themes": [
    "https://example.com/theme1",
    "https://example.com/theme2"
  ],
  "datasetVersions": [
    {
      "datasetDetails": {
        "versionID": "1b71b513-33be-45ee-b6e9-a24b2bc9dc05",
        "versionCode": "v1.0.0",
        "keywords": [
          "keyword1",
          "keyword2"
        ],
        "publishedDate": "2023-12-02",
        "updateDate": "2023-12-12"
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
          "controlGroup",
          "ad",
          "hd"
        ],
        "sex": [
          "male",
          "female"
        ],
        "clinical": [
          "lifeStyleInfo",
          "vitalSigns"
        ],
        "markers": [
          "amyloid",
          "tau"
        ],
        "images": [
          "mri",
          "petTau",
          "datScan"
        ],
        "electrophysiology": [
          "eeg",
          "meg"
        ],
        "dataTypes": [
          "demographics"
        ]
      }
    },
    {
      "datasetDetails": {
        "versionID": "4114682d-73f5-45eb-9b7c-023e18cd12c9",
        "versionCode": "v2.0.0",
        "keywords": [
          "keyword3",
          "keyword4"
        ],
        "publishedDate": "2024-01-01",
        "updateDate": "2024-01-11"
      },
      "datasetContent": {
        "numberOfSubjects": 200,
        "minAge": 20,
        "maxAge": 40,
        "countries": [
          "UK",
          "US",
          "CA"
        ],
        "diseases": [
          "controlGroup",
          "ad",
          "hd"
        ],
        "sex": [
          "male",
          "female",
          "other"
        ],
        "clinical": [
          "lifeStyleInfo",
          "vitalSigns"
        ],
        "markers": [
          "amyloid",
          "tau",
          "neurofilamentLightChain"
        ],
        "images": [
          "mri",
          "petTau",
          "datScan",
          "spect"
        ],
        "electrophysiology": [
          "eeg",
          "meg",
          "erp"
        ],
        "dataTypes": [
          "demographics",
          "clinical",
          "lifestyle"
        ]
      }
    }
  ],
  "releaseLicense": "https://opensource.org/licenses/MIT",
  "language": "en",
  "connectionID": "ac743200-c8ff-485e-a82d-45d0e636f862",
  "customFields": {
    "Some custom field": "Some value",
    "Another custom field": [
      "Value 1",
      "Value 2"
    ]
  }
}
```

### Uploading the metadata file

To upload the metadata file, go to the admin interface, and click on the "Create Meta Source" button.

![interface-landing_page_dashboard.png](interface-landing_page_dashboard.png)

![interface-meta_source_upload.png](interface-meta_source_upload.png)

Then, set the meta source type to "all" to use the file uploader. Multiple files can be selected, and selected files can
be removed before finalising the upload.

![interface-file_pick_multiple.png](interface-file_pick_multiple.png)

![interface-meta_source_file_selected.png](interface-meta_source_file_selected.png)

Once the files are decided, click the "Process" button to start reading and processing the files. All of the metadata
entries will be read in the front end, sanitised and validated, and then sent to the server for storage. After
processing, you will be prompted with the number of metadata entries it read in, and to confirm the upload. Once
confirmed, the metadata entries will be stored in the database, and will be available for search and discovery.
