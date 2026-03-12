"use client"
import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, TrendingUp, TrendingDown, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function VATPage() {
    const { userData } = useContext(UserContext);
    const vatSummary = useQuery(api.finance.getVatSummary, userData ? { userId: userData._id } : "skip");
    const invoices = useQuery(api.finance.getInvoices, userData ? { userId: userData._id } : "skip");

    const vatCollected = vatSummary?.vatCollected || 0;
    const pendingVat = vatSummary?.pendingVat || 0;
    const netVat = vatCollected;

    // Monthly schedule
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">VAT Management</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">VAT collected vs paid, monthly remittance tracking</p>
                </div>
                <Button variant="outline" className="rounded-2xl font-bold border-gray-200" onClick={async () => {
                    try {
                        const res = await fetch('/api/export', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'vat-firs', data: { invoices } }),
                        });
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url;
                        a.download = `NairaClare_VAT_FIRS_${new Date().toISOString().slice(0,7)}.txt`;
                        a.click(); URL.revokeObjectURL(url);
                        toast.success('FIRS report exported!');
                    } catch { toast.error('Export failed'); }
                }}>
                    <FileDown className="w-4 h-4 mr-2" /> FIRS Export
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 rounded-[2rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">VAT Collected</p>
                        </div>
                        <p className="text-2xl font-black text-emerald-600">₦{vatCollected.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-amber-50 to-white border-amber-100 rounded-[2rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-amber-600" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending (Unpaid Invoices)</p>
                        </div>
                        <p className="text-2xl font-black text-amber-600">₦{pendingVat.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100 rounded-[2rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Remittance Due</p>
                        </div>
                        <p className="text-2xl font-black text-blue-600">₦{netVat.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Remittance Schedule */}
            <Card className="rounded-[2rem] border-gray-100">
                <CardContent className="p-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Monthly Remittance Schedule</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {months.map((month, idx) => {
                            const isPast = idx < now.getMonth();
                            const isCurrent = idx === now.getMonth();
                            return (
                                <div key={month} className={`p-3 rounded-xl text-center transition-all ${isCurrent ? 'bg-[#2D5A27] text-white' : isPast ? 'bg-gray-50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                                    <p className="text-[10px] font-black uppercase">{month}</p>
                                    <p className="text-xs font-bold mt-1">{isPast ? '✓' : isCurrent ? 'Due' : '—'}</p>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-4">VAT remittance is due by the 21st of each month for the prior month's collections.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default VATPage;
