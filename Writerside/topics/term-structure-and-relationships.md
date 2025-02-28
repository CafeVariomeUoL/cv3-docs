# Term Structure and Relationships

## Ontology Tree

A large portion of the terms loaded into the databases are ontology terms. They come in a "tree" like structure, where a term may have children -- more detailed, specific terms -- and one or more parents -- more general, broader terms. This structure is used to represent the relationships between terms, and to facilitate the expansion and traversal of terms. The fact that a term may have more than one parent makes it a Directed Acyclic Graph (DAG) rather than a strict tree. Below is an example of the Human Phenotype Ontology (HPO) tree structure:

<img src="gn-hpo-ontology-structure.svg" alt="HPO Ontology Structure" width="450"/>

There are 2 main relationships in the ontology tree:

- `IS_A` relationship. This type of relationship exists between parents and children, pointing toward the parent. It indicates that a child term is a (more specific) type of the parent term. For example, "Gaucher cells" is a more specific description of a "
  Abnormal cell morphology". In ontologies, it's guaranteed that a child term has all the properties of its parent term.
- `REPLACED_BY` relationship. This type of relationship represent a modification in the ontology structure, usually due to new findings or adjustments. A `REPLACED_BY` relationship points from a deprecated term to a new term that serves in its place. Not all deprecated terms are replaced by new terms, and some may be removed entirely.

## Genomic data

Genomic data is different from ontological data. They do not have a hierarchical structure, but a "flat" format. Each gene is represented as a node, with no parent-child relationship. The `REPLACED_BY` relationship still applies. However, genomic data contains more than genes. It also includes transcripts, exons, proteins(products), and maybe variants. This part of the data is captured as:

<img src="gn-genomic-data-structure.svg" alt="Genomic Data Structure" width="450"/>

Specifically, the relationships between the entities are:

- `HAS_SYMBOL' relationship connects from a gene term to a HGNC standard gene symbol. This is to separate each gene term set, but allow them to be cross-referenced based on the HGNC symbol.
- `HAS_TRANSCRIPT` relationship connects from a gene term to a transcript term. This relationship is used to represent the relationship between a gene and its transcripts. A gene may have multiple transcripts, and a transcript may belong to multiple genes.
- `HAS_EXON` relationship connects from a transcript term to an exon term. This relationship is used to represent the relationship between a transcript and its exons. A transcript may have multiple exons, and an exon may belong to multiple transcripts.
- `ENCODES` relationship connects from a transcript term to a protein term. This relationship is used to represent the relationship between a transcript and its protein product. A transcript may encode multiple proteins, and a protein may be encoded by multiple transcripts.

## Pathway data

Pathway data focuses on the cell reactions and passways, and the genes that are known to relate to the reactions. It can be represented as:

<img src="gn-pathway-data-structure.svg" alt="Pathway Data Structure" width="450"/>

## Relationships between data types

From the mapping and annotation published by the respective databases, we can establish the relationships between the different data types. The relationships supported by the system are (as they are stored in neo4j):

<img src="gn-term-mapping.svg" alt="Term Mapping" width="450"/>
