# Dependent Services Configuration

Cafe Variome V3 relies on multiple services to function correctly, including databases, storage systems, and identity providers.

## MongoDB

MongoDB is a schemaless NoSQL database used by Cafe Variome V3 to store both operational and discoverable data.

<tabs>
    <tab title="Install as a package">
        Official document can be found <a href="https://www.mongodb.com/docs/manual/administration/install-on-linux/">here</a>. For Ubuntu, it can be installed via a custom source:
        <code-block lang="bash">
            sudo apt install gnupg curl
            curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
            echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
            sudo apt update
            sudo apt install mongodb-org
        </code-block>
    </tab>
    <tab title="Install with Docker">
        The minimal setup for docker would be:
        <code-block lang="yaml">
            services:
              mongodb:
              image: mongo:7.0.11
              restart: always
              ports:
                - "27017:27017"
              volumes:
                - mongodb-data:/data/db
            volumes:
              mongodb-data:
        </code-block>
    </tab>
    <tab title="Install from tarball">
        How to install as a tarball.
    </tab>
</tabs>

MongoDB supports authentication. It is recommended to enable authentication for production use. The corresponding configuration section of CV3 is:

```json
{
  "MongoDB": {
    "Host": "localhost",
    "Port": "27017",
    "User": "cafevariome",
    "Password": "cafevariome",
    "Database": "cafevariome",
    "MaxJobs": 40
  }
}
```

If authentication is not enabled, the username and password can be left empty or set to any value.

## Redis

Redis is a high speed in-memory cache storage that Cafe Variome V3 uses as a message broker and inter-process cache.

<tabs>
    <tab title="Install as a package">
        Redis comes with most distributions' package managers. For Ubuntu, it can be installed via:
        <code-block lang="bash">
            sudo apt update
            sudo apt install redis
            sudo systemctl enable redis --now
        </code-block>
    </tab>
    <tab title="Install with Docker">
        The minimal setup for docker would be:
        <code-block lang="yaml">
            services:
              redis:
              image: redis:7.4
              restart: always
              ports:
                - '6379:6379'
              command: redis-server
              volumes:
                - ./data/redis:/data
            volumes:
              redis-data:
        </code-block>
    </tab>
    <tab title="Install from tarball">
        How to install as a tarball.
    </tab>
</tabs>

Redis does not use traditional username/password authentication but instead relies on an ACL system. Currently, CV3 does not support this authentication method and only works with Redis without authentication.

Redis may also be configured as a cluster. When using a redis cluster, set the `cluster` option in CV3 configuration to
`true`.

## Keycloak

Keycloak is an open source <tooltip term="OIDC">OIDC</tooltip> identity provider that Cafe Variome V3 uses to authenticate users. CV3 integrates with Keycloak deeply, not only by using the <tooltip term="OIDC">OIDC</tooltip> protocol, but also uses its REST API to manage users, tokens and clients. It currently cannot use a different <tooltip term="OIDC">OIDC</tooltip> server.

### Using Keycloak docker

It's recommended to use Keycloak with docker. Otherwise, the server should be specifically hardened, and Keycloak should be run as a service to ensure availability and security.

<tabs>
    <tab title="Install with Docker">
        The minimal setup for docker would be:
        <code-block lang="yaml">
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
                  - keycloak-db:/var/lib/mysql
            volumes:
              keycloak-db:
        </code-block>
        This set up is for a dev server. For production use, you need to use `start` instead of `start-dev`, and may need to configure Java keystore for SSL, as well as other security settings.
    </tab>
    <tab title="Install from tarball">
        How to install as a tarball.
    </tab>
</tabs>

Cafe Variome V3 requires a service account with sufficient privileges to manage users and handle token operations. The necessary roles, which may be assigned to different clients, include:

- view-users
- manage-users (optional if need to create users)
- read-token
- manage-account
- manage-account-links
- view-groups
- view-applications
- delete-account
- view-profile

If you wish to use the Nexus mode (which manages multiple CV2 instances), you will also need to assign the following roles:

- create-client
- manage-clients
- view-clients

For federated authentication, a client role must be created with audience mappers for all clients that need to support this feature. This role should then be set as a default client role for those clients. By doing so, their access tokens will automatically include the necessary audiences. An example is:

![keycloak-audience-client-role.png](../images/keycloak-audience-client-role.png)

The two clients are the ones assumed that will be used for federated authentication.

To set up the credentials in KeyCloak 21+, follow the steps below:

<procedure title="Create credentials in KeyCloak 21+">
   <p>To set up the credentials in KeyCloak 21+, follow the steps below:</p>
   <step>Log in to KeyCloak as an administrator. The administrator account can be the global admin in master <tooltip term="realm">realm</tooltip>, or any admin account with the <code>realm-management</code> role in the <tooltip term="realm">realm</tooltip> you wish to use.</step>
   <step>Go to the <tooltip term="realm">realm</tooltip> you wish to use, and go to the <code>Clients</code> page.</step>
   <step>Click the <code>Create client</code> button to create a new client.</step>
   <step>Set the client type to <code>Service account</code>, and the client ID, client name, and description to something you wish to use. Click <code>Save</code> to save the client.</step>
   <step>In Capability config, enable <code>Client authentication</code>, <code>Standard flow</code> and <code>Service accounts roles</code>. For security purpose, it's recommended to disable <code>Direct access grants</code> and any other flow you do not use. Click <code>Next</code> to go to login settings.</step>
   <step>In the Login settings, configure all URLs to match the intended hosting location of the service. Assuming the domain hosting the service is <code>https://cv3.cafevariome.org</code>, the valid redirect URLs would be:
   <list>
      <li><code>https://cv3.cafevariome.org/callback.html</code></li>
      <li><code>https://cv3.cafevariome.org/callback-silent.html</code></li>
      <li><code>https://cv3.cafevariome.org/discover/callback.html</code></li>
      <li><code>https://cv3.cafevariome.org/discover/callback-silent.html</code></li>
      <li><code>https://cv3.cafevariome.org/meta-discover/callback.html</code></li>
      <li><code>https://cv3.cafevariome.org/meta-discover/callback-silent.html</code></li>
   </list>
   A wildcard can be used to simplify URL management. However, due to the frontend code structure, only these specified URLs will be valid for redirection. Click <code>Save</code> to save the settings.</step>
   <step>Go to the configuration page for the newly created client, and select <code>Service accounts roles</code> tab. Click <code>Assign role</code> to assign the aforementioned roles to the client.</step>
   <step>Go to the <code>Client Scopes</code> page and create a new client scope, following instructions in the image above. Assign this role to the client as a default client role.</step>
   <step>Fine tune other settings for this client.</step>
   <p>At this point, the client should be ready to use CV3.</p>
</procedure>

> The client secret, which is part of the client credentials, is one of the most important credential for CV3. DO NOT note it down in unsecure locations, and rotate it frequently. When running installation script, CV3 installer will ask for this secret, and store it securely in Vault.
> {style="note"}

## Vault

Vault is a powerful secret management tool that focuses on security. It's a web service that stores secrets, such as passwords, encryption keys, and other sensitive data. It stores everything in an encrypted form, and supports encryption / decryption as a service.

<tabs>
    <tab title="Install as a package">
        On some distributions, Vault can be installed via package manager. For Ubuntu, it can be installed like this:
        <code-block title="Install MongoDB on Ubuntu" lang="bash">
            sudo apt update && sudo apt install gpg wget
            wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
            sudo apt update && sudo apt install vault
        </code-block>
    </tab>
    <tab title="Install with Docker">
        Hashicorp provides an official docker image for Vault. It can be used like:
        <code-block lang="yaml">
            services:
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
        </code-block>
        The `IPC_LOCK` capability is mandatory for vault to work. The configuration of the vault can be supplied as an environment variable, or as a file. The above example uses environment variable.
    </tab>
    <tab title="Install from tarball">
        Vault is a self-contained binary that contains both the web service and a CLI tool to interact with the service. Refer to the official website to download the binary.
    </tab>
</tabs>

Vault requires unsealing each time it restarts. While this process can be automated using methods like AWS KMS or Azure Key Vault (which is recommended for production), we'll use a simple manual unseal process here for demonstration purposes.

<procedure title="Configure Hashicorp Vault">
    <p>To configure Hashicorp Vault for use with Cafe Variome, follow the steps below:</p>
    <step>Install the vault, configure it, and start the server. It's recommended to use high availability set up or auto unseal to ensure the availability of the vault server. Initialize and unseal the vault. For details on these steps, refer to <a href="https://developer.hashicorp.com/vault/docs">official vault documents</a> </step>
    <step>Enable kv store and transit engine for CV3, if not done so already. Run the following command (note that it's kv-v2, not kv):
        <code-block lang="bash">
        # Enable kv store
        vault secrets enable -path=kv kv-v2
        # Enable transit engine
        vault secrets enable -path=transit transit
    </code-block></step>
    <step>
    Create a policy that allows the CV3 to access necessary paths. CV3 needs full permission on the designated kv engine path, as well as permission to list and remove metadata for the same path (to check the key status and to completely remove a key). It also needs full access to the transit engine. A sample policy would be (assume the kv engine is mounted at <code>kv</code>, and the designated path is <code>cv3</code>, while the transit engine is mounted at <code>transit_cv3</code>):
    <code-block lang="yaml">
        path "kv/data/cv3" {
          capabilities = ["create", "update", "read", "delete", "list"]
        }
        path "kv/data/cv3/*" {
          capabilities = ["create", "update", "read", "delete", "list"]
        }
        path "kv/metadata/cv3" {
          capabilities = ["list", "delete"]
        }
        path "kv/metadata/cv3/*" {
          capabilities = ["list", "delete"]
        }
        path "transit_cv3/*" {
          capabilities = ["create", "update", "read", "delete", "list"]
        }
    </code-block>
    The policy should be stored with a name. For example, <code>cv3_policy</code>.
    </step>
    <step>
    Enable AppRole authentication. This can be done with command line:
    <code-block lang="bash">
        # Enable approle auth method
        vault auth enable approle
        # Create the role for cv3
        vault write auth/approle/role/cv3_role \
          secret_id_ttl=10m \
          token_num_uses=10 \
          token_ttl=20m \
          token_max_ttl=30m \
          secret_id_num_uses=40 \
          token_policies="cv3_policy"
        # Get the role ID
        vault read auth/approle/role/cv3_role/role-id
        # Get the secret ID
        vault write -f auth/approle/role/cv3_role/secret-id
    </code-block>
    </step>
</procedure>

The role ID is unique to each role and remains unchanged, even if the AppRole configuration is updated. In contrast, the secret ID is regenerated each time it is requested, and any previously issued secret ID becomes invalid.

In the example above, the secret ID is valid for 10 minutes after creation and can be used up to 40 times. Regardless of the authentication method (AppRole, OIDC, etc.), the client ultimately receives a token for the session. This token is configured to expire after 20 minutes and can be renewed up to a total of 30 minutes. It may be used a maximum of 10 times.

> For development purpose, the configurations can be set to 0 to disable the expiration of credentials. However, this is highly discouraged for production use.
> {style="note"}


<seealso>
    <category ref="related">
        <a href="deploying-backend.md"/>
        <a href="quick-start-guide.md"/>
        <a href="keycloak-credentials-and-account.md"/>
    </category>
</seealso>