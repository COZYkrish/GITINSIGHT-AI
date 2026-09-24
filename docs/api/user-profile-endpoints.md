# API Reference: User Profile Endpoints (`user.routes.ts`)

## `GET /api/user/profile`
Fetches current user's profile, linked GitHub identity, sync timestamp, and feature permissions.

## `PATCH /api/user/profile`
Updates optional developer preferences (vanity URL slug, bio override, public visibility toggle).

## `DELETE /api/user/account`
Initiates account deletion and cascaded cleanup of repositories and generated AI reports.
