"use client"
import React from 'react';
import { FileDown, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

function AnnualTaxSummary({ userData, taxSummary }) {
    const currentYear = new Date().getFullYear();
    const assessmentYear = currentYear - 1;

    // Dynamic checklist based on real data
    const hasIncome = taxSummary?.grossAnnualIncome > 0;
    const hasPension = userData?.salaryProfile?.pensionEnabled;
    const hasDeductions = (taxSummary?.totalDeductions || 0) > 0;

    const checklist = [
        { title: "Direct Assessment Form A", status: hasIncome ? "completed" : "missing", desc: hasIncome ? "Your income data is ready for filing." : "Log income to generate Form A." },
        { title: "WHT Credit Certificates", status: "pending", desc: "Upload or verify WHT certificates from clients." },
        { title: "Evidence of Life Insurance", status: hasDeductions ? "completed" : "missing", desc: hasDeductions ? "Deductions applied for relief." : "Upload policy document for relief." },
        { title: "Pension Contribution", status: hasPension ? "completed" : "pending", desc: hasPension ? "Auto-calculated from payroll." : "Enable pension in your profile." },
    ];

    const completedCount = checklist.filter(c => c.status === 'completed').length;
    const efficiency = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

    const handleExport = async () => {
        try {
            const res = await fetch('/api/export', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'filing-summary', data: { taxSummary, userData } }),
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            a.download = `NairaClare_Filing_Summary_${currentYear}.txt`;
            a.click(); URL.revokeObjectURL(url);
            toast.success('Filing summary exported!');
        } catch { toast.error('Export failed'); }
    };

    return (
        <Card className="rounded-[2.5rem] border-gray-100 bg-white overflow-hidden shadow-sm">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#2D5A27]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#0f172a] tracking-tight">{currentYear} Filing Summary</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Assessment Year {assessmentYear} / LIRS &middot; FIRS</p>
                        </div>
                    </div>
                    <Button onClick={handleExport} className="rounded-2xl px-6 bg-[#2D5A27] text-white font-black shadow-lg shadow-[#2D5A27]/10 h-12">
                        <FileDown className="w-4 h-4 mr-2" /> Export to Accountant
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filing Checklist</h3>
                        <div className="space-y-2">
                            {checklist.map((item, i) => (
                                <div key={i} className="flex items-start md:items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent hover:border-emerald-100 transition-all gap-2">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                        {item.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 md:mt-0" /> : <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 md:mt-0 ${item.status === 'missing' ? 'text-rose-500' : 'text-amber-500'}`} />}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-[#0f172a] leading-tight">{item.title}</p>
                                            <p className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[6.5px] md:text-[8px] font-black uppercase tracking-widest px-1 py-0.5 rounded-lg flex-shrink-0 whitespace-nowrap ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'missing' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="text-[10px] font-black text-[#2D5A27] uppercase tracking-widest mb-5">Tax Optimization Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end border-b border-emerald-100/50 pb-3">
                                <span className="text-[11px] font-bold text-gray-500">Gross Assessment</span>
                                <span className="text-base font-black text-[#0f172a]">₦{(taxSummary?.grossAnnualIncome || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-emerald-100/50 pb-3">
                                <span className="text-[11px] font-bold text-gray-500">Consolidated Relief</span>
                                <span className="text-base font-black text-emerald-600">-₦{(taxSummary?.craApplied || taxSummary?.cra || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-emerald-100/50 pb-3">
                                <span className="text-[11px] font-bold text-gray-500">Total Deductions</span>
                                <span className="text-base font-black text-emerald-600">-₦{(taxSummary?.totalDeductions || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-sm font-black text-[#0f172a]">Final Tax Liability</span>
                                <span className="text-xl font-black text-[#2D5A27]">₦{(taxSummary?.annualTax || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-[9px] font-bold text-emerald-700/60 uppercase tracking-widest">Tax strategy efficiency: {efficiency}% of checklist complete</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default AnnualTaxSummary;
