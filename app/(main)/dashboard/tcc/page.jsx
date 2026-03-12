"use client"
import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

function TCCPage() {
    const { userData } = useContext(UserContext);
    const stats = useQuery(api.finance.getDashboardStats, userData ? { userId: userData._id } : "skip");
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");

    const hasIncome = (income || []).length > 0;
    const hasProfile = !!userData?.salaryProfile;
    const complianceOk = (stats?.complianceScore || 0) >= 60;
    const isReady = hasIncome && hasProfile && complianceOk;

    const criteria = [
        { label: 'Income sources documented', met: hasIncome },
        { label: 'Salary profile completed', met: hasProfile },
        { label: 'Compliance score ≥ 60', met: complianceOk },
        { label: 'All filings up to date', met: false },
        { label: 'No outstanding tax liabilities', met: true },
    ];

    const metCount = criteria.filter(c => c.met).length;

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">TCC Readiness</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">Tax Clearance Certificate qualification status</p>
            </div>

            <Card className={`rounded-[2.5rem] border-2 ${isReady ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-[2rem] mx-auto mb-4 flex items-center justify-center ${isReady ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                        <Award className={`w-10 h-10 ${isReady ? 'text-emerald-600' : 'text-amber-600'}`} />
                    </div>
                    <h2 className={`text-2xl font-black ${isReady ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isReady ? 'TCC Ready' : 'Not Yet Qualified'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">{metCount} of {criteria.length} criteria met</p>
                </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-gray-100">
                <CardContent className="p-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Qualification Criteria</h3>
                    <div className="space-y-3">
                        {criteria.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                {item.met ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                                <span className={`text-sm font-bold ${item.met ? 'text-[#0f172a]' : 'text-gray-400'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default TCCPage;
