"use client"
import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, Check, X, Loader2, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { CREDIT_LIMITS } from '@/config/credits';
import { UserContext } from '@/app/_context/UserContext';
import { useContext } from 'react';

function StatementImporter({ userId, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState(null);
    const fileInputRef = useRef(null);
    const createIncome = useMutation(api.finance.createIncome);
    const createExpense = useMutation(api.finance.createExpense);
    const decrementCredits = useMutation(api.users.decrementCredits);
    const { userData } = useContext(UserContext);
    const currentCredits = userData?.credits ?? 0;

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                importStatement(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const importStatement = async (base64) => {
        if (currentCredits < CREDIT_LIMITS.FREE_PLAN.BANK_IMPORT_COST) {
            toast.error("Low Credits", {
                description: `You need ${CREDIT_LIMITS.FREE_PLAN.BANK_IMPORT_COST} credits to import a bank statement.`
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/import-statement', {
                method: 'POST',
                body: JSON.stringify({ pdfData: base64 }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            await decrementCredits({ 
                id: userData._id, 
                amount: CREDIT_LIMITS.FREE_PLAN.BANK_IMPORT_COST 
            });
            
            setTransactions(data);
            toast.success("Statement analyzed!", {
                description: `Used ${CREDIT_LIMITS.FREE_PLAN.BANK_IMPORT_COST} credits.`
            });
        } catch (err) {
            toast.error("Failed to import statement: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAll = async () => {
        if (!transactions) return;
        setLoading(true);
        try {
            for (const tx of transactions) {
                const dedupeKey = `${tx.date}_${tx.amount}_${tx.description.toLowerCase().trim().replace(/\s+/g, '_')}`;

                if (tx.type === 'income') {
                    await createIncome({
                        userId,
                        source: tx.description,
                        type: tx.category.toLowerCase(),
                        amount: tx.amount,
                        currency: "NGN",
                        exchangeRate: 1,
                        date: tx.date,
                        isTaxable: tx.isTaxableOrDeductible,
                        dedupeKey
                    });
                } else {
                    await createExpense({
                        userId,
                        description: tx.description,
                        category: tx.category,
                        amount: tx.amount,
                        date: tx.date,
                        isDeductible: tx.isTaxableOrDeductible,
                        dedupeKey
                    });
                }
            }
            toast.success(`${transactions.length} transactions imported!`);
            setTransactions(null);
            if (onComplete) onComplete();
        } catch (err) {
            toast.error("Error during batch import");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-dashed border-2 border-blue-100 bg-blue-50/20 rounded-[2.5rem]">
            <CardContent className="p-8 text-center">
                {!transactions && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                            <FileText className="w-8 h-8 text-[#2D5A27]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#0f172a] mb-1">Bank Import</h3>
                            <p className="text-xs text-muted-foreground font-medium">Auto-category bank transactions via AI</p>
                        </div>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                        />
                        <Button 
                            onClick={() => fileInputRef.current.click()}
                            disabled={loading}
                            className="rounded-2xl px-8 font-black bg-[#2D5A27] text-white"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />} Import PDF
                        </Button>
                    </div>
                )}

                {transactions && (
                    <div className="text-left space-y-6">
                        <div className="flex items-center justify-between border-b border-white pb-4">
                            <h3 className="font-black text-[#0f172a] flex items-center gap-2">
                                <ListFilter className="w-5 h-5 text-[#2D5A27]" />
                                Review Transactions ({transactions.length})
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setTransactions(null)} className="rounded-full">
                                <X className="w-4 h-4 text-rose-500" />
                            </Button>
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-2 no-scrollbar">
                            {transactions.map((tx, i) => (
                                <div key={i} className="p-3 bg-white rounded-xl border border-blue-50 flex justify-between items-center text-[10px] font-bold">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[#0f172a] truncate">{tx.description}</p>
                                        <p className="text-gray-400">{tx.date} • {tx.category}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className={tx.type === 'income' ? 'text-emerald-600' : 'text-[#0f172a]'}>
                                            {tx.type === 'income' ? '+' : '-'}₦{(tx.amount || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleConfirmAll} disabled={loading} className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} 
                            Import All Transactions
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default StatementImporter;
