import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { pdfData } = await req.json();

        if (!pdfData) {
            return new Response(JSON.stringify({ error: "No PDF data provided" }), { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
            Analyze this bank statement PDF (provided as base64).
            Extract all transactions and categorize them as 'income' or 'expense'.
            
            Return a JSON array of objects:
            [
                {
                    "date": "YYYY-MM-DD",
                    "description": "Transaction description",
                    "amount": 1000.50,
                    "type": "income" | "expense",
                    "category": "Rent, Salary, Business, Personal, etc.",
                    "isTaxableOrDeductible": true | false
                }
            ]
            Return ONLY the raw JSON array.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: pdfData.split(",")[1],
                    mimeType: "application/pdf",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        
        if (!jsonMatch) {
            return new Response(JSON.stringify({ error: "Failed to parse bank statement" }), { status: 500 });
        }

        return new Response(jsonMatch[0], { status: 200 });
    } catch (error) {
        console.error("Statement Scan Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
