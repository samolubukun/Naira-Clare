import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { income, expenses } = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `You are a financial auditor AI. Analyze this data for anomalies and inconsistencies.

Income entries: ${JSON.stringify(income.slice(0, 30))}
Expense entries: ${JSON.stringify(expenses.slice(0, 30))}

Look for:
1. Duplicate entries (same amount, date, description)
2. Unusual spikes (amounts much larger than average)
3. Missing months (gaps in regular income)
4. Suspicious patterns (round numbers, repeated exact amounts)
5. Date inconsistencies

Respond as valid JSON:
{
  "findings": [
    {"title": "string", "description": "string", "severity": "critical|warning|info|clean"}
  ],
  "overallRisk": "low|medium|high"
}

If data is clean, include a "clean" finding saying everything looks good. Maximum 5 findings.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { findings: [{ title: "No data", description: "No entries to analyze.", severity: "info" }] };
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ findings: [{ title: "Analysis unavailable", description: "Could not run anomaly detection.", severity: "info" }] });
    }
}
