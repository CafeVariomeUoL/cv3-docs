# Quick Start Guide

Resources links:

- Frontend GitHub Repository: [https://github.com/CafeVariomeUoL/cv3-frontend/](https://github.com/CafeVariomeUoL/cv3-frontend/)
- Backend GitHub Repository: [https://github.com/CafeVariomeUoL/cv3-backend/](https://github.com/CafeVariomeUoL/cv3-backend/)
- Hosted precompiled releases:
    - Frontend: [https://artifactory.cafevariome.org/#browse/browse:cv3-frontend](https://artifactory.cafevariome.org/#browse/browse:cv3-frontend)
    - Backend: [https://artifactory.cafevariome.org/#browse/browse:cv3-backend](https://artifactory.cafevariome.org/#browse/browse:cv3-backend)

Cafe Variome V3  (CV3 for short) is an open-source web application for data discovery on healthcare and medical data, so you can either try out our [demo](https://www.cafevariome.org/) or deploy it onto your server. Here are the basic steps on how:

## Prerequisite

To deploy a working copy of CV3, you will need:

- An HTTP server or load balancer (Apache, Nginx, etc.)
- Python environment, 3.11+
- A reachable instance of MongoDB
- A reachable instance of Redis
- A reachable instance of KeyCloak
- A reachable instance of Hashicorp Vault
- Correct permission to copy the files, configure the server and database, install and run Python packages, etc. The deployment itself does not require root privileges, but you might need them to configure the file server. Contact your system admin if you require further assistance with user privileges.

There is also a copy of example Apache configuration file in the backend repository, which can be used as a reference for setting up the reverse proxy. It is located at `resources/cafevariome.conf`.

## Deploy with source code

### Deploying the front end as a web app

The front end consists of 3 Flutter application, written with a cross-platform programming framework developed by Google. It can be compiled to run on desktop systems, but here we will cover only the web deployment.

The easiest option is to **Deploy it from release**. We provide periodical releases on major version updates and essential bug/security fixes, and they can be used directly as static web apps. To deploy from releases, download from the [GitHub release section](https://github.com/CafeVariomeUoL/cv3-frontend/releases), and follow the `README.md` provided within the release. Here is a brief summary:

Basically, you need to modify the config files (located at `assets/assets/config.json` for each app) and `callback` files to point to correct addresses. During compiling, each component has been assigned a subpath, and has to be followed when deploying it. By default, we assume that the entire folder is placed under a domain root. This means that, for a domain of `www.example.com`:

- The admin interface will be at `www.example.com`
- The record level discovery interface will be at `www.example.com/discover`
- The metadata discovery interface will be at `www.example.com/meta-discover`

To change this behavior, you would need to recompile the release with correct parameters.

#### Compiling from source

The frontend can be compiled from the latest commits or the source file of a release. The dependency is:

- Flutter SDK 3.22.0 or later
- Internet connection for downloading `pub` packages

After installing the SDK, a release can be built by running the shell script `build-release-web.sh` to build it with default parameters (which results in the same application as our release), or by running the following commands manually in project root:

```shell
# Build the admin interface
cd cv3-frontend-admin
cp ./assets/config.json.example ./assets/config.json
flutter pub get
flutter build web --release --base-href "/where-you-want-to-serve-the-app/"
sed -i 's|window.location.href = "/#/?code="|window.location.href = "/where-you-want-to-serve-the-app/#/?code="|g' ./build/web/callback.html
cd ..

# Same for the rest 2 applications
```

Note that the preceeding and traling slash `/` in the `--base-href` parameter is important, Flutter needs them to correctly replace the paths in the compiled web app.

The compiled web app will be in the ``build/web`` directory for each app. You can then move them to the correct location on your server.

### Deploying the backend

The backend consists of 9 components, and not all are mandatory. You can select which one to run based on your requirements. For the details on what each component does, refer to the backend documentation. Here we assume you need everything.

The first thing you need is to install dependencies with pip. Run the following command in the downloaded source folder (with Python and pip available in PATH, you may need to activate the conda environment beforehand):

```shell
pip install -r requirements.txt
```

Then, to run each component from source, you need a configuration file in each component's folder. They can be exactly the same in content, or different, based on your requirements. The configuration file is a JSON file, and the default name is `instance_config.json`. Then, before you can run the backend, you need to export credentials of the Vault into environment variables:

```shell
export VAULT_ROLE_ID=... # Role ID for AppRole authentication, ensure this role have access to the secret paths
export VAULT_SECRET_ID=... # Secret ID for AppRole authentication
```

> ##### Warning
>
> The Vault role ID and secret ID are sensitive information. Ensure the way you load them into the environment variables is secure, and they are not registered in any logs or history.
{: .block-warning }

The backend also provides a CLI tool for managing the instance, including initializing the database, etc. It's recommended to use the CLI to initialize the database before running it. To use it, run the following command in the **Backend Project Folder**:

```shell
./CafeVariome3.sh cli
```

In the interactive shell, type ``install``, and follow the instructions.

> ##### Danger
>
> Initializing the database and vault while there's data inside of them will lead to irreversible data loss. Ensure you do not accidentally use the wrong database or vault path.
{: .block-danger }

```
     ________  ________  ________ _______           ___      ___ ________  ________  ___  ________  _____ ______   _______           ________     
    |\   ____\|\   __  \|\  _____\\  ___ \         |\  \    /  /|\   __  \|\   __  \|\  \|\   __  \|\   _ \  _   \|\  ___ \         |\_____  \    
    \ \  \___|\ \  \|\  \ \  \__/\ \   __/|        \ \  \  /  / | \  \|\  \ \  \|\  \ \  \ \  \|\  \ \  \\\__\ \  \ \   __/|        \|____|\ /_   
     \ \  \    \ \   __  \ \   __\\ \  \_|/__       \ \  \/  / / \ \   __  \ \   _  _\ \  \ \  \\\  \ \  \\|__| \  \ \  \_|/__            \|\  \  
      \ \  \____\ \  \ \  \ \  \_| \ \  \_|\ \       \ \    / /   \ \  \ \  \ \  \\  \\ \  \ \  \\\  \ \  \    \ \  \ \  \_|\ \          __\_\  \ 
       \ \_______\ \__\ \__\ \__\   \ \_______\       \ \__/ /     \ \__\ \__\ \__\\ _\\ \__\ \_______\ \__\    \ \__\ \_______\        |\_______\
        \|_______|\|__|\|__|\|__|    \|_______|        \|__|/       \|__|\|__|\|__|\|__|\|__|\|_______|\|__|     \|__|\|_______|        \|_______|
    
MongoDB reachable
MongoDB initialized
Redis reachable
Vault reachable
Current database version: 0.1.0
Current application version: 1.0.0
> install
```

The CLI has interactive prompts and input pop ups that guide you through the installation process. Now, the backend is ready to be started. There is a **Process manager** to manage each components by guarding their process and start/stop them accordingly. We provided a simple script to manage the backend process, with startup check and graceful shutdown:

```shell
# To start it
./CafeVariome3.sh start
Starting service... # It performs self check to ensure the process is running
Service started

# To stop it
./CafeVariome3.sh stop
Shutting down gracefully...
Service stopped

# To restart it
./CafeVariome3.sh restart
```

To modify the startup config like port number, you may override them as environment variables. Refer to the backend documentation for more details.

## Deploy with precompiled release

We provide packaged release for backend on X86-64 Linux systems and frontend for web platform. They can be downloaded from our hosted repository, and each contain a `README.md` for detailed usage instructions. To use Cafe Variome from compiled release, follow the simplified steps below:

```shell
# Download the backend release, choose your preferred version
wget https://artifactory.cafevariome.org/repository/cv3-backend/cv3-backend/v1.0.0/cv3-backend-v1.0.0.tar.gz
tar -xvf cv3-backend-v1.0.0.tar.gz
cd cv3-backend

# Configure the backend
nano instance_config.json
export VAULT_ROLE_ID=...
export VAULT_SECRET_ID=...

# Initialize the database
./CafeVariome3.sh cli
> install

# Start the backend
./CafeVariome3.sh start
cd ..

# Download the frontend release, choose your preferred version
wget https://artifactory.cafevariome.org/repository/cv3-frontend/cv3-frontend/v1.0.0/cv3-frontend-v1.0.0.tar.gz
tar -xvf cv3-frontend-v1.0.0.tar.gz
cd cv3-frontend

# Configure the frontend
nano assets/assets/config.json
nano discover/assets/assets/config.json
nano meta-discover/assets/assets/config.json

# Deploy the frontend
cd ..
mv cv3-frontend /var/www/html

# Done!
```

## Deploy with Docker

We maintain a series of docker images for CV3, including the front end and the backend. They are hosted in [our Docker Hub](https://hub.docker.com/u/brookeslab). Note that the other required services, such as vault, KeyCloak or MongoDB, are not included in the image, and you will need to provide and configure them separately.

The [main Cafe Variome V3 repository](https://github.com/CafeVariomeUoL/CafeVariomeV3) contains 2 docker compose files and a series of configuration files that can be used to quickly deploy the system. Here are the content of the two docker compose files, and what they do:

### docker-compose.dependencies.yaml

This is the docker compose file to start the dependent services, such as MongoDB, Redis, Vault, and KeyCloak. These services are usually managed by the cloud provider if using a cloud, so use of this file may not always be necessary. If using it, this stack needs to be started first, and the credentials have to be created in advance and provided to the services. Refer to the [Dependent Service Configuration](dependent-services-configuration.md) for more details.

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    deploy:
      restart_policy:
        condition: always
        delay: 5s
        window: 120s
    ports:
      - '8080:8080'
    depends_on:
      - keycloak_db
    command: start-dev --db mariadb --db-url-host keycloak_db --db-username keycloak_docker --db-password KeyCloakPassword1234 --http-port 8080
    environment:
      DB_VENDOR: mariadb
      DB_ADDR: keycloak_db
      DB_PORT: 3306
      DB_DATABASE: keycloak
      DB_USER: keycloak_docker
      DB_PASSWORD: KeyCloakPassword1234
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: KeyCloakPassword1234

  keycloak_db:
    image: mariadb:lts-jammy
    environment:
      MYSQL_ROOT_PASSWORD: KeyCloakPassword1234
      MYSQL_DATABASE: keycloak
      MYSQL_USER: keycloak_docker
      MYSQL_PASSWORD: KeyCloakPassword1234
    restart: always
    volumes:
      - ./data/keycloak/db:/var/lib/mysql

  mongodb:
    image: mongo:7.0.11
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - ./data/mongodb/db:/data/db

  redis:
    image: redis:7.4
    restart: always
    ports:
      - '6379:6379'
    command: redis-server
    volumes: 
      - ./data/redis:/data

  vault:
    image: hashicorp/vault:1.17.2
    restart: always
    ports:
      - "8200:8200"
    cap_add:
      - IPC_LOCK
    environment:
      VAULT_LOCAL_CONFIG: '{"storage": {"file": {"path": "/vault/file"}}, "listener": [{"tcp": { "address": "0.0.0.0:8200", "tls_disable": true}}], "default_lease_ttl": "168h", "max_lease_ttl": "720h", "ui": true}'
    command: server
    volumes:
      - ./data/vault/file:/vault/file
```

Several points worth noting:

1. The KeyCloak server is configured to start as a dev server in this stack, and the database is set to MariaDB. This is to facilitate the easy debugging and run it with minimal configuration. When using in production environment, **do not use the dev mode**, instead refer to Keycloak documentation on how to configure it properly.
2. Remember to change the Keycloak admin password and the database password to something secure.
3. The vault is using file storage backend and has TLS disabled. This is also for development environment only. When using on production server, it's recommended to use vault with high availability cluster. If this is not an option, you should at least use a production storage backend (like MySQL) and enable TLS.
4. You may add or modify configurations, use a different version of the image, etc. as you see fit. The provided configuration is a minimal working example. As long as the services have compatible API, the version should not matter.

### docker-compose.cv.yaml

This is the docker compose file to start the Cafe Variome V3 backend and frontend. It does not contain any dependent services, and you may use it with or without the `docker-compose.dependencies.yaml` stack, as long as all the services are in place.

```yaml
services:
  cv3-backend-admin:
    image: brookeslab/cv3-backend-admin:latest
    restart: unless-stopped
    network_mode: "host"
    depends_on:
      - cv3-backend-database-manager
      - cv3-backend-scheduler
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  # cv3-backend-cli:
  #   image: brookeslab/cv3-backend-cli:latest
  #   restart: unless-stopped
  #   network_mode: "host"
  #   depends_on:
  #     - cv3-backend-database-manager
  #     - cv3-backend-scheduler
  #   environment:
  #     VAULT_ROLE_ID: <Vault Role ID here>
  #     VAULT_SECRET_ID: <Vault Secret ID here>
  #   volumes:
  #     - ./config/backend_config.json:/app/instance_config.json
  #     - ./logs:/app/logs

  cv3-backend-database-manager:
    image: brookeslab/cv3-backend-database-manager:latest
    restart: unless-stopped
    network_mode: "host"
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
      KEYCLOAK_CLIENT_SECRET: <Your Keycloak Client Secret here>
      ADMIN_EMAIL: demo@cafevariome.org
      ADMIN_AFFILIATION: CafeVariome
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  # cv3-backend-exporter:
  #   image: brookeslab/cv3-backend-exporter:latest
  #   restart: unless-stopped
  #   network_mode: "host"
  #   depends_on:
  #     - cv3-backend-database-manager
  #     - cv3-backend-scheduler
  #   volumes:
  #     - ./config/backend_config.json:/app/instance_config.json
  #     - ./logs:/app/logs

  cv3-backend-network:
    image: brookeslab/cv3-backend-network:latest
    restart: unless-stopped
    network_mode: "host"
    depends_on:
      - cv3-backend-database-manager
      - cv3-backend-scheduler
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  # cv3-backend-nexus:
  #   image: brookeslab/cv3-backend-nexus:latest
  #   restart: unless-stopped
  #   network_mode: "host"
  #   depends_on:
  #     - cv3-backend-database-manager
  #     - cv3-backend-scheduler
  #   environment:
  #     VAULT_ROLE_ID: <Vault Role ID here>
  #     VAULT_SECRET_ID: <Vault Secret ID here>
  #   volumes:
  #     - ./config/backend_config.json:/app/instance_config.json
  #     - ./logs:/app/logs

  cv3-backend-query:
    image: brookeslab/cv3-backend-query:latest
    restart: unless-stopped
    network_mode: "host"
    depends_on:
      - cv3-backend-database-manager
      - cv3-backend-scheduler
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  cv3-backend-query-compiler:
    image: brookeslab/cv3-backend-query-compiler:latest
    restart: unless-stopped
    network_mode: "host"
    depends_on:
      - cv3-backend-database-manager
      - cv3-backend-scheduler
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  cv3-backend-query-meta:
    image: brookeslab/cv3-backend-query-meta:latest
    restart: unless-stopped
    network_mode: "host"
    depends_on:
      - cv3-backend-database-manager
      - cv3-backend-scheduler
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  cv3-backend-scheduler:
    image: brookeslab/cv3-backend-scheduler:latest
    restart: unless-stopped
    network_mode: "host"
    depends_on:
      - cv3-backend-database-manager
    environment:
      VAULT_ROLE_ID: <Vault Role ID here>
      VAULT_SECRET_ID: <Vault Secret ID here>
    volumes:
      - ./config/backend_config.json:/app/instance_config.json
      - ./logs:/app/logs

  cv3-frontend-admin:
    image: brookeslab/cv3-frontend-admin:latest
    restart: unless-stopped
    ports:
      - '5080:80'
    volumes:
      - ./config/frontend_admin_config.json:/usr/share/nginx/html/assets/assets/config.json

  cv3-frontend-query:
    image: brookeslab/cv3-frontend-query:latest
    restart: unless-stopped
    ports:
      - '5081:80'
    volumes:
      - ./config/frontend_query_config.json:/usr/share/nginx/html/assets/assets/config.json

  cv3-frontend-query-meta:
    image: brookeslab/cv3-frontend-query-meta:latest
    restart: unless-stopped
    ports:
      - '5082:80'
    volumes:
      - ./config/frontend_query_meta_config.json:/usr/share/nginx/html/assets/assets/config.json

  nginx:
    image: nginx:mainline-alpine3.18
    restart: unless-stopped
    network_mode: "host"
    ports:
      - '18080:80'
    volumes:
      - ./config/reverse_proxy.nginx.conf:/etc/nginx/nginx.conf
```

Several points worth noting:

1. 3 of the containers are commented out. They are the ones that common deployment would not require. For the active configurations, not all are necessary either. Refer to the document of each component to see what they do, if they are optional, and if you should use it.
2. The `cv3-backend-database-manager` container has extra environment variables. These are used to initialize the system without using the CLI utility. If you already have a database initialized, you do not need to supply these variables. After the first run, you may safely remove them.
3. The `cv3-backend-exporter` does not require credentials.
4. All backend containers are started to use host network mode. This is so that they can connect to the services running on `localhost`. If your databases are running with a different hostname or domain (such as in a cloud environment), it's recommended not to use host network mode. If so, the reverse proxy container no longer needs to be in host network mode either.

