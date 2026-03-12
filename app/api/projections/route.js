import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { income, taxSummary, userData } = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `You are a Nigerian tax advisor AI. Analyze this taxpayer's income data and provide projections.

Income entries: ${JSON.stringify(income.slice(0, 20))}
Current tax summary: ${JSON.stringify(taxSummary)}
User profile: ${JSON.stringify({ name: userData?.name, onboardingType: userData?.onboardingType })}

Provide your response as valid JSON with this structure:
{
  "projectedAnnualIncome": number,
  "projectedTax": number,
  "insights": [
    {"title": "string", "description": "string", "type": "info|warning|opportunity"}
  ]
}

Include insights about:
1. Income trend (increasing/decreasing/stable)
2. Full-year income projection based on YTD data
3. Tax band warnings (if approaching a higher bracket under NTA 2025)
4. Monthly provision recommendation

Keep insights concise and practical. Maximum 4 insights.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { insights: [] };
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ insights: [{ title: "Analysis unavailable", description: "Could not generate projection. Please try again.", type: "info" }] });
    }
}
