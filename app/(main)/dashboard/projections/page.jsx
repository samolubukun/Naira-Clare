"use client"
import React, { useState, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Loader2, AlertTriangle, Sparkles } from 'lucide-react';

function ProjectionsPage() {
    const { userData } = useContext(UserContext);
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const taxSummary = useQuery(api.finance.getTaxSummary, userData ? { userId: userData._id } : "skip");
    const [loading, setLoading] = useState(false);
    const [projection, setProjection] = useState(null);

    const runProjection = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projections', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ income: income || [], taxSummary, userData }),
            });
            const data = await res.json();
            setProjection(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const totalIncome = (income || []).reduce((s, i) => s + (i.amount * (i.exchangeRate || 1)), 0);

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Income Projections</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">AI-powered income trends and full-year tax liability forecast</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-violet-50 to-white border-violet-100 rounded-[2rem]">
                    <CardContent className="p-5"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">YTD Income</p><p className="text-2xl font-black text-violet-600 mt-1">₦{totalIncome.toLocaleString()}</p></CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100 rounded-[2rem]">
                    <CardContent className="p-5"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Tax Estimate</p><p className="text-2xl font-black text-blue-600 mt-1">₦{(taxSummary?.annualTax || 0).toLocaleString()}</p></CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 rounded-[2rem]">
                    <CardContent className="p-5"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Rate</p><p className="text-2xl font-black text-emerald-600 mt-1">{(taxSummary?.effectiveRate || 0).toFixed(1)}%</p></CardContent>
                </Card>
            </div>

            {!projection ? (
                <Card className="rounded-[2.5rem] border-gray-100 bg-gradient-to-b from-violet-50/30 to-white">
                    <CardContent className="p-8 text-center">
                        <BarChart3 className="w-16 h-16 text-violet-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-[#0f172a] mb-2">Run AI Projection</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">Analyze your income trend, project full-year liability, and get warnings if you're nearing a higher tax band.</p>
                        <Button onClick={runProjection} disabled={loading} className="rounded-2xl px-8 bg-[#2D5A27] text-white font-black">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />} Generate Projection
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="rounded-[2rem] border-gray-100">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#0f172a]">AI Projection Results</h3>
                            <Button variant="ghost" size="sm" onClick={() => setProjection(null)} className="text-xs font-bold text-gray-400">Reset</Button>
                        </div>
                        {projection.insights?.map((insight, i) => (
                            <div key={i} className={`p-4 rounded-2xl border ${insight.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                <div className="flex items-start gap-3">
                                    {insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500 mt-1" /> : <TrendingUp className="w-4 h-4 text-emerald-500 mt-1" />}
                                    <div><p className="font-black text-sm text-[#0f172a]">{insight.title}</p><p className="text-xs text-gray-500 mt-1">{insight.description}</p></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default ProjectionsPage;
