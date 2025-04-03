# General Concepts

## Dashboard
An Admin Dashboard is available allow the user to get an overview of the system  - number of sources, networks, users and network requests along with disk space usage and number of records per source (if present). This tool provides an intuative and easy way to fully control the installation.
The sources option on the Admin Dashboard allows the admin to upload data (.csv, .xls, .xslx, phenopacket and .json files) into the CafeVariome.
![Admin Dashboard](Screenshot 2025-03-12 at 16-43-53 Cafe Variome 3 Admin Interface.png)

## Import Pipelines
The available data can be uploaded into Cafe Variome using Import Pipelines, that permit different formats of data to be imported (e.g. .csv, .xls, .xslx, phenopacket and .json files).  Import Pipelines can be customised for each installation, and permit the data that will be queried and potentially shared as search results to be uploaded into Cafe Variome.

## Sources
![sources](Screenshot 2024-03-15 at 17-26-53 Untitled design.png)

The imported data can optionally be represented and used within Cafe Variome as multiple (potentially overlapping) datasets, called Sources. Each Source can be made accessible for discovery by different networks and users.

## Network
A network is a collection of Cafe Variome (or other) software instances that interact to make their content discoverabe to each other in a decentralised manner. Not all members of the network have to be discoverable by all of the members of a network. The membership participation of given installation is under the control of the local administrator. One installation can be a member of multiple different networks, and each installation automatically constitutes a 'network of 1' (to which other installations may be added).

## Discovery Group Creation
Administrators can create multiple discovery groups as needed. This provides a way to group users together, with the same rights to discover within sources and networks.

### Specification of Network, Users, and Sources:

* Network: Specify the network to be queried by the group.
* Sources: Determine which sources( i,e datasets) can be queried. Each Source can be made accessible for discovery by different networks and different users.
* Users: Define which users have access to the query builder tool .

### Granularity of Results (Policy) :
Administrators can set the level of detail users receive in query responses. This could be :-

     1. Record exists (Yes/No)
     2. Range of record amount
     3. Count of records
     3. Show record ID
     4. Show record ID with details

### Control and Customization: 
Administrators have complete control over who sees what level of detail in the results, based on user roles and data sensitivity.
### Flexibility and Management:
Discovery groups can be customized to fit specific needs, and administrators can monitor and adjust settings as necessary over time.
![Discovery-groups](Screenshot 2024-03-15 at 17-09-37 Untitled design.png)
## Note : 
Not all members of a network have to be discoverable by all others in that network, as all membership participation is under the control of the local instance administrators. One installation can be a member of multiple different networks, and each installation automatically constitutes a 'network of 1' (to which other installations may be added).