# FortuneNews

Next.js application that surfaces the latest FortuneNews stories.

## Setup

1. Install dependencies with `npm install`.
2. Create a `.env.local` and set `NEXT_PUBLIC_API_URL` to point at the FortuneNews API (defaults to `http://localhost:3000/api/v1`).

## Development Scripts

- `npm run dev` – start the frontend at `http://localhost:3000`.
- `npm run build` – generate a production build.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint against the project.

## Running with the Admin API

1. In `fortunenews_admin/` export `CORS_ALLOWED_ORIGINS=http://localhost:3002`
   (or your preferred frontend origin) and run `npm run dev` to start the API.
2. In this project set `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1` in
   `.env.local` (or point it at your deployed API).
3. Run the frontend dev server on a different port to avoid conflicts, e.g.
   `npm run dev -- -p 3002`.

## Admin Console

The editorial console now lives in the standalone Next.js project located in `fortunenews_admin/`. Install dependencies inside that folder and run `npm run dev` to start the admin interface.
