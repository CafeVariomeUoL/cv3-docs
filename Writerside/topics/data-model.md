# Data Model

<primary-label ref="backend"/>
<secondary-label ref="wip"/>

Cafe Variome V3 uses MongoDB for primary data storage. All operational data, including the user information, networks, sources, etc. are all stored in it. Additionally, the data loaded for discovery (subject data and metadata) is also stored in MongoDB, unless Molgenis is being used as a storage backend.

## Class Diagram

<code-block lang="plantuml" src="plantuml/class_diagram.puml"/>
