import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="footer bg-white border-t border-gray-100 py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
                <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left order-1 md:order-none">
                    <Link href="/" className="flex flex-col md:flex-row items-center gap-3">
                        <Image src="/nairaclarelogo.svg" alt="NairaClare Icon" width={32} height={32} className="opacity-80 md:w-6 md:h-6" />
                        <span className="text-2xl md:text-xl font-black text-[#0f172a] tracking-tighter">
                            <span className="text-[#008751]">Naira</span>
                            <span className="text-[#0f172a]">Clare</span>
                        </span>
                    </Link>
                    <span className="text-gray-500 text-sm font-semibold tracking-wide">
                        Tax clarity for every Nigerian
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-12 lg:gap-24 text-sm mt-4 md:mt-0">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-2">Legal</h3>
                        <Link href="/privacy" className="text-gray-500 hover:text-[#008751] transition-colors font-medium">Privacy Policy</Link>
                        <Link href="/terms" className="text-gray-500 hover:text-[#008751] transition-colors font-medium">Terms of Service</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-2">
                            <Link href="/resources" className="hover:text-[#008751] transition-colors">Resources</Link>
                        </h3>
                        <Link href="/resources/understanding-nigerian-tax-law" className="text-gray-500 hover:text-[#008751] transition-colors font-medium">Tax Law Reforms</Link>
                        <Link href="/resources/tin-registration-and-tax-filing" className="text-gray-500 hover:text-[#008751] transition-colors font-medium">TIN & Tax Filing</Link>
                        <Link href="/resources/paye-and-payroll-compliance" className="text-gray-500 hover:text-[#008751] transition-colors font-medium">PAYE & Payroll</Link>
                        <Link href="/resources/vat-compliance-and-einvoicing" className="text-gray-500 hover:text-[#008751] transition-colors font-medium">VAT & E-Invoicing</Link>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Socials removed as requested */}
                </div>
            </div>
            <div className="max-w-4xl mx-auto text-center mt-12 pt-12 border-t border-gray-50 flex flex-col gap-4">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} NairaClare Ltd.
                </span>
                <p className="text-xs text-gray-300 font-medium uppercase tracking-[0.2em]">Financial Disclaimer: Educational insights only. Consult a certified accountant for filing.</p>
            </div>
        </footer>
    );
}
