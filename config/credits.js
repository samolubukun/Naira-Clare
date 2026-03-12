// Centralized Credit Configuration for Frontend
// Simplified: Unified Scan Credits for all AI and premium actions

export const CREDIT_LIMITS = {
    FREE_PLAN: {
        INITIAL_CREDITS: 50,
        AI_AUDIT_COST: 5,
        AI_CHAT_COST: 1,
        BANK_IMPORT_COST: 3,
        RECEIPT_SCAN_COST: 2
    }
};

export const DEFAULT_CREDITS = CREDIT_LIMITS.FREE_PLAN.INITIAL_CREDITS;
