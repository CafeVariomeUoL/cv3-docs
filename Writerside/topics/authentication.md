# Authentication

Cafe Variome V3 uses the <tooltip term="OIDC">OIDC</tooltip> protocol for user authentication, and combines various tools to protect user credentials and resources. This section of the Wiki explains the different tools and techniques used to secure the Cafe Variome V3 backend.

Cafe Variome is designed to work exclusively with <tooltip term="KeyCloak">Keycloak</tooltip> V20+ for authentication. This is because Keycloak offers robust user management, advanced token handling, and a convenient admin API for server integration. Additionally, Keycloak can act as an identity broker, allowing users to authenticate through providers like Google, Facebook, Twitter, or other OIDC services. By leveraging this feature, Cafe Variome can support any authentication provider that Keycloak integrates with, ensuring a unified authentication model.

<seealso>
    <category ref="related">
        <a href="authentication-model.md"/>
        <a href="keycloak-credentials-and-account.md"/>
        <a href="federated-authentication.md"/>
    </category>
</seealso>