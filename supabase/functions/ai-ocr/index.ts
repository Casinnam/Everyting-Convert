// Supabase Edge Function: ai-ocr (Smart OCR)
// GPT-4o vision OCR for the paid tier. The browser rasterizes PDF pages to
// images (pdf.js) and the free tier runs Tesseract locally; this function is
// only the paid, high-accuracy path.
//
// Modes (JSON body):
//   preview : { mode:'preview', image, pages }            -> OCR page 1, create job
//   full    : { mode:'full', job_id, page_index, image }  -> OCR one page (job must be paid)
//   enhance : { mode:'enhance', job_id, action, text, language } -> translate/summarize paid result
//
// Credit cost (charged separately by ai-redeem-credit): 2 credits per page.
//
// Required secret: OPENAI_API_KEY  (already configured; same key as PDF Summary)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_PAGES = 30;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function supa() {
  return { url: Deno.env.get('SUPABASE_URL') ?? '', key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' };
}

async function dbInsertJob(pages: number): Promise<string> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ tool: 'smart-ocr', status: 'preview_ready', preview_data: { pages } }),
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]?.id) throw new Error('Failed to create job record.');
  return rows[0].id as string;
}

async function dbGetJob(jobId: string): Promise<Record<string, unknown> | null> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]) return null;
  return rows[0] as Record<string, unknown>;
}

const OCR_MODEL = Deno.env.get('OPENAI_OCR_MODEL') || 'gpt-4o';

async function chat(messages: unknown, maxTokens = 4096): Promise<Record<string, unknown>> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('not_configured');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OCR_MODEL,
      temperature: 0,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('[ai-ocr] OpenAI error', data?.error?.message);
    throw new Error('ai_failed');
  }
  const content = data?.choices?.[0]?.message?.content;
  try { return JSON.parse(content); } catch { return { markdown: '', plain_text: '', tables: [], language: '' }; }
}

const OCR_INSTRUCTION =
  'You are a precise OCR engine. Extract ALL text from this document image exactly as written. ' +
  'Do NOT translate, summarize, or add commentary. Preserve reading order and layout. ' +
  'Return ONLY JSON with this shape: ' +
  '{"markdown": "layout-preserving Markdown (use # headings, lists, and Markdown tables where the source has tables)", ' +
  '"plain_text": "all text as plain lines", ' +
  '"tables": [[["cell","cell"],["cell","cell"]]], ' +
  '"language": "ISO 639-1 code of the main language"}. ' +
  'tables is an array of tables; each table is an array of rows; each row is an array of cell strings. Empty array if no tables. ' +
  'If the image has no readable text, return empty strings and empty arrays.';

async function ocrImage(dataUrl: string): Promise<Record<string, unknown>> {
  return await chat([
    { role: 'system', content: 'You convert document images to structured text. Output valid JSON only.' },
    {
      role: 'user',
      content: [
        { type: 'text', text: OCR_INSTRUCTION },
        { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
      ],
    },
  ]);
}

function isDataImage(s: unknown): boolean {
  return typeof s === 'string' && /^data:image\/(png|jpe?g|webp);base64,/.test(s) && s.length < 8_000_000;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    if (!Deno.env.get('OPENAI_API_KEY')) return json({ error: 'OCR service is not configured.' }, 500);

    let body: Record<string, unknown>;
    try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const mode = String(body.mode || 'preview');

    // ── PREVIEW: create the job and return page count + cost only.
    // We intentionally do NOT OCR here: for a 1-page document the OCR result
    // *is* the whole document, so returning it would give the paid result away
    // for free. The free on-device Tesseract path is the quality teaser; the
    // GPT-4o result is delivered only after payment (full mode).
    if (mode === 'preview') {
      const requested = Number(body.pages) || 1;
      const pages = Math.min(MAX_PAGES, Math.max(1, requested));
      const jobId = await dbInsertJob(pages);
      return json({ job_id: jobId, pages, cost: pages * 2, capped: requested > MAX_PAGES });
    }

    // ── FULL: OCR one page of a paid job ──
    if (mode === 'full') {
      const jobId = String(body.job_id || '');
      if (!jobId) return json({ error: 'job_id is required.' }, 400);
      if (!isDataImage(body.image)) return json({ error: 'A page image is required.' }, 400);

      const job = await dbGetJob(jobId);
      if (!job) return json({ error: 'Job not found.' }, 404);
      if (job.status !== 'paid' && job.status !== 'complete') return json({ error: 'Payment required.' }, 402);

      const paidPages = Math.min(MAX_PAGES, Math.max(1, Number((job.preview_data as Record<string, unknown>)?.pages ?? 1)));
      const pageIndex = Math.max(0, Number(body.page_index) || 0);
      if (pageIndex >= paidPages) return json({ error: 'Page is beyond the paid page count.' }, 403);

      let result: Record<string, unknown>;
      try { result = await ocrImage(body.image as string); }
      catch { return json({ error: 'OCR failed on this page. Please try again.' }, 502); }

      return json({ page_index: pageIndex, result });
    }

    // ── ENHANCE: translate or summarize the assembled paid result ──
    if (mode === 'enhance') {
      const jobId = String(body.job_id || '');
      const action = String(body.action || '');
      const text = String(body.text || '').slice(0, 60000);
      if (!jobId || !text) return json({ error: 'job_id and text are required.' }, 400);

      const job = await dbGetJob(jobId);
      if (!job) return json({ error: 'Job not found.' }, 404);
      if (job.status !== 'paid' && job.status !== 'complete') return json({ error: 'Payment required.' }, 402);

      let messages: unknown;
      if (action === 'translate') {
        const lang = String(body.language || 'English');
        messages = [
          { role: 'system', content: 'You translate documents and output valid JSON only.' },
          { role: 'user', content: `Translate the following document into ${lang}. Preserve Markdown structure (headings, lists, tables). Return ONLY JSON {"markdown": "..."}.\n\n${text}` },
        ];
      } else if (action === 'summarize') {
        messages = [
          { role: 'system', content: 'You summarize documents and output valid JSON only.' },
          { role: 'user', content: `Summarize the following document. Return ONLY JSON {"summary":"3-6 sentence summary","key_points":["..."]}. Use the document's main language.\n\n${text}` },
        ];
      } else {
        return json({ error: 'Unknown enhance action.' }, 400);
      }

      let result: Record<string, unknown>;
      try { result = await chat(messages, 4096); }
      catch { return json({ error: 'Processing failed. Please try again.' }, 502); }
      return json({ action, result });
    }

    return json({ error: 'Unknown mode.' }, 400);
  } catch (error) {
    console.error('[ai-ocr]', error);
    return json({ error: 'Internal server error.' }, 500);
  }
});
