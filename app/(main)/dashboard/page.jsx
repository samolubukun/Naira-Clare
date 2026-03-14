"use client"
import { useContext, useState, useEffect, useRef } from "react";
import StatCards from './_components/StatCards';
import NairaFeatures from './_components/NairaFeatures';
import RecentActivity from './_components/RecentActivity';
import FinancialOverview from './_components/FinancialOverview';
import TaxCalendar from './_components/TaxCalendar';
import ComplianceReminders from './_components/ComplianceReminders';
import AnnualTaxSummary from './_components/AnnualTaxSummary';
import TaxAuditor from './_components/TaxAuditor';
import TaxCalculatorCard from './_components/TaxCalculatorCard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from "@/app/_context/UserContext";
import OnboardingModal from "@/components/OnboardingModal";
import { Progress } from '@/components/ui/progress';
import { Shield, LayoutDashboard, TrendingUp, PieChart, Wallet } from 'lucide-react';
import Image from "next/image";

function Dashboard() {
    const { userData } = useContext(UserContext);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    const taxSummary = useQuery(api.finance.getTaxSummary, userData ? { userId: userData._id } : "skip");

    const [pulse, setPulse] = useState(false);
    const prevTaxRef = useRef(null);
    useEffect(() => {
        if (taxSummary && prevTaxRef.current !== null && prevTaxRef.current !== taxSummary.annualTax) {
            setPulse(true);
            const t = setTimeout(() => setPulse(false), 2000);
            return () => clearTimeout(t);
        }
        if (taxSummary) prevTaxRef.current = taxSummary.annualTax;
    }, [taxSummary?.annualTax]);

    useEffect(() => {
        if (userData && !userData.onboardingType) {
            setShowOnboarding(true);
        }
    }, [userData]);

    const now = new Date();
    const yearProgress = ((now - new Date(now.getFullYear(), 0, 1)) / (new Date(now.getFullYear(), 11, 31) - new Date(now.getFullYear(), 0, 1))) * 100;
    const firstName = userData?.name?.split(' ')[0] || 'there';

    return (
        <div className='space-y-6 md:space-y-10 pb-24'>
            {/* 0. Branding & Action Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-5 overflow-hidden">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xl shadow-emerald-900/10 border-2 border-[#008751]/20">
                         <Image src="/nairaclarelogo.jpg" alt="Logo" width={64} height={64} className="object-cover h-full w-full" />
                    </div>
                    <div className="min-w-0 pr-1">
                        <h1 className="text-lg md:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">Welcome back, {firstName}</h1>
                        <div className="flex items-center gap-1 mt-0.5 md:mt-1">
                            <Shield className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#008751] flex-shrink-0" />
                            <p className="text-[6.8px] md:text-sm font-bold text-gray-500 uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">Your NTA 2026 Financial Command Center</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Live Tax Estimate — inline card */}
            <div className={`rounded-[2rem] p-5 transition-all duration-700 ${pulse ? 'bg-emerald-50 ring-2 ring-emerald-300 shadow-lg' : 'bg-white border border-gray-100 shadow-sm'} min-w-0`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 min-w-0">
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${pulse ? 'bg-emerald-500 animate-ping' : 'bg-[#008751]'}`} />
                            <span className="text-[8px] font-black text-[#008751] uppercase tracking-[0.2em] bg-emerald-100/30 px-2 py-0.5 rounded-full">Live Calculation</span>
                        </div>
                    </div>

                    <div className="flex flex-col flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-8 min-w-0">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl md:text-3xl font-black tracking-tighter transition-colors duration-500 ${pulse ? 'text-emerald-600' : 'text-[#0f172a]'}`}>
                                ₦{(taxSummary?.annualTax || 0).toLocaleString()}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-[#008751] uppercase tracking-widest">Annual</span>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Tax</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 min-w-0">
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-50 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center mb-1.5 gap-2">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap flex-shrink-0">Year Progress</span>
                                <span className="text-[8px] font-black text-[#008751] bg-emerald-100/50 px-1 py-0.5 rounded-md flex-shrink-0">{Math.round(yearProgress)}%</span>
                            </div>
                            <Progress value={yearProgress} className="h-1 rounded-full bg-gray-200" indicatorClassName="bg-gradient-to-r from-[#008751] to-[#2D5A27]" />
                        </div>

                        <div className="bg-blue-50/30 p-3 rounded-2xl border border-blue-50/50 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center mb-0.5 gap-2">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap flex-shrink-0">Total Income</span>
                                <TrendingUp className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
                            </div>
                            <p className="text-sm font-black text-[#0f172a] whitespace-nowrap">
                                ₦{taxSummary?.grossAnnualIncome >= 1000000 
                                    ? (taxSummary.grossAnnualIncome / 1000000).toFixed(2) + 'M'
                                    : (taxSummary?.grossAnnualIncome / 1000).toFixed(0) + 'k'}
                            </p>
                        </div>

                        <div className="bg-emerald-50/30 p-3 rounded-2xl border border-emerald-50/50 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center mb-0.5 gap-2">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap flex-shrink-0">Effective Rate</span>
                                <PieChart className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                            </div>
                            <p className="text-sm font-black text-[#008751] whitespace-nowrap">{(taxSummary?.effectiveRate || 0).toFixed(1)}%</p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-gray-100 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center mb-0.5 gap-2">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap flex-shrink-0">Monthly Tax</span>
                                <Wallet className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                            </div>
                            <p className="text-sm font-black text-[#0f172a] whitespace-nowrap">₦{(taxSummary?.monthlyTax || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Stat Cards — 6 compact cards */}
            <StatCards />

            {/* 3. Feature Navigation Cards (Moved Up) */}
            <NairaFeatures />

            {/* 4. Primary Dashboard Grid — 3 Column */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start'>
                <div className='bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow'>
                    <FinancialOverview />
                </div>
                <div className="space-y-8">
                    <div className='bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow'>
                        <RecentActivity />
                    </div>
                    <TaxAuditor />
                </div>
                <div>
                    <ComplianceReminders />
                </div>
            </div>

            {/* 5. Annual Filing Summary (Live Data) */}
            <AnnualTaxSummary userData={userData} taxSummary={taxSummary} />

            {/* 6. Quick Estimates — Manual Calculator */}
            <TaxCalculatorCard />
            
            {/* 7. Upcoming Deadlines */}
            <TaxCalendar />

            <OnboardingModal 
                isOpen={showOnboarding} 
                user={userData} 
                onComplete={() => setShowOnboarding(false)} 
            />
        </div>
    )
}

export default Dashboard