# Supabase Migrations

This directory contains database migrations for GreenLine AI.

## Migration Files

### 001_security_policies.sql
Initial security policies and RLS setup for the database.

### 002_admin_access_control.sql
Admin user access control policies.

### 003_add_meetings_table.sql
Adds the meetings table for tracking scheduled appointments.

### 004_add_calls_and_calendly.sql
**Latest Migration** - Adds:
- `calls` table for Stammer AI voice call tracking
- Calendly integration fields to `meetings` table
- Proper RLS policies and indexes

### 004_rollback_calls_and_calendly.sql
Rollback script for migration 004 if needed.

## Running Migrations

### Option 1: Supabase CLI (Recommended)

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref nggelyppkswqxycblvcb

# Apply all pending migrations
npx supabase db push

# Or apply a specific migration
npx supabase db execute --file supabase/migrations/004_add_calls_and_calendly.sql
```

### Option 2: Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/nggelyppkswqxycblvcb
2. Navigate to **SQL Editor**
3. Copy and paste the contents of the migration file
4. Click **Run** to execute

### Option 3: Direct SQL

```bash
# Using psql
psql "postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres" \
  -f supabase/migrations/004_add_calls_and_calendly.sql
```

## Migration 004 Details

### New Tables

#### `calls`
Tracks individual voice calls made through Stammer AI or other voice providers.

**Columns:**
- `id` - UUID primary key
- `user_id` - Reference to profiles table
- `lead_id` - Reference to leads table (nullable)
- `phone_number` - Phone number called
- `status` - Call status (pending, in_progress, completed, failed, no_answer, voicemail)
- `disposition` - Final outcome (answered, no_answer, voicemail, busy, failed)
- `duration` - Call duration in seconds
- `transcript` - AI-generated call transcript
- `recording_url` - URL to call recording
- `vapi_call_id` - External ID from Stammer/Vapi
- `started_at` - When call started
- `ended_at` - When call ended
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

**Indexes:**
- `idx_calls_user_id` - Fast user queries
- `idx_calls_lead_id` - Fast lead queries
- `idx_calls_status` - Filter by status
- `idx_calls_phone_number` - Search by phone
- `idx_calls_vapi_call_id` - External ID lookup
- `idx_calls_created_at` - Date range queries

### Updated Tables

#### `meetings`
Added Calendly integration fields:
- `calendly_event_uri` - Calendly event URI for webhook correlation
- `calendly_invitee_uri` - Calendly invitee URI for tracking bookings

## Rollback

If you need to undo migration 004:

```bash
npx supabase db execute --file supabase/migrations/004_rollback_calls_and_calendly.sql
```

## Schema Generation

After running migrations, regenerate TypeScript types:

```bash
# Generate types from remote database
npx supabase gen types typescript --project-id nggelyppkswqxycblvcb > lib/database.types.ts

# Or from local schema
npx supabase gen types typescript --local > lib/database.types.ts
```

## Verifying Migration Success

```sql
-- Check if calls table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'calls'
);

-- Check Calendly fields in meetings
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'meetings' 
AND column_name LIKE 'calendly%';

-- Verify RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename = 'calls';
```

## Best Practices

1. **Always backup** before running migrations
2. **Test migrations** on staging environment first
3. **Review generated types** after schema changes
4. **Keep migrations idempotent** using `IF NOT EXISTS`
5. **Document breaking changes** in migration comments
6. **Version control** all migration files

## Troubleshooting

### Migration Fails

```bash
# Check migration status
npx supabase migration list

# Check database logs
npx supabase logs --type database
```

### Type Errors After Migration

```bash
# Regenerate types
npx supabase gen types typescript --project-id nggelyppkswqxycblvcb > lib/database.types.ts

# Clear Next.js cache
rm -rf .next
npm run build
```

### RLS Policy Issues

```sql
-- Temporarily disable RLS (development only!)
ALTER TABLE calls DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Check active policies
SELECT * FROM pg_policies WHERE tablename = 'calls';
```

## Support

For issues, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- Project Dashboard: https://supabase.com/dashboard/project/nggelyppkswqxycblvcb
