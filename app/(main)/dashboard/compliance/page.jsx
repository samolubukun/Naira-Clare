"use client"
import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2, AlertCircle, Calendar, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function CompliancePage() {
    const { userData } = useContext(UserContext);
    const stats = useQuery(api.finance.getDashboardStats, userData ? { userId: userData._id } : "skip");
    const score = stats?.complianceScore || 0;

    const getScoreColor = () => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-rose-600';
    };

    const actions = [
        { label: 'Complete Filing Preparation', href: '/dashboard/filing', urgency: stats?.daysToDeadline <= 30 ? 'high' : 'low' },
        { label: 'Review TCC Readiness', href: '/dashboard/tcc', urgency: 'medium' },
        { label: 'Log Missing Income Sources', href: '/dashboard/income', urgency: 'medium' },
        { label: 'Track WHT Credits', href: '/dashboard/wht', urgency: 'low' },
        { label: 'Manage VAT Remittance', href: '/dashboard/vat', urgency: 'low' },
    ];

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Compliance Overview</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">FIRS/LIRS filing schedules and compliance status</p>
            </div>

            <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-100 rounded-[2.5rem]">
                <CardContent className="p-8 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Compliance Score</p>
                        <p className={`text-5xl font-black ${getScoreColor()}`}>{score}</p>
                        <p className="text-sm text-gray-400 mt-1">out of 100</p>
                    </div>
                    <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center">
                        <ShieldCheck className={`w-12 h-12 ${getScoreColor()}`} />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-gray-100">
                <CardContent className="p-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Recommended Actions</h3>
                    <div className="space-y-3">
                        {actions.map((action, i) => (
                            <Link key={i} href={action.href}>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${action.urgency === 'high' ? 'bg-rose-500' : action.urgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                        <span className="text-sm font-bold text-[#0f172a] group-hover:text-[#2D5A27] transition-colors">{action.label}</span>
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-[#2D5A27]" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-[2rem] border-gray-100">
                    <CardContent className="p-5 flex items-center gap-4">
                        <Calendar className="w-8 h-8 text-[#2D5A27]" />
                        <div>
                            <p className="font-black text-[#0f172a]">{stats?.daysToDeadline || 0} days</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">To filing deadline</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-gray-100">
                    <CardContent className="p-5 flex items-center gap-4">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="font-black text-[#0f172a]">{(stats?.effectiveRate || 0).toFixed(1)}%</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Effective tax rate</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default CompliancePage;
