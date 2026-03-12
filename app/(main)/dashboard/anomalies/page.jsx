"use client"
import React, { useState, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

function AnomaliesPage() {
    const { userData } = useContext(UserContext);
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const expenses = useQuery(api.finance.getExpenses, userData ? { userId: userData._id } : "skip");
    const [loading, setLoading] = useState(false);
    const [anomalies, setAnomalies] = useState(null);

    const runDetection = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/anomalies', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ income: income || [], expenses: expenses || [] }),
            });
            const data = await res.json();
            setAnomalies(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const iconMap = { critical: AlertTriangle, warning: AlertTriangle, info: Info, clean: CheckCircle2 };
    const colorMap = {
        critical: 'bg-rose-50 border-rose-100 text-rose-600',
        warning: 'bg-amber-50 border-amber-100 text-amber-600',
        info: 'bg-blue-50 border-blue-100 text-blue-600',
        clean: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    };

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Anomaly Detection</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">AI flags duplicate entries, unusual spikes, and missing months</p>
            </div>

            {!anomalies ? (
                <Card className="rounded-[2.5rem] border-gray-100 bg-gradient-to-b from-red-50/20 to-white">
                    <CardContent className="p-8 text-center">
                        <Search className="w-16 h-16 text-red-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-[#0f172a] mb-2">Scan for Anomalies</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">AI reviews your financial data for inconsistencies, duplicates, and patterns that need attention.</p>
                        <Button onClick={runDetection} disabled={loading} className="rounded-2xl px-8 bg-[#2D5A27] text-white font-black">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />} Run Detection
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-[#0f172a]">{anomalies.findings?.length || 0} Findings</h3>
                        <Button variant="ghost" size="sm" onClick={() => setAnomalies(null)} className="text-xs font-bold text-gray-400">Rescan</Button>
                    </div>
                    {anomalies.findings?.map((f, i) => {
                        const Icon = iconMap[f.severity] || Info;
                        const colors = colorMap[f.severity] || colorMap.info;
                        return (
                            <Card key={i} className={`rounded-2xl border ${colors} hover:shadow-sm transition-all`}>
                                <CardContent className="p-5 flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-[#0f172a]">{f.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AnomaliesPage;
