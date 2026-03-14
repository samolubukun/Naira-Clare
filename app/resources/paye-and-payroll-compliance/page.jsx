import Link from 'next/link';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'PAYE & Payroll Compliance | NairaClare Resources',
  description: 'Understand the new 2026 PAYE tax bands, employer deduction responsibilities, and payroll compliance in Nigeria.',
};

export default function Article3() {
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
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">PAYE & Payroll</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              PAYE & Payroll Compliance: A Guide for Nigerian Employers
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="prose prose-lg prose-slate max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed text-gray-800">
              Pay As You Earn (PAYE) is how Nigeria collects personal income tax from employees. As an employer, you are the collection agent - deducting tax monthly from salaries and remitting it to the relevant tax authority. Getting this wrong carries serious legal and financial consequences under the 2026 reforms.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What Is PAYE?</h2>
            <p>
              Nigeria's PAYE system is the primary method for collecting personal income tax from employees. Under this system, employers are required to deduct income tax from their employees' monthly salaries and remit these deductions to the relevant tax authorities - a method that ensures steady revenue collection while making tax payment convenient for employees.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The New 2026 Tax Bands</h2>
            <p>
              Effective January 1, 2026, the old Consolidated Relief Allowance (CRA) system has been abolished. Under the new PAYE tax law in Nigeria, the Consolidated Relief Allowance no longer exists. It has been replaced with a rent relief system, which allows employees to reduce taxable income if they pay rent and can prove it.
            </p>
            <p>
              All employees in Nigeria earning up to ₦800,000 annually - approximately ₦66,667 monthly - will pay zero tax. This threshold applies automatically without any special application. Above this threshold, a progressive rate applies up to a maximum of 25%.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Employer Remittance Obligations</h2>
            <p>
              Employers are required to deduct monthly PAYE tax from employees' salaries and remit it to the relevant Nigerian authorities on or after the 10th day of the month following the payment of salary.
            </p>
            <p>
              In addition to PAYE, employers must remit contributions to statutory bodies: pension (under the Contributory Pension Scheme), National Housing Fund (NHF), National Health Insurance Authority (NHIA), the Nigeria Social Insurance Trust Fund (NSITF), and the Industrial Training Fund (ITF). Each has its own deadline and rate.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Annual Filing Obligations</h2>
            <p>
              Employers must also file PAYE returns twice a year on behalf of employees. Form H1 (Employer Declaration Form) shows employees' income, taxes deducted and remitted in the preceding year - due by January 31. Form G (Employer Remittance Card) shows monthly remittances and is also due by January 31 of the following year.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Stricter Penalties in 2026</h2>
            <p>
              The NRS will use data analytics to cross-check payroll, bank transactions, and tax filings. Late filing attracts ₦100,000 in the first month, then ₦50,000 monthly. False declarations can result in fines up to ₦1 million or three years in prison, or both.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Remote and Foreign Workers</h2>
            <p>
              If you pay Nigerian residents from abroad for work performed in Nigeria, you must calculate and remit Nigerian PAYE - even if the employee never receives funds in Nigeria. This is known as shadow payroll, and it's now actively enforced.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Key Employer Action Points</h2>
            <p>
              Update your payroll software to reflect the new 2026 tax bands immediately. Ensure all employees have valid TINs. Document rent relief claims properly - lease agreements and payment receipts are required. Train your HR and finance teams on the new structure before each monthly payroll run. The cost of under-deducting tax is now far higher than the cost of getting it right from the start.
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
