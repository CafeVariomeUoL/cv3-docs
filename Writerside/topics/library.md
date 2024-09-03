# Library

{is-library="true"}

<snippet id="json-meta_source_custom-minimum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSource.minimum.json">
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
</code-block>

</snippet>

<snippet id="json-meta_source_custom-maximum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSource.maximum.json">
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
</code-block>

</snippet>

<snippet id="json-meta_source_cohort-minimum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSourceCohort.minimum.json">
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
</code-block>

</snippet>

<snippet id="json-meta_source_cohort-maximum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSourceCohort.maximum.json">
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
</code-block>

</snippet>

<snippet id="json-meta_source_dataset-minimum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSourceDataset.minimum.json">
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
</code-block>

</snippet>

<snippet id="json-meta_source_dataset-maximum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSourceDataset.maximum.json">
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
</code-block>

</snippet>

<snippet id="json-meta_source_data_collection-minimum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSourceDataCollection.minimum.json">
{
  "sourceName": "A minimum dataset",
  "sourceType": "dataset",
  "publisher": {
    "publisherType": "individual",
    "name": "John Doe",
    "contactEmail": "john@example.com"
  },
  "resourceURLs": ["https://www.example.com"],
  "dataCollectionContent": {
    "numberOfSubjects": 100
  }
}
</code-block>

</snippet>

<snippet id="json-meta_source_data_collection-maximum">

<code-block lang="json" collapsible="true" collapsed-title="MetaSourceDataCollection.maximum.json">
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
  "dataCollectionDetails": {
    "keywords": [
      "keyword1",
      "keyword2"
    ],
    "publishedDate": "2023-12-02",
    "updateDate": "2023-12-12"
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
  },
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
</code-block>

</snippet>
