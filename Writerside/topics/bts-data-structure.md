# Data Structure

The CV-BTS is essentially an API wrapper for a pre-built database structure. To understand the full functionality and the logic behind the system, it is important to understand the data structure that is used by the system.

## Databases

The two databases powering BTS are:

- Neo4J, storing all the term IDs as nodes, and the connections (parent-child, replaced-by, etc.) as relationships. It handles the traversal, expansion and similarity search of terms.
- MongoDB, storing the term details, such as label, description, synonyms, etc. It is used for the term auto-completion and term details retrieval.

The term IDs are stored in both databases, which act as a common key to link the term details and the relationships.

Additionally, Redis is used to provide application-level caching and power the metrics when multiple workers or instances are used.

> It is possible to only load or populate one of the two databases, and use only the partial functions. However, this is not the design intention of BTS, and most of the semantic functions will not behave as intended. Always ensure that both databases are populated and in-sync if you're not doing it through the provided scripts.
> {style="note"}

## Ontologies, Genes and other term sets

The BTS contains multiple sets of controlled vocabulary terms to facilitate different use cases. The ones supported (and planned) are:

- Clinical Terms Version 3 (CTV3)
- Hugo Gene Nomenclature Committee (HGNC) symbols and IDs
- Human Phenotype Ontology (HPO)
- National Cancer Institute Thesaurus (NCIT)
- Online Mendelian Inheritance in Man (OMIM)
- Orphanet Rare Disease Ontology (ORDO)
- Reactome Pathways and Reactions
- SNOMED-CT, SNOMED UK Edition, SNOMED UK Drug Extension, SNOMED UK Clinical Extension (SNOMED)
- National Center for Biotechnology Information (NCBI) Gene IDs *(planned)*

To enable semantic similarity and mapping query, some annotation and mapping are loaded between two term sets. They are:

- HPO-Gene mapping, provided by the HPO consortium, within its GitHub releases.
- Reactome-Gene mapping, provided by the Reactome consortium, within its relational database
- HPO-ORDO mapping (the HOOM model), provided by Orphanet
- CTV3-SNOMED mapping, provided by the NHS TRUD
