"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

function TaxCalendar() {
    const [expandedIdx, setExpandedIdx] = useState(null);

    // Calculate deadlines dynamically
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;

    const getNextDeadlines = () => {
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed

        // March 31 — Annual Self-Assessment
        let annualDate = new Date(year, 2, 31);
        if (now > annualDate) annualDate = new Date(year + 1, 2, 31);

        // 10th of next month — PAYE Remittance
        let payeDate = new Date(year, month + 1, 10);
        if (now > payeDate) payeDate = new Date(year, month + 2, 10);

        // 21st of next month — VAT Remittance
        let vatDate = new Date(year, month + 1, 21);
        if (now > vatDate) vatDate = new Date(year, month + 2, 21);

        const deadlines = [
            {
                name: 'Annual Self-Assessment',
                date: annualDate,
                days: Math.max(0, Math.ceil((annualDate - now) / msPerDay)),
                description: 'Personal Income Tax return filing with LIRS/FIRS. Covers all income earned in the previous tax year.',
                action: 'Complete your filing preparation',
                link: '/dashboard/filing',
            },
            {
                name: 'PAYE Remittance',
                date: payeDate,
                days: Math.max(0, Math.ceil((payeDate - now) / msPerDay)),
                description: 'Monthly PAYE deduction remittance for employees to LIRS.',
                action: 'Check your payroll remittance schedule',
                link: '/dashboard/payroll',
            },
            {
                name: 'VAT Remittance',
                date: vatDate,
                days: Math.max(0, Math.ceil((vatDate - now) / msPerDay)),
                description: 'Monthly VAT collected remittance to FIRS.',
                action: 'Review your VAT collected vs paid',
                link: '/dashboard/vat',
            },
        ].sort((a, b) => a.days - b.days);

        return deadlines;
    };

    const deadlines = getNextDeadlines();

    const getUrgencyColor = (days) => {
        if (days <= 14) return { dot: 'bg-rose-500', bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600' };
        if (days <= 60) return { dot: 'bg-amber-500', bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600' };
        return { dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600' };
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6">
                <CalendarIcon className="w-5 h-5 text-[#2D5A27]" />
                <h3 className="text-lg font-black text-[#0f172a] tracking-tight">Upcoming Deadlines</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {deadlines.map((deadline, idx) => {
                    const colors = getUrgencyColor(deadline.days);
                    const isExpanded = expandedIdx === idx;

                    return (
                        <motion.div
                            key={deadline.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex-1 rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${isExpanded ? colors.bg : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} ${deadline.days <= 14 ? 'animate-pulse' : ''}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-[#0f172a] truncate">{deadline.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                        {formatDate(deadline.date)} · <span className={`${colors.text} font-black`}>{deadline.days} day{deadline.days !== 1 ? 's' : ''}</span>
                                    </p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{deadline.description}</p>
                                            <Link href={deadline.link} 
                                                className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${colors.text} hover:underline`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {deadline.action}
                                                <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default TaxCalendar;
