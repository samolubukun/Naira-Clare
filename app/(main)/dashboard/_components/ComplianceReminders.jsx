"use client"
import React, { useContext, useMemo, useEffect } from 'react';
import { Bell, Shield, AlertTriangle, FileText, Wallet, CheckCircle2, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';

function ComplianceReminders() {
    const { userData } = useContext(UserContext);
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const expenses = useQuery(api.finance.getExpenses, userData ? { userId: userData._id } : "skip");
    const stats = useQuery(api.finance.getDashboardStats, userData ? { userId: userData._id } : "skip");
    const persistedReminders = useQuery(api.finance.getReminders, userData ? { userId: userData._id } : "skip");
    const createReminder = useMutation(api.finance.createReminder);
    const dismissReminder = useMutation(api.finance.dismissReminder);
    const markDone = useMutation(api.finance.markReminderDone);

    const smartReminders = useMemo(() => {
        const items = [];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthIncome = (income || []).filter(i => {
            const d = new Date(i.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        if (thisMonthIncome.length === 0) {
            items.push({ key: `no-income-${currentYear}-${currentMonth}`, type: 'income', message: 'No income logged this month — log your income to keep your tax estimate accurate', deadline: now.toISOString().split('T')[0], urgent: false });
        }

        const daysToDeadline = stats?.daysToDeadline ?? 999;
        if (daysToDeadline <= 90) {
            items.push({ key: `filing-${currentYear}`, type: 'filing', message: `Annual Filing — ${daysToDeadline} days left. Complete your filing preparation before March 31`, deadline: `${currentYear}-03-31`, urgent: daysToDeadline <= 30 });
        }

        const expenseCategories = new Set((expenses || []).map(e => e.category));
        const missing = ['Rent', 'NHIS', 'Pension', 'Life Insurance'].filter(c => !expenseCategories.has(c));
        if (missing.length >= 2 && (expenses || []).length > 0) {
            items.push({ key: `deductions-missing-${missing.length}`, type: 'deduction', message: `Missing ${missing.length} deductible categories — log ${missing.slice(0, 2).join(' and ')} expenses to claim relief`, deadline: now.toISOString().split('T')[0], urgent: false });
        }

        const payeDate = new Date(currentYear, currentMonth + 1, 10);
        const payeDays = Math.max(0, Math.ceil((payeDate - now) / (1000 * 60 * 60 * 24)));
        if (payeDays <= 14) {
            items.push({ key: `paye-${currentYear}-${currentMonth}`, type: 'paye', message: `PAYE Remittance — ${payeDays} days. Ensure employee deductions are remitted`, deadline: payeDate.toISOString().split('T')[0], urgent: payeDays <= 5 });
        }

        const vatDate = new Date(currentYear, currentMonth + 1, 21);
        const vatDays = Math.max(0, Math.ceil((vatDate - now) / (1000 * 60 * 60 * 24)));
        if (vatDays <= 14) {
            items.push({ key: `vat-${currentYear}-${currentMonth}`, type: 'vat', message: `VAT Remittance — ${vatDays} days. Remit collected VAT to FIRS`, deadline: vatDate.toISOString().split('T')[0], urgent: vatDays <= 5 });
        }

        return items;
    }, [income, expenses, stats]);

    useEffect(() => {
        if (!userData || !persistedReminders) return;
        const existingKeys = new Set((persistedReminders || []).map(r => r.generatedKey));
        smartReminders.forEach(sr => {
            if (!existingKeys.has(sr.key)) {
                createReminder({ userId: userData._id, type: sr.type, message: sr.message, deadline: sr.deadline, generatedKey: sr.key });
            }
        });
    }, [smartReminders, persistedReminders, userData]);

    const handleDismiss = async (id) => { try { await dismissReminder({ id }); } catch {} };
    const handleDone = async (id) => { try { await markDone({ id }); } catch {} };

    const visibleReminders = persistedReminders || [];
    const iconForType = (type) => {
        const map = { income: Wallet, filing: Shield, deduction: AlertTriangle, paye: FileText, vat: Bell };
        return map[type] || Bell;
    };

    return (
        <Card className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#2D5A27]" />
                        <h3 className="text-lg font-black text-[#0f172a] tracking-tight">Smart Reminders</h3>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{visibleReminders.length} active</span>
                </div>

                {visibleReminders.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-500">All caught up!</p>
                        <p className="text-[10px] text-gray-400 mt-1">No pending reminders</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visibleReminders.map((item) => {
                            const Icon = iconForType(item.type);
                            const isUrgent = item.type === 'filing' || item.type === 'paye' || item.type === 'vat';
                            return (
                                <div key={item._id} className={`p-4 rounded-2xl border transition-all ${isUrgent ? 'bg-rose-50 border-rose-100' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isUrgent ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold ${isUrgent ? 'text-rose-700' : 'text-[#0f172a]'}`}>
                                                {item.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4 ml-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleDone(item._id)}
                                            className="h-7 rounded-lg text-[9px] font-black text-emerald-600 hover:bg-emerald-50 bg-emerald-50/30 uppercase tracking-widest px-2.5">
                                            <Check className="w-3 h-3 mr-1" /> Done
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDismiss(item._id)}
                                            className="h-7 rounded-lg text-[9px] font-black text-gray-400 hover:bg-gray-100 bg-gray-50 uppercase tracking-widest px-2.5">
                                            <X className="w-3 h-3 mr-1" /> Dismiss
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ComplianceReminders;
