# Querying the Service

The BTS service can be queried using REST API or GraphQL. The REST API is the primary way to interact with the service and is highly optimised. While the GraphQL API provides a more flexible way to query the data, it may be slower in performance.

## Using the REST API

> The full OpenAPI specs on the REST API can be found on our hosting site [here](https://v3doc.cafevariome.org/openapi/?urls.primaryName=Biomedical+Term+Service). Please refer to this if the API is not clear.

The REST API is designed to support Cafe Variome V3 functionalities, including the frontend auto-completion and backend searching functions. The implemented features are:

### Auto Completion

Auto-completion refers to the feature where the user types a few characters, and the system suggests a list of terms that match the input. Specifically:

- The search string needs to be at least 3 characters in length. This is to prevent returning a massive list of terms.
- The search is case-insensitive. Furthermore, all the quotation marks will be stripped off.
- White spaces are considered separators. The search string will be split into words, and each word will be searched on separately. However any other characters will be matched as-is, including but not limited to hyphens, underscores, dots, etc.

The results will be ordered by the relevance of the term to the search string. The relevance is calculated based on the length of the resulting term, and the position of the search string in the term. For example:

For the search string "pheno" on <tooltip term="HPO">HPO</tooltip>, the top 5 results will be:

- Koebner Phenomenon
- Phenotypic abnormality
- Phenotypic variability
- Sphenoid wing dysplasia
- Biphenotypic acute leukemia

The strings are ordered first by the length of the term, with the shortest term appearing first. This is based on the assumption that shorter terms are more likely to match a larger portion of the search string. If two terms have the same length, the position of the search string within the term is considered. Terms where the search string appears earlier are ranked higher in relevance.

In this system, not only the label but also other parts of a term are searched. The priority is as follows:

- Term ID (without prefix - **This is important because we do not store the prefix, so searching on the prefix will give you nothing**)
- Term Label
- Synonyms
- Definitions

Everything else is ignored.

> The production endpoint for auto-completion is `v2`. The `v1` endpoint is for Cafe Variome V2 legacy support, and should NOT be used in development of other services. We may discontinue the support for `v1` in the future, or fully deprecate it.
> {style="warning"}

### Ontology Tree Expansion

The ontology tree expansion search refers to the feature where the user provides term IDs, and the system returns the terms that are children of the provided terms. Naturally this only works on ontological datasets. Even if the other datasets have some type of hierarchy (pathway → reaction → product), they cannot be used in the expansion feature.

### Semantic Similarity Search

The semantic similarity search is a feature where the user provides a list of terms along with one or more similarity thresholds, and the system returns terms that are similar to the provided ones. Similarity is calculated based on the ontology tree structure using the relevance method.

### Term Translation

Translation search is a feature where the user provides a list of terms, one or more similarity thresholds, and a list of constraint terms. The service then returns the terms from the constraint list that exceed the given threshold. This feature is used to translate a match set to another on services that do not support fuzzy matching or similarity queries, such as a <tooltip term="BEACON">BEACON</tooltip> system.

### Term Set Mapping

Term set mapping is a feature where the user provides a list of terms and a target set, and the system maps the original terms onto the annotated or mapped terms on the target set. For now, only direct annotation is supported (for example, <tooltip term="HPO">HPO</tooltip> and <tooltip term="ORDO">ORDO</tooltip> have annotations, and <tooltip term="ORDO">ORDO</tooltip> and <tooltip term="SNOMED">SNOMED</tooltip> have annotations. However, the two cannot be used together to map <tooltip term="HPO">HPO</tooltip> to <tooltip term="SNOMED">SNOMED</tooltip>).

## Using the GraphQL API

A GraphQL endpoint is available at `https://similarity.cafevariome.org/graphql`, allowing for customisable queries to the service. The GraphQL API supports all the functionalities of the REST API, along with additional features such as multi-link traversal, child-parent reverse traversal, and more complex queries. However, due to the nature of GraphQL, the query may not be as optimised as the REST API, potentially resulting in slower performance. Additionally, the response is typically larger than that of the REST API. The schema is provided below:

<code-block lang="graphql" src="graphql/biomedical-term-service.graphql" collapsible="true" collapsed-title="GraphQL Schema"/>
