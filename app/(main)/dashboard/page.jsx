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
import { Shield, LayoutDashboard } from 'lucide-react';
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
            <div className={`rounded-[2.5rem] p-6 transition-all duration-700 ${pulse ? 'bg-emerald-50 ring-2 ring-emerald-300 shadow-lg' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${pulse ? 'bg-emerald-500 animate-ping' : 'bg-[#008751]'}`} />
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Tax Estimate</span>
                    </div>
                    <div className="flex-shrink-0">
                        <span className={`text-2xl md:text-4xl font-black tracking-tight transition-colors duration-500 ${pulse ? 'text-emerald-600' : 'text-[#0f172a]'}`}>
                            ₦{(taxSummary?.annualTax || 0).toLocaleString()}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 ml-2 md:ml-3 uppercase">Annual PAYE</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        <div>
                            <div className="flex justify-between mb-1 md:mb-1.5">
                                <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Tax Year</span>
                                <span className="text-[8px] md:text-[9px] font-black text-[#008751]">{Math.round(yearProgress)}%</span>
                            </div>
                            <Progress value={yearProgress} className="h-1.5 md:h-2 rounded-full bg-gray-100" indicatorClassName="bg-gradient-to-r from-[#008751] to-[#2D5A27]" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1 md:mb-1.5">
                                <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Income</span>
                                <span className="text-[8px] md:text-[9px] font-black text-blue-600">₦{((taxSummary?.grossAnnualIncome || 0) / 1000).toFixed(0)}k</span>
                            </div>
                            <Progress value={Math.min(100, yearProgress > 0 ? 80 : 0)} className="h-1.5 md:h-2 rounded-full bg-blue-50" indicatorClassName="bg-gradient-to-r from-blue-400 to-blue-600" />
                        </div>
                        <div className="col-span-2 md:col-span-1 flex items-center justify-between md:justify-end gap-3 md:gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6 mt-1 md:mt-0">
                            <div className="text-center">
                                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Rate</p>
                                <p className="text-sm md:text-lg font-black text-[#0f172a]">{(taxSummary?.effectiveRate || 0).toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Monthly</p>
                                <p className="text-sm md:text-lg font-black text-[#008751]">₦{(taxSummary?.monthlyTax || 0).toLocaleString()}</p>
                            </div>
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