# Oasis CI Server Build Guide

This guide explains how the Oasis CI server should be built, checked, configured, and run. It is written for the next person who has to pick this backend up and make it production-ready without guessing what the moving parts are.

## What The Server Is

The server lives in `oasis-ci-server`.

It is an Express API written in TypeScript. It currently runs through `tsx`, which means the TypeScript files are executed directly instead of being compiled into a `dist` folder first.

That is fine for local development and demos, but for a cleaner production setup the server should eventually have a real build step:

```bash
tsc
```

That build should emit JavaScript into `dist`, and production should run the compiled entry file instead of `src/server.ts`.

## Current Commands

From inside `oasis-ci-server`:

```bash
npm install
npm run dev
npm run check
npm run build
npm start
```

What each command does:

- `npm run dev` starts the API in watch mode using `tsx watch src/server.ts`.
- `npm run check` runs TypeScript validation with `tsc --noEmit`.
- `npm run build` compiles TypeScript into `dist` and copies `schema.sql` beside the compiled database module.
- `npm start` starts the compiled API with `node dist/server.js`.
- `npm run start:tsx` starts the source API directly with `tsx src/server.ts` when you specifically need the old runtime TypeScript path.

## Environment Variables

Create a `.env` file inside `oasis-ci-server`.

Use this shape:

```bash
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
SESSION_SECRET=replace-this-with-a-long-random-secret

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=oasis_ci
MYSQL_PASSWORD=replace-this-password
MYSQL_DATABASE=oasis_ci
```

Important notes:

- `PORT` is where the API listens. The frontend example expects `http://localhost:4000`.
- `CLIENT_ORIGIN` must match the frontend URL so CORS and cookies work.
- `SESSION_SECRET` must be changed before production.
- MySQL settings are required. The server owns platform state and will not start without database configuration.

The frontend should point at the API using `oasis-ci-app/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Database Setup

The current active database model is normalized MySQL tables. The server stores users, domains, exposures, submissions, flags, claims, audit events, and sessions separately.

Create the database first:

```sql
CREATE DATABASE oasis_ci;
```

Then run the schema in:

```text
oasis-ci-server/src/database/schema.sql
```

The schema is also explained in:

```text
oasis-ci-server/docs/DATABASE_SCHEMA.md
```

## Local Development Flow

Start MySQL.

Then start the API:

```bash
cd oasis-ci-server
npm install
npm run dev
```

In another terminal, start the frontend:

```bash
cd oasis-ci-app
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

The frontend will call the API at:

```text
http://localhost:4000
```

## Checking The Server Before Shipping

Run:

```bash
npm run check
```

This catches TypeScript mistakes. `npm run build` produces deployable JavaScript.

Before a real release, also manually test:

- `GET /api/health`
- sign in and session creation
- exposure creation
- researcher submission creation
- moderator review
- owner remediation updates
- domain removal after all problems are verified fixed

## Production Build

The server now builds to compiled JavaScript.

Current `package.json` scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "start": "node dist/server.js",
    "start:tsx": "tsx src/server.ts",
    "build": "tsc && node -e \"copy schema.sql into dist\"",
    "check": "tsc --noEmit"
  }
}
```

The important `tsconfig.json` output settings are:

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

The production flow is:

```bash
npm ci
npm run check
npm run build
npm start
```

That is the clean path: install exact dependencies, type-check, compile, copy the SQL schema into `dist`, then run compiled JavaScript.

## Deployment Direction

For a normal server deployment:

1. Provision a Node.js runtime.
2. Provision MySQL.
3. Create the `oasis_ci` database.
4. Run `src/database/schema.sql`.
5. Set all environment variables.
6. Install dependencies with `npm ci`.
7. Run `npm run check`.
8. Run `npm run build`.
9. Start the server.
10. Put it behind HTTPS.

For production, use a process manager or platform service that restarts the API after crashes and deploys. Examples: Docker, PM2, Render, Railway, Fly.io, Azure App Service, or a systemd service on a VM.

## Security Direction

Before production:

- Replace the default development `SESSION_SECRET`.
- Use HTTPS only.
- Restrict CORS to the real frontend domain.
- Store passwords as hashes, never plain text.
- Store claim tokens as hashes.
- Keep full URLs, exact paths, private evidence, and internal notes behind role checks.
- Do not expose raw evidence in public API responses.
- Keep MySQL credentials outside source control.

## What "Done" Should Mean

The server build is in good shape when:

- `npm run check` passes.
- `npm run build` exists and emits `dist`.
- `npm start` runs compiled JavaScript from `dist`.
- The API can start from a clean checkout using only `.env`, MySQL, and `npm ci`.
- The frontend can use `VITE_API_BASE_URL` to talk to it.
- The core role workflows work end to end.

The goal is simple: a developer should be able to clone the repo, configure the environment, run one schema file, start the server, and understand exactly what is happening.
