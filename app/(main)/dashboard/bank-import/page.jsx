"use client"
import React, { useContext } from 'react';
import { UserContext } from '@/app/_context/UserContext';
import StatementImporter from '../_components/StatementImporter';

function BankImportPage() {
    const { userData } = useContext(UserContext);
    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Bank Statement Import</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">Upload a PDF bank statement — AI categorises all transactions automatically</p>
            </div>
            <div className="max-w-lg">
                <StatementImporter userId={userData?._id} />
            </div>
        </div>
    );
}

export default BankImportPage;
