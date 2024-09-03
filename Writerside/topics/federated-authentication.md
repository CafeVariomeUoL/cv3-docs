# Federated Authentication

One core feature of Cafe Variome V3 is decentralized, zero trust discovery network. This wiki page is dedicated to the complicated security measures and authentication principles of the federated network. For general authentication model, refer to [Authentication Model](authentication-model.md) page.

## Server keys

Each instance of Cafe Variome, when joining a network (or creating one), generates a new identity. The info endpoints will still return the same basic information like owner, address, etc. but the installation ID and the keys are freshly generated. This allows semi-anonymity, and allows the separation of network permissions.

The keys are generated in Python backend, and is stored in vault immediately afterwards. The keys are standard RSA4096 keys, stored in PEM format in KV engine.

```python
private_key = rsa.generate_private_key(public_exponent=65537, key_size=4096)
public_key = private_key.public_key()

private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

self.client.secrets.kv.v2.create_or_update_secret(
    path=self.kv2_prefix + '/network/' + network_id,
    secret=dict(private_key=private_pem.decode(), public_key=public_pem.decode()),
    mount_point=self.kv2_mount_point,
)
```

During network joining request, the public key is sent in the request. When the request is approved, the key is stored inside vault. Then, the notification that a new node is in network will be propagated to all nodes; if not, the new node information will be synced during daily network sync. However, each node will need to approve the new node first. The key is stored in a separate place, until the approval. Only after the key is in place will the new node be able to communicate with this server. This allows for one-way communication, where one server accepts the other, but the other does not accept the first one.

### Signing the requests

The signature generated with server key is a SHA256 hash of the request body, signed with the private key. The signature is then sent in the request header. The reason why transit engine is not involved in the server key implementation is that the keys need to be exported and imported, and the transit engine does not support that very well.

```python
private_key = serialization.load_pem_private_key(
    private_pem.encode(),
    password=None,
    backend=default_backend()
)

signature = private_key.sign(
    payload.encode(),
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    hashes.SHA256()
)

return base64.b64encode(signature).decode()
```

The encoding and decoding in the end is to work around the problem of codec and platform differences. The result is a string that should be readable and encodeable in any platform.

## Access tokens

Access tokens are used to authenticate with KeyCloak, for either a user or a service account. The acquisition and validation of the access token is straightforward. However, there's also the case when the two instances use different KeyCloak server, or different realm, that the access token cannot be verified directly. Considering this, the user remaping is implemented.

### User remapping

User remapping refers to the operation that a user is mapped to a internal user ID, and has the permission of that internal user. The mapping does not have to be one-to-one. There are three types of user remapping:

#### No mapping

This is the simplest case. The user comes in, with no mapping at all. The user ID, although not in KeyCloak, is taken from the token directly. If the server is configured to have these IDs in the database, the operation will still be successful. This is highly discouraged, as it is not secure.

#### Static mapping

All users coming from one installation are mapped to a single internal user. This is the default case when the authentication provider is not trusted. All queries from this node will be considered performed under the privilege of this user, however, the query will still store the original user ID. This is because the query is still encrypted with the key of the original user, and the original ID is kept for query auditing.

One thing worth noting is that if the internal user is granted `Range` access to any source, this enables diffential privacy for this source. The privacy budget may quickly be exhausted, because all users are sharing the same budget.

#### Dynamic mapping

***This feature is not implemented yet.***

## User keys

For each user, to be able to log in to an instance, he would need a key in the transit engine. When the admin configures a user for being able to log in, they are in fact adding/deleting the key from the system. The key is generated in the transit engine without leaving it, as the encryption and decryption are all done in the transit engine.

```python
try:
    self.client.secrets.transit.create_key(
        name=user_id,
        key_type='rsa-4096',
        mount_point=self.transit_mount_point,
    )
except hvac.exceptions.InvalidRequest as e:
    # Key already exists
    return False

# Make the key deletable
self.client.secrets.transit.update_key_configuration(
    name=user_id,
    deletion_allowed=True,
    mount_point=self.transit_mount_point,
)
```

The transit engine requires the keys to be configured deletable before it can be deleted. The user keys are not used in signing, because the keys may be regenerated or deleted any time without the other instance knowing. It's only used to encrypt the query response. To encrypt:

```python
public_key = serialization.load_pem_public_key(
    public_pem.encode(),
    backend=default_backend()
)

aes_key = os.urandom(32)
aes_iv = os.urandom(16)

cipher = Cipher(algorithms.AES(aes_key), modes.CBC(aes_iv), backend=default_backend())
encryptor = cipher.encryptor()
encrypted_payload = encryptor.update(payload.encode()) + encryptor.finalize()

encrypted_aes_key = public_key.encrypt(
    aes_key,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

return (base64.b64encode(encrypted_aes_key).decode(),
        base64.b64encode(aes_iv).decode(),
        base64.b64encode(encrypted_payload).decode())
```

To decrypt:

```python
decrypt_response = self.client.secrets.transit.decrypt_data(
    name=user_id,
    ciphertext=encrypted_key,
    mount_point=self.transit_mount_point
)

aes_key = decrypt_response['data']['plaintext']
aes_key = base64.b64decode(aes_key)

cipher = Cipher(algorithms.AES(aes_key), modes.CBC(base64.b64decode(iv)), backend=default_backend())
decryptor = cipher.decryptor()
decrypted_payload = decryptor.update(base64.b64decode(encrypted_payload)) + decryptor.finalize()

return decrypted_payload.decode()
```

Because the payload is long, the RSA key is only used to encrypt an AES key, and the payload is encrypted with AES symmetric encryption.
