// Supabase i18n Service for SERA Mobile App
// Manages dynamic translation loading from Supabase with caching and fallback

// IMPORTANT: This polyfill must be imported FIRST before any Supabase imports
// It provides URL API support for React Native's Hermes engine
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client with SERA project credentials
const supabaseUrl = 'https://yxlfdigmbgxhfeudnbua.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bGZkaWdtYmd4aGZldWRuYnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDI1NjIsImV4cCI6MjA3NzExODU2Mn0.xjQlsbHTk4S03-Tqvfl8sFu0aQXeZl5PNdoTeJo7XWM';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false, // No auth needed for public translations
    },
    global: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
});

class SupabaseI18nService {
    constructor() {
        this.cacheKey = '@sera_supabase_i18n_cache';
        // Cache duration: 5 minutes in development, 24 hours in production
        // You can set __DEV__ to false in production builds
        this.cacheDuration = __DEV__
            ? 5 * 60 * 1000  // 5 minutes for development
            : 24 * 60 * 60 * 1000; // 24 hours for production
        this.isInitialized = false;
    }

    /**
     * Load translations from Supabase for a specific language
     * @param {string} language - Language code ('ar' or 'en')
     * @returns {Promise<object|null>} Nested translations object or null
     */
    async loadFromSupabase(language = 'ar') {
        try {
            console.log(`📡 Loading ${language} translations from Supabase...`);

            const { data, error } = await supabase
                .from('translations')
                .select('key, value, category')
                .eq('language', language);

            if (error) {
                console.error('❌ Supabase query error:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                console.log('⚠️ No translations found in Supabase for', language);
                return null;
            }

            console.log(`✅ Loaded ${data.length} translation keys from Supabase`);

            // Convert flat structure (key: "common.cancel") to nested object
            const translations = {};
            data.forEach(item => {
                try {
                    const keys = item.key.split('.');
                    let current = translations;

                    // Navigate/create nested structure
                    for (let i = 0; i < keys.length - 1; i++) {
                        if (!current[keys[i]]) {
                            current[keys[i]] = {};
                        }
                        current = current[keys[i]];
                    }

                    // Set the final value (parse JSON string)
                    const lastKey = keys[keys.length - 1];
                    try {
                        current[lastKey] = JSON.parse(item.value);
                    } catch (parseError) {
                        // If JSON parse fails, use raw value
                        current[lastKey] = item.value;
                    }
                } catch (keyError) {
                    console.error('Error processing translation key:', item.key, keyError);
                }
            });

            console.log(
                '✅ Supabase translations structured:',
                Object.keys(translations),
            );
            return translations;
        } catch (error) {
            console.error('❌ Error loading from Supabase:', error);
            return null;
        }
    }

    /**
     * Load translations from local cache
     * @param {string} language - Language code
     * @returns {Promise<object|null>} Cached translations or null
     */
    async loadFromCache(language) {
        try {
            const cacheKey = `${this.cacheKey}_${language}`;
            const cached = await AsyncStorage.getItem(cacheKey);

            if (cached) {
                const { data, timestamp } = JSON.parse(cached);

                // Check if cache is still valid
                const cacheAge = Date.now() - timestamp;
                const cacheAgeMinutes = Math.floor(cacheAge / (60 * 1000));

                if (cacheAge < this.cacheDuration) {
                    console.log(`💾 Using cached translations for ${language} (cached ${cacheAgeMinutes} min ago)`);
                    return data;
                } else {
                    console.log(`⏰ Cache expired for ${language} (cached ${cacheAgeMinutes} min ago, max: ${Math.floor(this.cacheDuration / (60 * 1000))} min)`);
                    // Clean expired cache
                    await AsyncStorage.removeItem(cacheKey);
                }
            } else {
                console.log(`📭 No cache found for ${language}`);
            }
        } catch (error) {
            console.error('❌ Error loading from cache:', error);
        }
        return null;
    }

    /**
     * Save translations to local cache
     * @param {string} language - Language code
     * @param {object} translations - Translations object to cache
     */
    async saveToCache(language, translations) {
        try {
            const cacheKey = `${this.cacheKey}_${language}`;
            const cacheData = {
                data: translations,
                timestamp: Date.now(),
            };

            await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log('💾 Translations cached for', language);
        } catch (error) {
            console.error('❌ Error saving to cache:', error);
        }
    }

    /**
     * Deep merge two translation objects (dynamic overwrites static)
     * @param {object} staticTranslations - Static fallback translations
     * @param {object} dynamicTranslations - Dynamic Supabase translations
     * @returns {object} Merged translations
     */
    mergeTranslations(staticTranslations, dynamicTranslations) {
        if (!dynamicTranslations) return staticTranslations;

        const merged = JSON.parse(JSON.stringify(staticTranslations)); // Deep clone

        Object.keys(dynamicTranslations).forEach(key => {
            if (
                typeof dynamicTranslations[key] === 'object' &&
                dynamicTranslations[key] !== null &&
                !Array.isArray(dynamicTranslations[key])
            ) {
                // Recursively merge nested objects
                merged[key] = this.mergeTranslations(
                    merged[key] || {},
                    dynamicTranslations[key],
                );
            } else {
                // Overwrite with dynamic value
                merged[key] = dynamicTranslations[key];
            }
        });

        return merged;
    }

    /**
     * Main function to load translations with cache and fallback strategy
     * Strategy: Cache → Supabase → Static Fallback
     * @param {object} staticResources - Static translations object
     * @returns {Promise<object>} Final resources for i18next
     */
    async loadTranslations(staticResources) {
        const languages = ['ar', 'en'];
        const finalResources = {};

        console.log('🌐 Initializing Supabase i18n service...');

        for (const lang of languages) {
            try {
                // Step 1: Try loading from cache first (fastest)
                let cachedTranslations = await this.loadFromCache(lang);
                if (cachedTranslations) {
                    finalResources[lang] = { translation: cachedTranslations };
                    continue; // Skip Supabase call if cache is valid
                }

                // Step 2: Try loading from Supabase (online)
                const supabaseTranslations = await this.loadFromSupabase(lang);
                if (supabaseTranslations) {
                    // Cache the Supabase translations
                    await this.saveToCache(lang, supabaseTranslations);

                    // Merge with static (Supabase values overwrite static)
                    const mergedTranslations = this.mergeTranslations(
                        staticResources[lang].translation,
                        supabaseTranslations,
                    );

                    finalResources[lang] = { translation: mergedTranslations };
                    console.log(`✅ ${lang} translations loaded from Supabase`);
                } else {
                    // Step 3: Fallback to static translations
                    console.log(
                        `⚠️ Using static fallback for ${lang} (Supabase unavailable)`,
                    );
                    finalResources[lang] = staticResources[lang];
                }
            } catch (error) {
                console.error(`❌ Error loading ${lang} translations:`, error);
                // Always fallback to static on any error
                finalResources[lang] = staticResources[lang];
            }
        }

        this.isInitialized = true;
        console.log('✅ Supabase i18n service initialized');
        return finalResources;
    }

    /**
     * Force refresh translations from Supabase
     * Clears cache and reloads from server
     * @param {string} language - Language to refresh
     * @returns {Promise<object|null>} Fresh translations
     */
    async refreshTranslations(language) {
        try {
            console.log(`🔄 Force refreshing ${language} translations...`);

            // Clear cache
            const cacheKey = `${this.cacheKey}_${language}`;
            await AsyncStorage.removeItem(cacheKey);

            // Load fresh from Supabase
            const freshTranslations = await this.loadFromSupabase(language);
            if (freshTranslations) {
                await this.saveToCache(language, freshTranslations);
                console.log(`✅ ${language} translations refreshed`);
                return freshTranslations;
            }
            return null;
        } catch (error) {
            console.error('❌ Error refreshing translations:', error);
            return null;
        }
    }

    /**
     * Clear all cached translations
     * Useful for troubleshooting or forced updates
     */
    async clearCache() {
        try {
            const languages = ['ar', 'en'];
            for (const lang of languages) {
                await AsyncStorage.removeItem(`${this.cacheKey}_${lang}`);
            }
            console.log('🗑️ All translation caches cleared');
        } catch (error) {
            console.error('❌ Error clearing cache:', error);
        }
    }

    /**
     * Force refresh translations from Supabase
     * Clears cache and reloads fresh data
     * @returns {Promise<object>} Fresh translations for both languages
     */
    async forceRefresh() {
        console.log('🔄 Force refreshing translations from Supabase...');
        await this.clearCache();

        // Reload translations for both languages
        const staticFallback = {
            ar: { translation: {} },
            en: { translation: {} }
        };

        const freshTranslations = await this.loadTranslations(staticFallback);

        console.log('✅ Force refresh completed');
        return freshTranslations;
    }

    /**
     * Update a single translation in Supabase (for admin use)
     * @param {string} key - Translation key (e.g., 'common.cancel')
     * @param {string} language - Language code
     * @param {any} value - Translation value
     * @param {string} category - Optional category
     * @returns {Promise<object>} Updated data
     */
    async updateTranslation(key, language, value, category = null) {
        try {
            const { data, error } = await supabase
                .from('translations')
                .upsert(
                    {
                        key,
                        language,
                        value: JSON.stringify(value),
                        category,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'key,language' },
                )
                .select();

            if (error) throw error;

            console.log(`✅ Translation updated: ${key} (${language})`);

            // Invalidate cache for this language
            await AsyncStorage.removeItem(`${this.cacheKey}_${language}`);

            return data;
        } catch (error) {
            console.error('❌ Error updating translation:', error);
            throw error;
        }
    }

    /**
     * Bulk update multiple translations
     * @param {Array} translations - Array of {key, language, value, category}
     * @returns {Promise<Array>} Results
     */
    async bulkUpdateTranslations(translations) {
        try {
            console.log(`📦 Bulk updating ${translations.length} translations...`);

            const promises = translations.map(t =>
                this.updateTranslation(t.key, t.language, t.value, t.category),
            );

            const results = await Promise.allSettled(promises);

            const succeeded = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            console.log(
                `✅ Bulk update complete: ${succeeded} succeeded, ${failed} failed`,
            );

            return results;
        } catch (error) {
            console.error('❌ Error in bulk update:', error);
            throw error;
        }
    }

    /**
     * Test Supabase connection
     * @returns {Promise<boolean>} Connection status
     */
    async testConnection() {
        try {
            console.log('🔍 Testing Supabase connection...');

            const { data, error } = await supabase
                .from('translations')
                .select('count')
                .limit(1);

            if (error) {
                console.error('❌ Connection test failed:', error);
                return false;
            }

            console.log('✅ Supabase connection successful');
            return true;
        } catch (error) {
            console.error('❌ Connection test error:', error);
            return false;
        }
    }
}

export default new SupabaseI18nService();

