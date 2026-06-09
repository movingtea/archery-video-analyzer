# Archery Lab — Motion Analysis Workbench

Phase 1 MVP for competitive recurve bow video analysis: upload videos, manage a library, play back frame-by-frame, create shots, and manually mark archery phase keyframes.

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui-style components
- NextAuth (credentials)

## Quick Start

### Option A — Docker PostgreSQL (recommended for local dev)

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Option B — Embedded PostgreSQL (no Docker)

```bash
npm install
npm run db:setup   # first-time init + schema + seed
npm run db:start   # keep DB running in a separate terminal
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@archer.app` / `demo1234`

## Project Structure

```
src/
├── app/
│   ├── (app)/                    # Authenticated shell
│   │   ├── dashboard/
│   │   ├── videos/
│   │   │   └── [videoId]/analysis/
│   │   └── shots/[shotId]/
│   ├── api/                      # REST handlers
│   ├── login/
│   └── layout.tsx
├── components/
│   ├── analysis/                 # Workbench UI
│   ├── dashboard/
│   ├── layout/                   # AppShell, Sidebar, Topbar
│   ├── ui/                       # shadcn-style primitives
│   └── videos/
├── lib/
│   ├── actions/                  # Server Actions
│   ├── auth.ts
│   └── prisma.ts
└── types/
prisma/
├── schema.prisma
└── seed.ts
public/uploads/                   # Local video storage (MVP)
```

## Core Pages

| Path | Description |
|------|-------------|
| `/dashboard` | Stats, recent videos, recent analysis |
| `/videos` | Video library |
| `/videos/[id]/analysis` | Analysis workbench |
| `/shots/[id]` | Shot phase marker detail |

## API Routes

- `GET/POST /api/videos`
- `GET/PATCH /api/videos/[id]`
- `GET/POST /api/videos/[id]/shots`
- `GET/PATCH/DELETE /api/shots/[id]`
- `POST/DELETE /api/shots/[id]/markers`
- `POST /api/upload`

Server Actions mirror the same operations in `src/lib/actions/`.

## Phase 1 Scope

Implemented:

- Auth + dashboard
- Video upload (local `public/uploads`)
- Video library
- Frame-accurate player with FPS control
- Shot creation
- Manual phase markers (Setup → Follow-through)
- Timeline + shot detail

Not in scope (Phase 2+):

- MediaPipe / pose overlay
- AI auto-detection

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
