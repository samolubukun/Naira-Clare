"use client"
import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';

function WHTPage() {
    const { userData } = useContext(UserContext);
    const whtCredits = useQuery(api.finance.getWhtCredits, userData ? { userId: userData._id } : "skip");
    const totalWHT = (whtCredits || []).reduce((s, w) => s + w.amount, 0);

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">WHT Tracker</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">Withholding tax deducted by clients — auto-reduces your tax owed</p>
            </div>

            <Card className="bg-gradient-to-r from-amber-50 to-white border-amber-100 rounded-[2rem]">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total WHT Credits</p>
                        <p className="text-3xl font-black text-amber-600">₦{totalWHT.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Auto-deducted from your annual tax liability</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                        <Scale className="w-8 h-8 text-amber-600" />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {(whtCredits || []).length === 0 ? (
                    <div className="text-center py-16">
                        <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No WHT credits yet</p>
                        <p className="text-sm text-gray-300 mt-1">WHT is auto-logged when invoices are marked paid</p>
                    </div>
                ) : (whtCredits || []).map(credit => (
                    <Card key={credit._id} className="rounded-2xl border-gray-100 hover:shadow-sm transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0f172a] text-sm">WHT Credit</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{moment(credit.date).format('MMM D, YYYY')}</p>
                                </div>
                            </div>
                            <p className="font-black text-amber-600">₦{credit.amount.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default WHTPage;
