# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Mail app & Resend setup

This workspace includes a small demo mail UI (`src/App.jsx`) and a minimal backend proxy (`server.js`) that forwards email sends to the Resend API.

Quick start:

1. Copy `.env.example` to `.env` and set `RESEND_API_KEY`.
2. Start the frontend dev server:

```bash
npm install
npm run dev
```

3. In a separate terminal, start the FastAPI backend server:

```bash
npm run server
```

The frontend uses Vite proxy rules for `/mail` and `/send-email` so requests are forwarded to the backend on `http://localhost:8000`.

Frontend notes:
- The demo login uses credentials `admin` / `password123`.
- When you sign in from a new device the app will ask you to register the device (stored in `localStorage`).
- The compose UI lets you choose the sender address from four demo addresses: `founder@soulmatrix.in`, `hello@soulmatrix.in`, `support@soulmatrix.in`, `security@soulmatrix.in`.

Resend setup checklist:

- Create a Resend account at https://resend.com and obtain an API key.
- Add and verify the sending domain(s) you plan to use (the From addresses above): either verify each email or verify the domain so you can send from those addresses.
- In Resend dashboard, copy the API key and set it to `RESEND_API_KEY` in your `.env` (or export it into your shell environment).
- The backend (`server.js`) expects `RESEND_API_KEY` available in `process.env` and will call `POST https://api.resend.com/emails`.
- For production, secure the server and do not expose the API key to the browser. Consider rate-limiting and authentication on the backend.

If you'd like, I can:
- Add server-side authentication and persistent user/device storage.
- Implement email verification codes to enforce new-device sign-ins.

