// Supabase Edge Function: ai-pdf-summary
// Receives extracted PDF text and returns a compact outline summary.
//
// Required secret:
//   OPENAI_API_KEY

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function languageName(code: string): string {
  const clean = String(code || 'en').toLowerCase();
  if (clean.startsWith('ko')) return 'Korean';
  if (clean.startsWith('de')) return 'German';
  if (clean.startsWith('es')) return 'Spanish';
  if (clean.startsWith('fr')) return 'French';
  return 'English';
}

function fallbackSummary(text: string, fileName: string): Record<string, unknown> {
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 5);
  return {
    title: `${fileName || 'PDF'} summary`,
    brief: sentences.slice(0, 2).join(' ') || 'The PDF text was extracted, but a complete AI summary could not be created.',
    key_points: sentences.slice(0, 4),
    important_details: ['Verify names, dates, amounts, and account numbers in the original PDF.'],
    suggested_questions: [
      'What are the most important dates in this document?',
      'Are there any amounts or deadlines I should confirm?',
      'What action should I take after reading this PDF?',
    ],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) return json({ error: 'PDF summary service is not configured.' }, 500);

    let body: { text?: string; file_name?: string; language?: string };
    try { body = await req.json(); }
    catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const fileName = String(body.file_name || 'PDF document').slice(0, 160);
    const text = String(body.text || '').replace(/\s+/g, ' ').trim().slice(0, 16000);
    const outputLanguage = languageName(String(body.language || 'en'));

    if (text.length < 80) {
      return json({ error: 'Not enough readable text was found in this PDF. OCR may be required.' }, 400);
    }

    const model = Deno.env.get('OPENAI_SUMMARY_MODEL') || 'gpt-4o-mini';
    const prompt = `
You are summarizing a PDF for an online file utility.
Return ONLY valid JSON, with no markdown.
The response language must be ${outputLanguage}.

JSON shape:
{
  "title": "short user-friendly title",
  "brief": "3-5 sentence summary",
  "key_points": ["5-8 bullet points"],
  "important_details": ["dates, amounts, account numbers, names, addresses, deadlines, or other concrete details"],
  "suggested_questions": ["3 practical questions a user may want to ask about this document"]
}

Rules:
- Do not invent missing facts.
- If a value is unclear, say it is unclear.
- Keep each bullet concise.
- Tell the user to verify sensitive legal, financial, medical, or tax details in the original document when appropriate.

File name: ${fileName}
Extracted text:
${text}
`;

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You produce careful, concise PDF summaries as valid JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      console.error('[ai-pdf-summary] OpenAI error', aiData);
      return json({ error: 'AI summary failed. Please try again later.' }, 502);
    }

    const content = aiData?.choices?.[0]?.message?.content;
    if (!content) return json({ summary: fallbackSummary(text, fileName), warning: 'Fallback summary used.' });

    try {
      return json({ summary: JSON.parse(content) });
    } catch {
      return json({ summary: fallbackSummary(text, fileName), warning: 'Fallback summary used.' });
    }
  } catch (error) {
    console.error('[ai-pdf-summary]', error);
    return json({ error: 'Internal server error.' }, 500);
  }
});
