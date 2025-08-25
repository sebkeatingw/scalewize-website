# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Supabase Configuration
```bash
# Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Supabase anon key (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase service role key (private, server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### n8n Email Webhook Configuration
```bash
# n8n webhook URL for email sending (recommended)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-email

# For production, use your actual n8n URL:
# N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/send-email
```

### Alternative Email Services (Optional)
```bash
# Resend.com API key (alternative to n8n)
RESEND_API_KEY=re_your_api_key_here

# Custom SMTP configuration (fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_SECURE=false
```

## Getting Your Supabase Keys

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the following values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key**: `SUPABASE_SERVICE_ROLE_KEY`

## Getting Your n8n Webhook URL

1. Set up n8n (see `N8N_EMAIL_SETUP.md` for detailed instructions)
2. Create a webhook trigger in your email workflow
3. Copy the webhook URL from the trigger node
4. Add it to your `.env.local` file

## Security Notes

- **Never commit** `.env.local` to version control
- **Service role key** should only be used server-side
- **Public keys** are safe to expose in client-side code
- **Webhook URLs** should use HTTPS in production

## Testing Your Configuration

After setting up your environment variables:

1. **Restart your development server**
2. **Test the admin dashboard** invitation system
3. **Check browser console** for any configuration errors
4. **Verify email sending** works with your chosen method

## Troubleshooting

### Common Issues

**"Environment variable not found"**
- ✅ Ensure `.env.local` is in project root
- ✅ Restart development server after changes
- ✅ Check variable names match exactly

**"n8n webhook not configured"**
- ✅ Verify `N8N_WEBHOOK_URL` is set
- ✅ Check n8n is running and accessible
- ✅ Test webhook URL in browser

**"Supabase connection failed"**
- ✅ Verify Supabase keys are correct
- ✅ Check Supabase project is active
- ✅ Ensure network connectivity

For detailed email setup instructions, see:
- `N8N_EMAIL_SETUP.md` - n8n workflow setup
- `EMAIL_SETUP_GUIDE.md` - Traditional SMTP setup
