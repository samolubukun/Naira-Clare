import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { calculateTax, calculateDeductions } from "./taxEngine";

/**
 * Internal helper to calculate tax summary for a user.
 */
async function calculateUserTaxSummary(ctx, userId) {
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const incomeEntries = await ctx.db
        .query("income")
        .withIndex("by_user", (q) => q.eq("uid", userId))
        .collect();

    const expenseEntries = await ctx.db
        .query("expenses")
        .withIndex("by_user", (q) => q.eq("uid", userId))
        .collect();

    const whtCredits = await ctx.db
        .query("whtCredits")
        .withIndex("by_user", (q) => q.eq("uid", userId))
        .collect();

    // 1. Calculate Gross Income (Sum all taxable income)
    const grossAnnualIncome = incomeEntries
        .filter(i => i.isTaxable)
        .reduce((sum, i) => sum + (i.amount * (i.exchangeRate || 1)), 0);

    // 2. Base Deductions from Salary Profile
    let baseDeductions = {
        pension: 0,
        nhf: 0,
        nhis: 0,
        rentRelief: 0,
        lifeInsurance: 0,
        loanInterest: 0
    };

    if (user.salaryProfile) {
        baseDeductions = calculateDeductions({
            basic: user.salaryProfile.basic * 12,
            housing: user.salaryProfile.housing * 12,
            transport: user.salaryProfile.transport * 12,
            otherAllowances: user.salaryProfile.otherAllowances * 12,
            pensionEnabled: user.salaryProfile.pensionEnabled,
            nhfEnabled: user.salaryProfile.nhfEnabled,
            nhisEnabled: user.salaryProfile.nhisEnabled,
        });
    }

    // 3. Add dynamic deductions from expenses (Life Insurance, Loan Interest, Rent)
    const rentExpenses = expenseEntries
        .filter(e => e.category === "Rent")
        .reduce((sum, e) => sum + e.amount, 0);
    
    if (rentExpenses > 0) {
        baseDeductions.rentRelief = Math.min(rentExpenses * 0.20, 500000);
    }

    baseDeductions.lifeInsurance += expenseEntries
        .filter(e => e.category === "Life Insurance")
        .reduce((sum, e) => sum + e.amount, 0);

    baseDeductions.loanInterest += expenseEntries
        .filter(e => e.category === "Loan Interest")
        .reduce((sum, e) => sum + e.amount, 0);

    // 4. Sum WHT Credits
    const totalWhtCredits = whtCredits.reduce((sum, w) => sum + w.amount, 0);

    // 5. Final Calculation
    const result = calculateTax({
        grossAnnualIncome,
        deductions: baseDeductions,
        whtCredits: totalWhtCredits
    });

    return {
        ...result,
        grossAnnualIncome,
        totalDeductions: Object.values(baseDeductions).reduce((s, v) => s + v, 0),
        whtCredits: totalWhtCredits
    };
}

/**
 * Live Tax Summary for the Gauge/Meter
 */
export const getTaxSummary = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await calculateUserTaxSummary(ctx, args.userId);
    }
});

/**
 * Dashboard Stat Cards Data
 */
export const getDashboardStats = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        const summary = await calculateUserTaxSummary(ctx, args.userId);
        if (!summary) return null;

        // Income Sources count
        const incomeSources = await ctx.db
            .query("income")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .collect();
        const uniqueSources = new Set(incomeSources.map(i => i.source)).size;

        // Expense entries for compliance scoring
        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .collect();

        // Dynamic compliance score (0-100)
        let compliance = 0;
        if (incomeSources.length > 0) compliance += 25; // Has logged income
        if (expenses.length > 0) compliance += 20; // Has logged expenses
        if (summary.totalDeductions > 0) compliance += 20; // Has claimed deductions
        const uniqueExpenseCategories = new Set(expenses.map(e => e.category)).size;
        if (uniqueExpenseCategories >= 3) compliance += 15; // Diverse expense tracking
        if (incomeSources.length >= 3) compliance += 10; // Multiple income months
        // Filing readiness bonus
        const user = await ctx.db.get(args.userId);
        if (user?.salaryProfile) compliance += 10; // Profile completed

        // Dynamic days to deadline (March 31 of current year)
        const now = new Date();
        let deadlineYear = now.getFullYear();
        const march31 = new Date(deadlineYear, 2, 31); // Month is 0-indexed
        if (now > march31) {
            deadlineYear += 1;
        }
        const nextDeadline = new Date(deadlineYear, 2, 31);
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysToDeadline = Math.max(0, Math.ceil((nextDeadline - now) / msPerDay));

        return {
            totalIncomeYTD: summary.grossAnnualIncome,
            incomeSourcesCount: uniqueSources,
            estimatedTaxOwed: summary.annualTax,
            effectiveRate: summary.effectiveRate,
            totalDeductions: summary.totalDeductions,
            taxSaved: summary.totalDeductions * (summary.effectiveRate / 100),
            monthlyProvision: summary.monthlyTax,
            complianceScore: Math.min(100, compliance),
            daysToDeadline,
        };
    }
});

/**
 * Income Logging
 */
export const createIncome = mutation({
    args: {
        userId: v.id('users'),
        source: v.string(),
        type: v.string(), // "salary", "freelance", "rental", etc.
        amount: v.number(),
        currency: v.string(),
        exchangeRate: v.number(),
        date: v.string(),
        isTaxable: v.boolean(),
        invoiceId: v.optional(v.id('invoices')),
        dedupeKey: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId, dedupeKey, ...data } = args;
        
        if (dedupeKey) {
            const existing = await ctx.db
                .query("income")
                .withIndex("by_user_dedupe", (q) => q.eq("uid", userId).eq("dedupeKey", dedupeKey))
                .first();
            if (existing) return existing._id;
        }

        return await ctx.db.insert("income", { uid: userId, dedupeKey, ...data });
    }
});

/**
 * Expense Logging
 */
export const createExpense = mutation({
    args: {
        userId: v.id('users'),
        description: v.string(),
        category: v.string(),
        amount: v.number(),
        date: v.string(),
        isDeductible: v.boolean(),
        receiptStorageId: v.optional(v.id('_storage')),
        dedupeKey: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId, dedupeKey, ...data } = args;

        if (dedupeKey) {
            const existing = await ctx.db
                .query("expenses")
                .withIndex("by_user_dedupe", (q) => q.eq("uid", userId).eq("dedupeKey", dedupeKey))
                .first();
            if (existing) return existing._id;
        }

        return await ctx.db.insert("expenses", { uid: userId, dedupeKey, ...data });
    }
});

/**
 * Client Management
 */
export const createClient = mutation({
    args: {
        userId: v.id('users'),
        name: v.string(),
        tin: v.optional(v.string()),
        email: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId, ...data } = args;
        return await ctx.db.insert("clients", { uid: userId, ...data });
    }
});

/**
 * Invoicing
 */
export const createInvoice = mutation({
    args: {
        userId: v.id('users'),
        clientId: v.id('clients'),
        invoiceNumber: v.string(),
        amount: v.number(),
        vatAmount: v.number(),
        whtAmount: v.number(),
        status: v.string(),
        date: v.string(),
        dueDate: v.string(),
        items: v.array(v.object({
            description: v.string(),
            quantity: v.number(),
            unitPrice: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        const { userId, ...data } = args;
        const invoiceId = await ctx.db.insert("invoices", { uid: userId, ...data });
        return invoiceId;
    }
});

export const updateInvoiceStatus = mutation({
    args: {
        invoiceId: v.id('invoices'),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        await ctx.db.patch(args.invoiceId, { status: args.status });
        
        if (args.status === "paid") {
            // Log the Income
            await ctx.db.insert("income", {
                uid: invoice.uid,
                source: `Invoice ${invoice.invoiceNumber}`,
                type: "freelance",
                amount: invoice.amount, // Base amount
                currency: "NGN",
                exchangeRate: 1,
                date: new Date().toISOString().split('T')[0],
                isTaxable: true,
                invoiceId: invoice._id,
            });

            // Automatically log WHT Credit if applicable
            if (invoice.whtAmount > 0) {
                await ctx.db.insert("whtCredits", {
                    uid: invoice.uid,
                    invoiceId: invoice._id,
                    amount: invoice.whtAmount,
                    date: new Date().toISOString().split('T')[0],
                });
            }
        }
    }
});

/**
 * WHT & VAT Specialized Queries
 */
export const getWhtCredits = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("whtCredits")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .order("desc")
            .collect();
    }
});

export const getVatSummary = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        const invoices = await ctx.db
            .query("invoices")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .collect();
        
        const vatCollected = invoices
            .filter(i => i.status === "paid")
            .reduce((sum, i) => sum + i.vatAmount, 0);
            
        return {
            vatCollected,
            pendingVat: invoices
                .filter(i => i.status !== "paid")
                .reduce((sum, i) => sum + i.vatAmount, 0),
        };
    }
});

export const getInvoices = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .order("desc")
            .collect();
    }
});

export const getIncome = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("income")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .order("desc")
            .collect();
    }
});

export const getExpenses = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("expenses")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .order("desc")
            .collect();
    }
});

/**
 * Payroll Management
 */
export const createEmployee = mutation({
    args: {
        userId: v.id('users'),
        employeeName: v.string(),
        salaryStructure: v.object({
            basic: v.number(),
            housing: v.number(),
            transport: v.number(),
            other: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        const { userId, ...data } = args;
        return await ctx.db.insert("payroll", { uid: userId, status: "active", ...data });
    }
});

export const runPayroll = mutation({
    args: {
        userId: v.id('users'),
        month: v.string(), // "2026-03"
    },
    handler: async (ctx, args) => {
        const employees = await ctx.db
            .query("payroll")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .filter(q => q.eq(q.field("status"), "active"))
            .collect();

        for (const emp of employees) {
            const payrollTotal = emp.salaryStructure.basic + emp.salaryStructure.housing + emp.salaryStructure.transport + emp.salaryStructure.other;
            
            await ctx.db.insert("expenses", {
                uid: args.userId,
                description: `Payroll - ${emp.employeeName} - ${args.month}`,
                category: "Business",
                amount: payrollTotal,
                date: new Date().toISOString().split('T')[0],
                isDeductible: true,
            });
        }
    }
});

/**
 * Client Queries
 */
export const getClients = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("clients")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .collect();
    }
});

export const getClientInvoices = query({
    args: { clientId: v.id('clients') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
            .order("desc")
            .collect();
    }
});

/**
 * Employee/Payroll Queries
 */
export const getEmployees = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("payroll")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .collect();
    }
});

/**
 * Delete Operations
 */
export const deleteIncome = mutation({
    args: { id: v.id('income') },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const deleteExpense = mutation({
    args: { id: v.id('expenses') },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

/**
 * Update Operations
 */
export const updateIncome = mutation({
    args: {
        id: v.id('income'),
        source: v.optional(v.string()),
        type: v.optional(v.string()),
        amount: v.optional(v.number()),
        currency: v.optional(v.string()),
        exchangeRate: v.optional(v.number()),
        date: v.optional(v.string()),
        isTaxable: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        const updates = {};
        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) updates[key] = val;
        }
        await ctx.db.patch(id, updates);
    }
});

export const updateExpense = mutation({
    args: {
        id: v.id('expenses'),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        amount: v.optional(v.number()),
        date: v.optional(v.string()),
        isDeductible: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        const updates = {};
        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) updates[key] = val;
        }
        await ctx.db.patch(id, updates);
    }
});

/**
 * Recurring Entries CRUD
 */
export const getRecurringEntries = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("recurringEntries")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .collect();
    }
});

export const createRecurringEntry = mutation({
    args: {
        userId: v.id('users'),
        name: v.string(),
        amount: v.number(),
        category: v.string(),
        frequency: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, ...data } = args;
        return await ctx.db.insert("recurringEntries", { uid: userId, active: true, ...data });
    }
});

export const deleteRecurringEntry = mutation({
    args: { id: v.id('recurringEntries') },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const toggleRecurringEntry = mutation({
    args: { id: v.id('recurringEntries') },
    handler: async (ctx, args) => {
        const entry = await ctx.db.get(args.id);
        if (entry) {
            await ctx.db.patch(args.id, { active: !entry.active });
        }
    }
});

/**
 * Reminders CRUD
 */
export const getReminders = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("reminders")
            .withIndex("by_user", (q) => q.eq("uid", args.userId))
            .filter(q => q.and(
                q.eq(q.field("isDismissed"), false),
                q.eq(q.field("isDone"), false)
            ))
            .collect();
    }
});

export const createReminder = mutation({
    args: {
        userId: v.id('users'),
        type: v.string(),
        message: v.string(),
        deadline: v.string(),
        generatedKey: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Deduplicate by generatedKey
        if (args.generatedKey) {
            const existing = await ctx.db
                .query("reminders")
                .withIndex("by_user", (q) => q.eq("uid", args.userId))
                .filter(q => q.eq(q.field("generatedKey"), args.generatedKey))
                .first();
            if (existing) return existing._id;
        }
        return await ctx.db.insert("reminders", {
            uid: args.userId,
            type: args.type,
            message: args.message,
            deadline: args.deadline,
            isDismissed: false,
            isDone: false,
            generatedKey: args.generatedKey,
        });
    }
});

export const dismissReminder = mutation({
    args: { id: v.id('reminders') },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isDismissed: true });
    }
});

export const markReminderDone = mutation({
    args: { id: v.id('reminders') },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isDone: true });
    }
});
