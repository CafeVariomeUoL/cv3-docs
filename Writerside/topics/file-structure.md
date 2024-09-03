# File Structure

The files in this repository follow the basic structure:

- cvf_app: The main Quart application folder, as a Python package.
    * auth: Folder containing authentication related code, including KeyCloak and Vault drivers, as well as some decorators and security related function
    * beacon: Beacon related functions, including the class definition, the code to query beacon endpoints, and to process beacon queries. Also containing the management functions to handle beacon sources
    * cv: The Cafe Variome management related code. Almost all endpoints used by frontend are here.
    * federation: The federated network related code. Federated query uses a different authentication model, so it has a different codebase from the regular query
    * legacy: Legacy functions, including the legacy query and views for frontend to manage the legacy code
    * log: The code to handle logging, log reporting, and receiving log from the front end.
    * meta: *ON HOLD NOW* The code for meta sources and meta-query
    * models: All class definition for data models used in cv and management functions. Specific models, like the query model, are inside the corresponding folder.
    * nexus: The code for nexus mode. The views in this folder do not follow naming conventions of this project, because it needs to be compatible with the V2 API endpoints.
    * query: The code related to querying, including both the query and response model, data searching and sanitization, etc.
    * util: Utility functions, not used by any other part of the code. It's a standalone implementation of a CLI to interact with the system.
- docs: The documentation folder, containing the OpenAPI specification.
- resources: The resource folder, containing the necessary files for backend to run
- static: Static file folder, containing web pages and js scripts that are served directly
- tests: Testing root folder
- utility: The folder containing helper script, etc.

## File names

In each source code subfolder, there could be these files:

- views: Definition of the endpoints, using `Blueprint` from Quart. These files are the direct entry point of a request
- management: The functions used to run background or scheduled tasks. These codes are used with `APScheduler` to run in the background to perform various data operations, like database cleanup, network syncing, etc.
- schemas: The file holding the schemas for input validation. CV3 uses `marshmallow` for input validation, working as both a data integrity check and security filter. This file defines the schema for the views in this folder.
