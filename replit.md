# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

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

## Project

**AgentBazaar** — An AI Agent marketplace where users can browse, buy, and review AI agents for various business needs.

### Pages
- `/` — Marketplace home with AI agent cards, search, and category filter
- `/login` — Login page (first screen)
- `/register` — Registration page
- `/agents/:id` — Agent detail page with features, pricing, reviews
- `/feedback` — Real-time customer feedback feed (auto-refreshes every 5s)
- `/pricing` — Pricing tiers (Starter/Pro/Enterprise)
- `/about` — About page with team section
- `/contact` — Contact form

### Artifacts
- `artifacts/web` — React + Vite frontend at `/`
- `artifacts/api-server` — Express backend API at `/api`

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── web/                # React + Vite frontend (AgentBazaar)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── agents.ts   # AI Agents table
│           ├── feedback.ts # Customer feedback/reviews table
│           ├── contacts.ts # Contact form submissions table
│           └── users.ts    # Users table (auth)
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Routes

All routes prefixed with `/api`:
- `GET /api/healthz` — Health check
- `GET /api/agents` — List agents (supports ?category=X&search=Y)
- `GET /api/agents/:id` — Get agent by ID
- `GET /api/feedback` — List feedback (supports ?agentId=X)
- `POST /api/feedback` — Submit feedback
- `POST /api/contact` — Submit contact form
- `POST /api/auth/login` — Login (returns JWT token)
- `POST /api/auth/register` — Register user
- `GET /api/auth/me` — Get current user (requires Bearer token)
- `POST /api/auth/logout` — Logout

## Database

Seeded with 8 AI agents across categories: Sales, Content, Support, Analytics, HR, Development, Finance, Marketing. Also 12 seed reviews across agents.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
