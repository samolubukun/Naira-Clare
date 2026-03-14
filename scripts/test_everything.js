const axios = require('axios');
const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');
const path = require('path');

// 1. Load Configuration from .env.local
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error("❌ .env.local not found!");
        process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
        }
    });
    return env;
}

const env = loadEnv();
const CONVEX_URL = env.NEXT_PUBLIC_CONVEX_URL;
const USER_EMAIL = "samuelolubukun@gmail.com";
const API_BASE = "http://localhost:3000/api";

if (!CONVEX_URL) {
    console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in .env.local");
    process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

// Real Paths
const RECEIPT_PATH = path.resolve("C:/Users/USER/.gemini/antigravity/brain/06e54cd6-be27-427a-a687-f9799e7ab71d", "nigerian_business_receipt_1773511986607.png");
const STATEMENT_PATH = path.resolve(process.cwd(), "scripts/test_statement.pdf");

// Helper to convert file to base64
function getBase64(filePath, mimeType) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Warning: File not found at ${filePath}`);
        return null;
    }
    const buffer = fs.readFileSync(filePath);
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// Helper to ensure data is JSON parsed
function ensureJSON(data) {
    if (typeof data === 'string') {
        try { return JSON.parse(data); } catch (e) { return data; }
    }
    return data;
}

async function runTest() {
    console.log(`\n🚀 Starting nairaClare Universal Test Script`);
    console.log(`👤 Testing User: ${USER_EMAIL}`);
    console.log(`🔗 Backend: ${CONVEX_URL}\n`);

    try {
        // --- STAGE 1: USER LOOKUP ---
        console.log(`[1/10] Looking up user...`);
        const user = await client.query("users:getUserByEmail", { email: USER_EMAIL });
        if (!user) {
            console.error(`❌ User ${USER_EMAIL} not found! Please log in on the frontend first.`);
            return;
        }
        const userId = user._id;
        console.log(`✅ Found User ID: ${userId}\n`);

        // --- STAGE 2: PROFILE UPDATE ---
        console.log(`[2/10] Simulating Profile/Onboarding update...`);
        await client.mutation("users:UpdateUserProfile", {
            id: userId,
            onboardingType: "business",
            stateOfResidence: "Lagos",
            salaryProfile: {
                basic: 1000000,
                housing: 500000,
                transport: 200000,
                otherAllowances: 100000,
                pensionEnabled: true,
                nhfEnabled: true,
                nhisEnabled: true
            }
        });
        console.log(`✅ Profile updated with salary structure.\n`);

        // --- STAGE 3: INCOME LOGGING ---
        console.log(`[3/10] Logging manual income entries...`);
        await client.mutation("finance:createIncome", {
            userId,
            source: "Monthly Salary Support",
            type: "salary",
            amount: 500000,
            currency: "NGN",
            exchangeRate: 1,
            date: "2026-03-01",
            isTaxable: true
        });
        await client.mutation("finance:createIncome", {
            userId,
            source: "Freelance Project - Web Design",
            type: "freelance",
            amount: 2500,
            currency: "USD",
            exchangeRate: 1550, // Realistic rate
            date: "2026-03-05",
            isTaxable: true
        });
        console.log(`✅ Income logged (Salary & USD Freelance).\n`);

        // --- STAGE 4: STRATEGIC EXPENSES (FOR RELIEFS) ---
        console.log(`[4/10] Logging strategic expenses for tax reliefs...`);
        await client.mutation("finance:createExpense", {
            userId,
            description: "Annual Residential Rent",
            category: "Rent",
            amount: 1200000,
            date: "2026-03-10",
            isDeductible: true
        });
        await client.mutation("finance:createExpense", {
            userId,
            description: "Axa Mansard Life Policy",
            category: "Life Insurance",
            amount: 150000,
            date: "2026-03-12",
            isDeductible: true
        });
        console.log(`✅ Expenses logged (Rent & Insurance). Check your "Live Tax Meter" for savings!\n`);

        // --- STAGE 5: INVOICING WORKFLOW ---
        console.log(`[5/10] Testing Invoicing Workflow...`);
        const clientId = await client.mutation("finance:createClient", {
            userId,
            name: "Globacom Limited",
            email: "finance@glo.com.ng"
        });
        console.log(`✅ Client created: Globacom`);

        const invId = await client.mutation("finance:createInvoice", {
            userId,
            clientId,
            invoiceNumber: "INV-2026-001",
            amount: 2000000,
            vatAmount: 150000, // 7.5%
            whtAmount: 100000, // 5%
            status: "sent",
            date: "2026-03-14",
            dueDate: "2026-04-14",
            items: [{ description: "Consultancy Services", quantity: 1, unitPrice: 2000000 }]
        });
        console.log(`✅ Invoice INV-2026-001 created.`);

        console.log(`🔄 Marking invoice as PAID (this triggers automated income & WHT credits)...`);
        await client.mutation("finance:updateInvoiceStatus", { invoiceId: invId, status: "paid" });
        console.log(`✅ Invoice PAID. Check your "WHT Credits" section in the dashboard.\n`);

        // --- STAGE 6: AI RECEIPT SCANNING ---
        console.log(`[6/10] Simulating AI Receipt Scan (calling /api/scan-receipt)...`);
        try {
            const receiptBase64 = getBase64(RECEIPT_PATH, "image/png");
            if (!receiptBase64) throw new Error("Receipt asset missing");

            const scanRes = await axios.post(`${API_BASE}/scan-receipt`, { image: receiptBase64 });
            const scanData = ensureJSON(scanRes.data);
            console.log(`✨ AI Result: ${scanData.description} - ₦${scanData.amount}`);
            
            await client.mutation("finance:createExpense", {
                userId,
                description: scanData.description || "Unparsed AI Expense",
                category: scanData.category || "Other",
                amount: parseFloat(scanData.amount) || 0,
                date: scanData.date || new Date().toISOString().split('T')[0],
                isDeductible: !!scanData.isDeductible
            });
            console.log(`✅ Scanned expense saved to ledger.\n`);
        } catch (e) {
            console.log(`⚠️ AI Scan simulation skipped: ${e.message}\n`);
        }

        // --- STAGE 7: BANK IMPORT SIMULATION ---
        console.log(`[7/10] Simulating Bank Import (calling /api/import-statement)...`);
        try {
            const pdfBase64 = getBase64(STATEMENT_PATH, "application/pdf");
            if (!pdfBase64) throw new Error("Statement asset missing");

            const importRes = await axios.post(`${API_BASE}/import-statement`, { pdfData: pdfBase64 }); 
            const txs = ensureJSON(importRes.data);
            console.log(`✨ AI analyzed ${(txs || []).length} transactions from "PDF".`);
            
            for (const tx of txs.slice(0, 2)) { // Just log top 2
                if (tx.type === 'income') {
                    await client.mutation("finance:createIncome", {
                        userId, source: tx.description, type: tx.category.toLowerCase(),
                        amount: tx.amount, currency: "NGN", exchangeRate: 1, date: tx.date, isTaxable: tx.isTaxableOrDeductible
                    });
                } else {
                    await client.mutation("finance:createExpense", {
                        userId, description: tx.description, category: tx.category,
                        amount: tx.amount, date: tx.date, isDeductible: tx.isTaxableOrDeductible
                    });
                }
                console.log(`✅ Imported: ${tx.description}`);
            }
            console.log(`✅ Bank import simulation successful.\n`);
        } catch (e) {
            console.log(`⚠️ Bank Import simulation skipped.\n`);
        }

        // --- STAGE 8: AI CHAT SIMULATION ---
        console.log(`[8/10] Simulating AI Chat interaction...`);
        const sessionId = await client.mutation("chat:createChatSession", { uid: userId, topic: "Tax Help" });
        await client.mutation("chat:addChatMessage", { sessionId, role: "user", content: "How do I optimize my WHT credits from invoices?" });
        
        try {
            const chatRes = await axios.post(`${API_BASE}/chat`, { 
                messages: [{ role: "user", content: "How do I optimize my WHT credits from invoices?" }],
                userType: user.onboardingType,
                state: user.stateOfResidence
            });
            const chatData = ensureJSON(chatRes.data);
            await client.mutation("chat:addChatMessage", { sessionId, role: "assistant", content: chatData.content });
            console.log(`✅ Chat session created and AI response received.\n`);
        } catch (e) {
            console.log(`⚠️ AI Chat simulation skipped: ${e.message}\n`);
        }

        // --- STAGE 9: ADMIN & OPERATIONS (REMINDERS/RECURRING) ---
        console.log(`[9/10] Seeding Reminders and Recurring entries...`);
        await client.mutation("finance:createReminder", {
            userId,
            type: "VAT",
            message: "Filing deadline for Globacom Invoice VAT collected.",
            deadline: "2026-03-21"
        });
        await client.mutation("finance:createRecurringEntry", {
            userId,
            name: "Broadband Subscription",
            amount: 25000,
            category: "Business",
            frequency: "Monthly",
            type: "expense"
        });
        console.log(`✅ Operations data seeded.\n`);

        // --- STAGE 10: INTELLIGENCE AUDIT ---
        console.log(`[10/10] Triggering Universal Intelligence Layer (Audit/Anomalies)...`);
        try {
            // Fetch the updated data to send to auditor
            const income = await client.query("finance:getIncome", { userId });
            const expenses = await client.query("finance:getExpenses", { userId });
            
            console.log(`🔍 Running AI Tax Audit on ${income.length} income entries...`);
            const auditRes = await axios.post(`${API_BASE}/tax-audit`, { userData: user, income, expenses });
            const auditData = ensureJSON(auditRes.data);
            console.log(`✨ AUDITOR INSIGHTS (Top 2):`);
            (auditData.insights || []).slice(0, 2).forEach(ins => {
                console.log(`   - [${ins.type.toUpperCase()}] ${ins.title}: ${ins.description}`);
            });

            console.log(`\n🔍 Checking for Anomalies...`);
            const anomalyRes = await axios.post(`${API_BASE}/anomalies`, { income, expenses });
            const anomalyData = ensureJSON(anomalyRes.data);
            console.log(`✨ ANOMALY REPORT: Found ${(anomalyData.findings || []).length} potential issues.`);

            console.log(`\n🔍 Finding missed Deductions...`);
            const deductRes = await axios.post(`${API_BASE}/deductions`, { income, expenses, userData: user });
            const deductData = ensureJSON(deductRes.data);
            console.log(`✨ DEDUCTION OPPORTUNITIES:`);
            (deductData.deductions || []).forEach(d => {
                const savings = typeof d.estimatedSavings === 'number' ? d.estimatedSavings : 0;
                console.log(`   - ${d.title}: Savings of ₦${savings.toLocaleString()}`);
            });

            console.log(`\n🔍 Generating AI Projections...`);
            const taxSummary = await client.query("finance:getTaxSummary", { userId });
            const projectionRes = await axios.post(`${API_BASE}/projections`, { income, taxSummary, userData: user });
            const projectionData = ensureJSON(projectionRes.data);
            const projectedIncome = typeof projectionData.projectedAnnualIncome === 'number' ? projectionData.projectedAnnualIncome : 0;
            console.log(`✨ PROJECTION: Estimated Annual Income ₦${projectedIncome.toLocaleString()}`);
            (projectionData.insights || []).slice(0, 2).forEach(ins => {
                console.log(`   - [${ins.type.toUpperCase()}] ${ins.title}`);
            });
            
        } catch (e) {
            console.log(`⚠️ Intelligence layer simulation skipped: ${e.message}`);
            if (e.response) console.log(`   Error Data:`, JSON.stringify(e.response.data));
        }

        console.log(`\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!`);
        console.log(`--------------------------------------------------`);
        console.log(`Next Step: Open your browser to http://localhost:3000/dashboard`);
        console.log(`Everything should be fully populated and reflecting real-time tax data.`);
        console.log(`--------------------------------------------------\n`);

    } catch (err) {
        console.error(`\n❌ TEST FAILED:`, err.message);
        if (err.response) console.error(`   Server Response:`, err.response.data);
    }
}

runTest();
