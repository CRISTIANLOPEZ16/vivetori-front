# Vivetori Ticket Support Frontend

Vivetori is a lightweight ticket support UI that lets users submit and track issues. It offers a public board for unauthenticated visitors and a private dashboard for signed-in users, with realtime updates powered by Supabase.

## What this app does

- Auth: email/password sign in and sign up via Supabase Auth.
- Public board: create and view tickets visible to everyone.
- Private tickets: signed-in users create and view their own tickets.
- Realtime updates: ticket lists update instantly from Postgres changes.
- Ticket metadata: status, category, sentiment, and created timestamps.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (Auth, Postgres, Realtime)

## Getting started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

3) Run the app

```bash
npm run dev
```

## Notes

- Tickets are stored in the `tickets` table in Supabase.
- The UI mentions an optional n8n + FastAPI pipeline that can process and enrich tickets (category, sentiment, processed).
