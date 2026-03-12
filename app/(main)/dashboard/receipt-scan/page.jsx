"use client"
import React, { useContext } from 'react';
import { UserContext } from '@/app/_context/UserContext';
import ExpenseScanner from '../_components/ExpenseScanner';

function ReceiptScanPage() {
    const { userData } = useContext(UserContext);
    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">AI Receipt Scanner</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">Upload a receipt photo and let AI extract expense details automatically</p>
            </div>
            <div className="max-w-lg">
                <ExpenseScanner userId={userData?._id} />
            </div>
        </div>
    );
}

export default ReceiptScanPage;
