# AI-Powered Agriculture Crop Advisory Assistant (KrishiMitra)

An end-to-end production SaaS web application for smallholder and mid-size farmers in India. Built with React (Vite, Tailwind CSS, TanStack Query), Express (Node.js 20+), Supabase (PostgreSQL, Supabase Auth, Storage), and Google Gemini (`@google/genai` SDK).

---

## 🌾 Architecture Diagram

```mermaid
graph TD
    Client["React Frontend (Vite + Tailwind)<br/>Port: 5173"] -->|REST API with JWT| Server["Node.js / Express Server<br/>Port: 8080"]
    Server -->|RLS User Client| SupabaseDB[("Supabase PostgreSQL DB")]
    Server -->|Storage API| SupabaseStorage[("Supabase Storage<br/>(crop-images bucket)")]
    Server -->|@google/genai SDK| GeminiAPI["Google Gemini API<br/>(gemini-2.5-flash)"]
```

---

## 🚀 Quick Start & Local Development

### Prerequisites

- **Node.js**: v20+ LTS
- **npm**: v10+

### Installation & Execution

1. **Install Root and Workspace Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables**:
   - Copy `server/.env.example` to `server/.env` and update values.
   - Copy `client/.env.example` to `client/.env` and update values.

3. **Run Dev Servers Concurrently**:
   ```bash
   npm run dev
   ```
   - Client will start on `http://localhost:5173`
   - Express server will start on `http://localhost:8080`

4. **Run Tests & Secret Audits**:
   ```bash
   npm run test
   npm run check:secrets
   npm run build
   ```

---

## 🗄️ Supabase Configuration Steps

Since Supabase setup cannot be fully automated from CLI without credentials, follow these manual steps:

1. Create a new project on [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** and run the following migration scripts in order:
   - `supabase/migrations/0001_init.sql` (Creates tables, triggers, indices, storage bucket)
   - `supabase/migrations/0002_rls.sql` (Enables Row-Level Security policies on all tables & buckets)
3. Under **Authentication > URL Configuration**:
   - Set **Site URL** to `http://localhost:5173`
   - Add `http://localhost:5173/reset-password` to **Redirect URLs**
4. Copy your project credentials into `server/.env` and `client/.env`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)

---

## 🔑 Environment Variables Reference

### Server (`server/.env`)
- `NODE_ENV`: `development` | `production` | `test`
- `PORT`: Express server port (default `8080`)
- `CORS_ORIGINS`: Allowed client origin(s) comma separated
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (used ONLY for deleting auth user on `DELETE /api/profile`)
- `GEMINI_API_KEY`: Server-side Google Gemini API key
- `GEMINI_MODEL`: Gemini model identifier (default `gemini-2.5-flash`)
- `AI_ADVISORY_TIMEOUT_MS`: Advisory generation timeout in ms (45000)
- `AI_CHAT_TIMEOUT_MS`: Chat response timeout in ms (30000)

### Client (`client/.env`)
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key
- `VITE_API_BASE_URL`: API base path (e.g. `http://localhost:8080/api`)

---

## 📡 Backend API Reference

Base path `/api`. All protected endpoints require `Authorization: Bearer <supabase_access_token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Health check & uptime |
| `GET` | `/api/meta/options` | No | Domain enumerations for forms |
| `GET` | `/api/profile` | Yes | Get own profile |
| `PUT` | `/api/profile` | Yes | Update profile fields |
| `DELETE` | `/api/profile` | Yes | Delete account and all associated data |
| `GET` | `/api/farms` | Yes | List own farms |
| `POST` | `/api/farms` | Yes | Register a new farm |
| `GET` | `/api/farms/:id` | Yes | Get farm details |
| `PUT` | `/api/farms/:id` | Yes | Update farm details |
| `DELETE` | `/api/farms/:id` | Yes | Delete a farm |
| `POST` | `/api/advisories` | Yes | Generate structured AI advisory (`multipart/form-data`) |
| `GET` | `/api/advisories` | Yes | List advisories with pagination and search |
| `GET` | `/api/advisories/:id` | Yes | Get single advisory (includes signed image URL) |
| `DELETE` | `/api/advisories/:id` | Yes | Delete advisory and image from storage |
| `GET` | `/api/advisories/:id/messages` | Yes | Get follow-up Q&A chat history |
| `POST` | `/api/advisories/:id/chat` | Yes | Send follow-up question to KrishiMitra |
| `PUT` | `/api/advisories/:id/feedback` | Yes | Submit thumbs up/down rating and comment |
| `GET` | `/api/dashboard/summary` | Yes | Dashboard stats & 5 recent advisories |

---

## 🔒 Security & Agronomic Safety Design

1. **Zero Secret Leakage**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively in server env. Verified automatically via `npm run check:secrets`.
2. **Database Isolation (RLS)**: Every query is executed through a per-request Supabase client instantiated with the user's JWT. User A cannot view, alter, or delete User B's records.
3. **Prompt Injection Defense**: User text is sanitized (control characters stripped, whitespace collapsed) and enclosed in `<user_input>...</user_input>` blocks.
4. **IPM & Chemical Safety Post-Processing**:
   - Chemical recommendations use active ingredient classes only.
   - Exact per-litre / per-acre dosage figures are automatically stripped and replaced with label-compliance notes.
   - Low-confidence or high-risk diagnoses force `escalate_to_expert.needed = true` displaying a banner directing the farmer to their local KVK.
5. **Image Verification**: Strict magic-byte checks for JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), and WebP (`RIFF....WEBP`) capped at 4MB.

---

## 📌 Engineering Assumptions

1. **Default Gemini Model**: Standardized on `gemini-2.5-flash` configured via environment variable `GEMINI_MODEL`.
2. **Account Deletion**: Handled by deleting the user's storage folder, deleting the profile row (cascading farms, advisories, messages, feedback via foreign keys), and then deleting the auth user via the admin client.
3. **Local Storage**: Used strictly for persisting the client UI language selection (`krishi_lang`).

---

## 🌐 Production Deployment Guide

### Express Server (Render / Railway)
- **Environment**: Node.js 20+
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add all variables from `server/.env.example`.

### React Client (Vercel / Netlify)
- **Framework**: Vite / React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`.
