# Deploying BTS

CV-BTS is backend only. It's meant to be queried by CV3 and its supporting services, but it may also be used independently or to support other biomedical related tools.

## Overview

The BTS backend is written in Python, powered by Quart. When in operation mode, it does not write into the databases, so it's safe to be scaled horizontally. All requests are RESTful, so there will be no session management required.

## Dependencies

The following language and libraries are required to run BTS:

- Python 3.11+
- Packages listed in `requirements.txt`

The following software and tools are required to run BTS:

- A web server (e.g., Nginx) for reverse proxy and HTTPS
- An ASGI server (Hypercorn if running from the script directly)
- MongoDB
- Neo4j
- Redis

The hardware requirements are:

- 2 CPU cores, 4 recommended, as many as needed for calculating semantic similarity
- 2 GB RAM to start (excluding the database requirements), 8 GB to serve a reasonable amount of requests, 64 GB if building the graph locally with up to 12 workers
- 30 GB storage, 60 GB if building the graph locally

> We have optimised the database to use indexes and pre-calculated relationships, exchanging space for speed. Still, similarity search is heavy on the Neo4j, which is memory hungry. We recommend at least 4GB of RAM for the Neo4j instance; if used in production, supporting multiple Cafe Variome V3 instances, we recommend a cloud/clustered solution with dynamic scaling.
> {style="note"}

## Installation

The BTS can be run from source, from a Docker container, from a pre-built binary, or as a Python package.

### From source

Prepare the Python environment first:

```shell
git clone https://github.com/CafeVariomeUoL/cv3-bioterms.git
cd cv3-bioterms
pip install .
cp config.json.example config.json
export BIOPORTAL_API_KEY=YOUR_BIOPORTAL_API_KEY
export NHS_TRUD_API_KEY=YOUR_NHS_TRUD_API_KEY
```

The two API keys are required to download the ontology terms from BioPortal and NHS TRUD. However, if you're using the database dump we provide, the API keys are not needed.

### From Docker

Docker images contains the CLI component, but since it's cumbersome to run the CLI from a container, it can also automatically download the data and initialize the databases. Since the project requires multiple external databases, it's recommended to use docker compose to start the service. The example docker compose file is released in the main repository:

```yaml
services:
  cv3-bioterms:
    image: brookeslab/cv3-bioterms:latest
    ports:
      - '3000:3000'
    environment:
      - BIOPORTAL_API_KEY=YOUR_BIOPORTAL_API_KEY
      - NHS_TRUD_API_KEY=YOUR_NHS_TRUD_API_KEY
    volumes:
      - ./config/bioterms_config.json:/app/config.json
    networks:
      - cv3_bioterms

  mongodb:
    image: mongo:7.0.11
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - cv3_bioterms

  neo4j:
    image: neo4j:5.22.0
    restart: always
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data
    networks:
      - cv3_bioterms

  redis:
    image: redis:7.4
    restart: always
    ports:
      - '6379:6379'
    command: redis-server
    volumes: 
      - redis_data:/data

networks:
  cv3_bioterms:
    driver: bridge

volumes:
  mongodb_data:
  neo4j_data:
  redis_data:
```

When running in docker, the database will be automatically populated. To disable this behavior, set environment variable `AUTO_LOAD` to `false`. The API keys are used to download the files. However, due to restrictions on the various data sources, not all data can be downloaded from the API. Some data files require manual downloading.

### From binary

We provide portable binary package releases for Linux environments. The binary is built using `nuitka`, a tool to compile Python code to C first, then executables. The result binary contains all necessary dependencies, and should perform consistently on all Linux distributions, provided that the `glibc` version is compatible. The binary also does not require Python or other runtime to be used, and may have a slightly better performance, due to the methods `nuitka` used to compile it. We do not currently provide binary release for Windows or MacOS, as we do not anticipate use cases with any OS other than Linux servers.

To use the binary release, download it from either the GitHub release page, or our artifact repository. The binaries in our artifact repository contains a "nightly" build, which keeps up to date with the main branch (if the test cases pass of course). However due to storage constraints, the old artifacts may be removed, so if you're looking for an old release for over 180 days, you may need to build it from source or check out the GitHub repository.

After downloading the tarball, extract it to a directory, and run the script:

```shell
tar -xzf cv3-bioterms-nightly.tar.gz
cd cv3-bioterms
./BioTermService.sh
```

### From Python package

## Using the CLI to load data

The CLI is used to download and load the data into the databases. In production, it might be the case where only part of the data is needed, so the CLI can selectively download and initialize only part of the graph.

```shell
# When running from source code, use the script
./BioTermService.sh cli
# When running from binary, use the binary
./app cli

     ________  ___      ___      ________  ___  ________  _________  _______   ________  _____ ______
    |\   ____\|\  \    /  /|    |\   __  \|\  \|\   __  \|\___   ___\\  ___ \ |\   __  \|\   _ \  _   \
    \ \  \___|\ \  \  /  / /    \ \  \|\ /\ \  \ \  \|\  \|___ \  \_\ \   __/|\ \  \|\  \ \  \\\__\ \  \
     \ \  \    \ \  \/  / /      \ \   __  \ \  \ \  \\\  \   \ \  \ \ \  \_|/_\ \   _  _\ \  \\|__| \  \
      \ \  \____\ \    / /        \ \  \|\  \ \  \ \  \\\  \   \ \  \ \ \  \_|\ \ \  \\  \\ \  \    \ \  \
       \ \_______\ \__/ /          \ \_______\ \__\ \_______\   \ \__\ \ \_______\ \__\\ _\\ \__\    \ \__\
        \|_______|\|__|/            \|_______|\|__|\|_______|    \|__|  \|_______|\|__|\|__|\|__|     \|__|

Database reachable
CTV3 terms loaded
Gene Symbol (HGNC Standard) terms loaded
HGNC terms loaded
HPO terms loaded
NCIT terms loaded
OMIM terms loaded
Orphanet terms loaded
Reactome terms loaded
SNOMED CT terms loaded

>
```

The CLI has autocomplete and help feature, so you can follow the built-in guide to load the data.
