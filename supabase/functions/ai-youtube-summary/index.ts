// Supabase Edge Function: ai-youtube-summary
// Takes a YouTube URL, pulls the video's transcript (captions), and returns an
// AI-generated multi-section summary.
//
// Daily free limits (enforced server-side via record_ai_usage RPC), mirrors
// the other AI tools:
//   guest (no login):   3 summaries/day per hashed IP
//   free account:      10 summaries/day per user
//   pro / admin:       unlimited
// Logged-in users who hit the limit can spend 1 AI credit instead.
//
// Required secrets:
//   OPENAI_API_KEY
//   USAGE_IDENTITY_SALT   (same salt used by functions/api/usage-limit.js)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY  (auto-set)
//
// Optional secrets (paid transcript provider — see fetchTranscript):
//   TRANSCRIPT_API_URL    e.g. https://provider.example/transcript
//   TRANSCRIPT_API_KEY
//
// Required DB setup: supabase/ai-usage-setup.sql (already used by ai-pdf-summary)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LIMITS = { guest: 3, free: 10 };
const TOOL = 'youtube-summary';
const MAX_TRANSCRIPT_CHARS = 22000; // keep the model input bounded (long-video support = future)

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
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

// ── Auth / usage / credits (same shape as ai-pdf-summary) ──────────────────

async function getUser(req: Request): Promise<{ id: string; plan: string; role: string } | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token || !token.startsWith('eyJ')) return null;

  const { url, key } = supa();
  if (!url || !key) return null;

  try {
    const userRes = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return null;
    const user = await userRes.json();
    if (!user?.id) return null;

    const profileRes = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=plan,role`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = profileRes.ok ? await profileRes.json() : [];
    return {
      id: user.id as string,
      plan: rows?.[0]?.plan ?? 'free',
      role: rows?.[0]?.role ?? 'user',
    };
  } catch {
    return null;
  }
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
    body: JSON.stringify({
      p_user_id: userId,
      p_cost: 1,
      p_tool: 'youtube-summary-extra',
      p_ref: ref,
    }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error(`record_ai_credit_spend failed: ${JSON.stringify(rows)}`);
  const row = Array.isArray(rows) ? rows[0] : rows;
  return { balance: Number(row?.balance ?? 0), allowed: Boolean(row?.allowed) };
}

function languageName(code: string): string {
  const clean = String(code || 'en').toLowerCase();
  if (clean.startsWith('ko')) return 'Korean';
  if (clean.startsWith('ja')) return 'Japanese';
  if (clean.startsWith('es')) return 'Spanish';
  if (clean.startsWith('de')) return 'German';
  if (clean.startsWith('fr')) return 'French';
  return 'English';
}

// ── YouTube URL parsing ────────────────────────────────────────────────────
// Supports: youtube.com/watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID,
// /live/ID, and bare 11-char IDs.
function parseVideoId(input: string): string | null {
  const raw = String(input || '').trim();
  if (!raw) return null;

  // Bare video id
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let u: URL;
  try {
    u = new URL(raw.includes('://') ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  const isYouTube = host === 'youtube.com' || host === 'm.youtube.com' ||
    host === 'youtu.be' || host === 'music.youtube.com';
  if (!isYouTube) return null;

  if (host === 'youtu.be') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }

  const vParam = u.searchParams.get('v');
  if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;

  const parts = u.pathname.split('/').filter(Boolean);
  const marker = parts.findIndex(p => p === 'shorts' || p === 'embed' || p === 'live' || p === 'v');
  if (marker !== -1 && parts[marker + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[marker + 1])) {
    return parts[marker + 1];
  }
  return null;
}

// ── Video info via oEmbed (no API key needed) ──────────────────────────────
async function fetchVideoInfo(videoId: string): Promise<{ title: string; channel: string; thumbnail: string }> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const fallbackThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`);
    if (!res.ok) return { title: '', channel: '', thumbnail: fallbackThumb };
    const data = await res.json();
    return {
      title: String(data?.title || ''),
      channel: String(data?.author_name || ''),
      thumbnail: String(data?.thumbnail_url || fallbackThumb),
    };
  } catch {
    return { title: '', channel: '', thumbnail: fallbackThumb };
  }
}

// ── Transcript adapter ─────────────────────────────────────────────────────
// IMPORTANT: This is the one piece most likely to be rate-limited/blocked when
// called from a datacenter IP (Supabase edge). It is intentionally isolated so
// you can swap in a paid transcript provider without touching anything else.
//
// If TRANSCRIPT_API_URL is set, we call that provider first. Otherwise we fall
// back to scraping YouTube's own timedtext captions. To add Whisper audio
// transcription later, add another branch here that downloads audio and calls
// your speech-to-text service — the rest of the function does not change.

type Segment = { start: number; dur: number; text: string };
type TranscriptResult = { segments: Segment[]; lengthSeconds: number } | null;

async function fetchTranscript(videoId: string, langHint: string): Promise<TranscriptResult> {
  // 1. Supadata (recommended paid provider) — enabled by just setting SUPADATA_API_KEY.
  const supadataKey = Deno.env.get('SUPADATA_API_KEY');
  if (supadataKey) {
    try {
      const viaSupadata = await fetchTranscriptFromSupadata(videoId, langHint, supadataKey);
      if (viaSupadata && viaSupadata.segments.length) return viaSupadata;
    } catch (error) {
      console.error('[ai-youtube-summary] supadata failed', error);
      // fall through
    }
  }

  // 2. Generic custom provider (any other paid API) via TRANSCRIPT_API_URL.
  const provider = Deno.env.get('TRANSCRIPT_API_URL');
  if (provider) {
    try {
      const viaApi = await fetchTranscriptFromProvider(provider, videoId, langHint);
      if (viaApi && viaApi.segments.length) return viaApi;
    } catch (error) {
      console.error('[ai-youtube-summary] transcript provider failed', error);
      // fall through
    }
  }

  // 3. Built-in YouTube caption scraper (least reliable from datacenter IPs).
  return await fetchTranscriptFromYouTube(videoId, langHint);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Map a Supadata transcript payload (array of {text, offset(ms), duration(ms)}
// or a plain string) into our Segment shape.
function supadataToResult(data: Record<string, unknown>): TranscriptResult {
  const content = data?.content;
  if (Array.isArray(content)) {
    const segments: Segment[] = content.map((c: Record<string, unknown>) => ({
      start: Number(c.offset ?? 0) / 1000,      // offset is milliseconds
      dur: Number(c.duration ?? 0) / 1000,       // duration is milliseconds
      text: String(c.text ?? '').replace(/\s+/g, ' ').trim(),
    })).filter((s: Segment) => s.text);
    if (!segments.length) return null;
    const last = segments[segments.length - 1];
    return { segments, lengthSeconds: Math.round(last.start + last.dur) };
  }
  if (typeof content === 'string' && content.trim()) {
    return { segments: [{ start: 0, dur: 0, text: content.trim() }], lengthSeconds: 0 };
  }
  return null;
}

// Supadata API: GET /v1/transcript?url=...&lang=...  (header: x-api-key)
// Large videos return 202 { jobId } → poll GET /v1/transcript/{jobId}.
// Docs: https://docs.supadata.ai/get-transcript
async function fetchTranscriptFromSupadata(videoId: string, langHint: string, apiKey: string): Promise<TranscriptResult> {
  const base = Deno.env.get('SUPADATA_API_URL') || 'https://api.supadata.ai/v1/transcript';
  const url = new URL(base);
  url.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
  if (langHint) url.searchParams.set('lang', langHint);
  // Cost safeguard: only pull EXISTING captions (1 credit each). Never trigger
  // Supadata's AI generation for caption-less videos (2 credits PER MINUTE →
  // a 2-hour video would cost ~$2, far above our 1-credit charge). Videos
  // without captions fall through to our "transcript not available" message,
  // which matches the site copy ("audio transcription coming soon").
  url.searchParams.set('mode', 'native');

  const res = await fetch(url.toString(), { headers: { 'x-api-key': apiKey } });

  // Async job for long videos.
  if (res.status === 202) {
    const { jobId } = await res.json();
    if (!jobId) return null;
    // Poll up to ~30s; most videos finish quickly. Edge functions have a wall
    // clock limit, so keep this bounded.
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await sleep(3000);
      const jobRes = await fetch(`${base}/${jobId}`, { headers: { 'x-api-key': apiKey } });
      if (!jobRes.ok) continue;
      const jobData = await jobRes.json();
      const status = String(jobData?.status || '');
      if (status === 'completed') return supadataToResult(jobData);
      if (status === 'failed') return null;
      // queued / active → keep polling
    }
    return null; // gave up waiting; caller will fall back
  }

  if (!res.ok) throw new Error(`supadata ${res.status}`);
  const data = await res.json();
  return supadataToResult(data);
}

// Generic paid-provider adapter. Expects the provider to return either a plain
// transcript string or an array of {start, dur/duration, text} segments.
// Adjust the request/response mapping to match whichever service you buy.
async function fetchTranscriptFromProvider(baseUrl: string, videoId: string, langHint: string): Promise<TranscriptResult> {
  const apiKey = Deno.env.get('TRANSCRIPT_API_KEY') ?? '';
  const url = new URL(baseUrl);
  url.searchParams.set('videoId', videoId);
  if (langHint) url.searchParams.set('lang', langHint);

  const res = await fetch(url.toString(), {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  });
  if (!res.ok) return null;
  const data = await res.json();

  const rawSegments = Array.isArray(data) ? data
    : Array.isArray(data?.segments) ? data.segments
    : Array.isArray(data?.transcript) ? data.transcript
    : null;

  if (rawSegments) {
    const segments: Segment[] = rawSegments.map((s: Record<string, unknown>) => {
      let start = 0;
      if (s.start != null) start = Number(s.start);
      else if (s.offset != null) start = Number(s.offset);
      else if (s.tStartMs != null) start = Number(s.tStartMs) / 1000;
      return {
        start: Number.isFinite(start) ? start : 0,
        dur: Number(s.dur ?? s.duration ?? 0) || 0,
        text: String(s.text ?? s.utf8 ?? '').trim(),
      };
    }).filter((s: Segment) => s.text);
    if (segments.length) {
      const last = segments[segments.length - 1];
      return { segments, lengthSeconds: Math.round(last.start + last.dur) };
    }
  }

  if (typeof data?.text === 'string' && data.text.trim()) {
    return { segments: [{ start: 0, dur: 0, text: data.text.trim() }], lengthSeconds: 0 };
  }
  return null;
}

// Built-in fallback: read the watch page, find the caption tracks in
// ytInitialPlayerResponse, then download the json3 timedtext for the best track.
async function fetchTranscriptFromYouTube(videoId: string, langHint: string): Promise<TranscriptResult> {
  const headers = {
    // A browser-like UA + consent cookie reduces (does not eliminate) the
    // chance YouTube serves a consent/blocked page to a datacenter IP.
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept-Language': `${langHint || 'en'},en;q=0.8`,
    'Cookie': 'CONSENT=YES+1',
  };

  let html: string;
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, { headers });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  const player = extractPlayerResponse(html);
  const lengthSeconds = Number(player?.videoDetails?.lengthSeconds ?? 0) || 0;

  const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || !tracks.length) return null;

  // Prefer a track matching the requested language, then English, then first.
  const pick = tracks.find((t: Record<string, unknown>) => String(t.languageCode || '').startsWith(langHint))
    ?? tracks.find((t: Record<string, unknown>) => String(t.languageCode || '').startsWith('en'))
    ?? tracks[0];

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
      segments.push({
        start: Number(ev.tStartMs ?? 0) / 1000,
        dur: Number(ev.dDurationMs ?? 0) / 1000,
        text,
      });
    }
    if (!segments.length) return null;
    return { segments, lengthSeconds };
  } catch {
    return null;
  }
}

// Pull the ytInitialPlayerResponse JSON object out of the watch page HTML.
function extractPlayerResponse(html: string): any {
  const marker = 'ytInitialPlayerResponse';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const braceStart = html.indexOf('{', idx);
  if (braceStart === -1) return null;
  // Walk braces to find the matching close (naive but works for this blob).
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = braceStart; i < html.length; i += 1) {
    const ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        try { return JSON.parse(html.slice(braceStart, i + 1)); }
        catch { return null; }
      }
    }
  }
  return null;
}

// ── Helpers to shape transcript for the model ──────────────────────────────
function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const parts = [h > 0 ? String(h) : null, mm, String(sec).padStart(2, '0')].filter(Boolean);
  return parts.join(':');
}

// Build a single transcript string with [mm:ss] markers inserted roughly every
// 30 seconds, capped to MAX_TRANSCRIPT_CHARS. The model uses this for both the
// plain summary and the timestamp summary.
function buildTimestampedText(segments: Segment[]): { text: string; truncated: boolean } {
  const lines: string[] = [];
  let nextMark = 0;
  for (const seg of segments) {
    if (seg.start >= nextMark) {
      lines.push(`[${formatTime(seg.start)}] ${seg.text}`);
      nextMark = seg.start + 30;
    } else {
      lines.push(seg.text);
    }
  }
  let text = lines.join('\n').replace(/[ \t]{2,}/g, ' ').trim();
  const truncated = text.length > MAX_TRANSCRIPT_CHARS;
  if (truncated) text = text.slice(0, MAX_TRANSCRIPT_CHARS);
  return { text, truncated };
}

function emptySummary(): Record<string, unknown> {
  return {
    quickSummary: [],
    detailedSummary: '',
    sections: [],
    keyPoints: [],
    timestampSummary: [],
    keywords: [],
    blogTitle: '',
    shortsIdeas: [],
    socialPost: '',
  };
}

// Group caption segments into readable, timestamped transcript lines (~180 chars
// each) so the frontend can show a scrollable script panel without thousands of
// tiny rows. Returns [{ time: "mm:ss", seconds, text }].
function buildTranscriptLines(segments: Segment[]): Array<{ time: string; seconds: number; text: string }> {
  const lines: Array<{ time: string; seconds: number; text: string }> = [];
  let buf = '';
  let bufStart = segments.length ? segments[0].start : 0;
  const flush = () => {
    const text = buf.replace(/\s+/g, ' ').trim();
    if (text) lines.push({ time: formatTime(bufStart), seconds: Math.floor(bufStart), text });
    buf = '';
  };
  for (const seg of segments) {
    if (!buf) bufStart = seg.start;
    buf += (buf ? ' ' : '') + seg.text;
    if (buf.length >= 180) flush();
  }
  flush();
  return lines;
}

// ── Handler ────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) return json({ error: 'YouTube summary service is not configured.' }, 500);

    let body: { url?: string; language?: string; use_credit?: boolean; credit_ref?: string };
    try { body = await req.json(); }
    catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const videoId = parseVideoId(body.url || '');
    if (!videoId) {
      return json({ error: 'That does not look like a valid YouTube video link.', code: 'invalid_url' }, 400);
    }

    const langCode = String(body.language || 'en').toLowerCase().slice(0, 5);
    const outputLanguage = languageName(langCode);
    const wantsCredit = body.use_credit === true;
    const cleanCreditRef = String(body.credit_ref || '').replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 160);

    // ── Usage limit (checked before we do any expensive work) ──
    const user = await getUser(req);
    const isUnlimited = !!user && (user.plan === 'pro' || user.role === 'admin');
    let usage: { remaining: number; limit: number } | null = null;
    let pendingCreditRef: string | null = null;

    if (!isUnlimited) {
      const identity = user
        ? `user:${user.id}`
        : `ip:${await sha256Hex(`${Deno.env.get('USAGE_IDENTITY_SALT') ?? 'ec-ai-usage'}|${clientIp(req)}`)}`;
      const limit = user ? LIMITS.free : LIMITS.guest;

      let result: { remaining: number; allowed: boolean };
      try {
        result = await recordUsage(identity, limit);
      } catch (error) {
        console.error('[ai-youtube-summary] usage check failed', error);
        return json({ error: 'Usage service is temporarily unavailable. Please try again shortly.' }, 503);
      }

      if (!result.allowed) {
        if (user && wantsCredit) {
          pendingCreditRef = cleanCreditRef || `youtube-summary-extra:${user.id}:${crypto.randomUUID()}`;
        } else {
          return json({
            error: 'Daily free limit reached.',
            code: 'limit_reached',
            remaining: 0,
            limit,
            logged_in: !!user,
            credit_supported: !!user,
            credit_cost: 1,
          }, 429);
        }
      } else {
        usage = { remaining: result.remaining, limit };
      }
    }

    // ── Gather video info + transcript in parallel ──
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

    // Transcript missing → clear, replaceable message (audio transcription = future).
    if (!transcript || !transcript.segments.length) {
      return json({
        videoInfo,
        summary: emptySummary(),
        transcriptAvailable: false,
        message: 'Transcript is not available for this video. Audio transcription support will be added soon.',
        usage,
      }, 200);
    }

    const { text: transcriptText, truncated } = buildTimestampedText(transcript.segments);
    if (transcriptText.trim().length < 40) {
      return json({
        videoInfo,
        summary: emptySummary(),
        transcriptAvailable: false,
        message: 'This video does not have enough spoken content to summarize.',
        usage,
      }, 200);
    }

    // ── AI summary ──
    const model = Deno.env.get('OPENAI_SUMMARY_MODEL') || 'gpt-4o-mini';
    const systemPrompt = 'You are an expert content summarizer. Read the video transcript and create a clear, useful, human-friendly summary. Do not invent information that is not in the transcript. Organize the result into quick summary, detailed summary, key points, timestamp summary, keywords, blog title, YouTube Shorts ideas, and social media summary. Write in the selected language.';

    const userPrompt = `
Return ONLY valid JSON, no markdown, matching exactly this shape:
{
  "quickSummary": ["exactly 3 short sentences that capture the whole video"],
  "detailedSummary": "2-3 sentence overview that introduces the whole video",
  "sections": [
    {
      "heading": "short title for this part of the video",
      "time": "mm:ss",
      "points": ["3-6 detailed bullets that fully explain what is said in this part"]
    }
  ],
  "keyPoints": ["5-8 concise bullet points (quick scan of the whole video)"],
  "timestampSummary": [{ "time": "mm:ss", "point": "what is covered around that time" }],
  "keywords": ["6-12 important keywords or topics"],
  "blogTitle": "one catchy, accurate blog post title",
  "shortsIdeas": ["3-5 short-form video / YouTube Shorts ideas based on the content"],
  "socialPost": "one short social-media-ready post summarizing the video"
}

Rules:
- Write ALL text values in ${outputLanguage}.
- "sections" is the MAIN detailed summary. It must follow the video in chronological order and cover the ENTIRE video so that reading only the sections gives a complete understanding without watching. Use 4-10 sections; each "time" must be an [mm:ss] timestamp taken from the transcript marking where that part starts; each section's "points" must be specific and self-explanatory (include concrete facts, names, numbers, and arguments actually stated).
- "detailedSummary" is only a short intro paragraph; do NOT put the full detail there — that belongs in "sections".
- Use ONLY the [mm:ss] timestamps that appear in the transcript. If no timestamps are present, use "" for section times and return an empty array for timestampSummary.
- Do not invent facts that are not in the transcript.
- Keep quickSummary, keyPoints, and the social post concise; "sections" is where the depth goes.
${truncated ? '- NOTE: the transcript was truncated for length; summarize what is provided.' : ''}

Video title: ${videoInfo.title}
Channel: ${videoInfo.channel || 'unknown'}

Transcript:
${transcriptText}
`;

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openAIKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      console.error('[ai-youtube-summary] OpenAI error', aiData);
      return json({ error: 'AI summary failed. Please try again later.', videoInfo }, 502);
    }

    const content = aiData?.choices?.[0]?.message?.content;
    let summary: Record<string, unknown>;
    try {
      summary = content ? { ...emptySummary(), ...JSON.parse(content) } : emptySummary();
    } catch {
      summary = emptySummary();
    }

    // ── Charge a credit only if this was an over-limit run ──
    let credit: { cost: number; balance: number } | null = null;
    if (user && pendingCreditRef) {
      const spend = await spendCredits(user.id, pendingCreditRef);
      if (!spend.allowed) {
        return json({ error: 'Not enough credits.', code: 'insufficient_credits', cost: 1, balance: spend.balance }, 402);
      }
      credit = { cost: 1, balance: spend.balance };
    }

    return json({
      videoInfo,
      summary,
      transcript: buildTranscriptLines(transcript.segments),
      transcriptAvailable: true,
      truncated,
      usage,
      credit,
    });
  } catch (error) {
    console.error('[ai-youtube-summary]', error);
    return json({ error: 'Internal server error.' }, 500);
  }
});
