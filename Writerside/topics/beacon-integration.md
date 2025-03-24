# Beacon Integration

The Beacon API is a simple data discovery tool that allows someone to search genomic and biomedical data worldwide. It's developed by a community lead by GA4GH (Global Alliance for Genomics and Health), and is widely adopted by many research groups, biobanks and data repositories.

## Motivation

Beacon protocol is relatively mature, and has a very large user base among data controllers and researches that wish to make others discover on their data. Previously with Cafe Variome V2, we also experimented with the Beacon protocol, by trying to use it to discover data from multiple sources. It's proven to be useful, and providing a service-agnostic way to discover data.

In CV3, we decided to take the support for Beacon one step further, by allowing CV3 to act as a Beacon resource as well. This means that CV3 can expose its data to the Beacon network, and allow others to discover data that resides in CV3. With this two-way support and its own decentralised network, CV3 can act as a bridge between multiple Beacon instances and other protocols, and maximise the discoverability of the data.

## Features

Currently, the Beacon integration provides the following features:

### Beacon source

When creating record level data sources, you can now select `Beacon Source` type. This type acts as a placeholder for a Beacon resource, and allows you to configure the connection details. Including:

- **Name**: A user-friendly name for the source.
- **URL**: The URL of the Beacon root. Beacon loosely defines a set of endpoints on the root URL, and CV3 uses these endpoints to get the information on the Beacon service. It then decides how to query the service based on the information.
- **Authentication method**: Beacon protocol does not impose restrictions on how the endpoints are protected, and it's up to the Beacon service provider to decide. CV3 supports multiple authentication methods, including:
  - **No Auth**: No authentication is required to query the service.
  - **API key**: A static key that is used to authenticate the request. Due to different implementations, the key is sent in both the `Authorization` header as a token, and a custom `api-key` header to maintain backward compatibility with EJP-RD Beacon.
  - **Bearer token**: CV3 will attach the access token for the querying user to the request, and the Beacon service can then decide if the user has the permission to query the service.

### Indexing Beacon sources

Each Beacon source exposes a set of `info` endpoints, providing information on the Beacon service itself. CV3 uses these endpoints to understand the Beacon service, specifically:

- The entity types that the service supports. It looks for the following entities:
  - `epnd:dataset`
  - `epnd:cohort`
  - `individual`
- The filtering terms endpoint for each entity type. This endpoint provides the terms that can be used to filter the data. CV3 uses this information to build the filter UI for the Beacon source, and trim the filters before sending it to the Beacon service.
- The query endpoint for each entity type. This is where the CV3 will post the query.

CV3 will actively scrape the endpoints, and store the information about each Beacon source in the database.

### Querying Beacon sources

When querying Beacon sources, CV3 will use the information stored in the database to build the query. The query is then sent to the Beacon service, and the results are displayed in the CV3 UI.

### Exposing Beacon endpoints

CV3 supports multiple Beacon endpoints configuration. A Beacon endpoint can be configured for a network, and a network can have multiple Beacon endpoints with different paths and authentication methods. Upon receiving a request, it is treated as a query to the network, and will be translated into a CV3 query and federate through the network.

### Logical OR filters

Beacon protocol does not officially support logical OR filters. In CV3, we implemented it so that if multiple terms are sent in the same filter as an array, they are treated as OR relationships. If multiple filters are sent in the same query, they are treated as AND relationships. We also allow sending multiple filters of the same type to combine OR and AND logic. For example:

```json
{
  "filters": [
    {
      "id": ["HP:0000001", "HP:0000002"]
    },
    {
      "id": ["HP:0000003", "HP:0000004"]
    }
  ]
}
```

Is to search on patient records that have either `HP:0000001` or `HP:0000002`, and also have either `HP:0000003` or `HP:0000004`.

## Future work

This integration is fairly stable now, but Beacon is an evolving protocol, and more features will be added to it. Once the official GA4GH Beacon specs are updated, we will consider implement the specs in CV3 where it's relevant. We may also extend the specs in a custom way to support more complicated queries that CV3 can do, but Beacon cannot.

The features we are currently working on are:

- Better way of returning "unsupported filters", by specifying if the filter is not supported by CV3 at all (unknown filter), or if there's no data for the filter so it's not supported.

The features that we know we will not implement in the near future are:

- Pagination support. All data will be returned in the same response. When querying a different service, if we detect pagination is enabled, we will send a second query requesting a larger pagination limit, which will cause all results to be returned in the same response. Then we will use the second response to display the results. CV3 does not give out paginated results at all.
