# YouTube Video Summary Tool

Paste a YouTube link → get an AI summary (quick recap, detailed summary, key
points, timeline, keywords, blog title, Shorts ideas, social post).

Built to match the existing EverythingConvert stack — **no build step**, static
HTML + a Supabase Edge Function. It reuses the same auth, daily-limit, and AI
credit plumbing as the other AI tools (`ai tools/pdf-summary`, etc.).

## Files

| File | Role |
|---|---|
| `ai tools/youtube-summary/index.html` | The tool page (UI, URL validation, calls the edge function, renders cards, TXT/MD/copy export). |
| `supabase/functions/ai-youtube-summary/index.ts` | Backend: parse URL → fetch video info + transcript → OpenAI summary. Enforces daily limits + credits server-side. |

## How it works

1. The page validates the YouTube URL client-side (`parseVideoId`) and POSTs
   `{ url, language, use_credit, credit_ref }` to the edge function.
2. The function:
   - resolves the caller (guest vs free vs pro/admin) and applies the daily
     limit via the shared `record_ai_usage` RPC (guest 3/day, free 10/day, pro
     unlimited). Over-limit logged-in users may spend 1 credit.
   - gets **video info** from YouTube **oEmbed** (no API key needed).
   - gets the **transcript** via the transcript adapter (see below).
   - sends the transcript to OpenAI and returns the structured summary.
3. The page renders result cards and enables Copy / TXT / Markdown export.

### Response shape

```json
{
  "videoInfo": { "title": "", "thumbnail": "", "channel": "", "duration": "", "url": "" },
  "summary": {
    "quickSummary": [], "detailedSummary": "", "keyPoints": [],
    "timestampSummary": [{ "time": "mm:ss", "point": "" }],
    "keywords": [], "blogTitle": "", "shortsIdeas": [], "socialPost": ""
  },
  "transcriptAvailable": true,
  "usage": { "remaining": 9, "limit": 10 },
  "credit": null
}
```

If no captions are found, `transcriptAvailable` is `false` and `message`
explains that audio transcription is coming.

## ⚠️ The transcript adapter (read this before going live)

The single riskiest part is transcript extraction. YouTube has **no public
captions API** for arbitrary videos, and the unofficial caption endpoints are
frequently **rate-limited or blocked for datacenter IPs** (which is what a
Supabase Edge Function is). The built-in scraper (`fetchTranscriptFromYouTube`)
works, but expect it to be unreliable under real traffic.

The logic is deliberately isolated in `fetchTranscript()`, which tries
providers in order and falls back automatically:

1. **Supadata** (recommended) — set `SUPADATA_API_KEY` and it just works.
   `fetchTranscriptFromSupadata()` calls `GET /v1/transcript?url=…`, handles the
   `202 { jobId }` async flow for long videos (polls `/v1/transcript/{jobId}`),
   and maps `content[{text, offset, duration}]` (offset/duration are **ms**).
2. **Any other paid API** — set `TRANSCRIPT_API_URL` (+ optional
   `TRANSCRIPT_API_KEY`). `fetchTranscriptFromProvider()` maps common shapes
   (a `text` string or an array of `{start, dur, text}` segments); tweak the
   mapping to match your service.
3. **Built-in YouTube scraper** — last resort, often blocked from datacenter IPs.

To add **Whisper / audio transcription** later, add another branch inside
`fetchTranscript()` that downloads the audio and calls your speech-to-text
service, then returns the same `{ segments, lengthSeconds }` shape. Nothing
else in the function needs to change.

## Environment variables (Supabase Edge Function secrets)

Required (already set for the other AI tools):

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | Summarization |
| `USAGE_IDENTITY_SALT` | Hash guest IPs for the daily counter (same salt as `functions/api/usage-limit.js`) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Auto-set by Supabase |

Optional:

| Variable | Purpose |
|---|---|
| `OPENAI_SUMMARY_MODEL` | Override the model (default `gpt-4o-mini`) |
| `SUPADATA_API_KEY` | **Recommended.** Enables the Supadata transcript provider. |
| `SUPADATA_API_URL` | Override Supadata endpoint (default `https://api.supadata.ai/v1/transcript`) |
| `TRANSCRIPT_API_URL` | A different paid transcript provider endpoint (generic adapter) |
| `TRANSCRIPT_API_KEY` | Bearer token for that generic provider |

See `.env.example` in this folder for a copy-paste template.

## Deploy

```bash
# from the repo root
supabase functions deploy ai-youtube-summary

# set/confirm secrets (only the ones not already set)
supabase secrets set OPENAI_API_KEY=sk-...
# recommended paid transcript provider (Supadata):
supabase secrets set SUPADATA_API_KEY=...
```

The DB setup (`record_ai_usage`, `record_ai_credit_spend`) is already installed
for the existing AI tools — no new SQL is required.

## Future work (structure is ready for these)

- **Audio transcription** when captions are missing (Whisper) — add a branch in
  `fetchTranscript()`.
- **Long-video support** — currently the transcript is capped at
  `MAX_TRANSCRIPT_CHARS`; chunk + map-reduce for full coverage.
- **Saved summaries / history** — write results to a `conversion_history`-style
  table keyed by user + videoId.
- **PDF export** — reuse the site's PDF tooling on the rendered summary.
- **Chrome extension** — the existing extension can POST to the same endpoint.
- **Navigation** — add the tool to `tools-menu.js` and the AI tools index so it
  shows up in the mega-menu.
