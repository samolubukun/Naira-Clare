"use client"
import React, { useContext, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, FileDown, CheckCircle2, AlertCircle, FileText, BarChart3, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function FilingPage() {
    const { userData } = useContext(UserContext);
    const taxSummary = useQuery(api.finance.getTaxSummary, userData ? { userId: userData._id } : "skip");
    const stats = useQuery(api.finance.getDashboardStats, userData ? { userId: userData._id } : "skip");
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const expenses = useQuery(api.finance.getExpenses, userData ? { userId: userData._id } : "skip");

    const hasIncome = (income || []).length > 0;
    const hasExpenses = (expenses || []).length > 0;
    const hasProfile = !!userData?.salaryProfile;
    const hasPension = userData?.salaryProfile?.pensionEnabled;

    const checklist = [
        { title: "Income Sources Logged", status: hasIncome ? "completed" : "missing", desc: hasIncome ? `${(income || []).length} income entries recorded.` : "Log your income to proceed." },
        { title: "Expenses & Deductions", status: hasExpenses ? "completed" : "pending", desc: hasExpenses ? `${(expenses || []).length} expenses tracked.` : "Log deductible expenses for relief." },
        { title: "Salary Profile Completed", status: hasProfile ? "completed" : "missing", desc: hasProfile ? "Salary structure set for CRA." : "Complete onboarding to set salary profile." },
        { title: "Pension Contribution", status: hasPension ? "completed" : "pending", desc: hasPension ? "8% pension contribution applied." : "Enable pension in your profile for relief." },
        { title: "Direct Assessment Form A", status: hasIncome ? "completed" : "pending", desc: "Auto-generated from your income data." },
        { title: "WHT Credit Certificates", status: "pending", desc: "Upload or verify WHT certificates from clients." },
    ];

    const completedCount = checklist.filter(i => i.status === 'completed').length;
    const progress = Math.round((completedCount / checklist.length) * 100);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Filing Preparation</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Personal Income Tax return — 2025 assessment year</p>
                </div>
                <Button onClick={async () => {
                    try {
                        const res = await fetch('/api/export', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'filing-summary', data: { taxSummary, income, expenses, userData } }),
                        });
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url;
                        a.download = `NairaClare_Tax_Filing_${new Date().getFullYear()}.txt`;
                        a.click(); URL.revokeObjectURL(url);
                        toast.success('Filing summary exported!');
                    } catch { toast.error('Export failed'); }
                }} className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                    <FileDown className="w-4 h-4 mr-2" /> Export to Accountant
                </Button>
            </div>

            {/* Progress */}
            <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 rounded-[2rem]">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-black text-[#0f172a]">Filing Readiness</p>
                        <span className="text-2xl font-black text-[#2D5A27]">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#8FAF6A] to-[#2D5A27] rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">{completedCount} of {checklist.length} items complete</p>
                </CardContent>
            </Card>

            {/* Tax Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-[2rem] border-gray-100"><CardContent className="p-5"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross Income</p><p className="text-xl font-black text-[#0f172a] mt-1">₦{(taxSummary?.grossAnnualIncome || 0).toLocaleString()}</p></CardContent></Card>
                <Card className="rounded-[2rem] border-gray-100"><CardContent className="p-5"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Deductions</p><p className="text-xl font-black text-emerald-600 mt-1">₦{(taxSummary?.totalDeductions || 0).toLocaleString()}</p></CardContent></Card>
                <Card className="rounded-[2rem] border-gray-100"><CardContent className="p-5"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tax Liability</p><p className="text-xl font-black text-[#2D5A27] mt-1">₦{(taxSummary?.annualTax || 0).toLocaleString()}</p></CardContent></Card>
            </div>

            {/* Checklist */}
            <Card className="rounded-[2rem] border-gray-100">
                <CardContent className="p-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Filing Checklist</h3>
                    <div className="space-y-3">
                        {checklist.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className={`w-5 h-5 ${item.status === 'missing' ? 'text-rose-500' : 'text-amber-500'}`} />}
                                    <div>
                                        <p className="text-sm font-black text-[#0f172a]">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'missing' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-4">
                <FileText className="w-4 h-4" />
                <span>Filing deadline: March 31, {new Date().getFullYear()} · {stats?.daysToDeadline || 0} days remaining</span>
            </div>
        </div>
    );
}

export default FilingPage;
