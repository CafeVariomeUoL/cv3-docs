# KeyCloak Credentials and Account

Cafe Variome V3 needs different features in KeyCloak to be enabled and granted to the account it uses. Here is a break down of the requirements:

## Features

### Client authentication

To secure the authentication flow and to authenticate the backend service with KeyCloak, the client needs to be set to confidential. This is also a requirement to enable a service account role. Enabling this will generate a client secret that will be used to authenticate the backend service with KeyCloak. By design, the client secret **CANNOT BE CHANGED IN RUNTIME**. This is because the backend needs to be able to perform operations on KeyCloak at any time. To rotate the client secret, the backend service needs to be stopped, and either the secret is changed externally inside the vault or use the CLI tool to input the new client secret.

The [Cafe Variome Assistant](https://github.com/CafeVariomeUoL/cv3-assistant) tool can also rotate the secrets of an instance it manages. Refer to its documentation for more details.

### Standard flow

Both the CV3 frontend and backend are designed specifically to use the standard flow and nothing else. This is due to the high compatibility and security of this flow, and to prevent potential credential leak. The client secret is kept in the backend, while the front end will send an auth code to exchange for the access token.

Different from normal designs, where the tokens are kept in backend to authenticate with other resources, CV3 keeps the tokens in the front end. This is due to the fact that all authorization is independent of the OIDC service, and the tokens are only with minimal scopes. This way, the backend is kept RESTful, and can potentially be used with any other tools or interface that can provide the correct tokens.

### Service account role

CV3 backend requires a service account to perform elevated privilege operations inside KeyCloak. There are two reasons for this:

- This allows the user token to have minimal scopes, because backend does not need it to authenticate with KeyCloak and perform operations.
- This allows the backend to perform operations outside the context of a request, and do some background tasks.

### Token exchange

CV3 utilizes token exchange service to translate the token into another realm, or to expand the audience of the token, allowing introspection in another client. This is to facilitate the federated nature of the user authentication in the federated network model. This feature needs to be enabled explicitly in KeyCloak, by rebuilding the server with this function enabled. This also contributes to the reason why KeyCloak is necessary, and another OIDC provider will not work with CV3.

## Service account roles

The service account bound to the client used by CV3 needs to have certain roles to allow CV3 to manage certain resources on KeyCloak. Specifically, they are:

### view-users

CV3 needs to see all the users in this realm. This is due to the fact that any user registered with any other instance of CV3, that is in the same realm, could potentially send a query to this instance. Thus, this instance needs to know in advance what users are there, and allows the admins to grant them permissions in advance. This is different from the V2 user management model, where each instance only cares about users in a local database.

### manage-users

CV3 needs to be able to create users, and update their information. This allows admins to create users directly inside the admin interface, and to update the affiliation information stored in KeyCloak.

### read-token

CV3 needs to be able to read the token of a user, to be able to perform token exchange. This is to allow the backend to translate the token into another realm, or to expand the audience of the token, allowing introspection in another client. This is to facilitate the federated nature of the user authentication, in the federated network model.

### manage-account

This allows CV3 to manage its own service account. The service account has an email address, used as the primary admin email. The CV3 instances, or the CVA tool can send email to this address to alert admins for events. This has to be updated accordingly.

### create-client, manage-clients, view-clients and manage-realm

These roles are only necessary if the nexus mode is enabled inside the config file. The nexus mode requires CV3 instance to create credentials for CV2 instances, thus it needs to be able to see, create and manage all clients inside this realm. Use this permission with care, as a mistake can potentially affect the clients not just for CV2, but for other applications. It's recommended to create only one instance of CV3 with nexus mode enabled, and use that instance to manage all the CV2 instances in this realm. This is a hard limit in CVA tool.
