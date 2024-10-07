# Cafe Variome V3

This is the documentation for Cafe Variome V3.

## What is Cafe Variome

Cafe Variome is a flexible web-based data discovery tool that any biomedical data owner can install to enable the “existence” rather than the “substance” of the data to be discovered. It takes in various format's of data (such as phenopackets, xlsx, csv, etc.), and allows users to query the patients in a unified way.

## Why Cafe Variome

Health data sharing often occurs in small-scale interactions between a limited number of individuals or institutions. Although this approach helps to ensure correct data governance and provenance the value of this data is never realised and runs counter to widespread FAIR principles.

Cafe Variome provides a user-friendly solution by allowing data controllers/custodians to retain control of their data while having approved data elements for discovery, either using a single instance or a federation of data sharing instances. It's powerful, adaptive query interface uses semantic similarity and its flexibility allows the researcher/user to use queries that are as simple or as complex as desired.

Cafe Variome can be used in a variety of settings. Examples include: searching for a specific study (performed using a given participant cohort), searching for a specific type of data or matching rare disease patients to take part in a clinical study.

## Key features of Cafe Variome Data Discovery Platform

### Powerful storage and query engine

Cafe Variome stores everything, a schema-less, scalable storage solution. It accepts a wide variety of data formats, and has powerful built-in features to assist the data holders to convert the data into an easily queryable format. The query engines run on the processed dataset, with the ability to query on any field, in any combination and in any order.

In collaboration with [Molgenis](https://www.molgenis.org/), we are building a query system, which will allow users to query data stored in both Cafe Variome and Molgenis simultaneously from the user's own Cafe Variome instance. This allows both platforms to make full use of all the powerful query filters and fine-grain access control available in Cafe Variome.

We are continuously working to support more data storage backends, more input formats, and more ontology/term sets.

### Semantic similarity based quering

Use of ontology terms in patient data is gaining prevalence. Cafe Variome can work with data inputted using ontology terms, by either detecting the terms automatically, or it can be configured to treat specific data as ontology terms. Currently, Cafe Variome supports the [ORDO](https://www.orphadata.com/ontologies/) and [SNOMED](https://www.snomed.org/what-is-snomed-ct) controlled vocabularies. Terms entered from either vocabulary is mapped internally to the Human Phenotype Ontology [(HPO)](https://hpo.jax.org/). This mapping permit Cafe Variome to enable semantic querying, in that queries are performed not only the terms entered but also the terms that are similar to the query terms. Other ontology term sets, if mapped to or from HPO set, can also be used for semantic similarity based query. Therefore, you can discover similar patients based on phenotypes, diseases, or medicine that they are assigned with.

### Federated data discovery

Cafe Variome, designed as a federated data discovery tool, can be used to form decentralised discovery networks. Such networks can combine the data from multiple instances of Cafe Variome, making the collective data discoverable from a single place. Cafe Variome allows data administrators to create bespoke networks for specific purposes, as well as to request to join existing networks. This implies data providers (viz., laboratories, biobanks etc.,) can connect together in closed or semi-closed discovery networks.

The resulting network is decentralised and utilises advanced security and access control features with a high fault tolerance, automatic data synchronisation and conflict resolution. Nodes requesting to join an existing network are approved individually by each node of the network, with users being granted access to the data on a per-source per-person basis. This allows the data owners to retain control of their data while having approved data elements for discovery, while still have a robust means of data discovery. The network model is flexible enough to work with common data access and analysis models, while still providing a unified interface.

### User-friendly, cross-platform interface

Cafe Variome's frontend interface is platform independent and can be run as a web application, mobile or a desktop client. It provides a unified experience across all platforms, including Web, Android, iOS, Windows, Linux, and macOS. The frontend is designed to work with the backend seamlessly and provides a unified experience across all platforms. The frontend is also designed to be responsive, and will adapt to different screen sizes, from mobile phones to desktops.

The query interface, with which most users interact adapts to the type of data that a given installation holds. By automatically detecting the type of data stored, Cafe Variome show only those components of the user interface that are appropriate to the type of data detected. This provides Cafe Variome with clean and adaptable user interface, which avoid confusing the user with unnecessary interface options. The advanced query interface provides a greater range of query logic and filter options, permitting advanced users to perform more targeted searches.

The interface can be adapted to the type of data contained in the underlying database, to allow users to quickly build their queries in an intuitive way. The examples below show the types of adaptations that can be made.

> **Keyword Search**
>
> ![interface-keyword_search.png](interface-keyword_search.png)

> **Toggle based filters**
>
> ![interface-available_samples.png](interface-available_samples.png)

> **Autocomplete dropdown lists**
>
> May be used to present matching terms from a controlled vocabulary, ontology or other list of terms.
> ![interface-hpo_auto_complete.png](interface-hpo_auto_complete.png)

> **Query using onotology terms and similarity**
>
> ![interface-ontology_query.png](interface-ontology_query.png)

### Full BEACON compatibility

Cafe Variome implements BEACON v2 specifications, which aims to make discovering genomic data easier. By loading data into Cafe Variome, the user also gets a BEACON compatible API, which can be integrated with other services. The optional security features have been implemented into the BEACON API, granting the BEACON the same level of security, access control, and data synchronisation should the admin wish to enable it.

Cafe Variome can also query other BEACON compatible systems as remote data sources, as if the data is being stored locally. While the query will be limited to BEACON capabilities, the results will be merged with local results. The compiled set of results will be presented to the user as a single set, allowing Cafe Variome to be used as a central interface for BEACON discovery.
