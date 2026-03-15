"use client"

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, SelectContent, SelectItem, 
    SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
    User, Briefcase, Building2, ShieldCheck, 
    ArrowRight, MapPin, Wallet 
} from "lucide-react";
import { motion } from "framer-motion";
import { formatMoney, parseMoney } from "@/lib/utils";

export default function OnboardingModal({ isOpen, user, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userType: "",
        residence: "Lagos",
        basic: "",
        housing: "",
        transport: "",
        other: "",
    });

    const updateProfile = useMutation(api.users.UpdateUserProfile);

    const handleSubmit = async () => {
        await updateProfile({
            id: user._id,
            onboardingType: formData.userType,
            stateOfResidence: formData.residence,
            salaryProfile: formData.userType === "employee" ? {
                basic: parseFloat(parseMoney(formData.basic || 0)),
                housing: parseFloat(parseMoney(formData.housing || 0)),
                transport: parseFloat(parseMoney(formData.transport || 0)),
                otherAllowances: parseFloat(parseMoney(formData.other || 0)),
                pensionEnabled: true,
                nhfEnabled: true,
                nhisEnabled: false,
            } : undefined
        });
        onComplete();
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none rounded-[2.5rem]">
                <div className="bg-[#0f172a] p-12 text-white relative">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black tracking-tighter mb-2">
                            Welcome to <span className="text-[#8FAF6A]">NairaClare</span>
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-lg">
                            Let's tailor your always-on accountant.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8FAF6A] opacity-10 -z-0" />
                </div>

                <div className="p-12 bg-white">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Who are you?</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: "solo", icon: User, label: "Solo / Creator", desc: "No employer PAYE" },
                                    { id: "employee", icon: Briefcase, label: "Employee", desc: "Side income too" },
                                    { id: "business", icon: Building2, label: "Owner", desc: "Has employees" },
                                ].map((type) => (
                                    <button 
                                        key={type.id}
                                        onClick={() => setFormData({...formData, userType: type.id})}
                                        className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${formData.userType === type.id ? "border-[#2D5A27] bg-[#f4f8f0] shadow-lg" : "border-gray-100 hover:border-gray-200"}`}
                                    >
                                        <type.icon className={`w-10 h-10 ${formData.userType === type.id ? "text-[#2D5A27]" : "text-gray-300"}`} />
                                        <div>
                                            <p className="font-bold text-sm text-[#0f172a]">{type.label}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">{type.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <Button 
                                disabled={!formData.userType} 
                                onClick={() => setStep(2)}
                                className="w-full py-7 text-lg font-bold rounded-2xl bg-[#2D5A27] text-white"
                            >
                                Next Step <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> State of Residence
                                </Label>
                                <Select value={formData.residence} onValueChange={(val) => setFormData({...formData, residence: val})}>
                                    <SelectTrigger className="py-7 rounded-2xl border-gray-100 bg-gray-50 font-bold">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[280px]">
                                        {["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"].map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.userType === "employee" && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-gray-100">
                                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Wallet className="w-3 h-3" /> Monthly Salary Breakdown
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="Basic" value={formData.basic} onChange={(e) => setFormData({...formData, basic: formatMoney(e.target.value)})} className="py-6 rounded-xl border-gray-100" type="text" inputMode="decimal" />
                                        <Input placeholder="Housing" value={formData.housing} onChange={(e) => setFormData({...formData, housing: formatMoney(e.target.value)})} className="py-6 rounded-xl border-gray-100" type="text" inputMode="decimal" />
                                        <Input placeholder="Transport" value={formData.transport} onChange={(e) => setFormData({...formData, transport: formatMoney(e.target.value)})} className="py-6 rounded-xl border-gray-100" type="text" inputMode="decimal" />
                                        <Input placeholder="Other" value={formData.other} onChange={(e) => setFormData({...formData, other: formatMoney(e.target.value)})} className="py-6 rounded-xl border-gray-100" type="text" inputMode="decimal" />
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="ghost" onClick={() => setStep(1)} className="py-7 font-bold rounded-2xl">Back</Button>
                                <Button onClick={handleSubmit} className="py-7 text-lg font-bold rounded-2xl bg-[#2D5A27] text-white">
                                    Complete Setup <ShieldCheck className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
