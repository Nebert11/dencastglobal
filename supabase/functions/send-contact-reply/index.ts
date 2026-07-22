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

type SendReplyPayload = {
  messageId: string;
  toEmail: string;
  toName?: string;
  subject: string;
  replyMessage: string;
  originalMessage?: string;
};

function textToHtml(text: string): string {
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
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }
    if (!resendApiKey || !resendFromEmail) {
      throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = (await req.json()) as SendReplyPayload;
    const { messageId, toEmail, toName, subject, replyMessage, originalMessage } = payload;

    if (!messageId || !toEmail || !subject || !replyMessage) {
      return new Response(
        JSON.stringify({ success: false, error: 'messageId, toEmail, subject and replyMessage are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #0f172a;">
        <p>Hi ${toName ? textToHtml(toName) : 'there'},</p>
        <p>Thank you for contacting Dencast Global. Here is our response:</p>
        <div style="margin: 16px 0; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
          ${textToHtml(replyMessage)}
        </div>
        ${
          originalMessage
            ? `<p style="font-size: 13px; color: #64748b; margin-top: 18px;"><strong>Your original message:</strong><br/>${textToHtml(
                originalMessage
              )}</p>`
            : ''
        }
        <p style="margin-top: 18px;">Regards,<br/>Dencast Global Team</p>
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
        to: [toEmail],
        subject,
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

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const now = new Date().toISOString();

    const { error: updateError } = await adminClient
      .from('contact_messages')
      .update({
        status: 'replied',
        reply_message: replyMessage,
        replied_at: now,
        updated_at: now,
      })
      .eq('id', messageId);

    if (updateError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Email sent but failed to update message status: ${updateError.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        providerMessageId: resendData?.id ?? null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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
