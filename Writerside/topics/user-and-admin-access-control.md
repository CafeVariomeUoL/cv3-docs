# User and Admin Access Control

<primary-label ref="cv3"/>

In Cafe Variome V3, users and admins have different levels of access to the system and interface. This guide will explain the different levels of access and how to configure them. Remember to follow the principle of least privilege when assigning access to users.

## User types and access overview

In Cafe Variome V3, users can be divided into the following types:

- **Anonymous
  users**: Users who have not logged in to the system. They can only access the landing page of the system, and, if enabled, can query some data without logging in.
- **Remote
  users**: Users registered with another installation that uses the same authentication providers. They may be granted query privileges on some data sources, but they cannot log into this particular system, and cannot access the interface that requires login.
- **Users**: Regular users that have logged in. They can access the query interface, as well as user setting pages.
- **Data admins**: The administrators that manage the data sources. They are allowed to access part of the admin interface, particularly the data source management pages, discovery network and discovery group settings, etc.
- **System admins**: The administrators that manage the system. They are allowed to access the user registration, server config, and other system management pages.
- **Developers**: The super admin of the system. They have full access to all pages of the system, including the debug system, while the system is in debug mode.

This model is designed to allow data holders to separate the role responsible for controlling access to data from the role required for server maintenance.

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

❓ -  Access Level not explicitly defined. It may vary depending on the system's configuration.

## Creating users

User access is managed in two separate places: the <tooltip term="KeyCloak">KeyCloak</tooltip> server and the application level.

### Creating user from admin interface

Users can be added through the admin interface on the user management page.

![interface-user_dashboard.png](interface-user_dashboard.png)

When a user is created here, an account is also generated in <tooltip term="KeyCloak">KeyCloak</tooltip>, and the user will receive an email prompting them to set up their password. Once completed, the new account will be able to log into the system. However, access to data sources will not be granted unless explicitly assigned through the discovery group settings.

### Creating user from KeyCloak

Users can also be created inside <tooltip term="KeyCloak">KeyCloak</tooltip>, although this is a more "manual" approach, and is not recommended. This is because the application uses the user ID from <tooltip term="KeyCloak">KeyCloak</tooltip> as the unique identifier, and this information needs to be manually put inside the database for it to work. This process is not allowed from the user interface as it would create an inconsistency with the database record. The system administrator would need to operate on the database directly. This should only be used while trying to recover a database from inconsistent state.

### User access request

When a user attempts to access the system without logging in, they will be directed to an access request page. This page guides them through the process of providing necessary information for the admin to create an account. After submitting the request, both the requester and the admin will receive an email notification about the new access request. The admin can then choose to accept the request, which will automatically create the account, or deny it.

### Automatic user registration

This feature allows for the automatic creation of a user account in the database if the user is already registered with <tooltip term="KeyCloak">KeyCloak</tooltip>. This feature can be configured under the federation settings on the discovery settings page. Typically, a user will have a <tooltip term="KeyCloak">KeyCloak</tooltip> account if they have been granted access to another instance of Cafe Variome within the same <tooltip term="KeyCloak">KeyCloak</tooltip> domain. This usually means that the Cafe Variome nodes are part of the same federation network, allowing users to access data across different nodes. To simplify the account creation process, Cafe Variome can automatically create a **disabled** user account when the user attempts to log in to this node, or when their access token is sent during a federation query. The admin can then enable the account, allow the user to log in, or grant access to specific data sources.

*When this feature is enabled, the system will automatically create a user account for all users in other installations during a status sync of the network.*

## Granting roles to users

Users can be assigned different roles, such as the ones shown above. This can be done during user creation in the admin interface, as demonstrated in the following image:

![interface-create_user.png](interface-create_user.png)

Or by editing the user in the user management page.

![interface-user_dashboard_selected.png](interface-user_dashboard_selected.png)

![interface-user_edit_privilege.png](interface-user_edit_privilege.png)

Roles are managed at the application level, meaning that a user may have different roles across different installations. However, **an admin can only grant a role to a user if they themselves possess that role**. For example, a data admin cannot assign a user the system admin role, even if they hold the system admin role in another installation. Similarly, a data admin cannot assign developer roles; only a developer account can grant developer roles.

## Granting access to data sources

<snippet id="discovery-group-access-control">

### Discovery group model

Access to data sources is managed through a model called **Discovery Groups**. Each discovery group is associated with a discovery network and contains one or more data sources, one or more users, and a defined discovery policy.

![interface-group_dashboard.png](interface-group_dashboard.png)

![interface-group_policy.png](interface-group_policy.png)

The available discovery policies are:

- **Boolean response**: This indicates whether there are records within a data source that meet the filtering criteria.
- **Range response**: This provides the maximum and minimum possible count of records within a data source that meet the filtering criteria. This range is calculated based on factors like user access, query sensitivity, and the data source itself. For example, if 50 records fit the criteria, the result might be displayed as a range of 25–65, with the actual average varying for each user. ***This feature is still under active development and is not available in the current release.***
- **Count response**: show the exact number of records inside a datasource that fits the filtering requirements.
- **Count with subject ID**: This refers to a response that provides both the exact number of records within a data source that meet the filtering criteria, as well as the subject IDs associated with those records. The subject ID is the unique identifier assigned to each record in the database. This ID may represent an actual identifier, such as a patient's NHS number, or a de-identified ID, depending on the data ingestion process and whether de-identification was applied.
- **Count with details**: This displays the records matching the filtering criteria, along with all associated data for each record. Please be aware that this may significantly increase the response size, especially if the data includes large representations like gene sequences. ***Use with caution.***

### Managing discovery groups

A discovery group assigns the same level of access to all users within it for all data sources contained in the group. However, both users and data sources can be included in multiple discovery groups, granting them different access levels for different sources. In the case where a user is granted access to a source multiple times with varying access levels, the highest access level will always apply.

For example, consider the following discovery groups:

- Group 1 grants users A, B, and C boolean access to sources 1 and 2.

- Group 2 grants users C and D count access to sources 1 and 3.

In this scenario:

- User C will have count access to sources 1 and 3, and boolean access to source 2.

- Users A and B will have boolean access to sources 1 and 2, but no access to source 3.

- User D will have count access to sources 1 and 3, but no access to source 2.

Additionally, a user may have different access levels granted through different discovery networks. However, if the same source is involved, the user will always use the highest access level, regardless of the network from which the query originates. Since access levels are definitive and take precedence, it's important to adhere to the principle of least privilege when granting user access.

</snippet>


<seealso>
    <category ref="related">
        <a href="authorisation.md"/>
        <a href="authentication.md"/>
        <a href="keycloak-credentials-and-account.md"/>
    </category>
</seealso>

