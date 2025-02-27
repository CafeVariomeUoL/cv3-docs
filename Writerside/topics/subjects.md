# Subjects

This page details how subject (usually a patient) information is stored in the corresponding collection. This is the final form of the input data, and is structured to facilitate the queries used in Cafe Variome.

## Subject Data Structure

Each subject is stored as an item within a specific collection belonging to a source. The subject is represented with a JSON object, with the following fields:

```json
{
    "subjectId": "string",
    "HPO": [
        "0000002",
        "0000003",
        {
            "0000004": 25
        }
    ],
    "ORDO": ["1234"],
    "SNOMED": [
        "248153007",
        {
            "424144002": 25
        }
    ],
    "NCIT": ["C12345"],
    "ALLELES": [
        {
            "gene": "APOE",
            "alleles": ["e3", "e3"]
        }
    ],
    "VARIANT": [
        {
            "gene": "APOE",
            "mutation": "lossOfStart",
            "af": 0.01
        }
    ],
    "EAV": {
        "attribute1": "Value 1",
        "attribute2": 2,
        "attribute3": true,
        "attribute4": ["Value 4", "Value 5"]
    }
}
```

In the example:

- `subjectId` is a unique identifier for the subject. If the original data source does not provide a unique identifier, Cafe Variome will generate one with UUID4 format. If the original data contains an ID and Cafe Variome is instructed to use it, it will not change anything. The ID should remain constant for the same subject within the same source, even across data updates, to allow correct association with other data.
- `HPO` is an array of strings, containing the ID part (with no `HPO:` or similar prefixes) of Human Phenotype Ontology terms. It's kept as a string with front-padded zeros, as the HPO terms standard structure. It may also contain a dictionary, where the key is a descriptive term, and the value being the actual value of the attribute (could be a term, boolean, number, or anything).
- `ORDO` is an array of strings, containing the ID part (with no `ORDO:` or similar prefixes) of Orphanet Rare Disease Ontology terms. Similar to HPO terms, it's the part taken from ORDO IDs directly, without the prefix.
- `SNOMED` is an array of strings, containing the SNOMED CT term IDs. It may also contain a dictionary, where the key is a descriptive term, and the value being the actual value of the attribute (could be a term, boolean, number, or anything).
- `NCIT` is an array of strings, containing the National Cancer Institute Thesaurus term IDs.
- `ALLELES` is an array of objects designed to describ what type of alleles the subject has. Each object contains two fields: `gene` and `allele`. `gene` is the gene name (in HGNC format), and `alleles` are a pair of values representing the alleles of this gene that the subject has.
- `VARIANT` is an array of objects designed to describe what type of genetic variants the subject has. Each object contains two fields: `gene` and `mutation`. The `gene` field is the gene name (in HGNC format), and the `mutation` field is the protein effect of the mutation. The `af` field is the allele frequency of the mutation. If the allele frequency is not provided, Cafe Variome will use the dataset itself to calculate it. This is to assume the dataset contains full information about each subject and their genetic variants.
- `EAV` is a key-value pair object, where the key is the attribute name and the value is the attribute value. This is used to store any additional information that does not fit into the other fields. The values can be string, number, boolean, or an array of the above.

## Ontology Terms and Qualifiers

### Prefix and ID structure

The ontology terms for subjects are stored in their corresponding fields as an array. They do not contain their prefixes (e.g. `HP:`, `Orpha:`), only the part after the prefix colon. All queries, indices, and other processing are done with the terms in this format. Note that not all prefixes or "common parts" of an ID are considered prefix; only the ones in namespace format are removed.
