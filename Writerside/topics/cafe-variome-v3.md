# Cafe Variome V3

<primary-label ref="cv3"/>

This is the documentation for Cafe Variome V3.

## What is Cafe Variome

Cafe Variome is a flexible, web-based data discovery tool designed for biomedical data owners. It enables discovery of the existence of data without revealing its substance. Supporting various data formats (such as Phenopackets, XLSX, CSV, etc.), Cafe Variome allows users to query patient records in a unified way.

## Why Cafe Variome

Health data sharing often takes place through small-scale interactions between a limited number of individuals or institutions. While this approach helps ensure proper data governance and provenance, it prevents the full potential of the data from being realised and contradicts widespread (<tooltip term="FAIR">FAIR</tooltip>) principles.

Cafe Variome provides a user-friendly solution, allowing data controllers and custodians to retain control of their data while making approved data elements discoverable, either through a single instance or a federation of data-sharing instances. Its powerful, adaptive query interface uses semantic similarity, and its flexibility enables researchers and users to create queries that are as simple or as complex as needed.

Cafe Variome can be used in a variety of settings, such as searching for a specific study (conducted using a given participant cohort), identifying a particular type of data, or matching rare disease patients to clinical studies.

## Key features of Cafe Variome Data Discovery Platform

### Powerful storage and query engine

Cafe Variome provides a schema-less, scalable storage solution for all data. It accepts a wide variety of formats and includes powerful built-in features to help data holders convert their data into an easily queryable format. The query engines run on the processed dataset, allowing queries on any field, in any combination, and in any order.

In collaboration with <a href="https://www.molgenis.org/"><tooltip term="Molgenis">Molgenis</tooltip></a>, we are developing a query system that enables users to query data stored in both Cafe Variome and Molgenis simultaneously from their own Cafe Variome instance. This integration allows both platforms to fully utilise Cafe Variome’s powerful query filters and fine-grained access control.

We are continuously working to support more data storage backends, more input formats, and more ontology/term sets.

### Semantic similarity based querying

The use of ontology terms in patient data is becoming increasingly common. Cafe Variome can process data inputted with ontology terms by either detecting them automatically or being configured to treat specific data as ontology terms. Currently, Cafe Variome supports the <a href="https://www.orphadata.com/ontologies/"><tooltip term="ORDO">ORDO</tooltip></a> and <a href="https://www.snomed.org/what-is-snomed-ct"><tooltip term="SNOMED">SNOMED</tooltip></a>  controlled vocabularies. Terms entered from either vocabulary are mapped internally to <a href="https://hpo.jax.org/"><tooltip term="HPO">HPO</tooltip></a>. 

This mapping enables semantic querying, meaning queries are performed not only on the entered terms but also on similar terms. Other ontology term sets, if mapped to or from (<tooltip term="HPO">HPO</tooltip>), can also be used for semantic similarity-based queries. As a result, users can discover similar patients based on phenotypes, diseases, or prescribed medications.

### Federated data discovery

Cafe Variome, designed as a federated data discovery tool, enables the formation of decentralised discovery networks. These networks can combine data from multiple instances of Cafe Variome, making the collective data discoverable from a single access point. Cafe Variome allows data administrators to create bespoke networks for specific purposes and request to join existing ones. This means that data providers (e.g., laboratories, biobanks, etc.) can connect within closed or semi-closed discovery networks.

The resulting network is decentralised and incorporates advanced security and access control features, ensuring high fault tolerance, automatic data synchronisation, and conflict resolution. Nodes requesting to join an existing network must be individually approved by each node, with user access granted on a per-source, per-person basis. This allows data owners to retain control of their data while making approved data elements discoverable, all within a robust data discovery framework. The network model is flexible enough to accommodate common data access and analysis models while still providing a unified interface.

### User-friendly, cross-platform interface

Cafe Variome's frontend interface is platform-independent and can run as a web application, mobile app, or desktop client. It provides a consistent experience across Web, Android, iOS, Windows, Linux, and macOS. Designed to integrate seamlessly with the backend, the frontend is also fully responsive, adapting to different screen sizes from mobile phones to desktops.

The query interface, which most users interact with, adapts to the type of data stored in a given installation. By automatically detecting the data type, Cafe Variome displays only the relevant components of the user interface, ensuring a clean and adaptable experience while avoiding unnecessary options that could confuse users. The advanced query interface offers a broader range of query logic and filter options, allowing advanced users to perform more targeted searches.

The interface adapts to the type of data in the underlying database, enabling users to build queries quickly and intuitively. The examples below illustrate the types of adaptations that can be made.

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

Cafe Variome implements (<tooltip term="BEACON">BEACON v2</tooltip>) specifications, designed to simplify genomic data discovery. By loading data into Cafe Variome, users automatically gain access to a BEACON-compatible API, which can be integrated with other services. Optional security features are built into the BEACON API, ensuring the same level of security, access control, and data synchronisation as Cafe Variome, should the administrator choose to enable them.

Cafe Variome can also query other BEACON-compatible systems as remote data sources, treating external data as if it were stored locally. While queries are limited to BEACON capabilities, the results are merged with local data and presented to the user as a single, unified set. This allows Cafe Variome to serve as a central interface for BEACON discovery.

<seealso>
    <category ref="related">
        <a href="quick-start-guide.md"/>
        <a href="user-and-admin-access-control.md"/>
        <a href="external-services-integration.md"/>
    </category>
</seealso>