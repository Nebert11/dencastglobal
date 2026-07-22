import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function getCorsHeaders(req: Request) {
  const requestedHeaders =
    req.headers.get('Access-Control-Request-Headers') ||
    'authorization, x-client-info, apikey, content-type, x-application-name';

  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': requestedHeaders,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

type NotifyPayload = {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  service_interest?: string | null;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL');
    const contactNotifyEmail = Deno.env.get('CONTACT_NOTIFY_EMAIL');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    if (!resendApiKey || !resendFromEmail || !contactNotifyEmail) {
      throw new Error('Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or CONTACT_NOTIFY_EMAIL');
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization') ?? '',
        },
      },
    });

    const payload = (await req.json()) as NotifyPayload;

    if (!payload?.name || !payload?.email || !payload?.message) {
      return new Response(
        JSON.stringify({ success: false, error: 'name, email, and message are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const senderName = payload.name.trim();
    const senderEmail = payload.email.trim();
    const subject = payload.subject?.trim() || 'New Contact Form Message';

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; line-height: 1.5;">
        <h2 style="margin: 0 0 10px 0;">New Contact Form Message</h2>
        <p style="margin: 0 0 12px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p style="margin: 0;"><strong>Name:</strong> ${escapeHtml(senderName)}</p>
        <p style="margin: 4px 0 0 0;"><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>
        ${payload.phone ? `<p style="margin: 4px 0 0 0;"><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ''}
        ${
          payload.service_interest
            ? `<p style="margin: 4px 0 0 0;"><strong>Service Interest:</strong> ${escapeHtml(payload.service_interest)}</p>`
            : ''
        }
        ${payload.id ? `<p style="margin: 4px 0 0 0;"><strong>Message ID:</strong> ${escapeHtml(payload.id)}</p>` : ''}

        <div style="margin-top: 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
          ${escapeHtml(payload.message)}
        </div>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [contactNotifyEmail],
        reply_to: senderEmail,
        subject: `[Contact] ${subject}`,
        html,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: resendData?.message || 'Email provider rejected request' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Optional lightweight trace: write a log entry in function invocation metadata by touching auth endpoint.
    await client.auth.getSession();

    return new Response(JSON.stringify({ success: true, providerMessageId: resendData?.id ?? null }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unexpected error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
