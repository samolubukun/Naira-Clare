"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
    Calculator, TrendingUp, Wallet, ArrowRight, 
    RefreshCcw, ShieldCheck, PieChart, Info, AlertCircle,
    ChevronDown, ChevronUp, Landmark, Heart, Settings2,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { currencies, getExchangeRates, convertToNGN } from "@/lib/currencies";

export default function TaxCalculator({ isDashboard = false }) {
    const router = useRouter();
    const [isMonthly, setIsMonthly] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    const [formData, setFormData] = useState({
        basic: "",
        housing: "",
        transport: "",
        other: "",
        annualRent: "",
        lifeInsurance: "",
        loanInterest: "",
        // Manual vs Auto toggles - DEFAULT TO FALSE (Manual First as requested)
        pensionAuto: false,
        nhfAuto: false,
        nhisAuto: false,
        // The actual values entered or calculated
        pensionValue: "",
        nhfValue: "",
        nhisValue: "",
    });

    const [results, setResults] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [rates, setRates] = useState(null);

    useEffect(() => {
        getExchangeRates().then(setRates);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Helper to calculate auto-values in real-time for display
    const getAutoValues = () => {
        const b = parseFloat(formData.basic || 0);
        const h = parseFloat(formData.housing || 0);
        const t = parseFloat(formData.transport || 0);
        
        return {
            pension: (b + h + t) * 0.08,
            nhf: b * 0.025,
            nhis: b * 0.05
        };
    };

    const auto = getAutoValues();

    const calculate = () => {
        const convert = (val) => convertToNGN(parseFloat(val || 0), selectedCurrency.code, rates);

        const factor = isMonthly ? 12 : 1;
        const b = convert(formData.basic) * factor;
        const h = convert(formData.housing) * factor;
        const t = convert(formData.transport) * factor;
        const o = convert(formData.other) * factor;
        const rent = convert(formData.annualRent);
        const life = convert(formData.lifeInsurance);
        const loan = convert(formData.loanInterest);

        const grossAnnual = b + h + t + o;
        const autoAnnual = {
            pension: convert(auto.pension) * factor,
            nhf: convert(auto.nhf) * factor,
            nhis: convert(auto.nhis) * factor
        };
        
        // Final values for calc: Use auto-calc ONLY if the toggle is ON
        const pensionFinal = formData.pensionAuto ? autoAnnual.pension : convert(formData.pensionValue) * factor;
        const nhfFinal = formData.nhfAuto ? autoAnnual.nhf : convert(formData.nhfValue) * factor;
        const nhisFinal = formData.nhisAuto ? autoAnnual.nhis : convert(formData.nhisValue) * factor;

        const rentReliefValue = Math.min(rent * 0.20, 500000);
        
        const totalDeductions = pensionFinal + nhfFinal + nhisFinal + rentReliefValue + life + loan;
        const chargeable = Math.max(0, grossAnnual - totalDeductions);

        const bands = [
            { label: "First ₦800,000", limit: 800000, rate: 0.00 },
            { label: "Next ₦2,200,000", limit: 3000000, rate: 0.15 },
            { label: "Next ₦9,000,000", limit: 12000000, rate: 0.18 },
            { label: "Next ₦13,000,000", limit: 25000000, rate: 0.21 },
            { label: "Next ₦25,000,000", limit: 50000000, rate: 0.23 },
            { label: "Remainder", limit: Infinity, rate: 0.25 }
        ];

        let tax = 0;
        let prevLimit = 0;
        let remaining = chargeable;
        const bracketBreakdown = [];

        for (const band of bands) {
            const size = band.limit - prevLimit;
            const taxableInThisBand = Math.min(Math.max(0, remaining), size);
            const taxInThisBand = taxableInThisBand * band.rate;
            
            bracketBreakdown.push({
                label: band.label,
                rate: band.rate * 100,
                taxable: taxableInThisBand,
                taxDue: taxInThisBand
            });

            tax += taxInThisBand;
            remaining -= taxableInThisBand;
            prevLimit = band.limit;
        }

        setResults({
            annualTax: tax,
            monthlyTax: tax / 12,
            takeHome: (grossAnnual - pensionFinal - nhfFinal - nhisFinal - tax) / 12,
            effectiveRate: grossAnnual > 0 ? (tax / grossAnnual) * 100 : 0,
            chargeable,
            totalDeductions,
            grossAnnual,
            rentReliefValue,
            bracketBreakdown
        });
    };

    const IntegratedInput = ({ label, name, field, autoValue }) => {
        const isAuto = formData[`${field}Auto`];
        const displayValue = isAuto 
            ? (autoValue > 0 ? Math.round(autoValue).toString() : "") 
            : formData[`${field}Value`];

        const ngnEquiv = selectedCurrency.code !== "NGN" && !isAuto && formData[`${field}Value`]
            ? convertToNGN(parseFloat(formData[`${field}Value`]), selectedCurrency.code, rates)
            : null;

        return (
            <div className="space-y-1.5 flex flex-col">
                <div className="flex justify-between items-center">
                    <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest text-gray-400 whitespace-nowrap">
                        {isMonthly ? "Monthly" : "Annual"} {label}
                    </Label>
                    {ngnEquiv && (
                        <span className="text-[8px] font-black text-emerald-600 animate-pulse">
                            ≈ ₦{Math.round(ngnEquiv).toLocaleString()}
                        </span>
                    )}
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                        {selectedCurrency.symbol}
                    </span>
                    <Input 
                        name={`${field}Value`}
                        value={displayValue} 
                        onChange={handleInputChange} 
                        placeholder={isAuto ? "Auto-fill..." : "0"} 
                        disabled={isAuto}
                        className={`bg-white border-gray-200 h-14 pl-10 text-lg font-bold placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50 transition-all ${isAuto ? "bg-emerald-50/20 text-[#008751] border-emerald-100 opacity-90 shadow-inner" : "focus:ring-[#008751] shadow-sm"}`} 
                        type="number" 
                    />
                </div>
                <button 
                    onClick={() => setFormData(prev => ({ ...prev, [`${field}Auto`]: !prev[`${field}Auto`] }))}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all self-end ${
                        isAuto ? "bg-emerald-100 text-[#008751]" : "bg-gray-100 text-gray-400 hover:text-gray-600 border border-gray-200 shadow-sm"
                    }`}
                >
                    <Zap className={`w-2 h-2 ${isAuto ? "fill-current" : ""}`} />
                    {isAuto ? "Auto ON" : "Use Auto"}
                </button>
            </div>
        );
    };


    return (
        <Card className={`w-full max-w-5xl mx-auto overflow-hidden bg-white ${isDashboard ? "border-none shadow-none rounded-none" : "border border-gray-100 shadow-2xl md:rounded-[2.5rem] rounded-3xl"}`}>
            <CardContent className="p-0">
                <div className="grid lg:grid-cols-5 grid-cols-1 gap-0">
                    {/* Input Side */}
                    <div className="lg:col-span-3 lg:p-12 p-6 space-y-8 bg-white border-b lg:border-b-0">
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h3 className="text-2xl font-black text-[#0f172a] flex items-center gap-2">
                                    <Calculator className="w-6 h-6 text-[#008751]" />
                                    Your Inputs
                                </h3>
                                <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
                                    <button 
                                        onClick={() => setIsMonthly(true)}
                                        className={`flex-1 sm:flex-none px-6 py-2 rounded-full text-xs font-bold transition-all ${isMonthly ? "bg-[#008751] text-white shadow-md shadow-emerald-900/10" : "text-gray-500"} max-sm:text-[10px] max-sm:px-3`}
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setIsMonthly(false)}
                                        className={`flex-1 sm:flex-none px-6 py-2 rounded-full text-xs font-bold transition-all ${!isMonthly ? "bg-[#008751] text-white shadow-md shadow-emerald-900/10" : "text-gray-500"} max-sm:text-[10px] max-sm:px-3`}
                                    >
                                        Annual
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Currency</span>
                                <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
                                    {currencies.map((curr) => (
                                        <button
                                            key={curr.code}
                                            onClick={() => setSelectedCurrency(curr)}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCurrency.code === curr.code ? "bg-[#0f172a] text-white shadow-md" : "text-gray-500"} max-sm:text-[10px] max-sm:px-2.5`}
                                        >
                                            {curr.symbol} {curr.code}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-3">
                            <Info className="w-5 h-5 text-[#008751] flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                                <strong>Tip:</strong> If you're unsure of your specific allowances, just enter your total pay in the <strong>Basic Salary</strong> field.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Income Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest text-gray-400 whitespace-nowrap">
                                            {isMonthly ? "Monthly" : "Annual"} Basic
                                        </Label>
                                        {selectedCurrency.code !== "NGN" && formData.basic && (
                                            <span className="text-[8px] font-black text-emerald-600">
                                                ≈ ₦{Math.round(convertToNGN(parseFloat(formData.basic), selectedCurrency.code, rates)).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                                            {selectedCurrency.symbol}
                                        </span>
                                        <Input 
                                            name="basic" 
                                            value={formData.basic} 
                                            onChange={handleInputChange} 
                                            placeholder={isMonthly ? "250,000" : "3,000,000"} 
                                            className="bg-white border-gray-200 h-14 pl-10 text-xl font-black focus:ring-[#008751] placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" 
                                            type="number" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest text-gray-400 whitespace-nowrap">
                                            {isMonthly ? "Monthly" : "Annual"} Housing
                                        </Label>
                                        {selectedCurrency.code !== "NGN" && formData.housing && (
                                            <span className="text-[8px] font-black text-emerald-600">
                                                ≈ ₦{Math.round(convertToNGN(parseFloat(formData.housing), selectedCurrency.code, rates)).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                                            {selectedCurrency.symbol}
                                        </span>
                                        <Input 
                                            name="housing" 
                                            value={formData.housing} 
                                            onChange={handleInputChange} 
                                            placeholder="0" 
                                            className="bg-white border-gray-200 h-14 pl-10 text-lg font-bold placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" 
                                            type="number" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest text-gray-400 whitespace-nowrap">
                                            {isMonthly ? "Monthly" : "Annual"} Transport
                                        </Label>
                                        {selectedCurrency.code !== "NGN" && formData.transport && (
                                            <span className="text-[8px] font-black text-emerald-600">
                                                ≈ ₦{Math.round(convertToNGN(parseFloat(formData.transport), selectedCurrency.code, rates)).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                                            {selectedCurrency.symbol}
                                        </span>
                                        <Input 
                                            name="transport" 
                                            value={formData.transport} 
                                            onChange={handleInputChange} 
                                            placeholder="0" 
                                            className="bg-white border-gray-200 h-14 pl-10 text-lg font-bold placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" 
                                            type="number" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest text-gray-400 whitespace-nowrap">
                                            {isMonthly ? "Monthly" : "Annual"} Other
                                        </Label>
                                        {selectedCurrency.code !== "NGN" && formData.other && (
                                            <span className="text-[8px] font-black text-emerald-600">
                                                ≈ ₦{Math.round(convertToNGN(parseFloat(formData.other), selectedCurrency.code, rates)).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                                            {selectedCurrency.symbol}
                                        </span>
                                        <Input 
                                            name="other" 
                                            value={formData.other} 
                                            onChange={handleInputChange} 
                                            placeholder="0" 
                                            className="bg-white border-gray-200 h-14 pl-10 text-lg font-bold placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" 
                                            type="number" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Deductions Grid */}
                            <div className="pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <Settings2 className="w-4 h-4 text-gray-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Statutory Deductions</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                                    <IntegratedInput label="Pension (8%)" field="pension" autoValue={auto.pension} />
                                    <IntegratedInput label="NHF (2.5%)" field="nhf" autoValue={auto.nhf} />
                                    <IntegratedInput label="NHIS (5%)" field="nhis" autoValue={auto.nhis} />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <Heart className="w-4 h-4 text-gray-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reliefs & Adjustments</span>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <Label className="text-xs font-black uppercase tracking-wider text-gray-500">Annual Rent Paid</Label>
                                                {selectedCurrency.code !== "NGN" && formData.annualRent && (
                                                    <span className="text-[10px] font-black text-emerald-600">
                                                        ≈ ₦{Math.round(convertToNGN(parseFloat(formData.annualRent), selectedCurrency.code, rates)).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-1 rounded-md">Activates Rent Relief</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                                                {selectedCurrency.symbol}
                                            </span>
                                            <Input name="annualRent" value={formData.annualRent} onChange={handleInputChange} placeholder="e.g. 1,200,000" className="bg-white border-gray-200 h-12 pl-10 font-bold placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" type="number" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-[#008751] font-black text-[10px] uppercase tracking-[0.2em] pt-4 transition-all hover:gap-3 group"
                            >
                                {showAdvanced ? <ChevronUp className="w-4 h-4 bg-emerald-50 rounded-full p-0.5" /> : <ChevronDown className="w-4 h-4 bg-emerald-50 rounded-full p-0.5" />}
                                {showAdvanced ? "Hide Extra Relief Tools" : "Show Extra Relief Tools"}
                            </button>

                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-6 pt-2"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2rem] bg-[#FAFAF9] border border-gray-100">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                                        <Landmark className="w-4 h-4 text-emerald-600" />
                                                        Interest on Loan (Owner-Occupied)
                                                    </Label>
                                                    {selectedCurrency.code !== "NGN" && formData.loanInterest && (
                                                        <span className="text-[10px] font-black text-emerald-600">
                                                            ≈ ₦{Math.round(convertToNGN(parseFloat(formData.loanInterest), selectedCurrency.code, rates)).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                                                        {selectedCurrency.symbol}
                                                    </span>
                                                    <Input name="loanInterest" value={formData.loanInterest} onChange={handleInputChange} placeholder="Annual amount" className="bg-white border-gray-200 h-11 pl-8 placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" type="number" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                                        <Heart className="w-4 h-4 text-rose-500" />
                                                        Life Insurance Premium
                                                    </Label>
                                                    {selectedCurrency.code !== "NGN" && formData.lifeInsurance && (
                                                        <span className="text-[10px] font-black text-emerald-600">
                                                            ≈ ₦{Math.round(convertToNGN(parseFloat(formData.lifeInsurance), selectedCurrency.code, rates)).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                                                        {selectedCurrency.symbol}
                                                    </span>
                                                    <Input name="lifeInsurance" value={formData.lifeInsurance} onChange={handleInputChange} placeholder="Annual amount" className="bg-white border-gray-200 h-11 pl-8 placeholder:font-medium placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-400/50" type="number" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button 
                            className="w-full py-10 sm:text-lg lg:text-xl text-sm font-black text-white rounded-[1.5rem] shadow-2xl shadow-emerald-900/20 transition-all hover:scale-[1.01] active:scale-[0.98] px-4"
                            style={{ background: 'linear-gradient(135deg, #008751 0%, #064e3b 100%)' }}
                            onClick={calculate}
                        >
                            <span className="hidden sm:inline">Calculate Tax Breakdown</span>
                            <span className="sm:hidden">Calculate Tax</span>
                            <ArrowRight className="ml-2 w-5 h-5 flex-shrink-0" />
                        </Button>
                    </div>

                    {/* Output Side */}
                    <div className="lg:col-span-2 lg:p-12 p-6 bg-slate-50 lg:border-l border-gray-100 text-[#0f172a] flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                            {!results ? (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 lg:py-0"
                                >
                                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl shadow-emerald-900/5 flex items-center justify-center rotate-3 transition-transform hover:rotate-0">
                                        <PieChart className="w-10 h-10 text-[#008751]" />
                                    </div>
                                    <div className="space-y-3 px-4">
                                        <h4 className="text-xl font-black text-[#0f172a] tracking-tight">Ready for your breakdown?</h4>
                                        <p className="text-gray-400 font-medium text-sm leading-relaxed">Enter your monthly or annual figures and click calculate to see your NTA 2025 impact.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-10"
                                >
                                    <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-emerald-900/[0.02] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                                        <h4 className="text-[#008751] font-black uppercase tracking-[0.2em] text-[10px] mb-4 relative z-10 text-center">Total Annual Tax</h4>
                                        <div className="flex flex-col items-center justify-center relative z-10">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl sm:text-5xl font-black tracking-tighter text-[#0f172a]">₦{(results.annualTax || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                <span className="text-gray-400 font-bold uppercase text-xs">/yr</span>
                                            </div>
                                            <div className="mt-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                                                Effective Rate: {(results.effectiveRate || 0).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-gray-50 flex justify-center relative z-10">
                                            <div className="text-center">
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Monthly Take-Home</p>
                                                <p className="text-xl font-black font-mono text-[#0f172a]">₦{(results.takeHome || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rent Relief Box */}
                                    <div className="p-6 rounded-[1.5rem] bg-emerald-50/50 border border-emerald-100 flex items-center justify-between group transition-all hover:bg-emerald-50">
                                        <div className="space-y-1">
                                            <h5 className="text-[9px] text-emerald-800 font-black uppercase tracking-[0.2em]">Rent Relief Applied</h5>
                                            <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                                                Based on ₦{(parseFloat(formData.annualRent || 0)).toLocaleString()} rent
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-[#008751]">-(₦{(results.rentReliefValue || 0).toLocaleString()})</span>
                                        </div>
                                    </div>

                                    {/* Detailed Bracket Table */}
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black text-[#0f172a] uppercase tracking-[0.2em] mb-4">Tax Progress Breakdown</h5>
                                        <div className="overflow-x-auto -mx-2 px-2 scrollbar-hide">
                                            <div className="min-w-[300px] space-y-2">
                                                <div className="grid grid-cols-12 gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">
                                                    <div className="col-span-1">%</div>
                                                    <div className="col-span-5">Tax Band</div>
                                                    <div className="col-span-3 text-right">Taxable</div>
                                                    <div className="col-span-3 text-right">Tax Due</div>
                                                </div>
                                                {results.bracketBreakdown.map((row, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`grid grid-cols-12 gap-2 text-[10px] font-bold py-2 transition-opacity ${row.taxable === 0 ? 'opacity-20' : 'opacity-100'}`}
                                                    >
                                                        <div className="col-span-1 text-[#008751] font-mono">{row.rate}%</div>
                                                        <div className="col-span-5 text-[#0f172a] truncate">{row.label}</div>
                                                        <div className="col-span-3 text-right font-mono text-gray-400">₦{Math.round(row.taxable).toLocaleString()}</div>
                                                        <div className="col-span-3 text-right font-mono text-[#0f172a] font-black">₦{Math.round(row.taxDue).toLocaleString()}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {!isDashboard && (
                                        <div className="pt-4">
                                            <Button 
                                                variant="outline" 
                                                className="w-full py-8 rounded-2xl border-gray-200 bg-white hover:bg-[#008751] hover:text-white transition-all text-[#0f172a] flex items-center justify-center gap-3 font-black shadow-lg shadow-emerald-900/[0.03] group"
                                                onClick={() => router.push('/dashboard')}
                                            >
                                                <ShieldCheck className="w-5 h-5 text-[#008751] group-hover:text-white transition-colors" />
                                                Get Started with NairaClare
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 text-gray-300 text-[9px] font-black uppercase tracking-[0.3em] bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                                <RefreshCcw className="w-3 h-3 text-emerald-400" />
                                Compliance Engine v2.0
                            </div>
                            <p className="text-[9px] text-gray-300 font-medium text-center uppercase leading-normal tracking-[0.2em] max-w-xs px-4">
                                Nigeria Tax Act 2025 (FIRS/LIRS) calibrated and verified
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

