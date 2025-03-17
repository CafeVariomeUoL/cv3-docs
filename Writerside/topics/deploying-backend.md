# Deploying Backend

<primary-label ref="backend"/>

## Overview

The backend of Cafe Variome V3 is developed with Python. It's designed to work in maximum efficiency, and is compatible with cluster or cloud environment. This document will explain how to deploy the backend in a single server environment, and how to configure the necessary pieces of software to work with it.

## Prerequisite

If running Cafe Variome V3 backend from source, the following dependencies are required on the server:

- Python 3.11. The backend requires Python 3.11+ for the syntax and `asyncio` functions it uses. However, 3.12 may work in theory, but it's not tested. It's recommended to use the latest version of Python 3.11.

The following services are also required, but they do not need to be on the server, just in a reachable location:

- KeyCloak 23+. KeyCloak is a open source OIDC provider system managed by RedHat. CV3 uses the OIDC protocol to authenticate and manage users, as well as the advanced token manipulation functions provided by KeyCloak. If you wish to use another authentication provider, it's recommended to use the identity brokering function of KeyCloak to connect to your provider. CV3 might work with other OIDC providers, but it's not tested and not recommended.
- Vault by HashiCorp 1.15+. Vault is a all-in-one secret management tool and cryptographic engine. CV3 uses vault to store sensitive information, and to encrypt/sign critical traffic for security.
- MongoDB 6.0+. CV3 uses MongoDB to store all data, including the configuration and the ingested data for querying. CV3 accepts both standalone instance of MongoDB and the cluster version, as it does not rely on the advanced function of cluster version.
- Redis 6.0+. CV3 uses Redis as a cache and a message broker. It's used to store temporary data, and to pass messages between different parts of the system.

For detailed instructions on how to set up these services, refer to [](dependent-services-configuration.md).

> It's highly recommended to run these services in production mode. Not only do they behave slightly differently in production mode, it's also safer and more efficient to run them in production mode. Running in debug mode may cause some feature to be unusable, depending on the exact configuration.
> {style="note"}

## Configuring the CV3 backend

Cafe Variome V3 backend needs a config file before it can start. This file contains all essential configurations that are not meant to be changed during run time. First copy the sample configuration:

```bash
cp instance_config.json.example instance_config.json
```

The content of the JSON file resembles:

<code-block src="json/backend.config.json" lang="json" />

Here is a breakdown of the configuration:

### MongoDB configs

This part configures the data storage for this instance. The settings are straight forward, with the ``MaxJobs`` being the maximum number of concurrent connections to maintain when performing massive database operations, for example, data ingestion. The other quick operations are not restricted. Note that in cluster mode, this refers to the amount of connection
  **EACH** instance will maintain, not the total amount of connections. Scale accordingly.

For example, if the ``MaxJobs`` is set to 10, then in one instance, while ingesting data, 10 connections will be held open until the operation finishes. However, if there are multiple users performing other quick operations such as CRUD operations on normal resources, these are not restricted. This will result in connection count higher than 10, but only 10 of them are used for the massive operation. If a cluster contains three instances, then the total number of connections will be 30, with each instance holding 10 connections.

### Redis configs

Redis configuration is simple, with only the host and port to be set. As of now no authentication or ACL is supported. If the redis server is a cluster, set the ``Cluster`` to true.

### Keycloak configs

The primary OIDC provider for CV3 needs to be a Keycloak server, instead of any other OIDC provider. This is because CV3 uses not only the OIDC flows for user authentication, but also leverages Keycloak specific configurations and features to manage the users and access tokens. The configuration contains all necessary information to connect to the Keycloak server. It also needs the URL where the backend service is being served from, and a list of all supported redirect URIs. The client secret is not stored in the config file, but set in the Hashicorp Vault directly.

### Vault configs

Within one Hashicorp Vault server, there may be multiple secret engines, or multiple applications using the same engine. For CV3, it needs a transit engine to store user keys and encrypt/decrypt the data payload, and a KV engine to store other secrets, like the client secret of Keycloak. The ``TransitPath`` is the path to the transit engine, and the ``KV2Path`` is the path to the KV engine. The ``KV2Prefix`` is the prefix to all keys stored in the KV engine. It's recommended to separate the access between each application connected to the same Vault by using policies over different path prefixes.

### CORS configs

Usually the only setting needs to be changed in the CORS configs is the ``AllowedOrigin`` header content. When the external URLs are determined, this should be set to the origins where the frontend is hosted. Do not modify the other headers unless for a specific reason you need to extend the allowed methods or headers. Never remove any of them, as this will cause the backend to stop working when connected from a web browser.

### Metrics configs

CV3 backend has built-in Prometheus metric collection capability, which export several application level metrics. This does not conflict or duplicate metrics from other sources, for example from MongoDB exporters. When set to true, the metrics will be collected, and exported on the designated sub-path. If the ``Key`` parameter is not empty, the metrics endpoint will require ``Authorization`` header and an API key. Prometheus can be set to use bearer auth to scrape this endpoint.

### Email configs

This is required configuration, as the CV3 backend uses email to alert admins on new events like access requests, or critical issues like database inconsistency. Most hosting solutions have a built-in SMTP server; if none is available, it's recommended to use a third-party service that supports SMTP delivery. If the configuration is omitted or not working correctly, CV3 cannot alert the admin on critical issues, or send credentials to users. This will cause some functions, such as BEACON endpoints, Nexus mode, access requests, etc. to fail silently.

### Legacy configs

This controls the legacy functions, in case compatibility is required with the Cafe Variome V2 instances. ``Nexus mode`` refers to the functions used to be called "Cafe Variome Net", a centralized network server facilitating federation between CV2 nodes. When enabled, CV2 instances can use this CV3 instance as the net server, and admin can manage the CV2 instances and network in the Nexus page. The access token refers to service account access token, which requires a late version of CV2 code base to use. This secures the connection between CV2 and CV3. The ``Query`` option refers to whether CV2 instances are allowed to query CV3 instance. When set to true, the CV3 instance will show an installation named ``nexus`` in the networks of CV2. It will also accept queries sent from CV2 nodes, but it will not federate the query out, as the access control model is different between CV2 and CV3. When set to false, CV2 instances will not be able to query this CV3 instance, but CV3 instace is still able to query all CV2 instances, and this will be done automatically, if ``Nexus mode`` is enabled.

### Logging configs

This controls the logging level of CV3 server. It sets the logging level of Quart application, which then controls the application level logger. It will not, however, affect the settings of the ASGI server used to serve the application. You would need to set it separately, based on what server you use. The ``SplunkHEC`` and ``Loki`` config will allow CV3 to push logs actively to the corresponding collector, for further processing with Splunk or Loki.

The built-in file logger also have a rotation setting. When the log file exceeds the ``MaxBytes``, it will be rotated. The ``BackupCount`` is the number of log files to keep. When the log file reaches the maximum count, the oldest log file will be deleted. This is to prevent the log files from taking up too much disk space.

> Modifying the config file requires restarting the application to take effect. Avoid modifying the file when the application is running. Although technically the content of the file is loaded when the application starts, it may still have unforeseen consequences.
> {style="warning"}

## Deploying the Cafe Variome V3 backend

The CV3 backend can be deployed via source code, pre-compiled binaries, or docker containers. Docker containers are recommended for production environments, as it's easier to manage and scale. For the hosting environments that cannot use docker compatible services, the pre-compiled binaries package all necessary libraries and dependencies into statically linked library files, and should perform consistently across different environments. Use the source code only if you intend to develop against it, or if all other options are not available.

> The binary version of the backend is compiled with Nuitka, which is a Python to C compiler. When building for Linux, it's very hard to create a binary that works on all Linux distributions, as the binary is compiled against the system libraries. The ``glibc`` used in the build environment is ``2.34``, and this will be the minimal requirements to run the binary.
> {style="warning"}

<tabs>
    <tab title="Deploy from source code">
        The first thing to do is to install dependencies with pip. Run the following command in the downloaded source folder (with Python and pip available in PATH, you may need to activate the conda environment beforehand):
        <code-block lang="bash">
            pip install -r requirements.txt
        </code-block>
        Then, to run each component from source, you need a configuration file in each component's folder. They can be exactly the same in content, or different, based on your requirements. Follow the guide above for changing the config file content. Then, use the script to copy the config into the correct location, and set Vault credentials:
        <code-block lang="bash">
            ./CafeVariomeV3 update-config
            export VAULT_ROLE_ID=... # Role ID for AppRole authentication, ensure this role have access to the secret paths
            export VAULT_SECRET_ID=... # Secret ID for AppRole authentication
        </code-block>
        The backend is ready to start. However, before it can function, the storage needs to be bootstrap with correct config. This can be done via the cli:
        <code-block lang="bash">
            ./CafeVariomeV3 cli
        </code-block>
        Type <code>install</code>, and follow the interactive process to finish the setup.
    </tab>
    <tab title="Deploy from binaries">
        The binaries are pre-compiled Python code, built using <code>nuitka</code>. In theory they should behave exactly like the source code. To use the binaries, first download them in from <a href="https://github.com/CafeVariomeUoL/cv3-backend/releases">GitHub Release page</a>. Then, extract the files to a location where the backend will be run. The config file is located in <code>cv3-backend/etc/instance_config.json</code>. Modify the file to match your environment, and set the Vault credentials:
        <code-block lang="bash">
            export VAULT_ROLE_ID=... # Role ID for AppRole authentication, ensure this role have access to the secret paths
            export VAULT_SECRET_ID=... # Secret ID for AppRole authentication
        </code-block>
        The backend is ready to start. However, before it can function, the storage needs to be bootstrap with correct config. This can be done via the cli:
        <code-block lang="bash">
            ./CafeVariomeV3 cli
        </code-block>
        Type <code>install</code>, and follow the interactive process to finish the setup.
    </tab>
    <tab title="Deploy from docker">
        Docker is the recommended way to deploy the CV3 backend. Below is an example docker compose file to deploy the backend:
        <code-block src="yaml/docker-compose.cv.yaml" lang="yaml" />
    </tab>
</tabs>

> The Vault role ID and secret ID are sensitive information. Ensure the way you load them into the environment variables is secure, and they are not registered in any logs or history.
> {style="warning"}

> Initializing the database and vault while there's data inside of them will lead to irreversible data loss. Ensure you do not accidentally use the wrong database or vault path.
> {style="warning"}

## Running the Cafe Variome V3 backend

After all necessary services and config file in place, CV3 backend can be started.

<tabs>
    <tab title="Running from source code">
        The backend services are either Quart ASGI applications, or an <code>aiomultiprocess</code> based process pool application. To start the corresponding app, one can either run the Python script directly, for example:
        <code-block lang="bash">
            cd cv3-backend-admin  # Change to the admin app folder
            export PYTHONPATH="./src:$PYTHONPATH"  # Add the source folder to the Python path
            python src/cv3_backend_admin/admin.py  # Run the admin app
            # Or optionally use your preferred ASGI server
            hypercorn cv3_backend_admin.asgi:app
        </code-block>
        <snippet id="backend-run-with-script">
            Or to use the management script to start all services:
            <code-block lang="bash">
                # To install the script to PATH
                ./CafeVariome3.sh install &lt;a_location_you_have_write_access&gt;
                # To start the server
                CafeVariome3 start
                # To stop the server
                CafeVariome3 stop
                # To restart the server
                CafeVariome3 restart
            </code-block>
            To modify any startup parameters, modify the script:
            <code-block lang="bash">
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
            </code-block>
            Above is the parameters at the beginning of the script. Modify accordingly. They can also be overridden by environment variables, for example:
            <code-block lang="bash">
                export CV3_BIND="0.0.0.0:8000"
                ./CafeVariome3.sh start
            </code-block>
        </snippet>
    </tab>
    <tab title="Running from binaries">
        The binary build uses multi-project build in nuitka, combining multiple binaries into the same package to allow sharing of statically linked libraries. To run the binaries, they need to be renamed to fit the entry name, or run with a different <code>arg[0]</code>. For example:
        <code-block lang="bash">
            cp backend admin
            ./admin
        </code-block>
        <include from="deploying-backend.md" element-id="backend-run-with-script" />
    </tab>
    <tab title="Running from docker">
        Docker is the recommended way to deploy the CV3 backend. Below is an example docker compose file to deploy the backend:
        <code-block src="yaml/docker-compose.cv.yaml" lang="yaml" />
    </tab>
</tabs>
