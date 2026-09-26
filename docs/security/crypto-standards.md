# Cryptographic Standards & Token Safety

1. **SHA-256 for Token Hashing**: Sensitive tokens (such as reset keys and API tokens) are hashed via SHA-256 before database insertion to prevent cleartext disclosure in backups.
2. **Timing-Safe String Comparisons**: `crypto.timingSafeEqual` is used for webhook signatures and token verification to mitigate side-channel timing attacks.
3. **Random Nonces**: Cryptographically secure nonces generated via `crypto.randomBytes(32)` are used for OAuth state parameters.
