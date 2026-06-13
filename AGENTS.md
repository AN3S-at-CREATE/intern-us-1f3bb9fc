# AGENTS.md

## Cursor Cloud specific instructions

Intern Us is a single-product app: a React 18 + Vite + TypeScript PWA (shadcn/ui + Tailwind, TanStack Query) backed by a **hosted/remote Supabase** project. There is no local backend to start — the committed `.env` already points at the hosted Supabase project (Auth, Postgres, Edge Functions), and that project is reachable from the cloud VM.

Standard commands live in `package.json` and `.github/workflows/ci.yml`; use those as the source of truth. Key points:

- **Package manager: npm** (CI uses `npm ci`, Node 22). A stray `bun.lockb` also exists — ignore it; do not use bun.
- **Dev server:** `npm run dev` serves on **port 8080** (not Vite's default 5173; set in `vite.config.ts`).
- **Tests:** there is **no `test` script** in `package.json` despite the README mentioning `npm test`. Run Vitest directly: `npx vitest run` (watch: `npx vitest`). Do **not** use `bun test` — it invokes Bun's runner, not Vitest.
- **Lint:** `npm run lint`. It currently reports ~38 warnings but **0 errors** (CI treats lint as non-blocking).
- **Build:** `npm run build` (the blocking CI job). `npm run build:dev` builds in development mode.

Backend / auth notes:
- The hosted Supabase project has **email confirmation disabled**, so signing up a new user immediately returns a session and lands on `/dashboard`. This makes the signup → dashboard flow a reliable smoke test.
- Roles are `student | employer | university | admin`; routes are gated by `ProtectedRoute` which requires both a session and a `profiles` row. New email signups default to the `student` role.
- AI features (career advisor, CV enhance, interview, match score, etc.) are powered by Supabase Edge Functions (Deno) calling the external Lovable AI Gateway, which needs `LOVABLE_API_KEY` set as a Supabase project secret. These are optional and not required for core auth/profile/browse flows.
