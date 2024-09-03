# Authentication

Cafe Variome V3 uses OpenID Connect (OIDC) protocol for user authentication, and use a mix of tools to secure the user credentials and resources. This section of WiKi explains the various tools and techniques used to secure the Cafe Variome V3 backend.

Cafe Variome is not designed to work with any other authentication providers than a V20+ KeyCloak. This is due to the fact that KeyCloak provides powerful user management and token manipulation functions as well as convenient admin API to work with the server. Also, KeyCloak can be set to broker the identity of users from other authentication providers such as Google, Facebook, Twitter, or another OIDC provider, etc. With this feature, Cafe Variome can be configured to work with any of the authentication providers that KeyCloak supports, via the translating of KeyCloak. This allows for a unified authentication model for Cafe Variome.
