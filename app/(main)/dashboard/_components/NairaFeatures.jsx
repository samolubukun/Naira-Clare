"use client"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Link from 'next/link'
import {
    ArrowRight,
    TrendingUp,
    Receipt,
    Calculator,
    MessageCircle,
    ShieldCheck,
    FileText,
    Camera,
    Upload,
    RefreshCw,
    Users,
    Scale,
    CreditCard,
    Building2,
    FileCheck,
    Award,
    BarChart3,
    Sparkles,
    Search,
    PlusCircle,
    Wallet
} from 'lucide-react'
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';

const featureCategories = [
    {
        title: 'Income & Expense',
        features: [
            { name: 'Income Logging', icon: Wallet, description: 'Full income ledger — log, edit, filter by type', href: '/dashboard/income', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-600' },
            { name: 'Expense Logging', icon: Calculator, description: 'Expense ledger with deductibility toggle', href: '/dashboard/expenses', color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-600' },
            { name: 'Receipt Scanner', icon: Camera, description: 'AI extracts and pre-fills expense form', href: '/dashboard/receipt-scan', color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-600' },
            { name: 'Bank Import', icon: Upload, description: 'Upload PDF, AI categorises transactions', href: '/dashboard/bank-import', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-600' },
            { name: 'Recurring Entries', icon: RefreshCw, description: 'Auto-log rent, NHIS, pension monthly', href: '/dashboard/recurring', color: 'from-teal-500/20 to-teal-500/5', iconColor: 'text-teal-600' },
        ]
    },
    {
        title: 'Business Tools',
        features: [
            { name: 'Invoice Builder', icon: Receipt, description: 'Create, send, track — paid auto-logs income', href: '/dashboard/invoices', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-600' },
            { name: 'Client Management', icon: Users, description: 'Directory, linked invoices, WHT records', href: '/dashboard/clients', color: 'from-indigo-500/20 to-indigo-500/5', iconColor: 'text-indigo-600' },
            { name: 'WHT Tracker', icon: Scale, description: 'Log withholding tax, auto-reduces tax owed', href: '/dashboard/wht', color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-600' },
            { name: 'VAT Management', icon: CreditCard, description: 'VAT collected vs paid, FIRS remittance', href: '/dashboard/vat', color: 'from-rose-500/20 to-rose-500/5', iconColor: 'text-rose-600' },
            { name: 'Payroll', icon: Building2, description: 'Run payroll, payslips, remittance schedule', href: '/dashboard/payroll', color: 'from-cyan-500/20 to-cyan-500/5', iconColor: 'text-cyan-600' },
        ]
    },
    {
        title: 'Filing & Compliance',
        features: [
            { name: 'Filing Prep', icon: FileCheck, description: 'PIT return summary, gaps flagged, export', href: '/dashboard/filing', color: 'from-green-500/20 to-green-500/5', iconColor: 'text-green-600' },
            { name: 'TCC Readiness', icon: Award, description: 'Tax Clearance Certificate qualification', href: '/dashboard/tcc', color: 'from-yellow-500/20 to-yellow-500/5', iconColor: 'text-yellow-600' },
        ]
    },
    {
        title: 'AI & Intelligence',
        features: [
            { name: 'Projections', icon: BarChart3, description: 'Income trend, full-year liability forecast', href: '/dashboard/projections', color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-600' },
            { name: 'Deduction AI', icon: Sparkles, description: 'AI flags missed deductions, one-tap apply', href: '/dashboard/deductions', color: 'from-pink-500/20 to-pink-500/5', iconColor: 'text-pink-600' },
            { name: 'Tax Q&A', icon: MessageCircle, description: 'AI-powered Nigerian tax Q&A assistant', href: '/dashboard/chat', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-600' },
            { name: 'Anomaly Check', icon: Search, description: 'Flags duplicates, spikes, missing months', href: '/dashboard/anomalies', color: 'from-red-500/20 to-red-500/5', iconColor: 'text-red-600' },
        ]
    },
];

function NairaFeatures() {
    const { userData } = useContext(UserContext);
    
    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <div>
                    <h2 className='text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter'>
                        Operations Hub
                    </h2>
                    <p className='text-sm text-muted-foreground mt-1 font-medium'>Master your cashflow with precision.</p>
                </div>
                <Link href="/dashboard/income">
                    <Button className='rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20 hover:scale-105 transition-all'>
                        <PlusCircle className="w-4 h-4 mr-2" /> Log Income
                    </Button>
                </Link>
            </div>

            <div className="space-y-8">
                {featureCategories.map((category) => (
                    <div key={category.title}>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{category.title}</h3>
                        <div className={`grid gap-3 ${category.features.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-5'} ${category.features.length === 4 ? 'lg:grid-cols-4' : ''}`}>
                            {category.features.map((feature, index) => (
                                <motion.div
                                    key={feature.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + index * 0.03 }}
                                >
                                    <Link href={feature.href}>
                                        <Card className='group relative border-border 
                                        hover:border-[#2D5A27]/30 transition-all duration-500 cursor-pointer
                                        hover:shadow-xl hover:-translate-y-1 h-full bg-white backdrop-blur-sm rounded-[1.5rem]'>
                                            <CardContent className='p-5 flex flex-col justify-center items-center h-full min-h-[130px]'>
                                                <div className={`relative mb-3 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-all duration-500 shadow-sm`}>
                                                    <feature.icon className={`w-6 h-6 ${feature.iconColor} z-10`} />
                                                </div>
                                                <h2 className='text-xs font-black text-center text-[#0f172a] mb-1 leading-tight tracking-tight'>
                                                    {feature.name}
                                                </h2>
                                                <p className='text-[9px] text-center text-muted-foreground leading-tight hidden sm:block px-1 opacity-80 font-medium'>
                                                    {feature.description}
                                                </p>
                                                <div className='flex items-center gap-1 text-[8px] font-black text-[#2D5A27] opacity-0
                                                group-hover:opacity-100 transition-all duration-300 mt-2 transform translate-y-2 group-hover:translate-y-0 uppercase tracking-widest'>
                                                    <span>Open</span>
                                                    <ArrowRight className='w-2.5 h-2.5' />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NairaFeatures
