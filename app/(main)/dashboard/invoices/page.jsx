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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Receipt, Send, Check, Clock, AlertTriangle, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { formatMoney, parseMoney } from '@/lib/utils';

function InvoicesPage() {
    const { userData } = useContext(UserContext);
    const invoices = useQuery(api.finance.getInvoices, userData ? { userId: userData._id } : "skip");
    const clients = useQuery(api.finance.getClients, userData ? { userId: userData._id } : "skip");
    const createInvoice = useMutation(api.finance.createInvoice);
    const updateStatus = useMutation(api.finance.updateInvoiceStatus);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        clientId: '', invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
        amount: '', vatRate: 7.5, whtRate: 5, date: new Date().toISOString().split('T')[0],
        dueDate: '', items: [{ description: '', quantity: 1, unitPrice: 0 }],
    });

    const calculateTotals = () => {
        const subtotal = form.items.reduce((s, i) => s + (i.quantity * parseFloat(parseMoney(i.unitPrice) || 0)), 0);
        const vat = subtotal * (form.vatRate / 100);
        const wht = subtotal * (form.whtRate / 100);
        return { subtotal, vat, wht, total: subtotal + vat };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.clientId || form.items.length === 0) { toast.error("Select a client and add items"); return; }
        const { subtotal, vat, wht } = calculateTotals();
        try {
            await createInvoice({
                userId: userData._id, clientId: form.clientId,
                invoiceNumber: form.invoiceNumber, amount: subtotal,
                vatAmount: vat, whtAmount: wht, status: 'sent',
                date: form.date, dueDate: form.dueDate || form.date,
                items: form.items.map(i => ({ description: i.description, quantity: Number(i.quantity), unitPrice: parseFloat(parseMoney(i.unitPrice)) })),
            });
            toast.success("Invoice created!");
            setOpen(false);
        } catch (err) { toast.error("Failed to create invoice"); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateStatus({ invoiceId: id, status });
            toast.success(status === 'paid' ? "Invoice marked paid — income auto-logged!" : `Status updated to ${status}`);
        } catch (err) { toast.error("Failed to update status"); }
    };

    const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }] });

    const statusConfig = {
        sent: { icon: Send, color: 'text-blue-600 bg-blue-50', label: 'Sent' },
        viewed: { icon: Eye, color: 'text-purple-600 bg-purple-50', label: 'Viewed' },
        paid: { icon: Check, color: 'text-emerald-600 bg-emerald-50', label: 'Paid' },
        overdue: { icon: AlertTriangle, color: 'text-rose-600 bg-rose-50', label: 'Overdue' },
    };

    const totalRevenue = (invoices || []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const totalPending = (invoices || []).filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Invoice Builder</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Create, send, and track tax-compliant invoices</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                            <Plus className="w-4 h-4 mr-2" /> New Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">Create Invoice</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Client</Label>
                                    <Select value={form.clientId} onValueChange={v => setForm({...form, clientId: v})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                                        <SelectContent>
                                            {(clients || []).map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Invoice #</Label>
                                    <Input value={form.invoiceNumber} onChange={e => setForm({...form, invoiceNumber: e.target.value})} className="rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Date</Label>
                                    <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Due Date</Label>
                                    <Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Line Items</Label>
                                {form.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-6 gap-2 items-end">
                                        <div className="col-span-3">
                                            <Input placeholder="Description" value={item.description} onChange={e => { const items = [...form.items]; items[idx].description = e.target.value; setForm({...form, items}); }} className="rounded-xl text-sm" />
                                        </div>
                                        <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => { const items = [...form.items]; items[idx].quantity = e.target.value; setForm({...form, items}); }} className="rounded-xl text-sm" />
                                        <div className="col-span-2">
                                            <Input type="text" inputMode="decimal" placeholder="Price" value={formatMoney(item.unitPrice)} onChange={e => { const items = [...form.items]; items[idx].unitPrice = formatMoney(e.target.value); setForm({...form, items}); }} className="rounded-xl text-sm" />
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="rounded-xl text-xs"><Plus className="w-3 h-3 mr-1" /> Add Item</Button>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-bold">₦{calculateTotals().subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">VAT ({form.vatRate}%)</span><span className="font-bold">₦{calculateTotals().vat.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">WHT ({form.whtRate}%)</span><span className="font-bold text-rose-500">-₦{calculateTotals().wht.toLocaleString()}</span></div>
                                <div className="flex justify-between text-lg font-black border-t pt-2"><span>Total</span><span>₦{calculateTotals().total.toLocaleString()}</span></div>
                            </div>

                            <Button type="submit" className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">Create Invoice</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 rounded-[2rem]">
                    <CardContent className="p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue (Paid)</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">₦{totalRevenue.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-amber-50 to-white border-amber-100 rounded-[2rem]">
                    <CardContent className="p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">₦{totalPending.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                {(invoices || []).length === 0 ? (
                    <div className="text-center py-16">
                        <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No invoices yet</p>
                    </div>
                ) : (invoices || []).map((inv) => {
                    const sc = statusConfig[inv.status] || statusConfig.sent;
                    return (
                        <Card key={inv._id} className="rounded-2xl border-gray-100 hover:shadow-sm transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sc.color}`}>
                                        <sc.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#0f172a] text-sm">{inv.invoiceNumber}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{moment(inv.date).format('MMM D, YYYY')} · Due {moment(inv.dueDate).format('MMM D')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-black text-[#0f172a]">₦{inv.amount.toLocaleString()}</p>
                                    {inv.status !== 'paid' && (
                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(inv._id, 'paid')} className="rounded-xl text-xs font-bold text-emerald-600 border-emerald-100">
                                            <Check className="w-3 h-3 mr-1" /> Mark Paid
                                        </Button>
                                    )}
                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${sc.color}`}>{sc.label}</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default InvoicesPage;
