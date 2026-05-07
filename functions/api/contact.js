// Cloudflare Pages Function — POST /api/contact
// Receives consultation requests from the landing page, upserts the
// contact in Brevo, and emails a notification to the sales inbox.
//
// Required env vars (set in Pages → Settings → Environment Variables):
//   BREVO_API_KEY        — API v3 key from Brevo (Account → SMTP & API)
//   BREVO_SENDER_EMAIL   — verified sender on the Brevo account
// Optional:
//   BREVO_SENDER_NAME    — display name for outgoing notification (default: Configureout)
//   BREVO_LIST_ID        — numeric list ID; new contacts are added to it
//   NOTIFICATION_EMAIL   — recipient (default: sales@configureout.com)

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const { name, businessName, email, phone, description, website, locale } = body || {};

  // Honeypot — silently accept bot submissions
  if (website) return json({ ok: true });

  const errs = [];
  if (!isStr(name, 2, 100)) errs.push('name');
  if (!isStr(businessName, 2, 200)) errs.push('businessName');
  if (!isEmail(email)) errs.push('email');
  if (!isStr(phone, 4, 30)) errs.push('phone');
  if (!isStr(description, 10, 2000)) errs.push('description');
  if (errs.length) return json({ error: 'invalid_fields', fields: errs }, 400);

  const apiKey = env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY not configured');
    return json({ error: 'server_misconfigured' }, 500);
  }

  const senderEmail = env.BREVO_SENDER_EMAIL;
  const senderName  = env.BREVO_SENDER_NAME || 'Configureout';
  const notifyTo    = env.NOTIFICATION_EMAIL || 'sales@configureout.com';
  const listId      = env.BREVO_LIST_ID ? Number(env.BREVO_LIST_ID) : null;

  if (!senderEmail) {
    console.error('BREVO_SENDER_EMAIL not configured');
    return json({ error: 'server_misconfigured' }, 500);
  }

  // 1) Upsert contact. Failures here are logged but do not block the
  //    user — the notification email is the primary signal.
  try {
    const contactBody = {
      email,
      attributes: {
        FIRSTNAME: name,
        PHONE: phone,
        BUSINESS_NAME: businessName,
        BUSINESS_DESCRIPTION: description,
        LOCALE: (locale === 'sr' ? 'sr' : 'en'),
        SOURCE: 'landing_page_consultation',
      },
      updateEnabled: true,
    };
    if (listId) contactBody.listIds = [listId];

    const cRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: brevoHeaders(apiKey),
      body: JSON.stringify(contactBody),
    });
    if (!cRes.ok && cRes.status !== 204) {
      const text = await cRes.text().catch(() => '');
      console.error('Brevo contact upsert failed', cRes.status, text);
    }
  } catch (e) {
    console.error('Brevo contact upsert exception', e);
  }

  // 2) Send notification email. This is the critical step.
  try {
    const html = renderNotification({ name, businessName, email, phone, description, locale });
    const eRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: brevoHeaders(apiKey),
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: notifyTo }],
        replyTo: { email, name },
        subject: `Consultation request — ${businessName}`,
        htmlContent: html,
      }),
    });
    if (!eRes.ok) {
      const text = await eRes.text().catch(() => '');
      console.error('Brevo email send failed', eRes.status, text);
      return json({ error: 'notification_failed' }, 502);
    }
  } catch (e) {
    console.error('Brevo email send exception', e);
    return json({ error: 'notification_failed' }, 502);
  }

  return json({ ok: true });
}

// Reject anything other than POST so the route 405s cleanly
export function onRequest({ request }) {
  return new Response('method_not_allowed', { status: 405, headers: { Allow: 'POST' } });
}

function brevoHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'api-key': apiKey,
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isStr(v, min, max) {
  return typeof v === 'string' && v.trim().length >= min && v.length <= max;
}

function isEmail(v) {
  return typeof v === 'string'
    && v.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHTML(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderNotification({ name, businessName, email, phone, description, locale }) {
  const e = escapeHTML;
  return `
    <h2 style="font-family:system-ui,sans-serif;margin:0 0 16px">New consultation request</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td style="padding:4px 0"><strong>${e(name)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Business</td><td style="padding:4px 0"><strong>${e(businessName)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td style="padding:4px 0"><a href="mailto:${e(email)}">${e(email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td style="padding:4px 0">${e(phone)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Locale</td><td style="padding:4px 0">${e(locale === 'sr' ? 'sr' : 'en')}</td></tr>
    </table>
    <h3 style="font-family:system-ui,sans-serif;margin:20px 0 6px">About the business</h3>
    <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin:0">${e(description)}</p>
  `;
}
