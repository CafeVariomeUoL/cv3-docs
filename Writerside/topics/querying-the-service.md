# Querying the Service

The BTS service can be queried using REST API or GraphQL. The REST API is the primary way to interact with the service and is highly optimised, while the GraphQL API provides a more flexible way to query the data, but may be slower in performance.

## Using the REST API

> The full OpenAPI specs on the REST API can be found in our hosting site [here](https://v3doc.cafevariome.org/openapi/?urls.primaryName=Biomedical+Term+Service). Please refer to it first if the API is not clear.

The REST API is designed to support Cafe Variome V3 functionalities, including the frontend auto completion and backend searching functions. The implemented features are:

### Auto Completion

The term auto-completion refers to the feature where the user types in a few characters, and the system suggests a list of terms that match the input. Specifically:

- The search string needs to be at least 3 characters in length. This is to prevent returning a massive list of terms.
- The search is case-insensitive. All the quotation marks will be stripped off as well.
- White spaces are matched as-is. For example, "Phenotypic abnormality" will not match "Phenotypicabnormality", and vice versa.

The results will be ordered by the relevance of the term to the search string. The relevance is calculated based on the length of the resulting term, and the position of the search string in the term. For example:

For the search string "pheno" on HPO, the top 5 results will be:

- Koebner Phenomenon
- Phenotypic abnormality
- Phenotypic variability
- Sphenoid wing dysplasia
- Biphenotypic acute leukemia

The strings are ordered based on the length of the term first, resulting the shortest to be the first term. This is based on the assumption that the shorter the term, the more portion is matched with the search string. If the length is the same, the position of the search string in the term is considered. The earlier the search string appears in the term, the higher the relevance.

Not only the label, the other parts of a term are also searched on in this system. The priority is:

- Term ID (without prefix. **This is important because we do not store the prefix, so searching on the prefix will give you nothing**)
- Term Label
- Synonyms
- Definitions

Everything else is ignored.

> The production endpoint for auto-completion is `v2`. The `v1` endpoint is for Cafe Variome V2 legacy support, and should NOT be used in development of other services. We may discontinue the support for `v1` in the future, or fully deprecate it.
> {style="warning"}

### Ontology Tree Expansion

The ontology tree expansion search refers to the feature where the user provides term IDs, and the system returns the terms that are children of the provided terms. Naturally this only works on ontological datasets. Even if the other datasets have some type of hierarchy (pathway → reaction → product), they cannot be used in the expansion feature.

### Semantic Similarity Search

The semantic similarity search refers to the feature where the user provides a list of terms and a single/list of similarity thresholds, and the system returns the terms that are similar to the provided terms. The similarity is calculated based on the ontology tree structure, with the relevance method.
