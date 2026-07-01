# YouTube Summary Tool — Full Replication Guide

A complete, portable spec for building the **YouTube Video Summary** feature on
another site. Paste a YouTube link → get an AI summary (quick recap, detailed
summary, key points, timeline, keywords, blog title, Shorts ideas, social post).

This document is self-contained: it includes the reasoning, the complete backend
code, the frontend contract, deployment, and the cost model. Everything below
was built and shipped to production on EverythingConvert.com; the same recipe
transfers to any site.

---

## 1. Architecture at a glance

```
Browser (static HTML + vanilla JS)
   │  POST { url, language, use_credit }
   ▼
Supabase Edge Function  ai-youtube-summary  (Deno / TypeScript)
   ├─ parse YouTube URL → videoId
   ├─ video info  ← YouTube oEmbed (no API key)
   ├─ transcript  ← Supadata (paid) → generic API → built-in scraper
   ├─ usage limit / credits  ← Postgres RPCs
   └─ summary     ← OpenAI (gpt-4o-mini), JSON output
   ▼
Browser renders result cards + Copy / TXT / Markdown export
```

**Stack chosen (and why):**
- **No build step, static frontend + serverless function.** The host site is
  plain HTML/CSS/vanilla JS. We deliberately did **not** use Next.js/React so the
  feature drops into the existing site instead of becoming a separate app. If
  your target site *is* Next.js, the same edge-function code works unchanged —
  just call it from a React component instead of the vanilla script.
- **Supabase Edge Functions (Deno)** for the backend, because that is where the
  OpenAI key and the usage/credit database already live. Any serverless runtime
  with the Web `Request`/`Response` API (Cloudflare Workers, Deno Deploy) works.
- **OpenAI `gpt-4o-mini`** — cheap, fast, supports JSON-mode output.

---

## 2. The one hard problem: getting the transcript

YouTube has **no public captions API** for arbitrary videos. The unofficial
caption endpoints (and the HTML-scraping trick) are **frequently rate-limited or
outright blocked when called from a datacenter IP** — which is exactly what a
serverless function is. We confirmed this in production: the built-in scraper
returned "no transcript" for a video that clearly has captions.

**Conclusion: for production you need a paid transcript provider.** We use
[Supadata](https://supadata.ai). The code keeps transcript extraction behind a
single `fetchTranscript()` function with three tiers so you can swap providers
without touching anything else:

1. **Supadata** (set `SUPADATA_API_KEY`) — the reliable path.
2. **Generic paid API** (set `TRANSCRIPT_API_URL`) — for any other vendor.
3. **Built-in YouTube scraper** — free but unreliable; last-resort fallback.

Only videos that **already have captions** (manual *or* YouTube auto-captions)
are summarized. Caption-less videos return a friendly "transcript not available"
message. Adding Whisper audio transcription later is a 4th branch in the same
function (see §10).

---

## 3. Prerequisites

| Need | Notes |
|---|---|
| Supabase project | Hosts the edge function + the OpenAI key as a secret. |
| OpenAI API key | `gpt-4o-mini` is the default model. |
| Supadata API key | https://supadata.ai — pay-as-you-go, ~$0.009 per captioned transcript. |
| Supabase CLI | `supabase functions deploy …`. |
| (Optional) usage/credit DB | Only if you want the free-tier limit + credit charging. See §7. |

---

## 4. Environment variables (Supabase secrets)

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set SUPADATA_API_KEY=...          # recommended
supabase secrets set USAGE_IDENTITY_SALT=some-random-string   # only for the limit system
# SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are auto-provided by Supabase.
# Optional:
#   OPENAI_SUMMARY_MODEL   (default gpt-4o-mini)
#   SUPADATA_API_URL       (default https://api.supadata.ai/v1/transcript)
#   TRANSCRIPT_API_URL / TRANSCRIPT_API_KEY  (a different paid provider)
```

---

## 5. Backend — the complete edge function

Save as `supabase/functions/ai-youtube-summary/index.ts`. This is the full,
production code. If your site has **no usage/credit system**, delete the marked
"usage limit" and "credit" blocks and the `getUser`/`recordUsage`/`spendCredits`
helpers — the function then works for everyone with no limits (see §7).

```typescript
// Supabase Edge Function: ai-youtube-summary
// Takes a YouTube URL, pulls the transcript (captions), returns an AI summary.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LIMITS = { guest: 3, free: 10 };          // daily free summaries
const TOOL = 'youtube-summary';
const MAX_TRANSCRIPT_CHARS = 22000;             // bound the model input

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function supa() {
  return {
    url: Deno.env.get('SUPABASE_URL') ?? '',
    key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  };
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  return fwd.split(',')[0].trim() || req.headers.get('cf-connecting-ip') || 'unknown';
}

// ── [USAGE/CREDIT BLOCK — delete this whole block for a no-limits version] ──
async function getUser(req: Request): Promise<{ id: string; plan: string; role: string } | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token || !token.startsWith('eyJ')) return null;
  const { url, key } = supa();
  if (!url || !key) return null;
  try {
    const userRes = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
    if (!userRes.ok) return null;
    const user = await userRes.json();
    if (!user?.id) return null;
    const profileRes = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=plan,role`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = profileRes.ok ? await profileRes.json() : [];
    return { id: user.id as string, plan: rows?.[0]?.plan ?? 'free', role: rows?.[0]?.role ?? 'user' };
  } catch { return null; }
}

async function recordUsage(identity: string, limit: number): Promise<{ remaining: number; allowed: boolean }> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/rpc/record_ai_usage`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ usage_identity: identity, usage_tool: TOOL, usage_limit: limit }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error(`record_ai_usage failed: ${JSON.stringify(rows)}`);
  const row = Array.isArray(rows) ? rows[0] : rows;
  return { remaining: Number(row?.remaining ?? 0), allowed: Boolean(row?.allowed) };
}

async function spendCredits(userId: string, ref: string): Promise<{ balance: number; allowed: boolean }> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/rpc/record_ai_credit_spend`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user_id: userId, p_cost: 1, p_tool: 'youtube-summary-extra', p_ref: ref }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error(`record_ai_credit_spend failed: ${JSON.stringify(rows)}`);
  const row = Array.isArray(rows) ? rows[0] : rows;
  return { balance: Number(row?.balance ?? 0), allowed: Boolean(row?.allowed) };
}
// ── [END USAGE/CREDIT BLOCK] ──

function languageName(code: string): string {
  const c = String(code || 'en').toLowerCase();
  if (c.startsWith('ko')) return 'Korean';
  if (c.startsWith('ja')) return 'Japanese';
  if (c.startsWith('es')) return 'Spanish';
  if (c.startsWith('de')) return 'German';
  if (c.startsWith('fr')) return 'French';
  return 'English';
}

// ── YouTube URL parsing: watch?v=, youtu.be/, /shorts/, /embed/, /live/, bare id ──
function parseVideoId(input: string): string | null {
  const raw = String(input || '').trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  let u: URL;
  try { u = new URL(raw.includes('://') ? raw : `https://${raw}`); } catch { return null; }
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  const ok = host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be' || host === 'music.youtube.com';
  if (!ok) return null;
  if (host === 'youtu.be') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }
  const v = u.searchParams.get('v');
  if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  const parts = u.pathname.split('/').filter(Boolean);
  const i = parts.findIndex(p => p === 'shorts' || p === 'embed' || p === 'live' || p === 'v');
  if (i !== -1 && parts[i + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[i + 1])) return parts[i + 1];
  return null;
}

// ── Video info via oEmbed (no API key) ──
async function fetchVideoInfo(videoId: string): Promise<{ title: string; channel: string; thumbnail: string }> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const fallbackThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`);
    if (!res.ok) return { title: '', channel: '', thumbnail: fallbackThumb };
    const d = await res.json();
    return { title: String(d?.title || ''), channel: String(d?.author_name || ''), thumbnail: String(d?.thumbnail_url || fallbackThumb) };
  } catch { return { title: '', channel: '', thumbnail: fallbackThumb }; }
}

// ── Transcript adapter (Supadata → generic API → built-in scraper) ──
type Segment = { start: number; dur: number; text: string };
type TranscriptResult = { segments: Segment[]; lengthSeconds: number } | null;

async function fetchTranscript(videoId: string, langHint: string): Promise<TranscriptResult> {
  const supadataKey = Deno.env.get('SUPADATA_API_KEY');
  if (supadataKey) {
    try {
      const r = await fetchTranscriptFromSupadata(videoId, langHint, supadataKey);
      if (r && r.segments.length) return r;
    } catch (e) { console.error('[yt] supadata failed', e); }
  }
  const provider = Deno.env.get('TRANSCRIPT_API_URL');
  if (provider) {
    try {
      const r = await fetchTranscriptFromProvider(provider, videoId, langHint);
      if (r && r.segments.length) return r;
    } catch (e) { console.error('[yt] provider failed', e); }
  }
  return await fetchTranscriptFromYouTube(videoId, langHint);
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function supadataToResult(data: Record<string, unknown>): TranscriptResult {
  const content = data?.content;
  if (Array.isArray(content)) {
    const segments: Segment[] = content.map((c: Record<string, unknown>) => ({
      start: Number(c.offset ?? 0) / 1000,   // ms → s
      dur: Number(c.duration ?? 0) / 1000,   // ms → s
      text: String(c.text ?? '').replace(/\s+/g, ' ').trim(),
    })).filter((s: Segment) => s.text);
    if (!segments.length) return null;
    const last = segments[segments.length - 1];
    return { segments, lengthSeconds: Math.round(last.start + last.dur) };
  }
  if (typeof content === 'string' && content.trim()) return { segments: [{ start: 0, dur: 0, text: content.trim() }], lengthSeconds: 0 };
  return null;
}

// Supadata: GET /v1/transcript?url=..&lang=..&mode=native  (header x-api-key)
// mode=native = ONLY existing captions (1 credit). Never triggers the
// 2-credits-per-minute AI generation. Long videos → 202 {jobId} → poll.
async function fetchTranscriptFromSupadata(videoId: string, langHint: string, apiKey: string): Promise<TranscriptResult> {
  const base = Deno.env.get('SUPADATA_API_URL') || 'https://api.supadata.ai/v1/transcript';
  const url = new URL(base);
  url.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
  if (langHint) url.searchParams.set('lang', langHint);
  url.searchParams.set('mode', 'native');           // ← cost safeguard
  const res = await fetch(url.toString(), { headers: { 'x-api-key': apiKey } });
  if (res.status === 202) {
    const { jobId } = await res.json();
    if (!jobId) return null;
    for (let i = 0; i < 10; i++) {
      await sleep(3000);
      const jr = await fetch(`${base}/${jobId}`, { headers: { 'x-api-key': apiKey } });
      if (!jr.ok) continue;
      const jd = await jr.json();
      const st = String(jd?.status || '');
      if (st === 'completed') return supadataToResult(jd);
      if (st === 'failed') return null;
    }
    return null;
  }
  if (!res.ok) throw new Error(`supadata ${res.status}`);
  return supadataToResult(await res.json());
}

// Generic vendor: returns {text} or [{start|offset|tStartMs, dur|duration, text|utf8}].
async function fetchTranscriptFromProvider(baseUrl: string, videoId: string, langHint: string): Promise<TranscriptResult> {
  const apiKey = Deno.env.get('TRANSCRIPT_API_KEY') ?? '';
  const url = new URL(baseUrl);
  url.searchParams.set('videoId', videoId);
  if (langHint) url.searchParams.set('lang', langHint);
  const res = await fetch(url.toString(), { headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {} });
  if (!res.ok) return null;
  const data = await res.json();
  const raw = Array.isArray(data) ? data : Array.isArray(data?.segments) ? data.segments : Array.isArray(data?.transcript) ? data.transcript : null;
  if (raw) {
    const segments: Segment[] = raw.map((s: Record<string, unknown>) => {
      let start = 0;
      if (s.start != null) start = Number(s.start);
      else if (s.offset != null) start = Number(s.offset);
      else if (s.tStartMs != null) start = Number(s.tStartMs) / 1000;
      return { start: Number.isFinite(start) ? start : 0, dur: Number(s.dur ?? s.duration ?? 0) || 0, text: String(s.text ?? s.utf8 ?? '').trim() };
    }).filter((s: Segment) => s.text);
    if (segments.length) { const last = segments[segments.length - 1]; return { segments, lengthSeconds: Math.round(last.start + last.dur) }; }
  }
  if (typeof data?.text === 'string' && data.text.trim()) return { segments: [{ start: 0, dur: 0, text: data.text.trim() }], lengthSeconds: 0 };
  return null;
}

// Free fallback: scrape the watch page's ytInitialPlayerResponse caption tracks.
async function fetchTranscriptFromYouTube(videoId: string, langHint: string): Promise<TranscriptResult> {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept-Language': `${langHint || 'en'},en;q=0.8`,
    'Cookie': 'CONSENT=YES+1',
  };
  let html: string;
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, { headers });
    if (!res.ok) return null;
    html = await res.text();
  } catch { return null; }
  const player = extractPlayerResponse(html);
  const lengthSeconds = Number(player?.videoDetails?.lengthSeconds ?? 0) || 0;
  const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || !tracks.length) return null;
  const pick = tracks.find((t: Record<string, unknown>) => String(t.languageCode || '').startsWith(langHint))
    ?? tracks.find((t: Record<string, unknown>) => String(t.languageCode || '').startsWith('en')) ?? tracks[0];
  const baseUrl = String(pick?.baseUrl || '');
  if (!baseUrl) return null;
  try {
    const capRes = await fetch(`${baseUrl}&fmt=json3`, { headers });
    if (!capRes.ok) return null;
    const capData = await capRes.json();
    const events = Array.isArray(capData?.events) ? capData.events : [];
    const segments: Segment[] = [];
    for (const ev of events) {
      const segs = Array.isArray(ev?.segs) ? ev.segs : [];
      const text = segs.map((s: Record<string, unknown>) => String(s?.utf8 ?? '')).join('').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      segments.push({ start: Number(ev.tStartMs ?? 0) / 1000, dur: Number(ev.dDurationMs ?? 0) / 1000, text });
    }
    if (!segments.length) return null;
    return { segments, lengthSeconds };
  } catch { return null; }
}

function extractPlayerResponse(html: string): any {
  const idx = html.indexOf('ytInitialPlayerResponse');
  if (idx === -1) return null;
  const start = html.indexOf('{', idx);
  if (start === -1) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}') { if (--depth === 0) { try { return JSON.parse(html.slice(start, i + 1)); } catch { return null; } } }
  }
  return null;
}

function formatTime(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return [h > 0 ? String(h) : null, mm, String(sec).padStart(2, '0')].filter(Boolean).join(':');
}

// Insert [mm:ss] markers ~every 30s so the model can build a timeline; cap length.
function buildTimestampedText(segments: Segment[]): { text: string; truncated: boolean } {
  const lines: string[] = [];
  let nextMark = 0;
  for (const seg of segments) {
    if (seg.start >= nextMark) { lines.push(`[${formatTime(seg.start)}] ${seg.text}`); nextMark = seg.start + 30; }
    else lines.push(seg.text);
  }
  let text = lines.join('\n').replace(/[ \t]{2,}/g, ' ').trim();
  const truncated = text.length > MAX_TRANSCRIPT_CHARS;
  if (truncated) text = text.slice(0, MAX_TRANSCRIPT_CHARS);
  return { text, truncated };
}

function emptySummary(): Record<string, unknown> {
  return { quickSummary: [], detailedSummary: '', keyPoints: [], timestampSummary: [], keywords: [], blogTitle: '', shortsIdeas: [], socialPost: '' };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) return json({ error: 'Service not configured.' }, 500);

    let body: { url?: string; language?: string; use_credit?: boolean; credit_ref?: string };
    try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const videoId = parseVideoId(body.url || '');
    if (!videoId) return json({ error: 'That does not look like a valid YouTube video link.', code: 'invalid_url' }, 400);

    const langCode = String(body.language || 'en').toLowerCase().slice(0, 5);
    const outputLanguage = languageName(langCode);
    const wantsCredit = body.use_credit === true;
    const cleanCreditRef = String(body.credit_ref || '').replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 160);

    // ── [USAGE LIMIT BLOCK — delete for a no-limits version] ──
    const user = await getUser(req);
    const isUnlimited = !!user && (user.plan === 'pro' || user.role === 'admin');
    let usage: { remaining: number; limit: number } | null = null;
    let pendingCreditRef: string | null = null;
    if (!isUnlimited) {
      const identity = user ? `user:${user.id}` : `ip:${await sha256Hex(`${Deno.env.get('USAGE_IDENTITY_SALT') ?? 'salt'}|${clientIp(req)}`)}`;
      const limit = user ? LIMITS.free : LIMITS.guest;
      let result: { remaining: number; allowed: boolean };
      try { result = await recordUsage(identity, limit); }
      catch (e) { console.error('[yt] usage failed', e); return json({ error: 'Usage service temporarily unavailable.' }, 503); }
      if (!result.allowed) {
        if (user && wantsCredit) pendingCreditRef = cleanCreditRef || `youtube-summary-extra:${user.id}:${crypto.randomUUID()}`;
        else return json({ error: 'Daily free limit reached.', code: 'limit_reached', remaining: 0, limit, logged_in: !!user, credit_supported: !!user, credit_cost: 1 }, 429);
      } else usage = { remaining: result.remaining, limit };
    }
    // ── [END USAGE LIMIT BLOCK] ──

    const [info, transcript] = await Promise.all([
      fetchVideoInfo(videoId),
      fetchTranscript(videoId, langCode.slice(0, 2)),
    ]);

    const videoInfo = {
      title: info.title || 'YouTube video',
      thumbnail: info.thumbnail,
      channel: info.channel,
      duration: transcript?.lengthSeconds ? formatTime(transcript.lengthSeconds) : '',
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };

    if (!transcript || !transcript.segments.length) {
      return json({ videoInfo, summary: emptySummary(), transcriptAvailable: false,
        message: 'Transcript is not available for this video. Audio transcription support will be added soon.', usage }, 200);
    }

    const { text: transcriptText, truncated } = buildTimestampedText(transcript.segments);
    if (transcriptText.trim().length < 40) {
      return json({ videoInfo, summary: emptySummary(), transcriptAvailable: false,
        message: 'This video does not have enough spoken content to summarize.', usage }, 200);
    }

    const model = Deno.env.get('OPENAI_SUMMARY_MODEL') || 'gpt-4o-mini';
    const systemPrompt = 'You are an expert content summarizer. Read the video transcript and create a clear, useful, human-friendly summary. Do not invent information that is not in the transcript. Organize the result into quick summary, detailed summary, key points, timestamp summary, keywords, blog title, YouTube Shorts ideas, and social media summary. Write in the selected language.';
    const userPrompt = `
Return ONLY valid JSON, no markdown, matching exactly this shape:
{
  "quickSummary": ["exactly 3 short sentences that capture the whole video"],
  "detailedSummary": "2-4 paragraph plain-language summary",
  "keyPoints": ["5-8 concise bullet points"],
  "timestampSummary": [{ "time": "mm:ss", "point": "what is covered around that time" }],
  "keywords": ["6-12 important keywords or topics"],
  "blogTitle": "one catchy, accurate blog post title",
  "shortsIdeas": ["3-5 short-form video / YouTube Shorts ideas based on the content"],
  "socialPost": "one short social-media-ready post summarizing the video"
}
Rules:
- Write ALL text values in ${outputLanguage}.
- Use ONLY the [mm:ss] timestamps that appear in the transcript for timestampSummary. Pick 4-8 evenly spread moments. If none, return [].
- Do not invent facts that are not in the transcript.
- Keep bullets and the social post concise.
${truncated ? '- NOTE: transcript was truncated for length; summarize what is provided.' : ''}

Video title: ${videoInfo.title}
Channel: ${videoInfo.channel || 'unknown'}

Transcript:
${transcriptText}
`;

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openAIKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, temperature: 0.3, response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }] }),
    });
    const aiData = await aiRes.json();
    if (!aiRes.ok) { console.error('[yt] OpenAI error', aiData); return json({ error: 'AI summary failed.', videoInfo }, 502); }

    const content = aiData?.choices?.[0]?.message?.content;
    let summary: Record<string, unknown>;
    try { summary = content ? { ...emptySummary(), ...JSON.parse(content) } : emptySummary(); }
    catch { summary = emptySummary(); }

    // ── [CREDIT BLOCK — delete for a no-limits version] ──
    let credit: { cost: number; balance: number } | null = null;
    if (user && pendingCreditRef) {
      const spend = await spendCredits(user.id, pendingCreditRef);
      if (!spend.allowed) return json({ error: 'Not enough credits.', code: 'insufficient_credits', cost: 1, balance: spend.balance }, 402);
      credit = { cost: 1, balance: spend.balance };
    }
    // ── [END CREDIT BLOCK] ──

    return json({ videoInfo, summary, transcriptAvailable: true, truncated, usage, credit });
  } catch (e) {
    console.error('[yt]', e);
    return json({ error: 'Internal server error.' }, 500);
  }
});
```

**`supabase/config.toml`** — the function does its own auth, so guests can call
it with the anon key. Disable the platform JWT gate:

```toml
[functions.ai-youtube-summary]
verify_jwt = false
```

---

## 6. Frontend contract

**Request** `POST https://<project>.functions.supabase.co/ai-youtube-summary`

```json
{ "url": "https://youtu.be/...", "language": "en", "use_credit": false }
```
Headers: `Content-Type: application/json`, and (for the anon gate)
`apikey: <SUPABASE_ANON_KEY>` + `Authorization: Bearer <userAccessToken || anonKey>`.

**Response (success)**
```json
{
  "videoInfo": { "title": "", "thumbnail": "", "channel": "", "duration": "", "url": "" },
  "summary": {
    "quickSummary": [], "detailedSummary": "", "keyPoints": [],
    "timestampSummary": [{ "time": "mm:ss", "point": "" }],
    "keywords": [], "blogTitle": "", "shortsIdeas": [], "socialPost": ""
  },
  "transcriptAvailable": true,
  "truncated": false,
  "usage": { "remaining": 9, "limit": 10 },
  "credit": null
}
```

**Status codes to handle in the UI:** `400 invalid_url`, `429 limit_reached`
(show login / buy-credits CTA), `402 insufficient_credits`, `200` with
`transcriptAvailable:false` (show "no captions" notice), `502`/`503`/network.

**Minimal vanilla-JS caller** (drop into any page; expand the rendering to taste):

```js
const FN = 'https://<project>.functions.supabase.co/ai-youtube-summary';
const ANON = '<SUPABASE_ANON_KEY>';

async function summarize(url, language = 'en') {
  const res = await fetch(FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
    body: JSON.stringify({ url, language }),
  });
  const data = await res.json();
  if (res.status === 429) throw new Error('Daily limit reached — log in or upgrade.');
  if (!res.ok) throw new Error(data.error || 'Failed');
  if (data.transcriptAvailable === false) return { info: data.videoInfo, notice: data.message };
  return { info: data.videoInfo, summary: data.summary };
}
```

Client-side URL validation: copy `parseVideoId` from §5 into the page so you can
show a friendly error before hitting the network.

**UI sections to render** (all present in `summary`): 3-line quick summary,
detailed summary, key points, timeline (time + point), keyword chips, blog title,
Shorts ideas, social post. Add Copy / Download-TXT / Download-Markdown buttons —
they just serialize the same `summary` object.

---

## 7. Database dependency (only for the free-tier limit + credits)

The usage/credit blocks call two Postgres RPCs. If your target site has its own
accounts + credits, wire these to your equivalents. If you want the **simplest
possible version, delete the marked blocks** — the tool then summarizes for
everyone with no limits (you rely on your own rate limiting / OpenAI budget).

Contract of the RPCs (implement in Postgres if you want limits):
- `record_ai_usage(usage_identity text, usage_tool text, usage_limit int)`
  → returns `{ remaining int, allowed bool }`. Increments a per-identity, per-day
  counter and reports whether this call is within `usage_limit`.
- `record_ai_credit_spend(p_user_id uuid, p_cost int, p_tool text, p_ref text)`
  → returns `{ balance int, allowed bool }`. Atomically deducts `p_cost` credits
  (idempotent on `p_ref`) and reports the new balance.

`profiles` table needs `plan` (`free`/`pro`) and `role` (`user`/`admin`).

---

## 8. Deploy

```bash
supabase functions deploy ai-youtube-summary --project-ref <PROJECT_REF>
```
(Docker not required — the CLI bundles via its API.) Then set the secrets from §4.

**Verify live** (no key needed if `verify_jwt=false`):
```bash
# invalid URL → 400 invalid_url
curl -s -X POST https://<project>.functions.supabase.co/ai-youtube-summary \
  -H 'Content-Type: application/json' -d '{"url":"nope"}'

# real captioned video → transcriptAvailable:true + summary
curl -s -X POST https://<project>.functions.supabase.co/ai-youtube-summary \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","language":"en"}'
```

---

## 9. Cost model & pricing decision

Per summary of a **captioned** video:
- Supadata transcript: **~$0.009** (1 credit @ $9 / 1,000).
- OpenAI `gpt-4o-mini`: **~$0.0015** (≈6k input + 1k output tokens).
- **Total ≈ $0.01 per summary.**

If you sell "credits" at $0.05–$0.10 each, charging **1 credit** is a 5–10× margin
and consistent with a sibling "summarize a document" tool. We charge the credit
**only after the daily free allowance** (guest 3/day, free 10/day; pro unlimited).

**Critical cost trap:** Supadata charges **2 credits per minute (~$0.018/min)** to
*AI-generate* a transcript for caption-less videos — a 2-hour video would cost
~$2, far above a 1-credit charge. We prevent this by sending **`mode=native`**
(existing captions only). Caption-less videos return the "not available" notice.
If you *do* want caption-less support, price it by **video length** (like an
"N credits per 10 minutes" rule), not a flat 1 credit.

---

## 10. Future work (structure already supports it)

- **Whisper / audio transcription** for caption-less videos: add a 4th branch in
  `fetchTranscript()` that downloads audio and calls a speech-to-text API, then
  returns the same `{ segments, lengthSeconds }`. Charge by length.
- **Long-video support:** currently capped at `MAX_TRANSCRIPT_CHARS`; chunk +
  map-reduce for full coverage.
- **Saved summaries / history:** persist `{ user, videoId, summary }`.
- **PDF export:** render the `summary` object to PDF.
- **Chrome extension:** POST to the same endpoint from the extension.

---

## 11. Build order checklist

1. Create the edge function file (§5) and `config.toml` entry.
2. Set secrets: `OPENAI_API_KEY`, `SUPADATA_API_KEY` (+ salt if using limits).
3. Deploy; verify with the curl calls (§8).
4. Build the frontend page: URL input + language select + Generate button; call
   the endpoint (§6); render the 8 sections + Copy/TXT/MD.
5. (Optional) wire the usage/credit RPCs (§7) if you want the freemium limit.
6. Add the tool to your navigation; bump any cached `?v=` on shared JS.

That's the whole feature. The transcript provider is the only paid dependency and
the only thing that must be configured for it to work in production.
