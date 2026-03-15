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
import { Plus, Building2, Play, Users, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { formatMoney, parseMoney } from '@/lib/utils';

function PayrollPage() {
    const { userData } = useContext(UserContext);
    const employees = useQuery(api.finance.getEmployees, userData ? { userId: userData._id } : "skip");
    const createEmployee = useMutation(api.finance.createEmployee);
    const runPayroll = useMutation(api.finance.runPayroll);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ employeeName: '', basic: '', housing: '', transport: '', other: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.employeeName || !form.basic) { toast.error("Name and basic salary required"); return; }
        try {
            await createEmployee({
                userId: userData._id, employeeName: form.employeeName,
                salaryStructure: { 
                    basic: Number(parseMoney(form.basic)), 
                    housing: Number(parseMoney(form.housing || 0)), 
                    transport: Number(parseMoney(form.transport || 0)), 
                    other: Number(parseMoney(form.other || 0)) 
                },
            });
            toast.success("Employee added!");
            setForm({ employeeName: '', basic: '', housing: '', transport: '', other: '' });
            setOpen(false);
        } catch (err) { toast.error("Failed to add employee"); }
    };

    const handleRunPayroll = async () => {
        try {
            const month = new Date().toISOString().slice(0, 7);
            await runPayroll({ userId: userData._id, month });
            toast.success(`Payroll run for ${month}!`);
        } catch (err) { toast.error("Failed to run payroll"); }
    };

    const activeEmployees = (employees || []).filter(e => e.status === 'active');
    const totalMonthly = activeEmployees.reduce((s, e) => s + e.salaryStructure.basic + e.salaryStructure.housing + e.salaryStructure.transport + e.salaryStructure.other, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter">Payroll Management</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Manage employees, run payroll, and export remittance schedules</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleRunPayroll} disabled={activeEmployees.length === 0} variant="outline" className="rounded-2xl font-bold border-[#2D5A27]/20 text-[#2D5A27]">
                        <Play className="w-4 h-4 mr-2" /> Run Payroll
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl px-6 font-bold bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                                <Plus className="w-4 h-4 mr-2" /> Add Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] max-w-md">
                            <DialogHeader><DialogTitle className="text-xl font-black">Add Employee</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</Label>
                                    <Input value={form.employeeName} onChange={e => setForm({...form, employeeName: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Basic (₦)</Label><Input type="text" inputMode="decimal" value={formatMoney(form.basic)} onChange={e => setForm({...form, basic: formatMoney(e.target.value)})} className="rounded-xl" /></div>
                                    <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Housing (₦)</Label><Input type="text" inputMode="decimal" value={formatMoney(form.housing)} onChange={e => setForm({...form, housing: formatMoney(e.target.value)})} className="rounded-xl" /></div>
                                    <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Transport (₦)</Label><Input type="text" inputMode="decimal" value={formatMoney(form.transport)} onChange={e => setForm({...form, transport: formatMoney(e.target.value)})} className="rounded-xl" /></div>
                                    <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest text-gray-400">Other (₦)</Label><Input type="text" inputMode="decimal" value={formatMoney(form.other)} onChange={e => setForm({...form, other: formatMoney(e.target.value)})} className="rounded-xl" /></div>
                                </div>
                                <Button type="submit" className="w-full rounded-2xl bg-[#2D5A27] text-white font-black py-6">Add Employee</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-cyan-50 to-white border-cyan-100 rounded-[2rem]">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Employees</p>
                            <p className="text-2xl sm:text-3xl font-black text-cyan-600 mt-1">{activeEmployees.length}</p>
                        </div>
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300" />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100 rounded-[2rem]">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Payroll</p>
                            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">₦{totalMonthly.toLocaleString()}</p>
                        </div>
                        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                {activeEmployees.length === 0 ? (
                    <div className="text-center py-16">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-bold text-gray-400">No employees added yet</p>
                    </div>
                ) : activeEmployees.map(emp => {
                    const total = emp.salaryStructure.basic + emp.salaryStructure.housing + emp.salaryStructure.transport + emp.salaryStructure.other;
                    return (
                        <Card key={emp._id} className="rounded-2xl border-gray-100 hover:shadow-sm transition-all">
                            <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                                        <span className="text-xs sm:text-sm font-black text-cyan-600">{emp.employeeName.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-[#0f172a] text-[11px] sm:text-sm leading-tight break-words">{emp.employeeName}</p>
                                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-tight">Basic: ₦{emp.salaryStructure.basic.toLocaleString()} · Housing: ₦{emp.salaryStructure.housing.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-[#0f172a] text-[11px] sm:text-base">₦{total.toLocaleString()}</p>
                                    <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold leading-none">/month</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default PayrollPage;
