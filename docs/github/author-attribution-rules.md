# GitHub Commit Author Attribution & Email Matching Logic

## Matching Logic
Commits authored under different git configuration emails must be correctly mapped to the authenticated user account:
1. **Verified Primary Email**: Matches GitHub OAuth primary email.
2. **Secondary Verified Emails**: Queries `/user/emails` endpoint during OAuth flow.
