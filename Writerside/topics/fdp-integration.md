# FDP Integration

A FAIR Data Point (FDP) is the realisation of the vision of a group of authors of the original paper on FAIR on how (meta)data could be presented on the web using existing standards, and without the need of APIs. It is essentially a group of RDF files that semantically represent the metadata of the resources, and can be discovered or queried by any service that understands RDF. It uses the Data Catalog (DCAT) model and Dublin Core terms to describe the metadata, and can be queried using SPARQL.

## Motivation

In CV3, metadata entries are small in size and relaxed in permissions. It does not have user level permission, only one global switch to allow or disallow user to query it without logging in. This allows the metadata entries to be fully downloaded to a frontend, an app or another system for local filtering. To enable this, FDP is a good candidate that supports customisable model, local query, semantic discovery and lightweight communication.

## Features

Currently, the FDP integration provides the following features:

### FDP data exposing

All metadata entries loaded into CV3 can be automatically converted into FDP representation. This is done on the fly, with no intermediate data being stored. Upon storing data, the CV3 will also expose a set of FDP endpoints, allowing all metadata entries to be retrieved.

## Future work

Due to lack of demand, the FDP integration is not actively developed. Usually it will only be updated after a metadata schema update or addition to support the new model. However, some features are planned for future support, but they will not be implemented until there is a valid use case:

- **SPARQL query**: CV3 may support an external service to submit a SPARQL query to the FDP endpoints, and return the results in RDF format.
- **FDP ingestion**: CV3 may support uploading of metadata in the form of FDP documents, and convert them into CV3 metadata entries for storage.
- **FDP query**: CV3 may support querying an external FDP service directly, and aggregate the result with other query results, similar to [Beacon integration](beacon-integration.md).

We are open to suggestions and contributions from the community, especially if you have a valid and practical use case that requires an existing or new feature.

<seealso>
    <category ref="related">
        <a href="molgenis-integration.md"/>
        <a href="beacon-integration.md"/>
    </category>
</seealso>