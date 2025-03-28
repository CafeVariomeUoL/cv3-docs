# Data Structure

The CV-BTS is essentially an API wrapper for a pre-built database structure. To understand the full functionality and the logic behind the system, it is important to understand the data structure that is used by the system.

## Databases

The two databases powering BTS are:

- **Neo4J** - storing all the term IDs as nodes, and the connections (parent-child, replaced-by, etc.) as relationships. This handles the traversal, expansion and similarity search of terms.
- **MongoDB** - storing the term details, such as label, description, synonyms, etc. This is used for the term auto-completion and term details retrieval.

The term IDs are stored in both databases, which act as a common key to link the term details and the relationships.

Additionally, Redis is used to provide application-level caching and power the metrics when multiple workers or instances are used.

> It is possible to only load or populate one of the two databases, and use only the partial functions. However, this is not the design intention of BTS, and most of the semantic functions will not behave as intended. Always ensure that both databases are populated and in-sync if you're not doing it through the provided scripts.
> {style="note"}

## Ontologies, Genes and other term sets

The BTS contains multiple sets of controlled vocabulary terms to facilitate different use cases. The ones supported (and planned) are:

- Clinical Terms Version 3 (CTV3)
- Ensembl Gene database (Ensembl)
- Hugo Gene Nomenclature Committee (<tooltip term="HGNC">HGNC</tooltip>) symbols and IDs
- Human Phenotype Ontology (<tooltip term="HPO">HPO</tooltip>)
- National Cancer Institute Thesaurus (<tooltip term="NCIT">NCIT</tooltip>)
- Online Mendelian Inheritance in Man (<tooltip term="OMIM">OMIM</tooltip>)
- Orphanet Rare Disease Ontology (<tooltip term="ORDO">ORDO</tooltip>)
- Reactome Pathways and Reactions
- <tooltip term="SNOMED">SNOMED</tooltip>-CT, <tooltip term="SNOMED">SNOMED</tooltip> UK Edition, <tooltip term="SNOMED">SNOMED</tooltip> UK Drug Extension, <tooltip term="SNOMED">SNOMED</tooltip> UK Clinical Extension (<tooltip term="SNOMED">SNOMED</tooltip>)
- National Center for Biotechnology Information (NCBI) Gene IDs *(planned)*

To enable semantic similarity and mapping query, some annotations and mappings are loaded between two term sets. They are:

- HPO-Gene mapping, provided by the <tooltip term="HPO">HPO</tooltip> consortium, within its GitHub releases.
- Reactome-Gene mapping, provided by the Reactome consortium, within its relational database.
- NCIT-Gene mapping, provided by the NCI Thesaurus, within its release files.
- OMIM-Gene mapping, provided by the <tooltip term="OMIM">OMIM</tooltip>, with a separate release file.
- HPO-ORDO mapping (the <tooltip term="HOOM model">HOOM model</tooltip>), provided by Orphanet
- ORDO-Gene mapping, provided by Orphanet, in its rare disease gene annotation files.
- ORDO-OMIM mapping, provided by Orphanet, in its alignment files.
- CTV3-SNOMED mapping, provided by the NHS TRUD.
- SNOMED-ORDO mapping, provided by <tooltip term="SNOMED">SNOMED</tooltip> (via UMLS downloads), as a Orphanet mapping pack.

## Input files

The system takes various input file formats to load the data into the databases, but each dataset can use only one of the designated formats. The supported formats are:

- CTV3: CTV3 speciality files, in the NHS TRUD format.
- Ensembl: GTF files.
- <tooltip term="HGNC">HGNC</tooltip>: TSV files.
- <tooltip term="HPO">HPO</tooltip>: OWL files.
- <tooltip term="NCIT">NCIT</tooltip>: TSV files.
- <tooltip term="OMIM">OMIM</tooltip>: CSV files.
- <tooltip term="ORDO">ORDO</tooltip>: OWL files.
- Reactome: There is a special script to extract from its neo4j database (when it's running), and store the data into CSV. The main program accepts this processed CSV file.
- <tooltip term="SNOMED">SNOMED</tooltip>: RF2 files.

For CTV3, CSV, TSV and RF2 files, `pandas` is used to load the raw data file; for OWL files `owlready2` is used to parse the ontology structure.
