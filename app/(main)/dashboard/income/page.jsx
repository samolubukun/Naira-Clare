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
import { Plus, Wallet, ArrowUpRight, Filter, Search, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { formatMoney, parseMoney } from '@/lib/utils';

function IncomePage() {
    const { userData } = useContext(UserContext);
    const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
    const createIncome = useMutation(api.finance.createIncome);
    const deleteIncome = useMutation(api.finance.deleteIncome);
    const updateIncome = useMutation(api.finance.updateIncome);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editEntry, setEditEntry] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [form, setForm] = useState({
        source: '', type: 'salary', amount: '', currency: 'NGN',
        exchangeRate: 1, date: new Date().toISOString().split('T')[0], isTaxable: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.source || !form.amount) { toast.error("Fill in all fields"); return; }
        try {
            await createIncome({
                userId: userData._id, source: form.source, type: form.type,
                amount: parseFloat(parseMoney(form.amount)), currency: form.currency,
                exchangeRate: parseFloat(form.exchangeRate), date: form.date, isTaxable: form.isTaxable,
            });
            toast.success("Income logged!");
            setForm({ source: '', type: 'salary', amount: '', currency: 'NGN', exchangeRate: 1, date: new Date().toISOString().split('T')[0], isTaxable: true });
            setOpen(false);
        } catch (err) { toast.error("Failed to log income"); }
    };

    const filtered = (income || []).filter(i => {
        if (filterType !== 'all' && i.type !== filterType) return false;
        if (searchQuery && !i.source.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const totalIncome = filtered.reduce((sum, i) => sum + (i.amount * (i.exchangeRate || 1)), 0);
    const types = [...new Set((income || []).map(i => i.type))];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Income Ledger</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Track all income sources for accurate tax calculation</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                            <Plus className="w-4 h-4 mr-2" /> Log Income
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">Log New Income</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Source</Label>
                                <Input value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="e.g. Freelance project, Salary" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Type</Label>
                                    <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['salary', 'freelance', 'rental', 'investment', 'business', 'other'].map(t => (
                                                <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Amount (₦)</Label>
                                    <Input type="text" inputMode="decimal" value={formatMoney(form.amount)} onChange={e => setForm({...form, amount: formatMoney(e.target.value)})} placeholder="0" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Date</Label>
                                    <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Currency</Label>
                                    <Select value={form.currency} onValueChange={v => setForm({...form, currency: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NGN">NGN (₦)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {form.currency !== 'NGN' && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Exchange Rate to NGN</Label>
                                    <Input type="number" value={form.exchangeRate} onChange={e => setForm({...form, exchangeRate: e.target.value})} className="rounded-xl" />
                                </div>
                            )}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <input type="checkbox" checked={form.isTaxable} onChange={e => setForm({...form, isTaxable: e.target.checked})} className="w-4 h-4 rounded" />
                                <Label className="text-sm font-bold">Taxable income</Label>
                            </div>
                            <Button type="submit" className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">Log Income</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Running Total */}
            <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 rounded-[2rem]">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Running Total</p>
                        <p className="text-3xl font-black text-[#0f172a]">₦{totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-500">{filtered.length} entries</p>
                        <p className="text-[10px] text-gray-400">{types.length} source types</p>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search sources..." className="pl-9 rounded-xl" />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px] rounded-xl"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Income List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No income entries yet</p>
                        <p className="text-sm text-gray-300 mt-1">Log your first income to get started</p>
                    </div>
                ) : filtered.map((entry) => (
                    <Card key={entry._id} className="rounded-2xl border-gray-100 hover:border-emerald-100 transition-all hover:shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0f172a] text-sm">{entry.source}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {entry.type} · {moment(entry.date).format('MMM D, YYYY')} {!entry.isTaxable && '· Non-taxable'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right mr-2">
                                    <p className="font-black text-emerald-600">₦{(entry.amount * (entry.exchangeRate || 1)).toLocaleString()}</p>
                                    {entry.currency !== 'NGN' && <p className="text-[9px] text-gray-400">{entry.currency} {entry.amount.toLocaleString()}</p>}
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-xl text-gray-400 hover:text-blue-600" onClick={() => { setEditEntry({ id: entry._id, source: entry.source, amount: formatMoney(entry.amount), date: entry.date }); setEditOpen(true); }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl text-gray-400 hover:text-rose-600" onClick={async () => { try { await deleteIncome({ id: entry._id }); toast.success('Deleted'); } catch { toast.error('Failed'); } }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="rounded-[2rem] max-w-sm">
                    <DialogHeader><DialogTitle className="text-xl font-black">Edit Income</DialogTitle></DialogHeader>
                    {editEntry && (
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Source</Label><Input value={editEntry.source} onChange={e => setEditEntry({...editEntry, source: e.target.value})} className="rounded-xl" /></div>
                            <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Amount</Label><Input type="text" inputMode="decimal" value={editEntry.amount} onChange={e => setEditEntry({...editEntry, amount: formatMoney(e.target.value)})} className="rounded-xl" /></div>
                            <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Date</Label><Input type="date" value={editEntry.date} onChange={e => setEditEntry({...editEntry, date: e.target.value})} className="rounded-xl" /></div>
                            <Button className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6" onClick={async () => { try { await updateIncome({ id: editEntry.id, source: editEntry.source, amount: Number(parseMoney(editEntry.amount)), date: editEntry.date }); toast.success('Updated!'); setEditOpen(false); } catch { toast.error('Failed'); } }}>Save Changes</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default IncomePage;
