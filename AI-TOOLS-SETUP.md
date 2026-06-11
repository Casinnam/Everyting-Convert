# AI Tools Setup Guide

This guide covers every manual step required before the 3 AI tools go live.
Code is already written. You only need to do the steps below.

---

## Step 1 — Run the database migration

Open the Supabase Dashboard → SQL Editor → New query.
Paste the contents of `supabase/ai-tools-setup.sql` and click **Run**.

This creates the `ai_jobs` table with RLS enabled.

Then run `supabase/ai-usage-setup.sql` the same way.
This creates the `ai_usage_counters` table and the `record_ai_usage` RPC
that enforce the daily free limits for PDF Summary (guest 3/day,
free account 10/day, Pro unlimited). **PDF Summary returns 503 until
this SQL has been run** — the function fails closed to protect the
OpenAI budget.

---

## Step 2 — Create Storage buckets

In the Supabase Dashboard → Storage → **New bucket**:

### Bucket: `ai-uploads`
- Name: `ai-uploads`
- Public: **OFF**
- File size limit: **50 MB**

Click Create, then add these **policies** (Storage → ai-uploads → Policies):

**Policy 1 — Allow anyone to upload:**
```sql
CREATE POLICY "Anyone can upload to ai-uploads"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'ai-uploads');
```

**Policy 2 — Service role only can read:**
```sql
CREATE POLICY "Service role reads ai-uploads"
ON storage.objects FOR SELECT
TO service_role
USING (bucket_id = 'ai-uploads');
```

### Bucket: `ai-results`
- Name: `ai-results`
- Public: **OFF**
- File size limit: **100 MB**

Add this policy:

**Policy — Service role only:**
```sql
CREATE POLICY "Service role only for ai-results"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'ai-results')
WITH CHECK (bucket_id = 'ai-results');
```

---

## Step 3 — Set Edge Function secrets

Install the Supabase CLI if you haven't:
```
npm install -g supabase
```

Log in and link the project:
```
supabase login
supabase link --project-ref tuwhuftbjqkgduukvbfv
```

Set secrets (replace the `...` values with your actual keys):

```
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set REMOVEBG_API_KEY=...
supabase secrets set IDPHOTO_API_KEY=...
supabase secrets set IDPHOTO_API_SECRET=...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set USAGE_IDENTITY_SALT=any-long-random-string
```

> **USAGE_IDENTITY_SALT** is used to hash guest IP addresses for the PDF
> Summary daily limit. Use the same value as the one configured for the
> Cloudflare `functions/api/usage-limit.js` if you want consistent hashing,
> or any long random string otherwise.

> **STRIPE_WEBHOOK_SECRET** is created in Step 5 below. Set it after you complete that step.

---

## Step 4 — Deploy Edge Functions

From the project root (where `supabase/` folder is):

```
supabase functions deploy ai-transcribe
supabase functions deploy ai-remove-bg
supabase functions deploy ai-id-photo
supabase functions deploy ai-checkout
supabase functions deploy ai-webhook
supabase functions deploy ai-pdf-summary --no-verify-jwt
```

> `--no-verify-jwt` is required for `ai-pdf-summary` because guests call it
> with the publishable key (not a JWT). The function does its own auth:
> it resolves the user from the Authorization header when present and
> enforces the daily usage limit server-side either way.

Each function will get a URL like:
`https://tuwhuftbjqkgduukvbfv.functions.supabase.co/<function-name>`

Verify deployment in the Supabase Dashboard → Edge Functions.

---

## Step 5 — Configure the Stripe webhook

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. Endpoint URL:
   ```
   https://tuwhuftbjqkgduukvbfv.functions.supabase.co/ai-webhook
   ```
3. Select event: **`checkout.session.completed`**
4. Click **Add endpoint**
5. Copy the **Signing secret** (starts with `whsec_`)
6. Run:
   ```
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## Step 6 — Get the background removal and ID photo API keys

`ai-remove-bg` uses the **remove.bg** API, and `ai-id-photo` uses the **idphoto.ai** API.
They are separate services with separate keys.

**remove.bg (background removal):**

1. Go to **https://www.remove.bg/api** and create an account
2. Copy your API key (the free tier includes 50 full-resolution calls per month)
3. Run:
   ```
   supabase secrets set REMOVEBG_API_KEY=your-key-here
   ```

**idphoto.ai (ID / passport photos):**

1. Go to **https://www.idphoto.ai** and sign up for an API account
2. Copy your API key and secret from the dashboard
3. Run:
   ```
   supabase secrets set IDPHOTO_API_KEY=your-key-here
   supabase secrets set IDPHOTO_API_SECRET=your-secret-here
   ```

> **IMPORTANT**: `ai-remove-bg` calls `https://api.remove.bg/v1.0/removebg` with the
> `X-Api-Key` header and needs only `REMOVEBG_API_KEY`. Before deploying `ai-id-photo`,
> check the current idphoto.ai documentation at https://www.idphoto.ai/api-docs to
> verify the endpoint URL, request parameter names, response format (base64 vs URL),
> and auth headers. The Edge Function code is in `supabase/functions/ai-remove-bg/index.ts`
> and `supabase/functions/ai-id-photo/index.ts`.

---

## Step 7 — Verify idphoto.ai preset IDs

In `supabase/functions/ai-id-photo/index.ts`, the `PHOTO_SPECS` object maps spec keys
to idphoto.ai preset IDs:

```typescript
const PHOTO_SPECS = {
  'kr-35x45': { label: '한국 증명사진 3.5×4.5cm', preset: 'kr_id' },
  'passport':  { label: '국제 여권 35×45mm',       preset: 'intl_passport' },
  'us-visa':   { label: '미국 비자 51×51mm',        preset: 'us_visa' },
  'cn-visa':   { label: '중국 비자 33×48mm',        preset: 'cn_visa' },
};
```

Check idphoto.ai docs for the actual preset ID strings and update this object.

---

## Step 8 — Set up a cleanup cron job (optional but recommended)

To automatically delete expired jobs and their storage files after 24 hours,
add a scheduled function or use pg_cron in Supabase:

In SQL Editor:
```sql
-- Enable pg_cron (run once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Delete expired jobs daily at 3 AM UTC
SELECT cron.schedule(
  'delete-expired-ai-jobs',
  '0 3 * * *',
  $$DELETE FROM public.ai_jobs WHERE expires_at < now()$$
);
```

Storage cleanup (files in `ai-results` and `ai-uploads`) must be handled separately.
You can add a Supabase Edge Function on a schedule via the Supabase Dashboard →
Edge Functions → Schedule, or use the Supabase Management API.

---

## Step 9 — Test the full flow

### Test transcription (Phase 1)
1. Go to `/ai tools/transcription/index.html`
2. Upload a short MP3 (< 60 s) → should get a free transcript + SRT download
3. Upload a longer MP3 (> 60 s) → should see preview text + pay button
4. Click pay → Stripe checkout → complete → redirected back → downloads appear

### Test background removal (Phase 2 — requires remove.bg key)
1. Go to `/ai tools/background-remover/index.html`
2. Upload a JPEG photo → should see low-res preview
3. Click pay → Stripe checkout → complete → HD PNG download appears

### Test ID photo (Phase 3 — requires idphoto.ai key)
1. Go to `/ai tools/id-photo/index.html`
2. Select a spec and background color
3. Upload a portrait photo → should see preview
4. Click pay → Stripe checkout → complete → photo + sheet downloads appear

### Security checks
- Open browser DevTools → Network tab
- Confirm `OPENAI_API_KEY`, `REMOVEBG_API_KEY`, `IDPHOTO_API_KEY`, `STRIPE_SECRET_KEY` never appear
  in any network response
- Confirm full-quality files are not returned before payment

---

## Pricing summary

| Tool | Free | Paid |
|---|---|---|
| Transcription | First 60 seconds | $2.99 — full transcript + SRT |
| Background Remover | Low-res preview | $1.99 — HD transparent PNG |
| ID / Passport Photo | Low-res preview | $2.99 — HD photo + print sheet |
| PDF Summary | Guest 3/day, account 10/day | Pro subscription — unlimited |

To change per-job prices, edit `supabase/functions/ai-checkout/index.ts` → the `PRICES` object.
Amounts are in cents (USD).

To change the PDF Summary daily limits, edit the `LIMITS` constant in
`supabase/functions/ai-pdf-summary/index.ts` and the matching copy in
`ai tools/pdf-summary/index.html` (`limitText`) and `pricing.html`.

---

## Architecture summary

```
Browser page
  └─ POST multipart/form-data ──→ Supabase Edge Function
                                      └─ OpenAI Whisper / remove.bg / idphoto.ai API
                                      └─ Stores results in Supabase Storage (private)
                                      └─ Creates ai_jobs row in DB
  ←── Returns: job_id + preview data

Browser: shows preview

  └─ POST /ai-checkout ──→ Creates Stripe Checkout session (job_id in metadata)
  ←── Returns: checkout_url → redirect

Stripe → POST /ai-webhook ──→ Marks ai_jobs.status = 'paid'

Browser (after Stripe redirect): ?paid=1&job_id=...&session_id=...
  └─ POST Edge Function (mode=full) ──→ Verifies payment (DB or Stripe API)
  ←── Returns: signed download URLs (valid 1 hour)
```

All API keys live only in Supabase Edge Function secrets. Nothing sensitive is
ever sent to the browser.
