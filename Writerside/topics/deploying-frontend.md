# Deploying Frontend

<primary-label ref="frontend"/>

## Overview

The frontend of Cafe Variome V3 is written with Flutter, a cross-platform application framework developed by Google. When designing the applications, we have taken into consideration different platforms, and tried our best to provide a unified experience across all platforms. However, due to the nature of Flutter, there are still some differences between the web and other versions. This document will explain the differences and how to compile and install the frontend. Note that we only provide pre-compiled release for web platform, because some parameters are set during compile time, and it's not possible to provide a single release that works for all requirements. This document will walk you through the process of compiling the frontend from source.

The frontend of Cafe Variome V3 consists of 3 applications: the admin interface, the record level query interface, and the metadata query interface. Each can be used independently as a standalone application, or they can redirect to each other (on web platform) and work together. The admin interface is used to manage the system, including user management, data source management, and system configuration. The record level query interface is used to query the data source and retrieve individual records. The metadata query interface is used to query the metadata of the data source, and retrieve the metadata. Some functionalities, such as login, landing page, etc. are shared between them.

## Prerequisite

To compile the frontend, you will need:

- Flutter SDK, 3.29.0 or above.
- Compatible Dart SDK, Flutter usually manages this automatically. The Dart SDK used to develop this project is 3.7.0.
- A working internet connection, as the Flutter SDK will download dependencies from the internet.
- Minimum of 1 GB available memory, minimum of 2 GB available disk space.

> To compile for specific platforms and to install/sign the package, other tools might be necessary. They will be explained in the corresponding sections.
> {style="note"}

## Compiling the frontend

> The instruction here suits all three parts of the frontend. The only difference is the configuration file, which needs to be changed to match the sub-paths of the application. The configuration file is explained in the following sections.

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

The backend URL points to the backend intended to use it with this frontend. The redirect URL points to the `callback.html` file within the web app, while the silent redirect URL points to the `callback-silent.html` file. When using the frontend as desktop app instead of web app, these URLs can be anything, as long as the frontend, backend and KeyCloak are configured to match. It's still recommended to set them to a domain controlled by you, as there may be credential leak if the URL is pointing outside. The admin, discover and meta-discovery URL points to the position of three web applications. If using in desktop mode they are not used, so can be left unchanged.

> Although the system uses the standard redirection flow of KeyCloak to authenticate a user, it mimics this flow in application mode. This is to minimise the effort one has to make to compile it for another platform, as different platforms handle redirection callback differently. It will make the GET and POST request to KeyCloak server behind the scene, mimicing the redirection flow, and get the authorisation code.
> {: .block-tip }

The content of `callback.html` also needs to be changed if using on web and serving under a sub-path. The line:

```javascript
window.location.href = "/#/?code=" + code;
```

Needs to be changed to:

```javascript
window.location.href = "/your/subpath/#/?code=" + code;
```

This can be done before compile in `web` directory, or after compile in the root directory of the result (often `build/web`).

For official documents on how to build and release Flutter apps, refer to [Google Documents](https://docs.flutter.dev/deployment).

> When signing and redistributing Cafe Variome 3 frontend, or any piece of this system, please refer to our licences to ensure you're complying with them.

<tabs>
    <tab title="Compile for web">
        The web version of the frontend is the easiest to compile, and the recommended distribution method for a hosted system. No extra tools required for compiling for web.
        To compile for web, configure the project as mentioned above, and run the following command in the root directory of the frontend:
        <code-block lang="bash">
            flutter build web --release
        </code-block>
        If the web app is intended to be served under a subpath, like <code>https://www.mydomain.com/cv3/</code>, the main js file need to be loaded from the sub path. To let Flutter engine know this, add the following parameter:
        <code-block lang="bash">
            flutter build web --base-href "/cv3/"
        </code-block>
        Remember to modify the `callback.html` file as mentioned above.
    </tab>
    <tab title="Compile for Linux">
        To compile for Linux, a system running Linux with necessary development header files is required. You would also need gcc and necessary dependencies. We recommend runnning <code>flutter doctor</code> and resolve any dependency issues before proceeding.
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
