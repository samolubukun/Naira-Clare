
import fs from 'fs';
import path from 'path';

// Manual env loader for testing
function loadEnv() {
    try {
        const envContent = fs.readFileSync('.env.local', 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...values] = trimmed.split('=');
                if (key === 'GEMINI_API_KEY') {
                    process.env.GEMINI_API_KEY = values.join('=').trim();
                }
            }
        }
    } catch (e) {
        console.error("Failed to load .env.local:", e.message);
    }
}

loadEnv();

import { geminiKeyManager } from './lib/gemini-keys.js';

function maskKey(key) {
    if (!key) return "NOT FOUND";
    return key.substring(0, 10) + "..." + key.substring(key.length - 4);
}

const keys = geminiKeyManager.getKeys();
console.log("--- Total Keys Detected ---");
console.log(`Count: ${keys.length}`);
keys.forEach((k, i) => console.log(`Key ${i + 1}: ${maskKey(k)}`));

console.log("\n--- Feature Assignment Test ---");

console.log("Skin Analysis (Call 1):", maskKey(geminiKeyManager.getSkinAnalysisKey()));
console.log("Skin Analysis (Call 2):", maskKey(geminiKeyManager.getSkinAnalysisKey()));
console.log("Product Usage Guide:  ", maskKey(geminiKeyManager.getProductUsageKey()));

const chatKeys = geminiKeyManager.getChatKeys();
console.log("Chat Keys (Priority): ", maskKey(chatKeys[0]));
console.log("Chat Keys (Fallback): ", maskKey(chatKeys[1]));
