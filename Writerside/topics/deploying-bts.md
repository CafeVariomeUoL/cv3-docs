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

The hardware requirements are:

- 2 CPU cores, 4 recommended
- 2 GB RAM to start, 4 GB to serve a reasonable amount of requests, 8 GB if building the graph locally
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
pip install -r requirements.txt
cp config.json.example config.json
export BIOPORTAL_API_KEY=YOUR_BIOPORTAL_API_KEY
export NHS_TRUD_API_KEY=YOUR_NHS_TRUD_API_KEY
```

The two API keys are required to download the ontology terms from BioPortal and NHS TRUD. However, if you're using the database dump we provide, the API keys are not needed.

### From Docker

Docker images contains the CLI component, but since it's cumbersome to run the CLI from a container, it can also automatically download the data and initialize the databases.

### From binary

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
HPO terms not loaded
ORDO terms not loaded
SNOMED terms not loaded

>
```

The CLI has autocomplete and help feature, so you can follow the built-in guide to load the data.

## Loading the database dump

If there is no need to customize the graph, it's recommended to use the database dump we provide. This would save both space and time to download the temporary files, build the connections, and calculate the semantic similarity scores.
