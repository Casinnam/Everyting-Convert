const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders,
  });
}

function cleanText(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanMessage(value) {
  return String(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().slice(0, 5000);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function buildEmailHtml(message) {
  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return `
    <h2>New Everything Convert contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
    <p><strong>Reply email:</strong> ${escapeHtml(message.email)}</p>
    <p><strong>Topic:</strong> ${escapeHtml(message.topic)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>
    <p><strong>Page:</strong> ${escapeHtml(message.page)}</p>
    <hr>
    <p style="white-space:pre-wrap;">${escapeHtml(message.message)}</p>
  `;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestPost(context) {
  const env = context.env || {};
  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: 'Contact email service is not configured.' }, 500);
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch (error) {
    return jsonResponse({ error: 'Please send a valid contact form.' }, 400);
  }

  const message = {
    name: cleanText(payload.name, 120),
    email: cleanText(payload.email, 180).toLowerCase(),
    topic: cleanText(payload.topic, 80) || 'General question',
    subject: cleanText(payload.subject, 180),
    message: cleanMessage(payload.message),
    page: cleanText(payload.page, 500),
  };

  if (!message.name || !isValidEmail(message.email) || !message.subject || !message.message) {
    return jsonResponse({ error: 'Please fill in your name, email, subject, and message.' }, 400);
  }

  const toEmail = env.CONTACT_TO_EMAIL || 'everythingconvert@gmail.com';
  const fromEmail = env.CONTACT_FROM_EMAIL || 'Everything Convert <onboarding@resend.dev>';
  const subject = `[Everything Convert] ${message.subject}`;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: message.email,
      subject,
      text: [
        'New Everything Convert contact message',
        '',
        `Name: ${message.name}`,
        `Reply email: ${message.email}`,
        `Topic: ${message.topic}`,
        `Subject: ${message.subject}`,
        `Page: ${message.page}`,
        '',
        message.message,
      ].join('\n'),
      html: buildEmailHtml(message),
    }),
  });

  if (!resendResponse.ok) {
    let detail = 'Email provider rejected the request.';
    try {
      const errorBody = await resendResponse.json();
      detail = errorBody.message || errorBody.error || detail;
    } catch (error) {
      // Keep the generic provider message.
    }
    return jsonResponse({ error: detail }, 502);
  }

  return jsonResponse({ ok: true });
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
