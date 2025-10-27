/**
 * SERA Mobile - Bulk Upload Translations to Supabase
 * 
 * This script uploads all i18n translations from i18n.js to Supabase database.
 * 
 * Usage:
 *   node scripts/upload-translations-to-supabase.js
 * 
 * Prerequisites:
 *   - Run supabase-fix-rls-policy.sql in Supabase SQL Editor
 *   - Ensure @supabase/supabase-js is installed
 */

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://yxlfdigmbgxhfeudnbua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bGZkaWdtYmd4aGZldWRuYnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDI1NjIsImV4cCI6MjA3NzExODU2Mn0.xjQlsbHTk4S03-Tqvfl8sFu0aQXeZl5PNdoTeJo7XWM';

const supabase = createClient(supabaseUrl, supabaseKey);

const BATCH_SIZE = 50; // Upload in batches for better performance

/**
 * Extract staticResources from i18n.js
 */
function loadStaticResources() {
    const i18nPath = path.join(__dirname, '../src/localization/i18n.js');

    if (!fs.existsSync(i18nPath)) {
        throw new Error(`i18n.js not found at: ${i18nPath}`);
    }

    const i18nContent = fs.readFileSync(i18nPath, 'utf8');

    // Find the start of staticResources
    const startMatch = i18nContent.match(/const\s+staticResources\s*=\s*\{/);
    if (!startMatch) {
        throw new Error('Could not find "const staticResources = {" in i18n.js');
    }

    const startIndex = startMatch.index + startMatch[0].length - 1; // Keep the opening brace

    // Find the matching closing brace
    let braceCount = 0;
    let endIndex = -1;

    for (let i = startIndex; i < i18nContent.length; i++) {
        if (i18nContent[i] === '{') braceCount++;
        if (i18nContent[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }

    if (endIndex === -1) {
        throw new Error('Could not find matching closing brace for staticResources');
    }

    const objectString = i18nContent.substring(startIndex, endIndex);

    try {
        // Parse the object (safe as it's from our own codebase)
        const staticResources = eval(`(${objectString})`);

        // Validate structure
        if (!staticResources.en || !staticResources.ar) {
            throw new Error('staticResources must have "en" and "ar" keys');
        }

        if (!staticResources.en.translation || !staticResources.ar.translation) {
            throw new Error('Each language must have a "translation" key');
        }

        console.log('✅ Loaded staticResources from i18n.js');
        return staticResources;
    } catch (parseError) {
        throw new Error(`Failed to parse staticResources: ${parseError.message}`);
    }
}

/**
 * Flatten nested object into dot-notation
 * Handles both objects and arrays
 */
function flattenObject(obj, prefix = '') {
    const flattened = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Recursively flatten nested objects
            Object.assign(flattened, flattenObject(value, newKey));
        } else {
            // Store primitive values and arrays as-is
            flattened[newKey] = value;
        }
    });

    return flattened;
}

/**
 * Get category from key (first segment)
 */
function getCategoryFromKey(key) {
    const parts = key.split('.');
    return parts[0] || 'general';
}

/**
 * Main upload function
 */
async function uploadTranslations() {
    console.log('\n═══════════════════════════════════════');
    console.log('  SERA Mobile - Supabase i18n Uploader');
    console.log('═══════════════════════════════════════\n');

    // Test Supabase connection
    console.log('🔍 Testing Supabase connection...');
    try {
        const { error } = await supabase.from('translations').select('id').limit(1);
        if (error) throw error;
        console.log('✅ Connection successful!\n');
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        console.error('Please check your SUPABASE_URL and SUPABASE_KEY\n');
        process.exit(1);
    }

    try {
        console.log('📂 Loading translations from i18n.js...');
        const staticResources = loadStaticResources();

        let totalUploaded = 0;
        let totalFailed = 0;

        // Process each language
        for (const lang of ['en', 'ar']) {
            console.log(`\n📝 Processing ${lang} translations...`);

            // Flatten the translation object
            const flatTranslations = flattenObject(staticResources[lang].translation);

            // Convert to array of translation entries
            const translationEntries = Object.entries(flatTranslations).map(([key, value]) => ({
                key,
                language: lang,
                value: JSON.stringify(value), // Store as JSON string
                category: getCategoryFromKey(key),
                updated_at: new Date().toISOString(),
            }));

            if (translationEntries.length === 0) {
                console.log(`   ⚠️  No translation keys found for ${lang}`);
                continue;
            }

            console.log(`   Found ${translationEntries.length} translation keys`);

            // Upload in batches
            for (let i = 0; i < translationEntries.length; i += BATCH_SIZE) {
                const batch = translationEntries.slice(i, i + BATCH_SIZE);
                const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

                try {
                    const { error } = await supabase
                        .from('translations')
                        .upsert(batch, { onConflict: ['key', 'language'] });

                    if (error) {
                        console.error(`   ❌ Error uploading batch ${batchNumber}:`, error.message);
                        totalFailed += batch.length;
                    } else {
                        console.log(`   ✅ Uploaded batch ${batchNumber} (${batch.length} keys)`);
                        totalUploaded += batch.length;
                    }
                } catch (batchError) {
                    console.error(`   ❌ Unexpected error in batch ${batchNumber}:`, batchError.message);
                    totalFailed += batch.length;
                }
            }

            console.log(`   ✅ Completed ${lang}`);
        }

        console.log('\n═══════════════════════════════════════');
        console.log('📊 Upload Summary:');
        console.log(`   ✅ Successfully uploaded: ${totalUploaded}`);
        console.log(`   ❌ Failed: ${totalFailed}`);
        console.log('═══════════════════════════════════════\n');

        // Verify upload
        console.log('🔍 Verifying upload...');
        const { data: countData, error: countError } = await supabase
            .from('translations')
            .select('language');

        if (countError) {
            console.error('❌ Verification failed:', countError.message);
        } else if (countData) {
            const counts = countData.reduce((acc, item) => {
                acc[item.language] = (acc[item.language] || 0) + 1;
                return acc;
            }, {});

            console.log('📊 Translations in database:');
            Object.entries(counts).forEach(([lang, count]) => {
                console.log(`   ${lang}: ${count} keys`);
            });
            console.log(''); // Empty line
        }

        console.log('🎉 Translation upload completed successfully!');
        console.log('📱 Your app will now load these translations on next launch.');
        console.log('🔄 To test: Clear app cache in Settings or restart the app.\n');

    } catch (error) {
        console.error('❌ Fatal error during upload:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the upload
uploadTranslations();
