# Cafe Variome V3

This is the documentation for Cafe Variome V3.

## What is Cafe Variome

Cafe Variome is a flexible web-based data discovery tool that any biomedical data owner can install to enable the “existence” rather than the “substance” of the data to be discovered. It takes in various format's (phenopacket, xlsx, csv) of data, and allows users to query the patients in a unified way.

## Why Cafe Variome

Health data sharing often occurs in small-scale interactions between a limited number of individuals or institutions. Although this approach helps to ensure correct data governance and provenance the value of this data is never realised and runs counter to widespread FAIR principles.

Cafe Variome provides a user frindly solution by allowing data controllers/custodians to retain control of their data while having approved data elements for discovery, either using a single instance or a federation of data sharing instances. It's powerful, adaptive query interface utilising semantic similarity has the flexibility of making the researcher/user queries as simple or as complex as desired.

Any user interested in finding data (for example, for cohort studies or checking the availability of specific data or matching rare disease patients), can use Cafe Variome.

The highlighted features of Cafe Variome Data Discovery Platform are:

### Powerful storage and query engine

Cafe Variome stores everything, a schema-less, scalable storage solution. It accepts a wide variety of data formats, and has powerful built-in features to assist the data holders to convert the data into an easily queryable format. The query engines runs on the processed dataset, with the ability to query on any field, in any combination and in any order.

In collaboration with [Molgenis](https://www.molgenis.org/), we are building a query system, which will allow users to query data stored not only in Cafe Variome but also in Molgenis, from the same place, making full use of all the powerful query filters and fine-grain access control available in Cafe Variome.

We are continuously working to support more data storage backends, more input formats, and more ontology/term sets.

### Semantic similarity based quering

Use of ontology terms in patient data is gaining prevalence. Cafe Variome can work with data inputted using ontology terms, by either detecting the terms automatically, or it can be configured to treat specific data as ontology terms. Once the data is ingested, Cafe Variome can query on the [HPO](https://hpo.jax.org/app/) (Human Phenotype Ontology) terms with semantic similarity support, enabling discovery on not only the ontology terms, but also the terms that are similar to the query terms. Other ontology term sets, if mapped to or from HPO set, can also be used for semantic similarity based query. Therefore, you can discover similar patients based on phenotypes, diseases, or medicine that they are assigned with.

### Federated data discovery

Cafe Variome, designed as a federated data discovery tool, can be used to form decentralised discovery networks. Such networks can combinatine the data from multiple instances of Cafe Variome, making the collective data discoverable from a single place. Cafe Variome allows data administrators to create bespoke networks for specific purposes, as well as to request to join existing networks. This implies data providers (viz., laboratories, biobanks etc.,) can connect together in closed or semi-closed discovery networks.

The resulting network is decentralised and utilises advanced security and access control features with a high fault tolerance, automatic data synchronisation and conflict resolution. Nodes requesting to join an existing network are approved individually by each node of the network, with users being granted access to the data on a per-source per-person basis. This allows the data owners to retain control of their data while having approved data elements for discovery, while still have a robust means of data discovery. The network model is flexible enough to work with common data access and analysis models, while still providing a unified interface.

### User-friendly, cross-platform interface

Cafe Variome's frontend interface is platform independent and can be run as a web application, mobile or a desktop client. It provides a unified experience across all platforms, including Web, Android, iOS, Windows, Linux, and macOS. The frontend is designed to work with the backend seamlessly and provides a unified experience across all platforms. The frontend is also designed to be responsive, and will adapt to different screen sizes, from mobile phones to desktops.

The query interface, with which most users interact, is designed to be generative. Cafe Variome uses an adaptive interface, that can automatically detect the type of data stored in teh database and only show necessary components for user to interface. This provides Cafe Variome with an adaptable user interface, without confusing the users with too much various interface options. For advanced users, the interface has an advanced query mode, supporting complicated query logic and filters.

The interface can be adapted to the type of data contained in the underlying database, to allow users to quickly build their queries in an intuitive way. The examples below show the types of adaptations that can be made.

> **Keyword Search**
> 
> ![interface-keyword_search.png](interface-keyword_search.png)

> **Toggle based filters**
>
> ![interface-available_samples.png](interface-available_samples.png)

> **Autocomplete dropdown lists**
> 
> It may be used to present matching terms from a controlled vocabulary, ontology or other list of terms.
> ![interface-hpo_auto_complete.png](interface-hpo_auto_complete.png)

> **Query using onotology terms and similarity**
>
> ![interface-ontology_query.png](interface-ontology_query.png)

### Full BEACON compatibility

Cafe Variome implements BEACON v2 specifications, which aims to make discovering genomic data easier. By loading data into Cafe Variome, you also get a BEACON compatible API to integrate with other services. The  optional security features have been implemented into the BEACON API, granting the BEACON the same level of security, access control, and data synchronisation should the admin wish to enable it.

Cafe Variome can also query other BEACON compatible systems as remote data sources, as if the data is being stored locally. The query will be limited to BEACON capabilities, but the results will be merged with local results, and will be presented to the user as a single result set, allowing Cafe Variome to be used as a central interface for BEACON discovery.
