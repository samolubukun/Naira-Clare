// Centralized Credit Configuration for Convex Backend
// Simplified: Unified Scan Credits for all AI and premium actions

export const CREDIT_LIMITS = {
    FREE_PLAN: {
        INITIAL_CREDITS: 50, // More generous start
        AI_AUDIT_COST: 5,     // Tax audit cost
        AI_CHAT_COST: 1,      // Per AI message
        BANK_IMPORT_COST: 3,  // Bank statement parsing
        RECEIPT_SCAN_COST: 2  // Receipt extraction
    }
};

// Default value for new users
export const DEFAULT_CREDITS = CREDIT_LIMITS.FREE_PLAN.INITIAL_CREDITS;
