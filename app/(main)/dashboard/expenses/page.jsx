"use client"
import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Calculator, ArrowDownRight, Filter, Search, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { formatMoney, parseMoney } from '@/lib/utils';

const CATEGORIES = ['Rent', 'NHIS', 'Pension', 'Life Insurance', 'Loan Interest', 'Business', 'Transport', 'Office Supplies', 'Professional Fees', 'Other'];

function ExpensesPage() {
    const { userData } = useContext(UserContext);
    const expenses = useQuery(api.finance.getExpenses, userData ? { userId: userData._id } : "skip");
    const createExpense = useMutation(api.finance.createExpense);
    const deleteExpense = useMutation(api.finance.deleteExpense);
    const updateExpense = useMutation(api.finance.updateExpense);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editEntry, setEditEntry] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [form, setForm] = useState({
        description: '', category: 'Business', amount: '',
        date: new Date().toISOString().split('T')[0], isDeductible: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.description || !form.amount) { toast.error("Fill in all fields"); return; }
        try {
            await createExpense({
                userId: userData._id, description: form.description, category: form.category,
                amount: parseFloat(parseMoney(form.amount)), date: form.date, isDeductible: form.isDeductible,
            });
            toast.success("Expense logged!");
            setForm({ description: '', category: 'Business', amount: '', date: new Date().toISOString().split('T')[0], isDeductible: true });
            setOpen(false);
        } catch (err) { toast.error("Failed to log expense"); }
    };

    const filtered = (expenses || []).filter(e => {
        if (filterCategory !== 'all' && e.category !== filterCategory) return false;
        if (searchQuery && !e.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const totalExpenses = filtered.reduce((sum, e) => sum + e.amount, 0);
    const deductibleTotal = filtered.filter(e => e.isDeductible).reduce((sum, e) => sum + e.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    filtered.forEach(e => {
        categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
    });

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Expense Ledger</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Track expenses and maximize deductions</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                            <Plus className="w-4 h-4 mr-2" /> Log Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">Log New Expense</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</Label>
                                <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="e.g. Office rent, Internet bill" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</Label>
                                    <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Amount (₦)</Label>
                                    <Input type="text" inputMode="decimal" value={formatMoney(form.amount)} onChange={e => setForm({...form, amount: formatMoney(e.target.value)})} placeholder="0" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Date</Label>
                                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                <input type="checkbox" checked={form.isDeductible} onChange={e => setForm({...form, isDeductible: e.target.checked})} className="w-4 h-4 rounded" />
                                <Label className="text-sm font-bold text-emerald-700">Tax deductible expense</Label>
                            </div>
                            <Button type="submit" className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">Log Expense</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-purple-50 to-white border-purple-100 rounded-[2rem]">
                    <CardContent className="p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Expenses</p>
                        <p className="text-2xl font-black text-[#0f172a] mt-1">₦{totalExpenses.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 rounded-[2rem]">
                    <CardContent className="p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deductible</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">₦{deductibleTotal.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100 rounded-[2rem]">
                    <CardContent className="p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categories</p>
                        <p className="text-2xl font-black text-blue-600 mt-1">{Object.keys(categoryBreakdown).length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
                <Card className="rounded-[2rem] border-gray-100">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Category Breakdown</h3>
                        <div className="space-y-3">
                            {Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                                <div key={cat} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                    <span className="text-[11px] sm:text-sm font-bold text-[#0f172a] truncate lg:overflow-visible lg:whitespace-normal">{cat}</span>
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:justify-end">
                                        <div className="flex-1 sm:w-24 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#2D5A27] rounded-full" style={{ width: `${(amt / totalExpenses) * 100}%` }} />
                                        </div>
                                        <span className="text-[11px] sm:text-sm font-black text-gray-500 whitespace-nowrap min-w-[70px] sm:w-28 text-right">₦{amt.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search expenses..." className="pl-9 rounded-xl" />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[160px] rounded-xl"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Expense List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No expense entries yet</p>
                        <p className="text-sm text-gray-300 mt-1">Log expenses to claim deductions</p>
                    </div>
                ) : filtered.map((entry) => (
                    <Card key={entry._id} className="rounded-2xl border-gray-100 hover:border-purple-100 transition-all hover:shadow-sm">
                        <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${entry.isDeductible ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                                    <ArrowDownRight className={`w-4 h-4 sm:w-5 sm:h-5 ${entry.isDeductible ? 'text-emerald-600' : 'text-gray-400'}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-[#0f172a] text-[11px] sm:text-sm leading-tight break-words">{entry.description}</p>
                                    <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-tight">
                                        {entry.category} · {moment(entry.date).format('MMM D, YYYY')}
                                        {entry.isDeductible && <span className="text-emerald-500 ml-1">· Deductible</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
                                <p className="font-black text-[#0f172a] text-[11px] sm:text-base whitespace-nowrap">₦{entry.amount.toLocaleString()}</p>
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-gray-400 hover:text-blue-600" onClick={() => { setEditEntry({ id: entry._id, description: entry.description, amount: formatMoney(entry.amount), date: entry.date }); setEditOpen(true); }}>
                                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-gray-400 hover:text-rose-600" onClick={async () => { try { await deleteExpense({ id: entry._id }); toast.success('Deleted'); } catch { toast.error('Failed'); } }}>
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="rounded-[2rem] max-w-sm">
                    <DialogHeader><DialogTitle className="text-xl font-black">Edit Expense</DialogTitle></DialogHeader>
                    {editEntry && (
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</Label><Input value={editEntry.description} onChange={e => setEditEntry({...editEntry, description: e.target.value})} className="rounded-xl" /></div>
                            <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Amount</Label><Input type="text" inputMode="decimal" value={editEntry.amount} onChange={e => setEditEntry({...editEntry, amount: formatMoney(e.target.value)})} className="rounded-xl" /></div>
                            <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Date</Label><Input type="date" value={editEntry.date} onChange={e => setEditEntry({...editEntry, date: e.target.value})} className="rounded-xl" /></div>
                            <Button className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6" onClick={async () => { try { await updateExpense({ id: editEntry.id, description: editEntry.description, amount: Number(parseMoney(editEntry.amount)), date: editEntry.date }); toast.success('Updated!'); setEditOpen(false); } catch { toast.error('Failed'); } }}>Save Changes</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ExpensesPage;
