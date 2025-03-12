# KeyCloak Credentials and Account

Cafe Variome V3 requires certain features in Keycloak to be enabled and granted to the account it uses. Below is a breakdown of the requirements:

## Features

### Client authentication

To secure the authentication flow and authenticate the backend service with Keycloak, the client must be set to confidential. This is also required to enable a service account role. Enabling this generates a client secret, which is used to authenticate the backend service with Keycloak. By design, the client secret **CANNOT BE CHANGED IN RUNTIME**, as the backend must always be able to interact with Keycloak at any point. To rotate the client secret, the backend service must be stopped. The new secret can then be updated externally in the vault or entered manually using the CLI tool before restarting the service.

The [Cafe Variome Assistant](https://github.com/CafeVariomeUoL/cv3-assistant) tool can also rotate the secrets of an instance it manages. Refer to its documentation for more details.

### Standard flow

Both the CV3 frontend and backend are designed exclusively to use the standard flow. This approach is chosen for its high compatibility and security while minimizing the risk of credential leaks. The client secret is stored in the backend, while the frontend sends an authorization code to exchange for an access token.

Unlike standard designs, where tokens are stored in the backend to authenticate with other resources, CV3 keeps the tokens in the frontend. This is because all authorization is independent of the OIDC service, and the tokens have only minimal scopes. By doing so, the backend remains RESTful and can potentially be used with any other tools or interfaces that provide the correct tokens.

### Service account role

CV3 backend requires a service account to perform elevated privilege operations inside KeyCloak. There are two reasons for this:

- It allows the user token to have minimal scopes, as the backend does not need it to authenticate with Keycloak or perform operations.
- It enables the backend to perform operations outside the context of a request and execute background tasks.

### Token exchange

CV3 uses a token exchange service to translate tokens between realms or broaden their audience, enabling introspection by another client. This supports the federated nature of user authentication in the federated network model. This feature must be explicitly enabled in Keycloak by rebuilding the server with it activated. This is also why Keycloak is necessary, as other OIDC providers are not compatible with CV3.

## Service account roles

The service account linked to the client used by CV3 must have specific roles to allow CV3 to manage certain resources in Keycloak. These roles include:

### view-users

CV3 needs visibility of all users within the realm. This is because any user registered with a CV3 instance could send a query to any other CV3 instance in the same realm. To handle this, CV3 must be aware of all users in advance, allowing admins to preemptively grant permissions. This differs from the V2 user management model, where each instance only managed users within its local database.

### manage-users

CV3 must be able to create users and update their information. This role allows admins to add users directly through the admin interface and modify affiliation details stored in Keycloak.

### read-token

CV3 must be able to read a user's token to perform a token exchange. This allows the backend to translate the token into another realm or expand its audience, enabling introspection by another client. This supports the federated nature of user authentication within a federated network model.

### manage-account

This role allows CV3 to manage its own service account, which has an associated email address used as the primary admin contact. CV3 instances or the CVA tool can send alerts to this address to notify admins of important events. This must be updated accordingly.

### create-client, manage-clients, view-clients and manage-realm

"These roles are required only when nexus mode is enabled in the config file. Nexus mode requires a CV3 instance to create credentials for CV2 instances, meaning it must have permission to view, create, and manage all clients within this realm. Use this permission with caution, as any mistakes could impact not only CV2 clients but also other applications. It is recommended to enable nexus mode on a single CV3 instance and use it to manage all CV2 instances within the realm. This is a strict limitation in the CVA tool.