# Troubleshooting GitHub OAuth & Token Invalidation

## Common Issues & Resolutions

### 1. `Bad credentials` (HTTP 401)
- **Cause**: User revoked application authorization in GitHub settings, or OAuth token expired.
- **Resolution**: Clear token from user record and prompt re-authentication via `/api/auth/github`.

### 2. Missing Private Repositories
- **Cause**: OAuth scope was initialized without `repo` permission.
- **Resolution**: Request elevated scopes during onboarding: `scope=read:user,user:email,repo`.

### 3. Organization Repository Access Denied
- **Cause**: Organization owner has not whitelisted the OAuth application.
- **Resolution**: Provide guide for organization members to request admin grant.
