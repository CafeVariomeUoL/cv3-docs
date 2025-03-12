# Convention

Cafe Variome V3 tries to follow best practice in both coding and maintaining the codebase. This section documents the conventions used in the system developments.

## Code style

The backend code style used in CV3 is based on PEP8, and is linted with `pylint`. The code base follows object-oriented programming convention, packaging all class and object related methods into the classes, with factory functions handling class creation.

The frontend code style used in CV3 is suggested by Google, following the Flutter official coding style guild. The code is linted with built-in dart analyzer.

## System architecture

CV3 backend is a Python-based microservice set, with multiple services running in parallel to provide the necessary functions. The services share a common library, which maintains basic functions like data models, database connections, and some utility functions. The services code bases mirror the library structure, with each service overwriting the necessary functions to provide the service-specific functions. Refer to [](file-structure.md) for more details on how the source code is structured.

The microservice architecture allows different options for running and scaling the system. Each service can be started manually, daemonize (with built-in process management features), or run with containers. If the features provided by a service is not needed, it may optionally be turned off. Refers to [](system-structure.md) for the system structure.

CV3 frontend is divided into 3 web apps, each handling a part of the essential functions. They can be deployed individually, or together following a standard URL structure. Each web app is a service oriented application, with data models handling data operation, services handling web requests, providers managing states, and pages rendering the UI. The web apps use async operations where possible, but due to the browser restrictions on Flutter, the operations are in fact based on micro-tasks.

## API design

The CV3 backend are fully RESTful, with no session or websocket usage. This allows maximum compatibility with most web server setup. One result of such design is each endpoint, if not public, requires an access token from OIDC provider to authenticate the user. The access token is thus managed by the frontend and passed to the backend in each request.

Additionally, all API uses JSON format for data exchange, and all JSON uses lower camel case, while URLs use hyphenated formats.
