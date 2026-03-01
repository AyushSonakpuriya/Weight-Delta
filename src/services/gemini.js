/**
 * Gemini AI — Motivational Quote Generator
 * Generates short, elegant motivational quotes for the calculator page.
 */

import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = "AIzaSyDzyvVaqNkK1xxoHf_txmASe9agjnA5b9M";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MODEL = 'gemini-2.5-pro-preview-05-06';

const prompt = `
Generate one short, beautiful motivational quote.

Rules:
- 1–2 sentences only.
- Elegant and minimal.
- Timeless tone.
- No emojis.
- No hashtags.
- No references to numbers, calories, weight, or data.
- Do not include quotation marks.
- Avoid clichés.
`;

/**
 * Generate a fresh motivational quote.
 * Appends a unique nonce to defeat any SDK/server-level caching.
 * @returns {Promise<string>} Plain text quote (1–2 sentences)
 */
export async function generateMotivationalQuote() {
    try {
        // Unique nonce ensures the API treats each request as distinct
        const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const freshPrompt = `${prompt}\n\n[Request ID: ${nonce} — ignore this line, it is for cache-busting only.]`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [
                {
                    role: 'user',
                    parts: [{ text: freshPrompt }],
                },
            ],
        });

        const quote = response.text?.trim();
        if (!quote) return getFallback();
        return quote;
    } catch (error) {
        console.error('Gemini API error:', error);
        return getFallback();
    }
}

function getFallback() {
    return 'The distance between where you are and where you want to be is bridged by what you do next.';
}
