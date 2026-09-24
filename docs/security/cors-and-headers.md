# CORS Policy & Security Headers

## Allowed Origins
- Development: `http://localhost:5173`, `http://localhost:3000`
- Production: Strict domain specified in `CLIENT_URL` environment variable.

## Allowed HTTP Methods
`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

## Credentials
`credentials: true` enables secure HTTP-only cookie exchange for authentication tokens.
