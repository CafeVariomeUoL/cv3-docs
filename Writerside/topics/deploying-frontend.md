# Deploying Frontend

<primary-label ref="frontend"/>

## Overview

The frontend of Cafe Variome V3 is built using **Flutter**, a cross-platform application framework developed by Google. During development, we aimed to deliver a consistent user experience across all supported platforms. However, due to certain limitations inherent to Flutter, there are some differences between the web version and other platform builds.

This document outlines those differences and provides guidance on how to compile and install the frontend. While we offer a pre-compiled release for the web platform, it's important to note that some parameters must be defined at compile time. As a result, it's not feasible to distribute a single pre-built release that meets all use cases. The sections below will walk you through compiling the frontend from source to suit your specific requirements.

The frontend of Cafe Variome V3 is made up of three applications: the **admin interface**, the **record-level query interface**, and the **metadata query interface**. Each can operate independently as a standalone app, or, on the web platform, where they can seamlessly redirect between one another and work together.

- The **admin interface** is used for managing the system. It handles user accounts, data sources, and configuration settings.
- The **record-level query interface** allows users to query data sources and retrieve individual records.
- The **metadata query interface** is used to search and retrieve metadata about data sources.

Certain features, such as login and the landing page, are shared across all three applications.

## Prerequisite

To compile the frontend, you will need:

- Flutter SDK, 3.29.0 or above.
- Compatible Dart SDK, Flutter usually manages this automatically. The Dart SDK used to develop this project is 3.7.0.
- A working internet connection, as the Flutter SDK will download dependencies from the internet.
- Minimum of 1 GB available memory, minimum of 2 GB available disk space.

> To compile for specific platforms and to install/sign the package, other tools might be necessary. They will be explained in the corresponding sections.
> {style="note"}

## Compiling the frontend

> The instructions in this section apply to all three frontend applications. The only difference lies in the configuration file, which must be adjusted to reflect each application's specific sub-path. Details on configuring these files are provided in the following sections.

The flutter application is designed to work on web and desktop environment, including Windows, Linux and macOS. Before compiling, several configurations need to be changed:

```shell
cp ./assets/config.json.example ./assets/config.json
nano ./assets/config.json
```

The JSON file contains only six entries:

```json
{
  "backendURL": "http://localhost:5000",
  "redirectURL": "http://localhost:49430/callback.html",
  "redirectSilentURL": "http://localhost:49430/callback-silent.html",
  "adminURL": "http://localhost:5000",
  "discoverURL": "http://localhost:5000/discover",
  "metaDiscoveryURL": "http://localhost:5000/meta-discover"
}
```

The backend URL specifies the backend server this frontend will interact with. The redirect URL should point to the ``callback.html`` file within the web app, while the silent redirect URL should point to ``callback-silent.html``. When running the frontend as a desktop application rather than a web app, these URLs can technically be set to any value—provided the frontend, backend, and Keycloak configurations all align. However, it's still recommended to use a domain under your control to avoid potential credential leakage if the URLs point elsewhere. The admin, discover, and meta-discovery URLs specify the locations of the three web applications. These are not used in desktop mode, so they can be left unchanged in that case.

> Although the system uses Keycloak’s standard redirection flow for user authentication, it emulates this flow in application mode. This approach reduces the effort required to compile the application across different platforms, as redirection callbacks are handled differently depending on the environment. Instead of performing an actual browser redirect, the application makes the necessary GET and POST requests to the Keycloak server behind the scenes, mimicking the redirection process to obtain the authorisation code.
> {: .block-tip }

If you're deploying the web app under a sub-path, you’ll also need to update the contents of `callback.html`. The line:

```javascript
window.location.href = "/#/?code=" + code;
```

Needs to be changed to:

```javascript
window.location.href = "/your/subpath/#/?code=" + code;
```

You can make this change either before compiling, within the ``web`` directory, or after compilation in the root of the output directory (typically ``build/web``).

For official documents on how to build and release Flutter apps, refer to [Google Documents](https://docs.flutter.dev/deployment).

> When signing and redistributing the Cafe Variome V3 frontend or any part of the system, please refer to our licenses to ensure compliance.

<tabs>
    <tab title="Compile for web">
        The web version of the frontend is the easiest to compile and is the recommended method for distributing a hosted system. No additional tools are required for web compilation. To build the web version, configure the project as described above, then run the following command from the root directory of the frontend:
        <code-block lang="bash">
            flutter build web --release
        </code-block>
        If the web app is meant to be served under a subpath (e.g. <code>https://www.mydomain.com/cv3/</code>), the main JavaScript file must be loaded from that subpath. To inform the Flutter engine of this, add the following parameter:
        <code-block lang="bash">
            flutter build web --base-href "/cv3/"
        </code-block>
        Remember to modify the <code>callback.html</code> file as mentioned above.
    </tab>
    <tab title="Compile for Linux">
        To compile for Linux, you’ll need a Linux system with the necessary development headers, along with gcc and other required dependencies. It's recommended to run flutter doctor beforehand and resolve any reported issues. To build for Linux, run:
        To build for linux, run:
        <code-block lang="bash">
            flutter build linux --release
        </code-block>
        This generates a directory with the compiled release. The binary file will be in <code>build/linux/release/bundle</code>. If there is a need to distribute the application, releasing as app image may be easier. There are configuration files checked into the repository to be used with `flutter_distributor` to generate app image. There is no pre-compiled app image, because the configuration files need to be modified before compiling. Run:
        <code-block lang="bash">
            # Install locate and appimagetool
            sudo apt install locate
            wget -O appimagetool "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage"
            chmod +x appimagetool
            mv appimagetool /usr/local/bin/
            # Install flutter_distributor
            dart pub global activate flutter_distributor
            # Compile the appimage
            flutter_distributor package --platform linux --targets appimage
        </code-block>
    </tab>
</tabs>

## Installing the frontend

After compiling, the frontend can then be installed, distributed or served.

<tabs>
    <tab title="Serving for web">
        Any HTTP server can serve the compiled web app. An example of Apache virtual host configuration is:
        <code-block lang="apache">
            &lt;VirtualHost *:80&gt;
                ServerName www.mydomain.com
                ServerAlias mydomain.com
                DocumentRoot /var/www/html/cv3
                &lt;Directory /var/www/html/cv3&gt;
                    Options Indexes FollowSymLinks MultiViews
                    AllowOverride All
                    Require all granted
                &lt;/Directory&gt;
            &lt;/VirtualHost&gt;
        </code-block>
    </tab>
</tabs>
