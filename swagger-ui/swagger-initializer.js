window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: "https://v3doc.cafevariome.org/openapi/cv3-all-bundled.yaml",
    urls: [
      {
        "name": "All Services",
        "url": "https://v3doc.cafevariome.org/openapi/cv3-all-bundled.yaml"
      },
      {
        "name": "Admin API",
        "url": "https://v3doc.cafevariome.org/openapi/cv3-admin-bundled.yaml"
      },
      {
        "name": "Network Gateway",
        "url": "https://v3doc.cafevariome.org/openapi/cv3-network-bundled.yaml"
      },
      {
        "name": "Query API",
        "url": "https://v3doc.cafevariome.org/openapi/cv3-query-bundled.yaml"
      }
    ],
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl,
      SwaggerUIBundle.plugins.TopbarPlugin
    ],
    layout: "StandaloneLayout",
    queryConfigEnabled: true
  });

  //</editor-fold>
};
