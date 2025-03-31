# Molgenis Integration

> Molgenis-Cafe Variome integration is under active development. There will be more features and functionalities added soon. We are also accepting ideas and contributions from the community, if there is a valid use case backing the request.
{style="note"}

[Molgenis EMX2](https://github.com/molgenis/molgenis-emx2) is a highly customisable platform for scientific data and FAIR principles. It is adopted by many research groups, cohorts and biobanks to manage their sensitive data. Through an ongoing collaboration with the Molgenis team, CV3 and Molgenis are building an integration to allow discovery of existing data that resides in Molgenis instances, without the need to move the data to Cafe Variome.

## Motivation

The integration is set off to resolve the following issues:

1. **Discoverability**: Molgenis is a powerful platform for creating / managing scientific data schemas, and can be queried via GraphQL. However, it lacks a direct interface to compose filters in a graphical manner, or a means to check on the **existence** rather than the **content** of the data. Cafe Variome, on the other hand, is designed to focus on the discovery steps, and provides a comprehensive and dynamic interface for filtering and querying data.
2. **Data flexibility and security**: To allow structured and federated query, Cafe Variome restricts its internal data structure to a defined schema. It also uses a local-first authorisation model, but it is not specifically hardened to store highly sensitive data like primary care data. In this aspect, Molgenis provides a fully customisable data schema, and a robust security model to manage sensitive data. By delegating the storage and raw queries to Molgenis, Cafe Variome can focus on the discovery and visualisation aspects of the data, while Molgenis ensures that unsafe queries cannot be performed, and data owners can adjust the schema however they see fit.
3. **Data duplication**: Both Molgenis and Cafe Variome have their own user base, while the user bases are highly overlapping. Without the integration, the data needs to be extracted from one into the other, and needs to be performed repeatedly to keep the data up-to-date. By integrating the two systems, the data can be queried in real-time, and the data is always up-to-date.

## Features

This documentation only explains the features and operations from the Cafe Variome perspective. For configuring the Molgenis EMX2 platform, please refer to their documents. Currently, the integration provides the following features:

### Molgenis source

When creating record level data sources, you can now select `Molgenis Source` type. This type acts as a placeholder for the Molgenis instance, and allows you to configure the connection details. Including:

- **Name**: A user-friendly name for the source.
- **URL**: The URL of the Molgenis instance. This should be the root URL of Molgenis, without the API subpaths. Refer to Molgenis documentation for setting the public URL and serving under a sub-path if necessary.
- **Schema**: The schema name to query. This is the schema name as defined in Molgenis, and is case-sensitive.

The Molgenis source allows one-to-many connections from CV3 to Molgenis, each Molgenis instance behaving as a data source from the query perspective. If a user queries the system, they would see the results as if it's an internal source.

### Data indexing

Molgenis can now expose its data index to CV3 in a mutually agreed format. CV3 ingests this format and understands what data is available to query within Molgenis. This information is then used to construct the query interface, and to provide the user with the available filters and fields to query. The indexing can be triggered manually, or it would run every day to synchronise the data.

### Record level querying

Molgenis supports CV3 query format and response format via a dedicated API. Upon querying, a request is sent to this endpoint, and Molgenis would translate the query into GraphQL and perform the query locally. The results are then returned to CV3 in a format that CV3 understands. This process is transparent to the user.

### Federated authentication

CV3 sends an access token with each request, whether it's a query or an indexing request. This allows Molgenis to determine the identity of the user and apply the permissions within their system.

## Future work

The integration is still in its early stages, and there are many features that are planned to be added. Current ideas that may be added into the integration are:

- Federated authorisation: CV3 and Molgenis may use some methods to sync user permissions within each instance. This allows CV3 to apply the same permissions as Molgenis, and vice versa.
- Automatic provisioning of data sources: CV3 may automatically discover Molgenis schemas, or Molgenis may automatically create a data source in CV3 upon schema changes.
- Native support of networking protocols in Molgenis: Molgenis may support the decentralised protocol used by CV3, allowing it to join the network directly as a data node, responding to other CV3 instances' queries.

We cannot provide a timeline for these features, or to confirm if they would be added to the system. However, we are open to suggestions and contributions from the community, especially if you have a valid and practical use case that requires an existing or new feature.

<seealso>
    <category ref="related">
        <a href="beacon-integration.md"/>
        <a href="fdp-integration.md"/>
    </category>
</seealso>