"use client"
import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { CREDIT_LIMITS } from '@/config/credits';
import { UserContext } from '@/app/_context/UserContext';
import { useContext } from 'react';

function ExpenseScanner({ userId, onComplete }) {
    const [image, setImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);
    const createExpense = useMutation(api.finance.createExpense);
    const decrementCredits = useMutation(api.users.decrementCredits);
    const { userData } = useContext(UserContext);
    const currentCredits = userData?.credits ?? 0;

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                scanReceipt(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const scanReceipt = async (base64) => {
        if (currentCredits < CREDIT_LIMITS.FREE_PLAN.RECEIPT_SCAN_COST) {
            toast.error("Low Credits", {
                description: `You need ${CREDIT_LIMITS.FREE_PLAN.RECEIPT_SCAN_COST} credits to scan a receipt.`
            });
            setImage(null);
            return;
        }

        setScanning(true);
        try {
            const res = await fetch('/api/scan-receipt', {
                method: 'POST',
                body: JSON.stringify({ image: base64 }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            await decrementCredits({ 
                id: userData._id, 
                amount: CREDIT_LIMITS.FREE_PLAN.RECEIPT_SCAN_COST 
            });
            
            setResult(data);
            toast.success("Receipt scanned!", {
                description: `Used ${CREDIT_LIMITS.FREE_PLAN.RECEIPT_SCAN_COST} credits.`
            });
        } catch (err) {
            toast.error("Failed to scan receipt: " + err.message);
        } finally {
            setScanning(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        try {
            await createExpense({
                userId,
                description: result.description,
                category: result.category,
                amount: parseFloat(result.amount),
                date: result.date || new Date().toISOString().split('T')[0],
                isDeductible: result.isDeductible
            });
            toast.success("Expense logged via AI!");
            if (onComplete) onComplete();
            setResult(null);
            setImage(null);
        } catch (err) {
            toast.error("Failed to save expense");
        }
    };

    return (
        <Card className="border-dashed border-2 border-emerald-100 bg-emerald-50/20 rounded-[2.5rem]">
            <CardContent className="p-8 text-center">
                {!image && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                            <Camera className="w-8 h-8 text-[#2D5A27]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#0f172a] mb-1">AI Receipt Scanner</h3>
                            <p className="text-xs text-muted-foreground font-medium">Drop a receipt or click to upload</p>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                        />
                        <Button 
                            onClick={() => fileInputRef.current.click()}
                            className="rounded-2xl px-8 font-black bg-[#2D5A27] text-white"
                        >
                            <Upload className="w-4 h-4 mr-2" /> Upload Receipt
                        </Button>
                    </div>
                )}

                {image && scanning && (
                    <div className="space-y-6 py-10">
                        <Loader2 className="w-12 h-12 text-[#2D5A27] animate-spin mx-auto" />
                        <p className="text-sm font-black text-[#2D5A27] animate-pulse uppercase tracking-widest">AI is analyzing your receipt...</p>
                    </div>
                )}

                {image && result && !scanning && (
                    <div className="space-y-6 text-left">
                        <div className="flex items-center gap-4 border-b border-white pb-4 mb-4">
                            <Sparkles className="w-6 h-6 text-[#8FAF6A]" />
                            <h3 className="font-black text-[#0f172a]">AI Extracted Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400">Description</label>
                                <p className="font-bold text-[#0f172a]">{result.description}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400">Amount</label>
                                <p className="font-black text-emerald-600">₦{(parseFloat(result.amount) || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400">Category</label>
                                <p className="font-bold text-[#0f172a]">{result.category}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400">Deductible</label>
                                <p className="font-bold text-[#0f172a]">{result.isDeductible ? "YES" : "NO"}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleSave} className="flex-1 rounded-xl font-bold bg-[#2D5A27] text-white">
                                <Check className="w-4 h-4 mr-2" /> Confirm
                            </Button>
                            <Button onClick={() => {setImage(null); setResult(null)}} variant="ghost" className="rounded-xl font-bold text-rose-500 hover:bg-rose-50">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ExpenseScanner;
