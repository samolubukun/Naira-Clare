import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Understanding Nigerian Tax Law Reforms | NairaClare Resources',
  description: 'Learn about the 2025/2026 Nigerian tax law reforms, the newly introduced Development Levy, and what changed with the NRS (formerly FIRS).',
};

export default function Article1() {
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
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tax Law Reforms</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Understanding Nigerian Tax Law: The 2025 Reforms Explained
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="prose prose-lg prose-slate max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed text-gray-800">
              Nigeria's tax system underwent its most significant overhaul in decades when President Bola Ahmed Tinubu signed four landmark bills into law on June 26, 2025. These are the Nigeria Tax Act (NTA), the Nigeria Revenue Service (Establishment) Act, the Nigeria Tax Administration Act, and the Joint Revenue Board (Establishment) Act - collectively reshaping the country's entire fiscal framework, effective January 1, 2026.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What Changed and Why It Matters</h2>
            <p>
              Before 2025, Nigerian tax law was scattered across more than a dozen separate statutes. The reforms consolidate and repeal more than a dozen outdated tax statutes, setting a unified direction for personal income tax, corporate taxation, VAT, capital gains, and fiscal governance. The goal is simpler compliance, a broader tax base, and a more business-friendly environment.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Corporate Income Tax</h2>
            <p>
              Small companies - now defined as those with annual gross turnover of ₦100 million or below and total fixed assets not exceeding ₦250 million - are exempt from Companies Income Tax (CIT), Capital Gains Tax, and the newly introduced Development Levy. For larger companies, the corporate income tax rate stands at 25%, which can be reduced by Executive Order if the President chooses to do so.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Personal Income Tax</h2>
            <p>
              Individuals earning ₦800,000 or less per annum are exempt from tax on their income and gains, while higher income earners are taxed up to a maximum rate of 25%. Nigeria has also shifted to a residency-based model - residents are taxed on worldwide income, though double-tax treaties may apply, while non-residents are taxed only on Nigeria-sourced income such as local salaries, rent, or dividends.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The Development Levy</h2>
            <p>
              Nigerian companies - except small companies - will pay a Development Levy at 4% of their assessable profits. This levy consolidates the former Tertiary Education Tax, Information Technology Levy, NASENI levy, and Police Trust Fund levy into a single, cleaner obligation.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Capital Gains Tax</h2>
            <p>
              The CGT rate for corporate organizations has been increased to match the Corporate Income Tax rate - 30% for most companies, and 0% for small companies. The exemption threshold has been increased to ₦50 million, with any amount above that being taxable.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Digital Assets</h2>
            <p>
              For the first time, profits or gains from transactions in digital or virtual assets are formally chargeable to tax under the NTA. This brings Nigeria in line with global trends, though enforcement will evolve as digital infrastructure develops.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What Replaced FIRS?</h2>
            <p>
              The Federal Inland Revenue Service has been succeeded by the Nigeria Revenue Service (NRS) as the central federal tax authority. The Joint Revenue Board Act also introduces a Tax Ombuds office to liaise with tax authorities on behalf of taxpayers, serving as an independent arbiter for resolving complaints relating to taxes, levies, and duties.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Key Takeaway for Compliance Apps</h2>
            <p>
              These reforms demand a full strategic review - from your corporate structure and profit model to your invoicing and payroll systems. The era of disparate, loosely enforced tax rules is over. The NRS now has stronger data analytics powers and cross-agency integration to enforce compliance systematically.
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
