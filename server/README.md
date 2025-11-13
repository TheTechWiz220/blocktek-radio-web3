Local Express server for BlockTek Radio (MVP)

Quick start:
1. cd server
2. npm install
3. npm run dev

Server endpoints:
- POST /api/auth/register { email, password } -> creates user, sets httpOnly cookie session
- POST /api/auth/login { email, password } -> sets session cookie
- POST /api/auth/logout -> clears session
- GET /api/me -> returns { profile }
- PATCH /api/me { displayName, bio, avatarUrl } -> update profile (requires session)
- POST /api/wallet/nonce -> { nonce } (requires session)
- POST /api/wallet/link { signature, nonce } -> link wallet to authenticated user
- POST /api/upload/avatar (form-data: avatar) -> returns { url }

Notes:
- This is an MVP server intended for local development. On deployment you should:
  - Use HTTPS
  - Harden cookie settings (secure, sameSite as needed)
  - Replace disk uploads with cloud storage
  - Add rate limiting and input validation
