# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running Tests

Tests are plain Node.js assert scripts — no test framework needed.

```bash
# Run a single test
node tests/auth-path.test.js

# Run all tests
for f in tests/*.test.js; do node "$f"; done
```

Each test file prints `<name> tests passed` on success, or throws an assertion error with a message explaining the invariant that failed.

## Architecture Overview

**Everything Convert** is a multilingual freemium file-conversion SaaS. The stack is intentionally simple: static HTML/CSS/vanilla JS frontend with no build step, Supabase for auth and database, Node.js serverless functions for backend APIs, and Stripe for payments.

### Frontend

**No build step.** HTML pages are served directly. Shared JS modules are referenced via `<script>` tags. Path depth matters — scripts use relative paths, and `tools-menu.js` auto-detects page depth to construct them correctly.

Key shared modules loaded by every page:
- `tools-menu.js` — injects the unified sticky header/mega-menu
- `auth.js` — manages Supabase auth session, exposes `isPro()` / `isAdmin()`
- `usage-limit.js` — enforces free tier (guest: 5, free account: 10 daily downloads) via localStorage + Supabase `usage_counters`. The limit is gated on the **download** action (convert/preview stays free): `gatedDownload({token,download})` counts the first download of a result and frees re-downloads; `showDownloadCard()` renders the shared completion card. AI/credit tools are exempt (no `usage-limit` meta change on those)
- `language-menu.js` / `header-language.js` / `tool-language.js` / `developer-language.js` — i18n translation objects for 5 languages (en, ko, de, es, fr); switching persists to localStorage
- `tool-page-redesign.js` — metadata-driven UI generator that builds the upload zone, progress indicator, and related-tools section for each converter page

**Tool pages** live in directories named after the conversion (e.g., `pdf to word/`, `image converter/`). Each contains an `index.html` that references the shared modules and any tool-specific JS.

### Backend (functions/api/)

Serverless functions deployed to a Cloudflare-compatible runtime (they use the Web `Request`/`Response` API, not Node.js `http`). Each file exports a default handler.

| File | Purpose |
|---|---|
| `usage-limit.js` | Check/increment free-tier usage counters; enforces guest (5) and free-account (10) daily limits |
| `conversion-history.js` | GET/POST conversion records; requires auth; pro/admin only |
| `create-checkout-session.js` | Create Stripe checkout for pro subscription |
| `confirm-checkout-session.js` | Verify Stripe payment and upgrade user plan to `pro` |
| `stripe-webhook.js` | Handle Stripe webhook events |
| `contact.js` | Contact form submissions |
| `env-check.js` | Validate required environment variables are set |

### Database (Supabase PostgreSQL)

Schema is in `supabase-setup.sql`. Key tables:
- `profiles` — user metadata: `plan` (`free`/`pro`), `role` (`user`/`admin`)
- `usage_counters` — IP-based conversion counts for guest/free users
- `conversion_history` — per-conversion records (pro users only)

RLS policies are enforced on all tables. PL/pgSQL helpers: `is_pro(user_id)`, `is_admin(user_id)`, `record_usage_conversion(identity, limit)`.

### Auth & Usage Flow

1. `supabase-config.js` exports the Supabase client (URL + anon key).
2. `auth.js` wraps the client with session caching (`everything_convert_auth_snapshot`) and exposes reactive state.
3. `usage-limit.js` (frontend) reads the auth state to determine which limit applies, then calls `/api/usage-limit` to record conversions in Supabase.
4. Auth identity cache key: `everything_convert_auth_identity_snapshot`. It caches confirmed `pro`/`admin` status but never caches `free` as a quick-show label (see `auth-path.test.js` for the invariant).

### i18n

Language strings are defined in the four language JS files as plain objects keyed by language code. `language-menu.js` is the largest and covers the full site; the others cover specific page sections. Language switching fires a `languagechange` custom event — the header re-renders on every such event.

### Python Utilities

Maintenance scripts for bulk HTML updates — not part of the runtime:
- `fix_inline_css.py` — strips inline styles from tool pages
- `update_menus.py` — regenerates the injected header markup
- `update_nav.py` — updates navigation links across pages

```bash
python fix_inline_css.py
python update_menus.py
python update_nav.py
```

## Environment Variables

Required for backend functions:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (backend only) |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe price for Pro monthly ($6.99/mo) |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Stripe price for Pro yearly ($49/yr) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `USAGE_IDENTITY_SALT` | Salt for hashing user IPs |

`supabase-config.js` (gitignored) holds `SUPABASE_URL` and `SUPABASE_ANON_KEY` for the frontend.
