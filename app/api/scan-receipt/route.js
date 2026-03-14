import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { image } = await req.json();

        if (!image) {
            return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
            Analyze this receipt for a Nigerian business or individual.
            Extract the following information in JSON format:
            {
                "description": "Short summary of the expense",
                "category": "One of: Rent, NHIS, Pension, Life Insurance, Loan Interest, Business, Other",
                "amount": "Numeric amount in NGN",
                "date": "YYYY-MM-DD",
                "isDeductible": "Boolean (In Nigeria, business expenses and specific personal reliefs like NHIS/Pension are deductible)",
                "confidence": "Scale 0-1"
            }
            Return ONLY the raw JSON.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: image.split(",")[1],
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch (error) {
        console.error("AI Scan Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
