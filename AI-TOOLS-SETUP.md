# AI Tools Setup Guide

This guide covers every manual step required before the 3 AI tools go live.
Code is already written. You only need to do the steps below.

---

## Step 1 — Run the database migration

Open the Supabase Dashboard → SQL Editor → New query.
Paste the contents of `supabase/ai-tools-setup.sql` and click **Run**.

This creates the `ai_jobs` table with RLS enabled.

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
supabase secrets set IDPHOTO_API_KEY=...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

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
```

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

## Step 6 — Get an idphoto.ai API key

1. Go to **https://www.idphoto.ai** and sign up for an API account
2. Copy your API key from the dashboard
3. Run:
   ```
   supabase secrets set IDPHOTO_API_KEY=your-key-here
   ```

> **IMPORTANT**: Before deploying `ai-remove-bg` and `ai-id-photo`, check the current
> idphoto.ai API documentation at https://www.idphoto.ai/api-docs to verify:
> - The exact endpoint URL (the code uses `https://api.idphoto.ai/matting` for bg removal
>   and `https://api.idphoto.ai/idphoto` for ID photos — confirm these are current)
> - The correct request parameter names
> - The response format (base64 vs URL)
> - The authentication header format (`x-api-key` header is assumed — verify this)
>
> The Edge Function code is in `supabase/functions/ai-remove-bg/index.ts` and
> `supabase/functions/ai-id-photo/index.ts`. Update as needed after checking the docs.

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

### Test background removal (Phase 2 — requires idphoto.ai key)
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
- Confirm `OPENAI_API_KEY`, `IDPHOTO_API_KEY`, `STRIPE_SECRET_KEY` never appear
  in any network response
- Confirm full-quality files are not returned before payment

---

## Pricing summary

| Tool | Free | Paid |
|---|---|---|
| Transcription | First 60 seconds | $2.99 — full transcript + SRT |
| Background Remover | Low-res preview | $1.99 — HD transparent PNG |
| ID / Passport Photo | Low-res preview | $2.99 — HD photo + print sheet |

To change prices, edit `supabase/functions/ai-checkout/index.ts` → the `PRICES` object.
Amounts are in cents (USD).

---

## Architecture summary

```
Browser page
  └─ POST multipart/form-data ──→ Supabase Edge Function
                                      └─ OpenAI Whisper / idphoto.ai API
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
