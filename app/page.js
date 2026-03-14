"use client"

import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from "framer-motion";
import {
    TrendingUp, Calendar, Shield, MessageCircle, Sparkles,
    ShoppingBag, ChevronRight, ShieldCheck, ArrowRight, Zap, Target
} from 'lucide-react';
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TaxCalculator from "@/components/TaxCalculator";

export default function LandingPage() {
    const router = useRouter();
    const { scrollYProgress } = useScroll();
    
    const handleGetStarted = () => router.push('/dashboard');

    const features = [
        { icon: TrendingUp, title: "Live Tax Meter", desc: "Watch your tax liability update in real-time as you log income and expenses. Never be surprised again." },
        { icon: Calendar, title: "Smart Tax Calendar", desc: "Never miss a deadline. Annual filings, VAT, and PAYE reminders baked directly into your workflow." },
        { icon: Shield, title: "Compliance Score", desc: "Track your standing with FIRS/LIRS. Get a clear view of your tax health and clear paths to TCC readiness." },
        { icon: MessageCircle, title: "Tax Q&A Assistant", desc: "Ask complex Nigerian tax questions and get answers grounded in the latest NTA 2025 regulations." },
        { icon: Sparkles, title: "Deduction Finder", desc: "Our AI scans your expenses to find legal ways to reduce your tax bill, from rent relief to pension credits." },
        { icon: ShoppingBag, title: "Invoice & Client Tools", desc: "Professional, tax-compliant invoicing that automatically logs your income and tracks WHT credits." }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#008751]/20">
            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#008751] to-[#2D5A27] z-[60] origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            <Header isLanding={true} />

            <main className="flex-1 pt-16 md:pt-0">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 overflow-hidden">
                    {/* Top shadow for white header text visibility */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0f172a]/20 to-transparent pointer-events-none z-20" />
                    
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="flex flex-col items-center"
                        >
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-10 bg-[#008751]/5 border border-[#008751]/10 backdrop-blur-sm">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#008751]">Tax clarity for every Nigerian</span>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black mb-10 leading-[0.85] tracking-tighter text-[#0f172a]">
                                Taxes made <br />
                                <span className="text-[#008751]">simple for you.</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-16 text-gray-500 max-w-3xl leading-relaxed font-semibold">
                                Calculate your tax, track your income, and stay compliant. Built for every Nigerian - from salary earners to growing businesses.
                            </motion.p>
                            
                            <motion.div variants={itemVariants} className="w-full max-w-5xl mx-auto">
                                <div className="p-1 md:p-4 rounded-[3.5rem] bg-white border border-gray-100 shadow-2xl shadow-emerald-900/5">
                                    <TaxCalculator />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                    
                    {/* Background Soft Accents */}
                    <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#008751]/5 blur-[160px] rounded-full -z-10" />
                    <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#2D5A27]/5 blur-[160px] rounded-full -z-10" />
                </section>

                {/* New Section 1: The New Standard */}
                <section className="py-32 px-6 bg-white border-t border-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="group space-y-6 p-10 rounded-[3rem] bg-[#FAFAF9] border border-gray-100 hover:border-[#008751]/30 transition-all hover:shadow-xl hover:shadow-emerald-900/5">
                                <div className="w-16 h-16 rounded-2xl bg-[#008751]/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <Zap className="w-8 h-8 text-[#008751]" />
                                </div>
                                <h3 className="text-2xl font-black text-[#0f172a]">Instant Calculations</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">No more spreadsheets. Our engine applies NTA 2025 bands instantly to your monthly income and side hustles.</p>
                            </div>
                            <div className="group space-y-6 p-10 rounded-[3rem] bg-white border border-emerald-50 shadow-2xl shadow-emerald-900/5 transform md:-translate-y-8 transition-all hover:border-[#008751]/30">
                                <div className="w-16 h-16 rounded-2xl bg-[#008751] flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#0f172a]">LIRS/FIRS Ready</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Built strictly on Nigerian regulation. We handle the complexities of CRA, pension relief, and WHT tracking so you don't have to.</p>
                            </div>
                            <div className="group space-y-6 p-10 rounded-[3rem] bg-[#FAFAF9] border border-gray-100 hover:border-[#008751]/30 transition-all hover:shadow-xl hover:shadow-emerald-900/5">
                                <div className="w-16 h-16 rounded-2xl bg-[#008751]/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <Target className="w-8 h-8 text-[#008751]" />
                                </div>
                                <h3 className="text-2xl font-black">AI-Driven Audit</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Our AI Tax Auditor scans for missing deductions and ensures your expense categories maximize your legal tax reliefs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-32 px-6 bg-[#FAFAF9]/50 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="order-2 lg:order-1 relative"
                            >
                                <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 bg-white border border-gray-100 p-8 md:p-12 aspect-[4/5] md:aspect-square flex flex-col justify-center items-center text-center">
                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#008751]/10 rounded-3xl flex items-center justify-center mb-6 md:mb-8 shrink-0">
                                        <Image src="/nairaclarelogo.svg" alt="NairaClare Icon" width={64} height={64} className="rounded-2xl shrink-0" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-4 md:mb-6 leading-tight">Mastering tax is the <br className="hidden sm:block" /><span className="text-[#008751]">ultimate leverage.</span></h3>
                                    <div className="h-1 w-12 bg-gray-100 rounded-full mb-4 md:mb-6 shrink-0"></div>
                                    <p className="text-gray-400 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[10px]">Precision in Every Filing.</p>
                                </div>
                                <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#008751]/5 blur-2xl rounded-full"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#2D5A27]/5 blur-2xl rounded-full"></div>
                            </motion.div>

                            <div className="order-1 lg:order-2 space-y-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-4xl md:text-7xl font-black text-[#0f172a] leading-[0.95] tracking-tighter mb-8">
                                        Perfect <br /><span className="text-[#008751]">compliance.</span>
                                    </h2>
                                    <p className="text-xl text-gray-500 font-bold max-w-xl leading-relaxed">Nigerian tax shouldn't be a game of chance. Own your status with data-driven precision and focus on growth.</p>
                                </motion.div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="grid gap-6"
                                >
                                    {[
                                        { title: "Manual Errors", desc: "Mistakes in PAYE or WHT calculations lead to heavy, automated penalties." },
                                        { title: "Lost Credits", desc: "Tracking WHT from clients is complex. We automate it to secure your wealth." },
                                        { title: "Filing Anxiety", desc: "The fear of the 31st deadline shouldn't haunt your business vision." }
                                    ].map((item, idx) => (
                                        <motion.div key={idx} variants={itemVariants} className="group flex items-start gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#008751]/20 transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-[#008751]/5 flex items-center justify-center flex-shrink-0 text-[#008751] font-black italic border border-[#008751]/10 group-hover:bg-[#008751] group-hover:text-white transition-colors">!</div>
                                            <div>
                                                <h4 className="text-xl font-black text-[#0f172a] mb-2">{item.title}</h4>
                                                <p className="text-gray-500 font-semibold text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features - Elevated Grid */}
                <section className="py-32 md:py-48 px-6 relative bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-32">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-8xl font-black mb-10 text-[#0f172a] leading-tight tracking-tighter"
                            >
                                Financial <br /><span className="text-[#008751]">Intelligence.</span>
                            </motion.h2>
                            <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-[10px]">
                                Sophisticated compliance on autopilot.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-12 rounded-[4rem] bg-[#FAFAF9] border border-gray-100 hover:border-[#008751] hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/10 transition-all group"
                                >
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-[#008751]/10 flex items-center justify-center mb-10 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        <feature.icon className="w-10 h-10 text-[#008751]" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-[#0f172a] tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed font-semibold">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                    
                {/* CTA Section */}
                <section className="py-20 md:py-32 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative p-8 md:p-12 lg:p-24 rounded-[3rem] md:rounded-[4rem] bg-white border border-gray-100 shadow-2xl shadow-emerald-900/5 overflow-hidden">
                            <div className="relative z-10 text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-[#0f172a] mb-6 md:mb-10 leading-tight tracking-tighter">
                                    Join the <br /><span className="text-[#008751]">circle of clarity.</span>
                                </h2>
                                <p className="text-lg md:text-xl text-gray-500 mb-10 md:mb-16 font-semibold leading-relaxed">
                                    Join the thousands of Nigerians mastering their finances and taxes with NairaClare.
                                </p>
                                <Button 
                                    onClick={handleGetStarted}
                                    className="w-full sm:w-auto h-auto px-8 md:px-12 py-6 md:py-8 text-lg font-black text-white rounded-2xl shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #008751 0%, #2D5A27 100%)' }}
                                >
                                    <span>Get Started Now</span>
                                    <ArrowRight className="w-5 h-5 shrink-0" />
                                </Button>
                            </div>
                            
                            {/* CTA Background accents */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#008751]/5 blur-[100px] rounded-full -z-0" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2D5A27]/5 blur-[100px] rounded-full -z-0" />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
