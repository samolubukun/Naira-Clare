import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { userData, income, expenses } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
            Act as a Senior Nigerian Tax Auditor. 
            Analyze the following taxpayer data for NTA 2025 compliance and optimization:
            
            User Profile: ${JSON.stringify(userData)}
            Recent Income: ${JSON.stringify(income.slice(0, 20))}
            Recent Expenses: ${JSON.stringify(expenses.slice(0, 20))}
            
            Identify:
            1. Anomalies (e.g., missing WHT credits on freelance invoices, suspiciously high/low categories).
            2. Missing Deductions (e.g., if they pay rent but haven't logged it as a 'Rent' category for the 20% relief).
            3. Future Risks (e.g., nearing a higher tax band).
            
            Return a JSON object:
            {
                "insights": [
                    { "type": "opportunity" | "risk" | "info", "title": "string", "description": "string" }
                ],
                "confidenceScore": 0.95
            }
            Return ONLY raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch (error) {
        console.error("Audit Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
