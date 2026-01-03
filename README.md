# Statement Reader MVP

Scaffolded Next.js (App Router) + TypeScript MVP with stubbed services for statement extraction, categorization, and sheet writing.

## What’s included

- Pages: `/login`, `/household`, `/sheet`, `/upload`, `/imports/[id]`, `/review`
- Prisma + SQLite schema for users, households, sheet connections, imports, transactions, and merchant rules
- Stub services:
  - `ExtractorService` returns deterministic mock ParsedStatement data
  - `CategorizerService` assigns mock categories
  - `SheetsWriterService` simulates sheet appends in the DB
- JSON Schema validation for ParsedStatement outputs

## Running locally

```bash
npm install
```

Create a local SQLite database and Prisma client:

```bash
cp .env.example .env
npx prisma generate
npx prisma db push
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and walk through the flow:
1. Login with the fake login.
2. Create a household.
3. Add a sheet connection.
4. Upload a statement to generate a mock import.
5. Review the import and review queue.

## Notes

- No real OpenAI, Google OAuth, Sheets, GCS, or Cloud Run integrations are implemented yet.
- Uploaded files are not stored; only metadata is saved.
