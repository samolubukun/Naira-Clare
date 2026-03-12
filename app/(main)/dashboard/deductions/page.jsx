"use client"
import React, { useState, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, CheckCircle2, Zap } from 'lucide-react';
import { toast } from 'sonner';

function DeductionsPage() {
    const { userData } = useContext(UserContext);
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const expenses = useQuery(api.finance.getExpenses, userData ? { userId: userData._id } : "skip");
    const [loading, setLoading] = useState(false);
    const [opportunities, setOpportunities] = useState(null);

    const scanDeductions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/deductions', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ income: income || [], expenses: expenses || [], userData }),
            });
            const data = await res.json();
            setOpportunities(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Deduction Opportunities</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">AI scans your data to find missed deductions</p>
            </div>

            {!opportunities ? (
                <Card className="rounded-[2.5rem] border-gray-100 bg-gradient-to-b from-pink-50/30 to-white">
                    <CardContent className="p-8 text-center">
                        <Sparkles className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-[#0f172a] mb-2">Find Missing Deductions</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">AI analyzes your income and expense patterns to identify deductions you may have missed.</p>
                        <Button onClick={scanDeductions} disabled={loading} className="rounded-2xl px-8 bg-[#2D5A27] text-white font-black">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />} Scan for Deductions
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-[#0f172a]">Found {opportunities.deductions?.length || 0} Opportunities</h3>
                        <Button variant="ghost" size="sm" onClick={() => setOpportunities(null)} className="text-xs font-bold text-gray-400">Rescan</Button>
                    </div>
                    {opportunities.deductions?.map((d, i) => (
                        <Card key={i} className="rounded-2xl border-emerald-100 bg-emerald-50/30 hover:shadow-sm transition-all">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-[#0f172a]">{d.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{d.description}</p>
                                        {d.estimatedSavings && <p className="text-xs font-black text-emerald-600 mt-2">Potential savings: ₦{Number(d.estimatedSavings).toLocaleString()}</p>}
                                    </div>
                                </div>
                                <Button size="sm" className="rounded-xl bg-[#2D5A27] text-white font-bold text-xs" onClick={() => toast.success("Deduction applied!")}>
                                    Apply
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DeductionsPage;
