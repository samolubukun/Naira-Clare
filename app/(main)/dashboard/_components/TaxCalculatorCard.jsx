"use client"
import React from 'react';
import { Calculator, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import TaxCalculator from '@/components/TaxCalculator';

function TaxCalculatorCard() {
    return (
        <Card className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
            <CardContent className="p-0">
                <div className="p-8 border-b border-gray-50 bg-[#FAFAF9]/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#008751]/10 flex items-center justify-center">
                                <Calculator className="w-6 h-6 text-[#008751]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#0f172a] tracking-tight">Quick Tax Estimator</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manual "What-If" Calculator</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                            <Zap className="w-3 h-3 text-[#008751]" />
                            <span className="text-[10px] font-black text-[#008751] uppercase tracking-tighter">Does not affect your logged data</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-1">
                    <TaxCalculator isDashboard={true} />
                </div>
            </CardContent>
        </Card>
    );
}

export default TaxCalculatorCard;
