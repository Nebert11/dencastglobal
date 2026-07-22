# dencastglobal

## Contact Reply Emails

Admin replies are sent through a Supabase Edge Function: `send-contact-reply`.

### 1) Set required secrets

Run these in your project root after linking Supabase CLI:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set RESEND_FROM_EMAIL="Dencast Global <noreply@yourdomain.com>"
```

Notes:
- `RESEND_FROM_EMAIL` must be a verified sender/domain in Resend.
- If sender is not verified, email delivery will fail.

### 2) Deploy the function

```bash
supabase functions deploy send-contact-reply
```

### 3) Verify schema compatibility

If your DB was created before reply fields existed, run:

```sql
alter table public.contact_messages add column if not exists reply_message text;
alter table public.contact_messages add column if not exists replied_at timestamptz;
```

After this, the Admin `Send Reply` button sends a real email and updates the message status to `replied` only when delivery succeeds.

## Contact Form Inbox Notifications

New contact form submissions can also be forwarded directly to your Google Workspace inbox via `notify-contact-message`.

### 1) Set required secret

```bash
supabase secrets set CONTACT_NOTIFY_EMAIL="ngarinebert2020@gmail.com"
```

Use the same existing `RESEND_API_KEY` and `RESEND_FROM_EMAIL` secrets from the reply-email setup.

### 2) Deploy the function

```bash
supabase functions deploy notify-contact-message
```

After deployment, each successful contact form submission is stored in backend and also forwarded to `CONTACT_NOTIFY_EMAIL`.

### 3) If `supabase` is still not found after install

If Homebrew install succeeded but shell still says command not found, start a new terminal and run:

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
hash -r
supabase --version
```
