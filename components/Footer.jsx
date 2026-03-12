import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer bg-white border-t border-gray-100 py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/nairaclarelogo.svg" alt="NairaClare Icon" width={24} height={24} className="opacity-80" />
                        <span className="text-xl font-black text-[#0f172a] tracking-tighter">
                            <span className="text-[#008751]">Naira</span>
                            <span className="text-[#0f172a]">Clare</span>
                        </span>
                    </Link>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} NairaClare Ltd.
                    </span>
                </div>

                <div className="flex gap-12 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    <Link href="/privacy" className="hover:text-[#008751] transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-[#008751] transition-colors">Terms</Link>
                </div>

                <div className="flex gap-4">
                    {/* Socials removed as requested */}
                </div>
            </div>
            <div className="max-w-4xl mx-auto text-center mt-12 pt-12 border-t border-gray-50">
                <p className="text-xs text-gray-300 font-medium uppercase tracking-[0.2em]">Financial Disclaimer: Educational insights only. Consult a certified accountant for filing.</p>
            </div>
        </footer>
    );
}
