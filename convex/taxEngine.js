/**
 * NairaClare Tax Engine
 * Implements Nigeria Tax Act (NTA) 2025 logic (effective Jan 1, 2026)
 */

export const TAX_BANDS = [
    { limit: 800000, rate: 0.00 },
    { limit: 3000000, rate: 0.15 },
    { limit: 12000000, rate: 0.18 },
    { limit: 25000000, rate: 0.21 },
    { limit: 50000000, rate: 0.23 },
    { limit: Infinity, rate: 0.25 }
];

export const MIN_WAGE_EXEMPTION = 840000; // 70k/month * 12
export const RENT_RELIEF_CAP = 500000;

/**
 * Calculates annual PAYE tax based on gross income and deductions.
 * 
 * @param {Object} params
 * @param {number} params.grossAnnualIncome - Total annual income
 * @param {Object} params.deductions - Deductions breakdown
 * @param {number} params.deductions.pension - Pension contribution
 * @param {number} params.deductions.nhf - NHF contribution
 * @param {number} params.deductions.nhis - NHIS contribution
 * @param {number} params.deductions.rentRelief - Rent relief (20% of rent up to 500k)
 * @param {number} params.deductions.lifeInsurance - Life insurance premium
 * @param {number} params.deductions.loanInterest - Owner-occupied loan interest
 * @param {number} params.whtCredits - Withholding tax credits to subtract from final tax
 */
export function calculateTax({
    grossAnnualIncome,
    deductions = {
        pension: 0,
        nhf: 0,
        nhis: 0,
        rentRelief: 0,
        lifeInsurance: 0,
        loanInterest: 0
    },
    whtCredits = 0
}) {
    // Step 4: Minimum Wage Exemption
    if (grossAnnualIncome <= MIN_WAGE_EXEMPTION) {
        return {
            annualTax: 0,
            monthlyTax: 0,
            chargeableIncome: 0,
            effectiveRate: 0,
            takeHome: (grossAnnualIncome - (deductions.pension || 0) - (deductions.nhf || 0) - (deductions.nhis || 0)) / 12
        };
    }

    // Step 3: Calculate Chargeable Income
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
    const chargeableIncome = Math.max(0, grossAnnualIncome - totalDeductions);

    // Step 5: Apply Progressive Tax Bands
    let remainingChargeable = chargeableIncome;
    let totalTax = 0;
    let prevLimit = 0;

    for (const band of TAX_BANDS) {
        const bandSize = band.limit - prevLimit;
        const taxableInBand = Math.min(Math.max(0, remainingChargeable), bandSize);
        totalTax += taxableInBand * band.rate;
        remainingChargeable -= taxableInBand;
        prevLimit = band.limit;
        if (remainingChargeable <= 0) break;
    }

    // Step 6: Apply WHT Credits
    const finalTaxPayable = Math.max(0, totalTax - whtCredits);

    // Step 7: Derived Outputs
    const annualPAYETax = finalTaxPayable;
    const monthlyPAYETax = annualPAYETax / 12;
    const effectiveRate = grossAnnualIncome > 0 ? (annualPAYETax / grossAnnualIncome) * 100 : 0;
    
    // Monthly Take-home: (Gross - Pension - NHF - NHIS - Tax) / 12
    const totalMandatoryDeductions = (deductions.pension || 0) + (deductions.nhf || 0) + (deductions.nhis || 0);
    const monthlyTakeHome = (grossAnnualIncome - totalMandatoryDeductions - annualPAYETax) / 12;

    return {
        annualTax: annualPAYETax,
        monthlyTax: monthlyPAYETax,
        chargeableIncome,
        effectiveRate,
        takeHome: monthlyTakeHome
    };
}

/**
 * Helper to calculate deductions from salary components
 */
export function calculateDeductions({
    basic,
    housing,
    transport,
    otherAllowances = 0,
    annualRent = 0,
    pensionEnabled = true,
    nhfEnabled = true,
    nhisEnabled = false,
    lifeInsurance = 0,
    loanInterest = 0
}) {
    const pensionableBase = basic + housing + transport;
    
    return {
        pension: pensionEnabled ? pensionableBase * 0.08 : 0,
        nhf: nhfEnabled ? basic * 0.025 : 0,
        nhis: nhisEnabled ? basic * 0.05 : 0,
        rentRelief: Math.min(annualRent * 0.20, RENT_RELIEF_CAP),
        lifeInsurance,
        loanInterest
    };
}
