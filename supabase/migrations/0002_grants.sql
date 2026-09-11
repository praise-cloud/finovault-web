-- Grants for the Supabase API roles against local REST/PostgREST access.
-- 0001_init.sql creates tables but local Supabase does NOT auto-expose them;
-- without these, PostgREST returns 42501 "permission denied" for every query.
-- The BFF authenticates exclusively with the service_role key (no RLS in this schema).
-- ponytail: anon/authenticated not granted DML — nothing in the app uses those keys and this
-- schema has no RLS; add GRANTs if a future client talks to PostgREST directly.

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Future-proofing: ensure service_role gets access to objects created by later migrations.
-- Without this, a new CREATE TABLE only grants access to the migration owner, not service_role.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;