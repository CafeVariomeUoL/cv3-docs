# Federated Authorization

When performing discovery in a discovery network, the authorization happens in a decentralized way. This wiki page explains how a user or a node is authorized, providing insight on the basic model of the discovery network. For a general authorization process, refer to the [Authorization Model](authorization-model.md).

The federated authorization process can be divided into 2 parts: authorizing the server where the requests originate from, and the user himself.

## Node authorization

Assume that a discovery network is already created, consisting A, B and C 3 nodes. Now, Node D wishes to join this network. The joining and authorization process can be divided into:

### Join request

Node D (with some other methods, like being told offline or over email) realizes the existence of this network, and one of the member node A. Node D cannot actively join a network it doesn’t know exists, nor can it join a network that is set to be not visible to public. In these cases, it would have to be invited. This is discussed later.

Through the interface, D retrieves information about the network, and request to join. This request carries all necessary information about D, including domain, name, description, ownership, server public key (newly generated, before the join process is started), etc. All these information is sent to A, stored in a separate collection, awaiting approval.

### Accepting or denying the request

Admins will either notice the request, or be notified, if they haven’t responded to the request in a given time. They will see basic information regarding the requesting node, including its security configuration, name, reason to join, etc. but not the operational information like public key. They can either choose to accept, which adds the node into database and add the public key into the vault; deny, which purges the database of its residual data; or put on hold, which will automatically expire after a certain time.

Upon accepting or denying the request, A will send a response to D. This response tells D whether the request is approved, and if so, also carries the information about A. Note that this is the first time A sending public key to D, only after accepting a request, preventing possible misuse of the request feature.

If the request is denied, D will clean up the database; if accepted, D will start to fetch information about the network in details from A, and using the information, including the address of other nodes, to synchronize the state (url, status, basic info) for the first time. However, after state synchronization, it would need to get more details like user public keys, dataset capabilities, etc. which requires it to be authorized by other nodes too.

### Join invite

Besides the join request, another way to join the network is through invite. This is particularly useful when D doesn’t know the exact address of A, or when the network is set to be hidden. A would send an invite to D, carrying all information about the network and A, while D can either accept or reject the invite. It’s very much the same as requesting, except it’s the other way around.

### Authorizing a new node

In the perspective of B and C, D is a new node that A approved, but never seen before. In this state, all request coming from D that requires authorization will fail. This lasts until B and C performs a network sync, which is either the daily sync or triggered by A announcing a new node has joined.

During the sync, B and C would receive information about D from A, since only A have it in database. These information will be put in a collection for pending node, until the admin approves or denies the node. If denied, D can still communicate to A, but not to B or C.

For the sake of explaining, assume B approved D, while C denied D.

### Two way data sync

To prevent “ghost data”, where the information in a node changes in a decentralized network, but the others didn’t realize it and still propagating the outdated data, most of the data sync is done from the source directly, and is done on daily basis. This is why although upon approving D, the data like user list is already synced, it’s still recommended to wait for 24 hours to allow the network to fully sync up. In case of an urgent need to use the network, a manual resync can be triggered from the admin interface, but this will not let the other nodes perform the synchronization.

### Request relay

Specially, a node may not be directly reachable, and requires relay by another node. In this case, both the original node and the relay node needs to be authorized in the destination node, to allow relay to succeed. This is because both of their credentials are used, and only the original node can decrypt the response.

## User authorization

After a node is authorized, all communication between the nodes can proceed normally. Assume a user now tries to query from D. The admins of D should have granted necessary permission for this user, and the results from D locally will be returned directly to the user. In the meantime, the query is also sent to A and B. C is ignored due to it not accepting D, the query won’t be sent in the first place.

### User mapping

Based on whether A and D is using the same authentication service provider (A.K.A. the same realm in a KeyCloak), the user token may not be accepted. This is explained in [Federated Authentication](federated-authentication.md). After this step, the user may carry the permission of either himself or the remapped user ID. The ID used for encryption is still the original ID.

### Discovery group

For any node in the network, it cannot see the user access level in another node, thus would need to determine the discovery group configuration on its own. The incoming request may carry a granularity request, but it's up to the node whether to respond with the requested granularity. If the granularity is higher than the permitted, the node will respond with the permitted granularity. If the granularity is lower than the permitted, the node will respond with the requested granularity. If the granularity is not specified, the node will respond with the permitted granularity.

It's not possible to restrict the user access based on source node, unless the user is remapped. For a user that is not remapped, the user access level is determined by the user access level in the current node, regardless of the source node. This is to uphold the fairness principle of the decentralized network.
