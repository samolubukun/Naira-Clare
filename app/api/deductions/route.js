import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { income, expenses, userData } = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `You are a Nigerian tax expert AI. Analyze this taxpayer's data to find missed deduction opportunities.

Income: ${JSON.stringify(income.slice(0, 20))}
Expenses: ${JSON.stringify(expenses.slice(0, 20))}
User: ${JSON.stringify({ name: userData?.name, onboardingType: userData?.onboardingType, salaryProfile: userData?.salaryProfile })}

Under Nigerian Tax Act 2025, key reliefs:
- Consolidated Relief Allowance (CRA): 20% of gross + ₦200,000
- Pension (8% employee contribution)
- NHIS contributions
- Life insurance premiums
- Housing loan interest
- Charitable donations (with limits)

Respond as valid JSON:
{
  "deductions": [
    {"title": "string", "description": "string", "estimatedSavings": number, "category": "string"}
  ],
  "totalPotentialSavings": number
}

Find 2-5 specific deduction opportunities based on what's MISSING from their expense data. Be practical and specific.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { deductions: [] };
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ deductions: [{ title: "Analysis unavailable", description: "Could not scan deductions.", estimatedSavings: 0, category: "General" }] });
    }
}
