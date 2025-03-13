# User and Admin Access Control

In Cafe Variome V3, users and admins have different levels of access to the system and interface. This guide will explain the different levels of access and how to configure them. Remember to follow the principle of least privilege when assigning access to users.

## User types and access overview

In Cafe Variome V3, users can be divided into the following types:

- *Anonymous
  users*: Users who have not logged in to the system. They can only access the landing page of the system, and, if enabled, can query some data without logging in.
- *Remote
  users*: Users registered with another installation that uses the same authentication providers. They may be granted query privileges on some data sources, but they cannot log into this particular system, and cannot access the interface that requires login.
- *Users*: Regular users that have logged in. They can access the query interface, as well as user setting pages.
- *Data admins*: The administrators that manage the data sources. They are allowed to access part of the admin interface, particularly the data source management pages, discovery network and discovery group settings, etc.
- *System admins*: The administrators that manage the system. They are allowed to access the user registration, server config, and other system management pages.
- *Developers*: The super admin of the system. They have full access to all pages of the system, including the debug system, while the system is in debug mode.

This model is implemented so that data holders can separate the role that actually controls who can see the data, with the necessary role of server maintenance.

### Comparison of access

| Access type         | Anonymous | Remote | User | Data admin | System admin | Developer |
|---------------------|:---------:|:------:|:----:|:----------:|:------------:|:---------:|
| Landing page        |     ✅     |   ✅    |  ✅   |     ✅      |      ✅       |     ✅     |
| Query               |     ❓     |   ✅    |  ✅   |     ✅      |      ✅       |     ✅     |
| User setting        |     ❌     |   ❌    |  ✅   |     ✅      |      ✅       |     ✅     |
| Statistics          |     ❌     |   ❌    |  ❌   |     ✅      |      ✅       |     ✅     |
| Pipeline            |     ❌     |   ❌    |  ❌   |     ✅      |      ❌       |     ✅     |
| Data Source         |     ❌     |   ❌    |  ❌   |     ✅      |      ❌       |     ✅     |
| Discovery Network   |     ❌     |   ❌    |  ❌   |     ✅      |      ❌       |     ✅     |
| Discovery Group     |     ❌     |   ❌    |  ❌   |     ✅      |      ❌       |     ✅     |
| Beacon endpoints    |     ❌     |   ❌    |  ❌   |     ✅      |      ❌       |     ✅     |
| Nexus settings      |     ❌     |   ❌    |  ❌   |     ❌      |      ✅       |     ✅     |
| User management     |     ❌     |   ❌    |  ❌   |     ❌      |      ✅       |     ✅     |
| System setting      |     ❌     |   ❌    |  ❌   |     ✅      |      ✅       |     ✅     |
| Information setting |     ❌     |   ❌    |  ❌   |     ❌      |      ✅       |     ✅     |
| Discovery setting   |     ❌     |   ❌    |  ❌   |     ✅      |      ❌       |     ✅     |
| Debug page          |     ❌     |   ❌    |  ❌   |     ❌      |      ❌       |     ✅     |

## Creating users

User access is managed in two separate places: the KeyCloak server and the application level.

### Creating user from admin interface

Users can be created inside the admin interface, under the user management page.

![interface-user_dashboard.png](interface-user_dashboard.png)

When creating a user here, an account will also be created inside KeyCloak, and the user will receive an email, instructing them to set up their password. Once complete, the newly created account will be able to log into the system. However, the user will not be able to access any data sources, unless they are granted access to them, under discovery group settings.

### Creating user from KeyCloak

Users can also be created inside KeyCloak, although this is a more "manual" approach, and is not recommended. This is because the application uses the user ID from KeyCloak as the unique identifier, and this information needs to be manually put inside the database for it to work. This process is not allowed from the user interface as it would create an inconsistency with the database record. The system administrator would need to operate on the database directly. This should only be used while trying to recover a database from inconsistent state.

### User access request

When a user accesses the system without logging in, he would see an access request page, which will guide him through the process of providing enough information for the admin to create an account for him. Once the request is submitted, both the requester and the admin would receive an email, notifying them a new access request has been created, and the admin can then either accept the request to automatically create the account or deny the request.

### Automatic user registration

The "automatic user registration" feature refers to the ability to automatically create an account for a user in database if the user is already registered with KeyCloak. This can be set under the federation settings, inside the discovery settings page. A user would typically have an account with KeyCloak if he is granted access in another instance of Cafe Variome within the same KeyCloak domain. This usually indicates that these nodes of Cafe Variome are in the same federation network, and users are expected to be able to access the data from the different nodes. So, to simplify the account creation, Cafe Variome can create a **disabled ** user account automatically once a user tries to log in to this node, or his access token is sent to this node during a federation query. The admin can then enable the account, allow login, or grant access to data sources. *When this feature is enabled, the system will automatically create a user account for all users in other installations during a status sync of the network.*

## Granting roles to user

User can be assigned to different roles, as the ones presented above. This can either be done while creating a user in the admin interface, like in the following image:

![interface-create_user.png](interface-create_user.png)

Or by editing the user in the user management page.

![interface-user_dashboard_selected.png](interface-user_dashboard_selected.png)

![interface-user_edit_privilege.png](interface-user_edit_privilege.png)

The roles are managed in the application level, thus a user might have different roles in different installations. However, *an admin cannot grant a role to a user that he does not have himself*. For example, a data admin cannot grant a user the system admin role, even if he has the system admin role in another installation. Nor can he grant the user the role as developers. Only developer account can assign developer roles.

## Granting access to data sources

<snippet id="discovery-group-access-control">

### Discovery group model

Access to data sources are controlled by a model called **Discover Groups**. A discovery group is bound to a discovery network, and contains one or more data sources, one or more users, and has a discovery policy.

![interface-group_dashboard.png](interface-group_dashboard.png)

![interface-group_policy.png](interface-group_policy.png)

The available discovery policies are:

- Boolean response: show whether there are records inside a datasource that fits the filtering requirements.
- Range response: show a possible minimum and maximum count of records inside a datasource that fits the filtering requirements. The range is calculated based on the user access, the sensitivity of the query, the data source, etc. For example, if there are 50 records fitting the requirement, the result might be 25–65, with the average not being 50, but different for each user. ***This feature is still under active development and is not available in the current release.***
- Count response: show the exact number of records inside a datasource that fits the filtering requirements.
- Count with subject ID: show the exact number of records inside a datasource that fits the filtering requirements, and also show the subject IDs of the records. The subject ID is the ID for the record inside the database, and may or may not correspond to an actual ID (for example, NHS number of a patient, or an ID generated by de-identification system), based on how the data is ingested into the system.
- Count with details: show the records that fit the filtering requirements, with all the data related to this record. Please note that this will drastically increase the size of the response if the data contains massive representations of the subject, for example, the gene sequence. Use it with care.

### Managing discovery groups

A discovery group grants all the users in it with the same level of access to all the data sources in it. However, a user or a data source may appear in different discovery groups, to be granted different level of access to different sources. A special case would be: if a user is granted access to a source multiple times, but with different access level, he will always be using the highest level of access. For example, if there are discovery groups that:

- Grant A, B and C boolean access to source 1 and 2
- Grant C and D count access to source 1 and 3

Then user C will have count access to sources 1 and 3, and boolean access to source 2, while user A and B will have boolean access to source 1 and 2, and no access to source 3, and user D will have count access to source 1 and 3, and no access to source 2.

A user may also be granted different level of access from different discovery networks. However, if the target source is the same, he will still be using the highest level of access, regardless of the network he queries from. The level of access is definitive and overriding, so always follow the principle of least privilege when granting access to users.

</snippet>
