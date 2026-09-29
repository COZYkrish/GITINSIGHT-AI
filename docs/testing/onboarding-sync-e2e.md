# End-to-End Onboarding & Sync Flow Test Plan

1. **User Landing**: Visit `/`. Click "Sign in with GitHub".
2. **OAuth Consent**: Confirm required scopes on GitHub authorization page.
3. **Redirection**: Redirect back to `/onboarding/sync`.
4. **Sync Trigger**: Progress bar indicates GraphQL query streaming.
5. **Dashboard Transition**: Once complete, user automatically transitions to `/dashboard`.
