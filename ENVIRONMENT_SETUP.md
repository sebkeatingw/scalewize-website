# Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to Get Your Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "service_role" key (NOT the anon key)
4. Add it to your `.env.local` file

## Security Note

The service role key has admin privileges and should NEVER be exposed to the client. It's only used in server-side API routes to bypass RLS policies during signup.

## Testing the Setup

1. Add the environment variables
2. Restart your development server
3. Try the signup flow again
4. Check the console for any errors

## Alternative: Fix RLS Policies

If you prefer not to use the service role key, you can run the SQL script in `scripts/fix-signup-rls.sql` to update your RLS policies to be more permissive during signup.
