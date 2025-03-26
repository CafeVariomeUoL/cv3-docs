# Convention

<primary-label ref="cv3"/>

Cafe Variome V3 strives to adhere to best practices in both coding and codebase maintenance. This section outlines the conventions followed in the system's development.

## Code style

The backend code style in CV3 follows PEP8 guidelines and is linted using `pylint`. The codebase adheres to object-oriented programming conventions, encapsulating class and object-related methods within classes, with factory functions handling class instantiation.

For the frontend, CV3 follows the coding style recommended by Google, in alignment with the official Flutter style guide. The code is linted using the built-in Dart analyzer.

## System architecture

The CV3 backend is composed of a Python-based set of microservices, with multiple services running concurrently to deliver the required functionality. These services share a common library that handles fundamental tasks, such as data models, database connections, and various utility functions. Each service's codebase mirrors the structure of the library, overriding specific functions to provide its own service-specific functionality. For more details on how the source code is organized, refer to the  [](file-structure.md) section.

The microservice architecture provides flexibility in how the system can be run and scaled. Each service can be started manually, daemonized with built-in process management features, or run within containers. If certain features provided by a service are not required, they can be disabled. For a detailed overview of the system's structure, refer to the [](system-structure.md) section.

The CV3 frontend is composed of three web applications, each responsible for a specific set of essential functions. These applications can be deployed independently or together, following a standardised URL structure. Each web app is designed with a service-oriented architecture, where data models manage data operations, services handle web requests, providers manage states, and pages render the user interface. The frontend leverages asynchronous operations where possible, but due to browser restrictions on Flutter, these operations are effectively handled as micro-tasks.

## API design

The CV3 backend is fully RESTful, with no use of sessions or websockets. This ensures maximum compatibility with most web server setups. One consequence of this design is that each endpoint, if not public, requires an access token from an (<tooltip term="OIDC">OIDC</tooltip>) provider to authenticate the user. The access token is managed by the frontend and passed to the backend with each request.

Additionally, all APIs use JSON format for data exchange, with all JSON following lower camel case, while URLs are formatted using hyphens.

There are several OpenAPI specifications available for the system, including individual specifications for each microservice and one that covers all microservices. Below is a list of the available OpenAPI specifications:

- [All microservices](https://v3doc.cafevariome.org/openapi/?urls.primaryName=All+Services)
- [Admin API](https://v3doc.cafevariome.org/openapi/?urls.primaryName=Admin+API)
- [Network Gateway](https://v3doc.cafevariome.org/openapi/?urls.primaryName=Network+Gateway)
- [Query API](https://v3doc.cafevariome.org/openapi/?urls.primaryName=Query+API)
- [Biomedical Term Service](https://v3doc.cafevariome.org/openapi/?urls.primaryName=Biomedical+Term+Service)
