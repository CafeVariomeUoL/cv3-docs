# Quick Start Guide

<primary-label ref="cv3"/>
<link-summary>This guide provides a quick way to get started from the latest release with docker.</link-summary>

Resources links:

- Frontend GitHub Repository: [](https://github.com/CafeVariomeUoL/cv3-frontend/)
- Backend GitHub Repository: [](https://github.com/CafeVariomeUoL/cv3-backend/)
- Hosted precompiled releases:
    - Frontend: [](https://artifactory.cafevariome.org/#browse/browse:cv3-frontend)
    - Backend: [](https://artifactory.cafevariome.org/#browse/browse:cv3-backend)

Cafe Variome V3 (CV3 for short) is an open-source web application for data discovery on healthcare and medical data, so you can either try out our [demo](https://www.cafevariome.org/) or deploy it onto your server. Here are the basic steps on how:

## Prerequisite

To deploy a working copy of CV3, you will need:

- An HTTP server or load balancer (Apache, Nginx, etc.)
- Docker, Docker Compose, or a compatible container runtime
- Active network connection

There is also a copy of example Apache configuration file in the backend repository, which can be used as a reference for setting up the reverse proxy. It is located at `resources/cafevariome.conf`.

## Deploying with docker

We maintain a series of docker images for CV3, including the front end and the backend. They are hosted in [our Docker Hub](https://hub.docker.com/u/brookeslab). Note that the other required services, such as vault, KeyCloak or MongoDB, are not included in the image, and you will need to provide and configure them separately.

The [main Cafe Variome V3 repository](https://github.com/CafeVariomeUoL/CafeVariomeV3) contains multiple docker compose files and a series of configuration files that can be used to quickly deploy the system. Here is the content of the two relevant docker-compose files, and what they do:

<code-block src="yaml/docker-compose.cv-dependency.yaml" collapsed-title="docker-compose.dependencies.yaml" collapsible="true" lang="yaml" />

This is the docker compose file to start the dependent services, such as MongoDB, Redis, Vault, and KeyCloak. These services are usually managed by the cloud provider if using a cloud, so use of this file may not always be necessary. If using it, this stack needs to be started first, and the credentials have to be created in advance and provided to the services. Refer to the [Dependent Service Configuration](dependent-services-configuration.md) for more details. Several points worth noting:

1. The KeyCloak server is configured to start as a dev server in this stack, and the database is set to MariaDB. This is to facilitate the easy debugging and run it with minimal configuration. When using in production environment,
   **do not use the dev mode**, instead refer to Keycloak documentation on how to configure it properly.
2. Remember to change the Keycloak admin password and the database password to something secure.
3. The vault is using file storage backend and has TLS disabled. This is also for development environment only. When using on production server, it's recommended to use vault with high availability cluster. If this is not an option, you should at least use a production storage backend (like MySQL) and enable TLS.
4. You may add or modify configurations, use a different version of the image, etc. as you see fit. The provided configuration is a minimal working example. As long as the services have compatible API, the version should not matter.

<code-block src="yaml/docker-compose.cv.yaml" collapsed-title="docker-compose.cv.yaml" collapsible="true" lang="yaml" />

This is the docker compose file to start the Cafe Variome V3 backend and frontend. It does not contain any dependent services, and you may use it with or without the `docker-compose.dependencies.yaml` stack, as long as all the services are in place. Several points worth noting:

1. 3 of the containers are commented out. They are the ones that common deployment would not require. For the active configurations, not all are necessary either. Refer to the document of each component to see what they do, if they are optional, and if you should use it.
2. The `cv3-backend-database-manager` container has extra environment variables. These are used to initialize the system without using the CLI utility. If you already have a database initialized, you do not need to supply these variables. After the first run, you may safely remove them.
3. The `cv3-backend-exporter` does not require credentials.
4. All backend containers are started to use host network mode. This is so that they can connect to the services running on `localhost`. If your databases are running with a different hostname or domain (such as in a cloud environment), it's recommended not to use host network mode. If so, the reverse proxy container no longer needs to be in host network mode either.
