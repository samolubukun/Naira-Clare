"use client"
import React, { useState, useContext } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { CREDIT_LIMITS } from '@/config/credits';
import { toast } from 'sonner';

function TaxAuditor() {
    const { userData } = useContext(UserContext);
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const expenses = useQuery(api.finance.getExpenses, userData ? { userId: userData._id } : "skip");
    
    const [loading, setLoading] = useState(false);
    const [audit, setAudit] = useState(null);
    const decrementCredits = useMutation(api.users.decrementCredits);
    const currentCredits = userData?.credits ?? 0;

    const runAudit = async () => {
        if (currentCredits < CREDIT_LIMITS.FREE_PLAN.AI_AUDIT_COST) {
            toast.error("Low Credits", {
                description: "You need at least " + CREDIT_LIMITS.FREE_PLAN.AI_AUDIT_COST + " credits for an AI Audit."
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/tax-audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userData, income: income || [], expenses: expenses || [] })
            });
            const data = await res.json();
            
            if (data.insights) {
                await decrementCredits({ 
                    id: userData._id, 
                    amount: CREDIT_LIMITS.FREE_PLAN.AI_AUDIT_COST 
                });
                setAudit(data);
                toast.success("Audit Complete", {
                    description: `Used ${CREDIT_LIMITS.FREE_PLAN.AI_AUDIT_COST} credits.`
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Audit Failed", { description: "Something went wrong during the audit." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
            <CardContent className="p-6 md:p-8">
                {!audit && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#2D5A27]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#0f172a] tracking-tight">AI Compliance Audit</h3>
                                <p className="text-[10px] text-gray-400 font-medium">Scans for missing reliefs or filing risks</p>
                            </div>
                        </div>
                        <Button onClick={runAudit} disabled={loading} className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6 hover:scale-[1.02] transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />} 
                            Run Live Audit
                        </Button>
                    </div>
                )}

                {audit && (
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-[#0f172a] tracking-tight">Audit Insights</h3>
                            <Button variant="ghost" size="sm" onClick={() => setAudit(null)} className="text-[10px] font-black uppercase text-gray-400 hover:text-[#0f172a]">Reset</Button>
                        </div>
                        
                        <div className="space-y-3">
                            {audit.insights.map((insight, i) => (
                                <div key={i} className={`p-4 rounded-2xl border ${insight.type === 'risk' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                    <div className="flex items-start gap-3">
                                        {insight.type === 'risk' 
                                            ? <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" /> 
                                            : <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />}
                                        <div>
                                            <p className="font-black text-sm text-[#0f172a] mb-1">{insight.title}</p>
                                            <p className="text-[11px] text-gray-500 leading-relaxed">{insight.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button className="w-full rounded-xl bg-[#2D5A27] text-white font-bold py-4 text-xs group">
                            Apply Optimized Strategy <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default TaxAuditor;
