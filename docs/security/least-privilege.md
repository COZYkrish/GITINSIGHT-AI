# GitHub OAuth Least Privilege Scopes

GitInsight AI requests the minimum necessary permissions:
- `read:user`: Read user profile bio, avatar, and handle.
- `user:email`: Read primary verified email for notification routing.
- `repo`: Read access to public and private repository statistics.
- **Write permissions are never requested**; GitInsight AI is strictly read-only.
