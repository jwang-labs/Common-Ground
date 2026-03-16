# CommunityShield

## Overview

Police accountability and transparency platform that bridges trust between law enforcement and communities. Citizens can report verified interactions, recognize good officers, view anonymized precinct-level data on a map, and access their legal rights — all with privacy-first design.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui
- **Map**: Leaflet + react-leaflet (OpenStreetMap tiles)
- **Icons**: lucide-react
- **Routing**: wouter
- **Animations**: framer-motion

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── community-shield/   # React + Vite frontend (community-facing app)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Key Features

### Community-Facing App (artifacts/community-shield)
- **Home**: Hero section with dual action cards (Report Incident / Recognize Officer)
- **Map View** (/map): Interactive Leaflet map showing aggregate anonymized data by precinct
- **Report Form** (/report): Step-by-step wizard (type → details → binary questions → review)
- **Recognize Form** (/recognize): Positive officer recognition with categories
- **Know Your Rights** (/rights): Accordion cards with legal rights organized by situation

### Privacy Design
- No officer identifying information displayed to citizens
- Badge numbers stored privately but never shown in public views
- Binary yes/no questions reduce subjective bias
- All precinct data is aggregated and anonymized

### Database Schema (lib/db/src/schema/)
- `reports` — incident reports with verification fields, binary questions, location
- `recognitions` — positive officer recognitions with categories

### API Routes (artifacts/api-server/src/routes/)
- `reports.ts` — CRUD for incident reports
- `recognitions.ts` — CRUD for officer recognitions (badge number excluded from public responses)
- `aggregate.ts` — anonymized precinct stats, time trends, and know-your-rights content
- `health.ts` — health check endpoint

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)
Express 5 API server. Routes in `src/routes/` use `@workspace/api-zod` for validation and `@workspace/db` for persistence.

### `artifacts/community-shield` (`@workspace/community-shield`)
React + Vite frontend with Tailwind CSS v4, shadcn/ui components, Leaflet map, wouter routing.

### `lib/db` (`@workspace/db`)
Drizzle ORM with PostgreSQL. Schema files: `reports.ts`, `recognitions.ts`.

### `lib/api-spec` (`@workspace/api-spec`)
OpenAPI 3.1 spec and Orval codegen config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)
Generated Zod schemas from OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)
Generated React Query hooks from OpenAPI spec.

## Database

Production migrations handled by Replit when publishing. Development: `pnpm --filter @workspace/db run push`.
