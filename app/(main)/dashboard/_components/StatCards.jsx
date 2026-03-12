"use client"
import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { 
    Wallet, Calculator, ShieldCheck, 
    PiggyBank, Award, Clock 
} from 'lucide-react';

function StatCards() {
    const { userData } = useContext(UserContext);
    const stats = useQuery(api.finance.getDashboardStats, userData ? { userId: userData._id } : "skip");

    if (!stats) {
        return (
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-[100px] rounded-2xl" />
                ))}
            </div>
        );
    }

    const getDaysColor = (days) => {
        if (days <= 14) return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: 'text-rose-500' };
        if (days <= 60) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: 'text-amber-500' };
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: 'text-emerald-500' };
    };

    const getComplianceLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Attention';
    };

    const daysColors = getDaysColor(stats.daysToDeadline);

    const cards = [
        // Row 1 — Money overview
        {
            label: 'Total Income YTD',
            value: `₦${(stats.totalIncomeYTD || 0).toLocaleString()}`,
            sub: `${stats.incomeSourcesCount || 0} source${stats.incomeSourcesCount !== 1 ? 's' : ''}`,
            icon: Wallet,
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            border: 'border-emerald-100',
        },
        {
            label: 'Estimated Tax Owed',
            value: `₦${(stats.estimatedTaxOwed || 0).toLocaleString()}`,
            sub: `${(stats.effectiveRate || 0).toFixed(1)}% effective rate`,
            icon: Calculator,
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            border: 'border-blue-100',
        },
        {
            label: 'Total Deductions',
            value: `₦${(stats.totalDeductions || 0).toLocaleString()}`,
            sub: `saving ₦${(stats.taxSaved || 0).toLocaleString()}`,
            icon: ShieldCheck,
            bg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            border: 'border-purple-100',
        },
        // Row 2 — Action and compliance
        {
            label: 'Monthly Provision',
            value: `₦${(stats.monthlyProvision || 0).toLocaleString()}`,
            sub: 'Save this month',
            icon: PiggyBank,
            bg: 'bg-orange-50',
            iconColor: 'text-orange-600',
            border: 'border-orange-100',
        },
        {
            label: 'Compliance Score',
            value: `${stats.complianceScore || 0} / 100`,
            sub: getComplianceLabel(stats.complianceScore),
            icon: Award,
            bg: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            border: 'border-cyan-100',
        },
        {
            label: 'Days to Deadline',
            value: `${stats.daysToDeadline || 0} days`,
            sub: 'March 31 deadline',
            icon: Clock,
            bg: daysColors.bg,
            iconColor: daysColors.icon,
            border: daysColors.border,
        },
    ];

    return (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                >
                    <Card className={`${card.bg} ${card.border} border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full`}>
                        <CardContent className="p-2 md:p-4 flex flex-col items-center text-center">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center mb-1.5 md:mb-2`}>
                                <card.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${card.iconColor}`} />
                            </div>
                            <span className="text-[6.5px] md:text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1 min-h-[1.5rem] flex items-center leading-tight">{card.label}</span>
                            <p className="text-[10px] md:text-base font-black text-[#0f172a] tracking-tight mb-0.5 leading-tight">{card.value}</p>
                            <p className="text-[7.5px] md:text-[8px] font-bold text-gray-400 leading-tight">{card.sub}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

export default StatCards;
