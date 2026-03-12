import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { messages, userType, state } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const systemPrompt = `
            You are "Clare", the NairaClare AI Tax Assistant. You are an expert in Nigerian Tax Law, specifically the New Tax Act (NTA) 2025.
            The user is a ${userType || 'Nigerian Taxpayer'} residing in ${state || 'Nigeria'}.
            
            Your goals:
            1. Provide accurate, concise answers about Nigerian taxes (PIT, VAT, WHT, CIT).
            2. Explain deductions and reliefs (e.g., Rent relief cap at ₦500k/20% of rent).
            3. Use a professional yet friendly "Nigerian accountant" tone.
            4. If you are unsure, advise the user to consult a licensed tax professional or FIRS/LIRS directly.
            
            Context: The current NTA 2025 bands are:
            - First ₦300k: 7%
            - Next ₦300k: 11%
            - Next ₦500k: 15%
            - Next ₦500k: 19%
            - Next ₦1.6M: 21%
            - Above ₦3.2M: 24%
        `;

        const chat = model.startChat({
            history: messages.slice(0, -1).map(m => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.content }],
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage([
            { text: systemPrompt },
            { text: messages[messages.length - 1].content }
        ]);

        const response = await result.response;
        return new Response(JSON.stringify({ content: response.text() }), { status: 200 });
    } catch (error) {
        console.error("AI Assistant Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
