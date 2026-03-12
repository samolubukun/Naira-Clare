"use client"
import React, { useContext } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RefreshCw, Plus, Trash2, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const CATEGORIES = ['Rent', 'NHIS', 'Pension', 'Life Insurance', 'Retainer', 'Subscription', 'Other'];

function RecurringPage() {
    const { userData } = useContext(UserContext);
    const entries = useQuery(api.finance.getRecurringEntries, userData ? { userId: userData._id } : "skip");
    const createEntry = useMutation(api.finance.createRecurringEntry);
    const deleteEntry = useMutation(api.finance.deleteRecurringEntry);
    const toggleEntry = useMutation(api.finance.toggleRecurringEntry);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', amount: '', category: 'Rent', frequency: 'Monthly', type: 'expense' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.amount) { toast.error("Name and amount required"); return; }
        try {
            await createEntry({
                userId: userData._id,
                name: form.name,
                amount: Number(form.amount),
                category: form.category,
                frequency: form.frequency,
                type: form.type,
            });
            toast.success("Recurring entry added!");
            setForm({ name: '', amount: '', category: 'Rent', frequency: 'Monthly', type: 'expense' });
            setOpen(false);
        } catch (err) { toast.error("Failed to add entry"); }
    };

    const handleDelete = async (id) => {
        try { await deleteEntry({ id }); toast.success("Entry removed"); } catch { toast.error("Failed to remove"); }
    };

    const handleToggle = async (id) => {
        try { await toggleEntry({ id }); } catch { toast.error("Failed to toggle"); }
    };

    const activeEntries = (entries || []).filter(e => e.active);
    const pausedEntries = (entries || []).filter(e => !e.active);
    const totalMonthly = activeEntries.reduce((s, e) => s + e.amount, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Recurring Entries</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Auto-log monthly rent, NHIS, pension, retainers, and more</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] max-w-md">
                        <DialogHeader><DialogTitle className="text-xl font-black">Add Recurring Entry</DialogTitle></DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Entry Name</Label>
                                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Office Rent, NHIS Premium" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Amount (₦)</Label>
                                    <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</Label>
                                    <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Frequency</Label>
                                    <Select value={form.frequency} onValueChange={v => setForm({...form, frequency: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                                            <SelectItem value="Annually">Annually</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Type</Label>
                                    <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="expense">Expense</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">Add Recurring Entry</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary */}
            <Card className="bg-gradient-to-r from-teal-50 to-white border-teal-100 rounded-[2rem]">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Auto-Log Total</p>
                        <p className="text-3xl font-black text-teal-600">₦{totalMonthly.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-500">{activeEntries.length} active</p>
                        {pausedEntries.length > 0 && <p className="text-[10px] text-gray-400">{pausedEntries.length} paused</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Active Entries */}
            <div className="space-y-3">
                {(entries || []).length === 0 ? (
                    <div className="text-center py-16">
                        <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No recurring entries set up</p>
                        <p className="text-sm text-gray-300 mt-1">Add entries to auto-log them each period</p>
                    </div>
                ) : (entries || []).map(entry => (
                    <Card key={entry._id} className={`rounded-2xl border-gray-100 hover:shadow-sm transition-all ${!entry.active ? 'opacity-50' : ''}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.active ? 'bg-teal-50' : 'bg-gray-100'}`}>
                                    <RefreshCw className={`w-5 h-5 ${entry.active ? 'text-teal-600' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0f172a] text-sm">{entry.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{entry.category} · {entry.frequency} · {entry.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-black text-[#0f172a] mr-2">₦{entry.amount.toLocaleString()}</p>
                                <Button variant="ghost" size="icon" onClick={() => handleToggle(entry._id)} className="rounded-xl text-gray-400 hover:text-amber-600">
                                    {entry.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(entry._id)} className="rounded-xl text-gray-400 hover:text-rose-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default RecurringPage;
