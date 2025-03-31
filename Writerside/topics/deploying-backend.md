# Deploying Backend

<primary-label ref="backend"/>

## Overview

The backend of Cafe Variome V3 is developed in Python and optimised for high efficiency. It is designed to run seamlessly in both clustered and cloud environments. This document outlines how to deploy the backend on a single server and how to configure the necessary supporting software to ensure everything works correctly.

## Prerequisite

If running Cafe Variome V3 backend from source, the following dependencies are required on the server:

- Python 3.11. The backend requires Python 3.11 or later due to specific `syntax` and `asyncio` features. While Python 3.12 may work in theory, it has not been thoroughly tested. For best compatibility, it’s recommended to use the latest release of Python 3.11.

The following services are also required, but they do not need to be on the server, just in a reachable location:

- KeyCloak 23+. Keycloak is an open-source <tooltip term="OIDC">OIDC</tooltip> provider maintained by Red Hat. CV3 uses <tooltip term="OIDC">OIDC</tooltip> for user authentication and management, as well as for advanced token handling supported by Keycloak. If you prefer to use a different authentication provider, it's recommended to connect it through Keycloak’s identity brokering feature. While CV3 may work with other <tooltip term="OIDC">OIDC</tooltip> providers, this is untested and not officially supported.
- <tooltip term="Vault">Vault</tooltip> by HashiCorp 1.15+. <tooltip term="Vault">Vault</tooltip> is an all-in-one secret management tool and cryptographic engine. CV3 uses <tooltip term="Vault">vault</tooltip> to store sensitive information, and to encrypt/sign critical traffic for security.
- MongoDB 6.0+. CV3 uses MongoDB to store all system data, including configuration and ingested data used for querying. Both standalone and clustered MongoDB deployments are supported, as CV3 does not depend on advanced cluster-specific features.
- Redis 6.0+. CV3 uses Redis as a cache and a message broker. It's used to store temporary data, and to pass messages between different parts of the system.

For detailed instructions on how to set up these services, refer to [](dependent-services-configuration.md).

> It’s highly recommended to run these services in production mode. Not only does this offer improved safety and performance, but some features may not function correctly in debug mode, depending on the specific configuration.
> {style="note"}

## Configuring the CV3 backend

The Cafe Variome V3 backend requires a configuration file before it can start. This file holds all essential settings that should not be modified during runtime. To begin, copy the sample configuration:

```bash
cp instance_config.json.example instance_config.json
```

The content of the JSON file resembles:

<code-block src="json/backend.config.json" lang="json" />

Here is a breakdown of the configuration:

### MongoDB configs

This section defines the data storage settings for the instance. Most options are straightforward. The ``MaxJobs`` setting specifies the maximum number of concurrent connections used during intensive database operations, such as data ingestion. Regular, lightweight operations are not limited by this setting.

If you're running in a cluster mode, keep in mind that MaxJobs refers to the number of connections **EACH** instance will maintain - not the total across the entire cluster. Be sure to scale this setting appropriately.

For example, if ``MaxJobs`` is set to 10, a single instance will hold open up to 10 connections during intensive operations like data ingestion, until the task completes. Other quick tasks (such as typical CRUD operations) are not limited by this setting and may use additional connections. This means the total number of connections can exceed 10, but only 10 will be dedicated to heavy operations. 

In a cluster with three instances, each maintaining 10 ingestion connections, the total number of concurrent connections across the cluster would be 30.

### Redis configs

Redis configuration is simple, with only the host and port to be set. As of now no authentication or ACL is supported. If the redis server is a cluster, set the ``Cluster`` to true.

### Keycloak configs

The primary <tooltip term="OIDC">OIDC</tooltip> provider for CV3 must be a Keycloak server, rather than a different <tooltip term="OIDC">OIDC</tooltip> provider. This is because CV3 relies not only on standard <tooltip term="OIDC">OIDC</tooltip> flows for user authentication, but also on Keycloak-specific configurations and features to manage users and access tokens.

The configuration includes all required information to connect to the Keycloak server. It also specifies the backend service URL and a list of all supported redirect URIs. Note that the client secret is **not** stored in the configuration file - it is securely managed within HashiCorp Vault.

### Vault configs

Within a single HashiCorp Vault server, multiple secret engines can exist, and several applications may share the same engine. For CV3, two specific secret engines are required:

- A **transit engine**, used to store user keys and handle encryption/decryption of data payloads.
- A **KV (Key-Value) engine**, used to store other secrets such as the Keycloak client secret.

The ``TransitPath`` defines the path to the transit engine, while ``KV2Path`` defines the path to the KV engine. The ``KV2Prefix`` is the prefix applied to all keys stored in the KV engine.

It’s recommended to isolate access between different applications using Vault by applying Vault policies to distinct path prefixes.

### CORS configs

The only setting that typically needs to be updated in the CORS configuration is the ``AllowedOrigin`` header. Once the external URLs are finalised, this should be set to the origin(s) where the frontend is hosted. Avoid changing the other headers unless you have a specific reason to extend the allowed methods or headers. Do not remove any existing headers, as this may prevent the backend from functioning correctly when accessed via a web browser.

### Metrics configs

The CV3 backend includes built-in support for Prometheus metrics collection, exporting several application-level metrics. These do not conflict with or duplicate metrics from other sources, such as MongoDB exporters. When enabled, metrics will be collected and made available at the specified sub-path. If the ``Key`` parameter is set, access to the metrics endpoint will require an ``Authorization`` header containing the API key. Prometheus can be configured to use bearer authentication to scrape this endpoint.

### Email configs

This configuration is essential, as the CV3 backend relies on email to notify admins about important events - such as access requests or critical issues like database inconsistencies. Most hosting environments include a built-in SMTP server; if not, it's recommended to use a third-party service that supports SMTP delivery. If this configuration is missing or misconfigured, CV3 will be unable to send alerts or deliver user credentials. As a result, key features such as BEACON endpoints, Nexus mode, and access request handling may fail silently.

### Legacy configs

This section controls legacy features for compatibility with Cafe Variome V2 (CV2) instances. ``Nexus mode`` refers to the functionality previously known as Cafe Variome Net - a centralised network server that facilitates federation between CV2 nodes. When ``Nexus mode`` is enabled, this CV3 instance can act as the net server for CV2 instances, allowing admins to manage them via the <tooltip term="Nexus">Nexus</tooltip> page.

The ``access token`` field is used for a service account and requires a recent version of the CV2 codebase. It secures communication between CV2 and CV3. The ``Query`` option determines whether CV2 instances are allowed to send queries to this CV3 instance:

- When ``Query`` is set to **true**, the CV3 instance will appear as an installation named <tooltip term="Nexus">nexus</tooltip> in the CV2 networks and will accept incoming queries from CV2 nodes. However, it will not federate these queries outward, as the access control models differ between CV2 and CV3.
- When ``Query`` is set to **false**, CV2 instances cannot query this CV3 instance. However, CV3 will still be able to query CV2 instances automatically, if ``Nexus mode`` is enabled.

### Logging configs

This configures the logging behaviour of the CV3 server. It sets the log level for the Quart application, which controls how application-level logs are captured. Note that this does not affect the ASGI server used to run the app - you’ll need to configure that separately depending on which ASGI server you're using. If desired, logs can also be forwarded to external systems using ``SplunkHEC`` or ``Loki``, enabling integration with log analysis tools for real-time processing and monitoring.

CV3’s built-in file logger supports automatic log rotation. When a log file exceeds the limit set by ``MaxBytes``, it is rotated, and a new log file is started. The number of archived log files kept is defined by ``BackupCount``. Once this limit is reached, the oldest log file is deleted, helping prevent excessive disk usage over time.

> Modifying the config file requires restarting the application to take effect. Avoid modifying the file when the application is running. Although technically the content of the file is loaded when the application starts, it may still have unforeseen consequences.
> {style="warning"}

## Deploying the Cafe Variome V3 backend

The CV3 backend can be deployed in three ways: from source code, using pre-compiled binaries, or via Docker containers. Docker containers are the recommended option for production environments, as they simplify deployment, scaling, and maintenance. If your hosting environment does not support Docker, the pre-compiled binaries are a good alternative - they include all required libraries and dependencies as statically linked files, ensuring consistent behaviour across systems. Source code deployment is intended primarily for development purposes or when no other deployment method is feasible.

> The binary version of the backend is compiled using **Nuitka**, a Python-to-C compiler. When targeting Linux, creating a truly universal binary is challenging because it's built against the system’s libraries. In this case, the binary is compiled with ``glibc 2.34``, which means any system running the binary must have ``glibc 2.34`` or newer installed as a minimum requirement.
> {style="warning"}

<tabs>
    <tab title="Deploy from source code">
        The first thing to do is to install dependencies with pip. Run the following command in the downloaded source folder (with Python and pip available in PATH, you may need to activate the conda environment beforehand):
        <code-block lang="bash">
            pip install -r requirements.txt
        </code-block>
        To run each component from source, you’ll need a configuration file placed in each component’s folder. These config files can be identical or customised individually, depending on your setup needs. Refer to the guide above for instructions on modifying the config content. Once ready, use the provided script to copy the configuration into the correct location and to set the Vault credentials.
        <code-block lang="bash">
            ./CafeVariomeV3 update-config
            export VAULT_ROLE_ID=... # Role ID for AppRole authentication, ensure this role have access to the secret paths
            export VAULT_SECRET_ID=... # Secret ID for AppRole authentication
        </code-block>
        The backend is now ready to start. However, before it can function properly, the storage must be bootstrapped with the correct configuration. This can be done using the CLI:
        <code-block lang="bash">
            ./CafeVariomeV3 cli
        </code-block>
        Type <code>install</code>, and follow the interactive process to finish the setup.
    </tab>
    <tab title="Deploy from binaries">
        The binaries are pre-compiled Python code, built using <code>nuitka</code>. In theory they should behave exactly like the source code. To use the binaries, first download them in from the <a href="https://github.com/CafeVariomeUoL/cv3-backend/releases">GitHub Release page</a>. Then, extract the files to a location where the backend will be run. The config file is located in <code>cv3-backend/etc/instance_config.json</code>. Modify the file to match your environment, and set the Vault credentials:
        <code-block lang="bash">
            export VAULT_ROLE_ID=... # Role ID for AppRole authentication, ensure this role have access to the secret paths
            export VAULT_SECRET_ID=... # Secret ID for AppRole authentication
        </code-block>
            The backend is now ready to start. However, before it can function properly, the storage must be bootstrapped with the correct configuration. This can be done using the CLI:
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

After all necessary services and config file in place, the CV3 backend can be started.

<tabs>
    <tab title="Running from source code">
        The backend services are either Quart ASGI apps, or process pool applications built using <code>aiomultiprocess</code>. To start a specific service, you can run its corresponding Python script directly. For example:
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
            The parameters listed above appear at the beginning of the script and can be modified as needed. Alternatively, they can be overridden using environment variables. For example:
            <code-block lang="bash">
                export CV3_BIND="0.0.0.0:8000"
                ./CafeVariome3.sh start
            </code-block>
        </snippet>
    </tab>
    <tab title="Running from binaries">
        The binary build uses Nuitka’s multi-project build feature, which combines multiple binaries into a single package to share statically linked libraries. To run these binaries, they must either be renamed to match the expected entry point name, or executed with a different <code>arg[0]</code>. For example:
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

<seealso>
    <category ref="related">
        <a href="quick-start-guide.md"/>
        <a href="dependent-services-configuration.md"/>
        <a href="deploying-frontend.md"/>
    </category>
</seealso>
