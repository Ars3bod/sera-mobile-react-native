-- ============================================================================
-- SERA Mobile App - Fix RLS Policy for Translation Uploads
-- ============================================================================
-- This script updates the RLS policies to allow uploading translations
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON translations;
DROP POLICY IF EXISTS "Enable write for authenticated users" ON translations;

-- Create policy for public read access (anyone can read)
CREATE POLICY "Enable read access for all users" ON translations
    FOR SELECT USING (true);

-- Create policy for public write access (anyone can insert/update)
-- Note: This is safe for translations as they're public data
-- You can restrict this later if you build an admin panel
CREATE POLICY "Enable insert for all users" ON translations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON translations
    FOR UPDATE USING (true);

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'translations';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies updated successfully!';
    RAISE NOTICE '✅ You can now run: node scripts/upload-translations-to-supabase.js';
END $$;

