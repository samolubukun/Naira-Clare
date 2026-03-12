"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header({ isLanding = false }) {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (!isLanding) {
            setIsScrolled(true);
            return;
        }
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLanding]);

    const handleGetStarted = () => router.push('/dashboard');

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#E6F3ED]/90 backdrop-blur-md border-b border-[#008751]/10 ${isScrolled
                ? "py-2 shadow-sm"
                : "py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
                <motion.div
                    initial={isLanding ? { opacity: 0, x: -20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/nairaclarelogo.svg" alt="NairaClare Icon" width={40} height={40} className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black tracking-tighter">
                            <span className="text-[#008751]">Naira</span>
                            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Clare</span>
                        </span>
                    </Link>
                </motion.div>
                <motion.div
                    className="flex items-center gap-4"
                    initial={isLanding ? { opacity: 0, x: 20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button
                        onClick={handleGetStarted}
                        className="px-6 py-2.5 text-white magnetic-button rounded-full shadow-xl shadow-[#8FAF6A]/10 border-none"
                        style={{ background: 'linear-gradient(135deg, #8FAF6A 0%, #2D5A27 100%)' }}
                    >
                        Login
                    </Button>
                </motion.div>
            </div>
        </header>
    );
}
