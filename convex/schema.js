import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        onboardingType: v.optional(v.string()), // "solo", "employee", "business"
        stateOfResidence: v.optional(v.string()), // e.g., "Lagos", "FCT"
        salaryProfile: v.optional(v.object({
            basic: v.number(),
            housing: v.number(),
            transport: v.number(),
            otherAllowances: v.number(),
            pensionEnabled: v.boolean(),
            nhfEnabled: v.boolean(),
            nhisEnabled: v.boolean(),
        })),
        profileCompleted: v.optional(v.boolean()),
        credits: v.optional(v.number()),
    }).index("by_email", ["email"]),

    income: defineTable({
        uid: v.id('users'),
        source: v.string(),
        type: v.string(), // "salary", "freelance", "rental", etc.
        amount: v.number(),
        currency: v.string(), // "NGN", "USD"
        exchangeRate: v.number(), // Rate to NGN
        date: v.string(), // YYYY-MM-DD
        isTaxable: v.boolean(),
        invoiceId: v.optional(v.id('invoices')),
        dedupeKey: v.optional(v.string()),
    }).index("by_user", ["uid"]).index("by_user_date", ["uid", "date"]).index("by_user_dedupe", ["uid", "dedupeKey"]),

    expenses: defineTable({
        uid: v.id('users'),
        description: v.string(),
        category: v.string(), // "Rent", "NHIS", "Business", etc.
        amount: v.number(),
        date: v.string(),
        isDeductible: v.boolean(),
        receiptStorageId: v.optional(v.id('_storage')),
        dedupeKey: v.optional(v.string()),
    }).index("by_user", ["uid"]).index("by_user_category", ["uid", "category"]).index("by_user_dedupe", ["uid", "dedupeKey"]),

    clients: defineTable({
        uid: v.id('users'),
        name: v.string(),
        tin: v.optional(v.string()),
        email: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
    }).index("by_user", ["uid"]),

    invoices: defineTable({
        uid: v.id('users'),
        clientId: v.id('clients'),
        invoiceNumber: v.string(),
        amount: v.number(),
        vatAmount: v.number(),
        whtAmount: v.number(),
        status: v.string(), // "sent", "viewed", "paid", "overdue"
        date: v.string(),
        dueDate: v.string(),
        items: v.array(v.object({
            description: v.string(),
            quantity: v.number(),
            unitPrice: v.number(),
        })),
    }).index("by_user", ["uid"]).index("by_client", ["clientId"]),

    payroll: defineTable({
        uid: v.id('users'), // Business owner
        employeeName: v.string(),
        salaryStructure: v.object({
            basic: v.number(),
            housing: v.number(),
            transport: v.number(),
            other: v.number(),
        }),
        status: v.string(), // "active", "terminated"
    }).index("by_user", ["uid"]),

    whtCredits: defineTable({
        uid: v.id('users'),
        invoiceId: v.id('invoices'),
        amount: v.number(),
        certificateStorageId: v.optional(v.id('_storage')),
        date: v.string(),
    }).index("by_user", ["uid"]),

    reminders: defineTable({
        uid: v.id('users'),
        type: v.string(),
        message: v.string(),
        deadline: v.string(),
        isDismissed: v.boolean(),
        isDone: v.boolean(),
        generatedKey: v.optional(v.string()), // For deduplication
    }).index("by_user", ["uid"]),

    recurringEntries: defineTable({
        uid: v.id('users'),
        name: v.string(),
        amount: v.number(),
        category: v.string(),
        frequency: v.string(), // "Monthly", "Quarterly", "Annually"
        type: v.string(), // "expense" or "income"
        active: v.boolean(),
    }).index("by_user", ["uid"]),

    chatSessions: defineTable({
        uid: v.id('users'),
        topic: v.string(),
    }).index("by_user", ["uid"]),

    chatMessages: defineTable({
        sessionId: v.id('chatSessions'),
        role: v.string(), // "user" or "assistant"
        content: v.string(),
        timestamp: v.number(),
    }).index("by_session", ["sessionId"]),
});