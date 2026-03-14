import Link from 'next/link';
import { ArrowLeft, Receipt } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'VAT Compliance & E-Invoicing | NairaClare Resources',
  description: 'Learn about mandatory e-invoicing laws, expanded input VAT recovery, and VAT compliance for Nigerian businesses in 2026.',
};

export default function Article4() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white pb-24 mt-16 pt-8">
        {/* Header Area */}
        <div className="bg-slate-50 border-b border-gray-100 py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/resources" className="inline-flex items-center text-sm font-semibold text-[#008751] mb-8 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">VAT & E-Invoicing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              VAT Compliance & E-Invoicing: What Every Nigerian Business Must Know in 2026
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="prose prose-lg prose-slate max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed text-gray-800">
              Value Added Tax remains one of the most operationally complex compliance obligations for Nigerian businesses. In 2026, it just got more demanding - with mandatory e-invoicing now extending to small and medium businesses and stricter enforcement across the board.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The Basics: VAT in Nigeria</h2>
            <p>
              Value Added Tax is a consumption tax charged on goods and services at each stage of production and distribution in Nigeria, currently set at 7.5%. VAT is ultimately borne by the final consumer, but businesses act as collection agents for the Nigeria Revenue Service.
            </p>
            <p>
              Every business making taxable supplies in Nigeria must register for VAT with the Nigeria Revenue Service - there is no minimum threshold for registration. However, small businesses with under ₦100 million turnover are exempt from filing VAT returns, though they may still need to register.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What's New: Expanded Input VAT Recovery</h2>
            <p>
              One of the most significant changes under the Nigeria Tax Act 2025 is that businesses can now claim input VAT on both services and capital assets - a major change from previous laws that only allowed recovery for goods or materials used for production or resale. This improves cash flow for compliant businesses substantially.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Zero-Rated vs. Exempt Supplies</h2>
            <p>
              The NTA expands the list of zero-rated items to include essential goods and services such as basic food items, medical and pharmaceutical products, educational books and materials, and electricity generation and transmission services. Zero-rated means no VAT is charged to customers, but the seller can still recover input VAT. Exempt supplies offer no input recovery - a crucial distinction for accounting purposes.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Mandatory E-Invoicing - Now Law</h2>
            <p>
              This is the biggest operational shift. From January 1, 2026, all taxable persons, regardless of size, must use the NRS-approved e-invoicing system to issue, submit, and validate invoices. Paper-based invoices are no longer compliant from January 2026.
            </p>
            <p>
              An e-invoice is generated electronically from a business's ERP or accounting system, submitted through an Access Point Provider (APP), validated and digitally signed by the NRS, and returned with a QR Code and Cryptographic Stamp Identifier (CSID) for authenticity.
            </p>
            <p>
              Nigeria's e-invoicing system uses Peppol BIS Billing 3.0 Universal Business Language (UBL) formats - XML or JSON - to ensure interoperability and alignment with global e-invoicing frameworks.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Filing VAT Returns</h2>
            <p>
              VAT-registered businesses are expected to file tax returns every month, with 21 days to file and pay after the end of each period. VAT returns are filed using Form 002. Note that even if you made zero sales in a month, you must file a nil return.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Penalties for Non-Compliance</h2>
            <p>
              Under the Nigeria Tax Administration Bill, failure to process taxable supplies through the e-invoicing system results in a ₦200,000 administrative penalty, plus 100% of the tax due, with additional interest at 2% above the CBN's monetary policy rate. Non-compliant B2B invoices will also be disallowed for input VAT claims.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Your Action Checklist</h2>
            <p>
              Register for VAT if you haven't already. Obtain your TIN and link your VAT obligations to it. Select an accredited Access Point Provider (APP) and integrate your accounting or ERP software. Train your invoicing and finance staff on the new digital workflow. File monthly - on time, every time.
            </p>
          </div>

          <div className="mt-16 bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
            <p className="text-sm text-slate-500 italic text-center">
              <strong>Disclaimer:</strong> This content is for informational purposes only and does not constitute professional tax advice. Consult a qualified tax professional or visit nrs.gov.ng for official guidance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
