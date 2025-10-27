-- ============================================================================
-- SERA Mobile App - Supabase i18n Database Setup
-- ============================================================================
-- This script creates the translations table and sets up initial data
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
-- ============================================================================

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id BIGSERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    language TEXT NOT NULL,
    value JSONB NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(key, language)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_key_lang ON translations(key, language);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);
CREATE INDEX IF NOT EXISTS idx_translations_updated ON translations(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can read translations)
DROP POLICY IF EXISTS "Enable read access for all users" ON translations;
CREATE POLICY "Enable read access for all users" ON translations
    FOR SELECT USING (true);

-- Optional: Create policy for authenticated write access (if you want admin panel)
-- DROP POLICY IF EXISTS "Enable write for authenticated users" ON translations;
-- CREATE POLICY "Enable write for authenticated users" ON translations
--     FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- Insert Sample Translations (Arabic - Common)
-- ============================================================================
INSERT INTO translations (key, language, value, category) VALUES
('common.cancel', 'ar', '"إلغاء"', 'common'),
('common.ok', 'ar', '"موافق"', 'common'),
('common.close', 'ar', '"إغلاق"', 'common'),
('common.exit', 'ar', '"خروج"', 'common'),
('common.error', 'ar', '"خطأ"', 'common'),
('common.save', 'ar', '"حفظ"', 'common'),
('common.submit', 'ar', '"تقديم"', 'common'),
('common.loading', 'ar', '"جاري التحميل..."', 'common'),
('common.retry', 'ar', '"إعادة المحاولة"', 'common'),
('common.success', 'ar', '"نجح"', 'common'),
('common.goBack', 'ar', '"العودة"', 'common'),
('common.notAvailable', 'ar', '"غير متوفر"', 'common'),
('common.networkError', 'ar', '"خطأ في الاتصال بالشبكة"', 'common'),
('common.yesterday', 'ar', '"أمس"', 'common'),
('common.invalidDate', 'ar', '"تاريخ غير صالح"', 'common')
ON CONFLICT (key, language) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ============================================================================
-- Insert Sample Translations (English - Common)
-- ============================================================================
INSERT INTO translations (key, language, value, category) VALUES
('common.cancel', 'en', '"Cancel"', 'common'),
('common.ok', 'en', '"OK"', 'common'),
('common.close', 'en', '"Close"', 'common'),
('common.exit', 'en', '"Exit"', 'common'),
('common.error', 'en', '"Error"', 'common'),
('common.save', 'en', '"Save"', 'common'),
('common.submit', 'en', '"Submit"', 'common'),
('common.loading', 'en', '"Loading..."', 'common'),
('common.retry', 'en', '"Retry"', 'common'),
('common.success', 'en', '"Success"', 'common'),
('common.goBack', 'en', '"Go Back"', 'common'),
('common.notAvailable', 'en', '"Not Available"', 'common'),
('common.networkError', 'en', '"Network connection error"', 'common'),
('common.yesterday', 'en', '"Yesterday"', 'common'),
('common.invalidDate', 'en', '"Invalid Date"', 'common')
ON CONFLICT (key, language) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ============================================================================
-- Insert Sample Translations (Arabic - Auth)
-- ============================================================================
INSERT INTO translations (key, language, value, category) VALUES
('auth.login', 'ar', '"تسجيل الدخول"', 'auth'),
('auth.cancel', 'ar', '"إلغاء"', 'auth'),
('auth.loginRequired', 'ar', '"مطلوب تسجيل الدخول"', 'auth'),
('auth.loginRequiredMessage', 'ar', '"تحتاج إلى تسجيل الدخول للوصول إلى هذه الميزة. يرجى تسجيل الدخول باستخدام حساب نفاذ للمتابعة."', 'auth')
ON CONFLICT (key, language) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ============================================================================
-- Insert Sample Translations (English - Auth)
-- ============================================================================
INSERT INTO translations (key, language, value, category) VALUES
('auth.login', 'en', '"Login"', 'auth'),
('auth.cancel', 'en', '"Cancel"', 'auth'),
('auth.loginRequired', 'en', '"Login Required"', 'auth'),
('auth.loginRequiredMessage', 'en', '"You need to login to access this feature. Please login with your Nafath account to continue."', 'auth')
ON CONFLICT (key, language) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ============================================================================
-- Verify Setup
-- ============================================================================
-- Check total translations count
SELECT 
    language,
    category,
    COUNT(*) as count
FROM translations
GROUP BY language, category
ORDER BY language, category;

-- Check sample translations
SELECT * FROM translations WHERE category = 'common' LIMIT 10;

-- ============================================================================
-- Helper Functions (Optional - for future use)
-- ============================================================================

-- Function to get all translations for a language
CREATE OR REPLACE FUNCTION get_translations_for_language(lang TEXT)
RETURNS TABLE(key TEXT, value JSONB, category TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT t.key, t.value, t.category
    FROM translations t
    WHERE t.language = lang
    ORDER BY t.category, t.key;
END;
$$ LANGUAGE plpgsql;

-- Function to update translation timestamp on change
CREATE OR REPLACE FUNCTION update_translation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_translations_timestamp ON translations;
CREATE TRIGGER update_translations_timestamp
    BEFORE UPDATE ON translations
    FOR EACH ROW
    EXECUTE FUNCTION update_translation_timestamp();

-- ============================================================================
-- Success Message
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ SERA Mobile i18n database setup completed successfully!';
    RAISE NOTICE '📊 Run this query to see your translations: SELECT * FROM translations;';
    RAISE NOTICE '🔄 To refresh app translations, clear cache in Settings screen';
END $$;

