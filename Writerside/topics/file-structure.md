# File Structure

## Backend Library

The files in the library repository follow the basic structure:

- src: The source code directory. If running from source, this directory should be added to the Python path.
  - cv3_backend_lib: the library package, containing the shared functions and data models.
    - data: a data folder containing non-code files, like GraphQL schemas, resource files, etc. This folder is packaged by the build system upon release.
    - etc: arbitrary files that provide configurations and other data, such as constant definitions, `marshmallow` schemas, etc.
    - graphql: module dedicated to graphql support. GraphQL in CV3 is a wrapper on normal functions, so this module is not imported elsewhere (except by the main server file), and is self-contained for GraphQL functions.
    - models: the data models used in the system. These files minimise the import from other modules except from the `etc` and `util` module. For child classes that are used in-place as a more detailed version of parent classes, they are defined in a submodule, named after the parent class.
    - query: the query driver handling either internal database queries or network-based queries for supported protocols and implementations.
    - util: utility functions that are used across the library and cannot be packed into any specific classes, such as logging and security wrappers.
    - views: the definition of Quart blueprints.
- tests: the test directory, containing all test files for the library. Within each test type, the file structure mirros the module they are testing.
  - function_test: function tests. These tests start from an endpoint funtion, and runs through the function with mocked database drivers. They will test all internal functions except the database/network calls.
  - unit_test: unit tests, focusing on classes and functions in an individual level.
- instance_config.json(.example): the (example) config file. When running from source code, this file needs to be present in all microservice folders.
- LICENSE, READEME.md: the license and readme files.
- pyproject.toml, requirements.txt, requirements-test.txt: the build and dependency files.
- *.nuitka-package.config.yaml: the Nuitka build configuration files. These files are used to build the source code into binary executables.

## Frontend library

The files in the library repository follow the basic structure:

- lib: the flutter source root.
  - models: the data models.
    - providers: the state management providers. All providers are injected into the app at the root level, some are chained with proxy providers for inter-provider state access.
  - pages: the UI pages.
  - routes: the router definition, and the generated router file by `auto_route`.
  - services: the service classes handling web requests to the backend.
  - utils: utility functions that are used across the library.
  - widgets: the UI components that are reused across different pages.
