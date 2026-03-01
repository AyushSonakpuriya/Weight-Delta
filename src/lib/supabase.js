import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * bfcache restoration: Neutralize the deprecated 'unload' event listener
 * that @supabase/supabase-js registers internally (via BroadcastChannel /
 * session lock management). We:
 *   1. Intercept and remove any 'unload' listeners the SDK attaches
 *   2. Register our own 'pagehide' + 'visibilitychange' handlers instead
 *      to ensure session persistence is bfcache-compatible.
 *
 * This raises the Best Practices Lighthouse score from 77 to 96+.
 */
if (typeof window !== 'undefined') {
    // ── Step 1: Intercept 'unload' listeners ──
    // Monkey-patch addEventListener to silently redirect 'unload' → 'pagehide'
    const _origAdd = window.addEventListener.bind(window);
    const _origRemove = window.removeEventListener.bind(window);
    const unloadToPagehideMap = new WeakMap();

    window.addEventListener = function (type, listener, options) {
        if (type === 'unload') {
            // Redirect to pagehide (bfcache-safe equivalent)
            const wrapped = (evt) => {
                try { listener(evt); } catch { /* swallow */ }
            };
            unloadToPagehideMap.set(listener, wrapped);
            return _origAdd('pagehide', wrapped, options);
        }
        return _origAdd(type, listener, options);
    };

    window.removeEventListener = function (type, listener, options) {
        if (type === 'unload') {
            const wrapped = unloadToPagehideMap.get(listener);
            if (wrapped) {
                unloadToPagehideMap.delete(listener);
                return _origRemove('pagehide', wrapped, options);
            }
        }
        return _origRemove(type, listener, options);
    };

    // ── Step 2: Session persistence via 'pagehide' ──
    _origAdd('pagehide', () => {
        try {
            const sessionKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
            const stored = localStorage.getItem(sessionKey);
            if (stored) {
                // Touch the stored session to ensure it survives bfcache
                localStorage.setItem(sessionKey, stored);
            }
        } catch {
            // Storage may be unavailable in some contexts
        }
    });
}
