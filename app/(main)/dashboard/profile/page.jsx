"use client"
import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '@/app/_context/UserContext'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { User, ShieldCheck, Zap, Save, CheckCircle2, Info, Building2, Briefcase, UserCircle, MapPin, Calculator, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
    "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

function ProfilePage() {
    const { userData } = useContext(UserContext)
    const updateUser = useMutation(api.users.UpdateUserProfile)
    
    const [formData, setFormData] = useState({
        onboardingType: 'solo',
        stateOfResidence: 'Lagos',
        salaryProfile: {
            basic: 0,
            housing: 0,
            transport: 0,
            otherAllowances: 0,
            pensionEnabled: true,
            nhfEnabled: true,
            nhisEnabled: false,
        }
    })

    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (userData) {
            setFormData({
                onboardingType: userData.onboardingType || 'solo',
                stateOfResidence: userData.stateOfResidence || 'Lagos',
                salaryProfile: userData.salaryProfile || {
                    basic: 0,
                    housing: 0,
                    transport: 0,
                    otherAllowances: 0,
                    pensionEnabled: true,
                    nhfEnabled: true,
                    nhisEnabled: false,
                }
            })
        }
    }, [userData])

    const handleSave = async () => {
        if (!userData) return
        setIsSaving(true)
        try {
            await updateUser({
                id: userData._id,
                onboardingType: formData.onboardingType,
                stateOfResidence: formData.stateOfResidence,
                salaryProfile: formData.salaryProfile
            })
            toast.success("Profile updated successfully")
        } catch (err) {
            toast.error("Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    const updateSalaryField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            salaryProfile: {
                ...prev.salaryProfile,
                [field]: value
            }
        }))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-[#2D5A27]">
                        <UserCircle className="w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">{userData?.name || 'Your Profile'}</h1>
                        <p className="text-gray-500 font-medium">{userData?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50">
                    <div className="w-10 h-10 rounded-2xl bg-[#008751] flex items-center justify-center text-white shadow-lg shadow-[#008751]/20">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#008751] uppercase tracking-widest">Available Credits</p>
                        <p className="text-xl font-black text-[#0f172a]">{userData?.credits || 0} <span className="text-xs text-gray-400 font-bold ml-1">CREDITS</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Settings */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-[#0f172a] flex items-center gap-2">
                           <ShieldCheck className="w-5 h-5 text-[#2D5A27]" /> Core Identity
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Tax Category</Label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: 'solo', label: 'Freelancer / Solo', icon: User },
                                        { id: 'employee', label: 'Paid Employee', icon: Briefcase },
                                        { id: 'business', label: 'Business Owner', icon: Building2 }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setFormData({...formData, onboardingType: type.id})}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${formData.onboardingType === type.id ? 'bg-emerald-50 border-emerald-200 text-[#2D5A27]' : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-200'}`}
                                        >
                                            <type.icon className="w-4 h-4" />
                                            <span className="text-sm font-bold">{type.label}</span>
                                            {formData.onboardingType === type.id && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Primary Residence</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select 
                                        value={formData.stateOfResidence}
                                        onChange={(e) => setFormData({...formData, stateOfResidence: e.target.value})}
                                        className="w-full bg-gray-50 border-transparent rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-[#0f172a] focus:ring-2 focus:ring-[#008751] transition-all appearance-none cursor-pointer"
                                    >
                                        {NIGERIAN_STATES.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Info className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Why this matters?</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            Your state of residence determines which tax authority (LIRS, FIRS, etc.) you report to, while your category adjusts Clare's AI advice to your specific situation.
                        </p>
                    </div>
                </div>

                {/* Salary Profile & Deductions */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#0f172a] flex items-center gap-2">
                               <Calculator className="w-5 h-5 text-[#2D5A27]" /> Tax Deductions Profile
                            </h3>
                            <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="rounded-2xl bg-[#008751] hover:bg-[#007043] text-white font-black h-12 px-8 shadow-lg shadow-[#008751]/20"
                            >
                                {isSaving ? <span className="animate-spin mr-2">◌</span> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Salary Breakdown (₦)</Label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                                        <Input 
                                            type="number" 
                                            placeholder="Basic Salary" 
                                            value={formData.salaryProfile.basic || ''}
                                            onChange={(e) => updateSalaryField('basic', parseFloat(e.target.value) || 0)}
                                            className="h-14 pl-10 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Basic</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                                        <Input 
                                            type="number" 
                                            placeholder="Housing" 
                                            value={formData.salaryProfile.housing || ''}
                                            onChange={(e) => updateSalaryField('housing', parseFloat(e.target.value) || 0)}
                                            className="h-14 pl-10 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Housing</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                                        <Input 
                                            type="number" 
                                            placeholder="Transport" 
                                            value={formData.salaryProfile.transport || ''}
                                            onChange={(e) => updateSalaryField('transport', parseFloat(e.target.value) || 0)}
                                            className="h-14 pl-10 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Transport</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                                        <Input 
                                            type="number" 
                                            placeholder="Other Allowances" 
                                            value={formData.salaryProfile.otherAllowances || ''}
                                            onChange={(e) => updateSalaryField('otherAllowances', parseFloat(e.target.value) || 0)}
                                            className="h-14 pl-10 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Other</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statutory Deductions (NTA 2026)</Label>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[#2D5A27]">Pension Scheme (8%)</p>
                                            <p className="text-[10px] font-medium text-emerald-600/70">Mandatory for employees</p>
                                        </div>
                                        <Switch 
                                            checked={formData.salaryProfile.pensionEnabled}
                                            onCheckedChange={(val) => updateSalaryField('pensionEnabled', val)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[#2D5A27]">NHF (2.5%)</p>
                                            <p className="text-[10px] font-medium text-emerald-600/70">National Housing Fund</p>
                                        </div>
                                        <Switch 
                                            checked={formData.salaryProfile.nhfEnabled}
                                            onCheckedChange={(val) => updateSalaryField('nhfEnabled', val)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-gray-600">NHIS / Health Insurance</p>
                                            <p className="text-[10px] font-medium text-gray-400">Voluntary health contribution</p>
                                        </div>
                                        <Switch 
                                            checked={formData.salaryProfile.nhisEnabled}
                                            onCheckedChange={(val) => updateSalaryField('nhisEnabled', val)}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                                    <Info className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                                        NairaClare uses these settings to calculate your **Consolidated Relief Allowance (CRA)** and other tax-exempt items automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
