# Subjects

This page explains how subject (typically a patient) information is stored in the relevant collection. It represents the final form of the input data, organised to support the queries used in Cafe Variome.

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

- `subjectId` is a unique identifier for the subject. If the original data source does not provide a unique identifier, Cafe Variome will generate one with <tooltip term="UUID4">UUID4 format</tooltip>. If the original data contains an ID and Cafe Variome is instructed to use it, it will not change anything. The ID should remain constant for the same subject within the same source, even across data updates, to allow correct association with other data.
- `HPO` is an array of strings, containing the ID part (with no `HPO:` or similar prefixes) of Human Phenotype Ontology terms. These IDs are stored as strings with leading zeros, following the standard <tooltip term="HPO">HPO</tooltip>. structure. It may also contain a dictionary, where the key represents a descriptive term and the value corresponds to the actual attribute value (which could be a term, boolean, number, or other types).
- `ORDO` is an array of strings, containing the ID part (with no `ORDO:` or similar prefixes) of Orphanet Rare Disease Ontology terms. Similar to <tooltip term="HPO">HPO</tooltip> terms, it's the part taken from <tooltip term="ORDO">ORDO</tooltip> IDs directly, without the prefix.
- `SNOMED` is an array of strings containing the <tooltip term="SNOMED">SNOMED</tooltip> CT term IDs. It may also contain a dictionary, where the key is a descriptive term, and the value represents the actual attribute value, which could be a term, boolean, number, or any other type.
- `NCIT` is an array of strings, containing the National Cancer Institute Thesaurus term IDs.
- `ALLELES` is an array of objects that describe the alleles present in the subject. Each object contains two fields: `gene`, which represents the gene name (in <tooltip term="HGNC">HGNC</tooltip> format), and `alleles`, which consists of a pair of values representing the alleles of the gene that the subject has."
- `VARIANT` is an array of objects designed to describe what type of genetic variants the subject has. Each object contains two fields: `gene` and `mutation`. The `gene` field is the gene name (in <tooltip term="HGNC">HGNC</tooltip> format), and the `mutation` field is the protein effect of the mutation. The `af` field is the allele frequency of the mutation. If the allele frequency is not provided, Cafe Variome will use the dataset itself to calculate it. This is to assume the dataset contains full information about each subject and their genetic variants.
- `EAV` is a key-value pair object, where the key is the attribute name and the value is the attribute value. This is used to store any additional information that does not fit into the other fields. The values can be string, number, boolean, or an array of the above.

## Ontology Terms and Qualifiers

### Prefix and ID structure

The ontology terms for subjects are stored in their corresponding fields as an array. They do not contain their prefixes (e.g. `HP:`, `Orpha:`), only the part after the prefix colon. All queries, indices, and other processing are done with the terms in this format. Note that not all prefixes or "common parts" of an ID are considered prefix; only the ones in namespace format are removed.
