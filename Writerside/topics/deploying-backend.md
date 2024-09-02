# Deploying Backend

## Overview

The backend of Cafe Variome V3 is developed with Python. It's designed to work in maximum efficiency, and is compatible with cluster or cloud environment. This document will explain how to deploy the backend in a single server environment, and how to configure the necessary pieces of software to work with it.

## Prerequisite

If running Cafe Variome V3 backend from source, the following dependencies are required on the server:

- Python 3.11. The backend requires Python 3.10 or above for the Union syntax in type hinting. However, 3.12 has problem with asyncio and aiohttp at the time of writing, so 3.11 is the recommended version.

The following services are also required, but they do not need to be on the server, just in a reachable location:

- KeyCloak 23 or above. KeyCloak is a open source OIDC provider system managed by RedHat. CV3 uses the OIDC protocol to authenticate and manage users, as well as the advanced token manipulation functions provided by KeyCloak. If you wish to use another authentication provider, it's recommended to use the identity brokering function of KeyCloak to connect to your provider. CV3 might work with other OIDC providers, but it's not tested and not recommended.
- Vault by HashiCorp 1.15+. Vault is a all-in-one secret management tool and cryptographic engine. CV3 uses vault to store sensitive information, and to encrypt/sign critical traffic for security.
- MongoDB 6.0+. CV3 uses MongoDB to store all data, including the configuration and the ingested data for querying. CV3 accepts both standalone instance of MongoDB and the cluster version, as it does not rely on the advanced function of cluster version.
- Redis 6.0+. CV3 uses Redis as a cache and a message broker. It's used to store temporary data, and to pass messages between different parts of the system.

For detailed instructions on how to set up these services, refer to [Dependent Services Configuration](dependent-services-configuration.md).

> It's highly recommended to run these services in production mode. Not only do they behave slightly differently in production mode, it's also safer and more efficient to run them in production mode. Running in debug mode may cause some feature to be unusable, depending on the exact configuration.
> {style="note"}

## Configuring the CV3 backend

Cafe Variome V3 backend needs a config file before it can start. This file contains essential configuration that is not meant to be changed during run time. First copy the sample configuration:

```bash
cp instance_config.json.example instance_config.json
```

The content of the json file resembles:

```json
{
  "MongoDB": {
    "Host": "localhost",
    "Port": "27017",
    "User": "cafevariome",
    "Password": "cafevariome",
    "Database": "cafevariome",
    "MaxJobs": 40
  },
  "Keycloak": {
    "Client": "test_client",
    "Realm": "cafe_variome",
    "URL": "http://localhost:8080",
    "RedirectURL": "http://localhost:49430/callback.html"
  },
  "Vault": {
    "Host": "http://localhost:8200",
    "TransitPath": "transit_cv3",
    "KV2Path": "kv",
    "KV2Prefix": "cv3"
  },
  "Neo4j": {
    "Enabled": false,
    "URI": "neo4j://localhost:7687",
    "User": "neo4j",
    "Password": "neo4j",
    "MaxJobs": 40
  },
  "CORS": {
    "AllowOrigin": "*",
    "AllowMethods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    "AllowHeaders": [
      "Content-Type",
      "Authorization",
      "Network-Id"
    ]
  },
  "Metrics": {
    "Prometheus": {
      "Enabled": false,
      "Path": "/metrics",
      "Key": ""
    }
  },
  "Email": {
    "From": {
      "Address": "admin@cafevariome.org",
      "Name": "Cafe Variome Admin"
    },
    "Sender": "noreply@system.le.ac.uk",
    "SMTP": {
      "Host": "localhost",
      "Port": 25,
      "Authentication": {
        "Required": false,
        "Username": "",
        "Password": ""
      }
    }
  },
  "OpenAPI": {
    "Enabled": true
  },
  "Legacy": {
    "NexusMode": {
      "Enabled": true,
      "AccessTokenEnabled": false
    },
    "Query": true
  },
  "Logging": {
    "Name": "Cafe Variome V3",
    "Level": "INFO",
    "SplunkHEC": {
      "Enabled": false,
      "HecEndpoint": "",
      "Token": ""
    },
    "Loki": {
      "Enabled": false,
      "Endpoint": "",
      "Tags": {},
      "Auth": {
        "Enabled": false,
        "Username": "",
        "Password": ""
      }
    }
  },
  "Data": {
    "UploadPath": "data_source/",
    "ValidFileFormats": ["vcf", "csv"],
    "ChunkSize": 1024
  }
}


```

Here are several important configurations:

- MongoDB config: This part configures the data storage for this instance. The settings are straight forward, with the ``MaxJobs`` being the maximum amount of concurrent connections to maintain when performing massive database operations, for example data ingestion. The other quick operations are not restricted. Note that in cluster mode, this refers to the amount of connection
  **EACH** instance will maintain, not the total amount of connections. Scale accordingly.
- Metrics config: CV3 backend has built-in Prometheus metric collection capability, which export several application level metrics. This does not conflict or duplicate metrics from other sources, for example from MongoDB exporters. When set to true, the metrics will be collected, and exported on the designated sub-path. If the ``Key`` parameter is not empty, the metrics endpoint will require ``Authorization`` header and an API key. Prometheus can be set to use bearer auth to scrape this endpoint.
- Email config: This is required configuration, as the CV3 backend uses email to alert admins on new event like access requests, or critical issues like database inconsistency.
- OpenAPI config: CV3 code base contains an OpenAPI documentation folder. When set to true, the backend will serve the OpenAPI documentation on the designated sub-path. It will be in raw OpenAPI format, and can be read by any OpenAPI compatible reader.
- Neo4j config: This controls the Neo4j connection used for similarity search. We provide web service that can be used for similarity query, but our server has limited capacity. For faster response time, higher query volumes, or custom similarly data or ontology graphs, you can use your own Neo4j database with a pre-populated graph. Refer to the documentaion on [our similarity service]() to find out more.
- Legacy config: This controls the legacy functions, in case compatibility is required with Cafe Variome V2 instances. ``Nexus mode`` refers to the functions used to be called "Cafe Variome Net", a centralized network server facilitating federation between CV2 nodes. When enabled, CV2 instances can use this CV3 instance as the net server, and admin can manage the CV2 instances and network in the Nexus page. The access token refers to service account access token, which requires a late version of CV2 code base to use. This secures the connection between CV2 and CV3. The ``Query`` option refers to whether CV2 instances are allowed to query CV3 instance. When set to true, the CV3 instance will show a installation named ``nexus`` in the networks of CV2. It will also accept queries sent from CV2 nodes, but it will not federate the query out, as the access control model is different between CV2 and CV3. When set to false, CV2 instances will not be able to query this CV3 instance, but CV3 instace is still able to query all CV2 instances, and this will be done automatically, if ``Nexus mode`` is enabled.
- Logging config: This controls the logging level of CV3 server. It sets the logging level of Quart application, which then controls the application level logger. It will not, however, affect the settings of the ASGI server used to serve the application. You would need to set it separately, based on what server you use. The ``SplunkHEC`` and ``Loki`` config will allow CV3 to push logs actively to the corresponding collector, for further processing with Splunk or Loki.

> Modifying the config file requires restarting the application to take effect. Avoid modifying the file when the application is running. Although technically the content of the file is loaded when the application starts, it may still have unforeseen consequences.
> {style="warning"}

## Running the CV3 backend from script

After all necessary services and config file in place, CV3 backend can be started. First, install the dependencies:

```bash
pip install -r requirements.txt
```

The backend is written in quart, with the main application in ``src/application_name/app.py``. It can be served with any ASGI compatible server. During development, we use Hypercorn, and it's also a recommended server, as it's a pure Python implementation, with no need for any other dependencies. When running from source code or binary, we provide a process manager that serves as both a launcher and a process guard. There's a script to handle the startup and stopping of the system.

```bash
# To install the script to PATH
./CafeVariome3.sh install <a_location_you_have_write_access>

# To start the server
./CafeVariome3.sh start

# To stop the server
./CafeVariome3.sh stop

# To restart the server
./CafeVariome3.sh restart
```

To modify any startup parameters, modify the script:

```bash
#!/bin/bash

CV3_APP_PATH="${CV3_APP_PATH:-.}"
CV3_APP_MODULE="${CV3_APP_MODULE:-cvf_app.app:app}"
CV3_LOGFILE="${CV3_LOGFILE:-$CV3_APP_PATH/hypercorn.log}"
CV3_ACCESS_LOG_FILE="${CV3_ACCESS_LOG_FILE:-$CV3_APP_PATH/access.log}"
CV3_ERROR_LOG_FILE="${CV3_ERROR_LOG_FILE:-$CV3_APP_PATH/error.log}"
CV3_PIDFILE="${CV3_PIDFILE:-$CV3_APP_PATH/hypercorn.pid}"
CV3_BIND="${CV3_BIND:-127.0.0.1:5000}"
CV3_GRACEFUL_TIMEOUT="${CV3_GRACEFUL_TIMEOUT:-30}"
CV3_HYPERCORN_PATH="$(which hypercorn)"
```

Above is the parameters at the beginning of the script. Modify accordingly. They can also be overridden by environment variables, for example:

```bash
export CV3_BIND="0.0.0.0:8000"
./CafeVariome3.sh start
```

If the service is to be maintained in an extended period and controlled manually, we recommend install the script to path. This can be done by:

```bash
./CafeVariome3.sh install <a_location_you_have_write_access>
```

This automatically creates the directory if it does not exit, and add it to the PATH environment variable. It also writes the necessary environment variable (for example, the path to the CV3 backend) to the ``.bashrc`` file. Then, the script can be called as:

```bash
CafeVariome3 start
```
