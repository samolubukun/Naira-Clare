"use client"
import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/app/_context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Users, Mail, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';

function ClientsPage() {
    const { userData } = useContext(UserContext);
    const clients = useQuery(api.finance.getClients, userData ? { userId: userData._id } : "skip");
    const createClient = useMutation(api.finance.createClient);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', tin: '', email: '', phoneNumber: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name) { toast.error("Client name is required"); return; }
        try {
            await createClient({ userId: userData._id, ...form });
            toast.success("Client added!");
            setForm({ name: '', tin: '', email: '', phoneNumber: '' });
            setOpen(false);
        } catch (err) { toast.error("Failed to add client"); }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Client Management</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Manage clients, linked invoices, and WHT records</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] max-w-md">
                        <DialogHeader><DialogTitle className="text-xl font-black">Add New Client</DialogTitle></DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Client Name</Label>
                                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Company or individual name" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">TIN (Optional)</Label>
                                <Input value={form.tin} onChange={e => setForm({...form, tin: e.target.value})} placeholder="Tax Identification Number" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</Label>
                                    <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone</Label>
                                    <Input value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} className="rounded-xl" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">Add Client</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(clients || []).length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No clients yet</p>
                    </div>
                ) : (clients || []).map(client => (
                    <Card key={client._id} className="rounded-[2rem] border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                                <span className="text-xl font-black text-indigo-600">{client.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-black text-[#0f172a] mb-1">{client.name}</h3>
                            {client.tin && <p className="text-[10px] font-bold text-gray-400 mb-2">TIN: {client.tin}</p>}
                            <div className="space-y-1 mt-3">
                                {client.email && <p className="text-xs text-gray-500 flex items-center gap-2"><Mail className="w-3 h-3" />{client.email}</p>}
                                {client.phoneNumber && <p className="text-xs text-gray-500 flex items-center gap-2"><Phone className="w-3 h-3" />{client.phoneNumber}</p>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ClientsPage;
