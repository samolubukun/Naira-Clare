import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'TIN Registration & Tax Filing | NairaClare Resources',
  description: 'Learn how to get your Tax Identification Number (TIN) and the basics of tax filing for businesses in Nigeria.',
};

export default function Article2() {
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
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">TIN & Tax Filing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              TIN Registration & Tax Filing: Your First Step to Compliance
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="prose prose-lg prose-slate max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed text-gray-800">
              Before your business can file a single return, pay a single levy, or open a corporate bank account in Nigeria, you need one thing: a Tax Identification Number (TIN). A TIN is a unique identifier issued by the Federal Inland Revenue Service to businesses and individuals for tax purposes. It is essential for filing taxes, opening corporate accounts, and ensuring compliance with Nigerian tax laws.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Who Needs a TIN?</h2>
            <p>
              All businesses in Nigeria are required by law to have a TIN for tax registration. Without it, your business may face penalties and challenges with regulatory authorities. Banks also require a TIN to open a corporate account, and it is necessary for applying for business loans or participating in government funding programs. Even freelancers and sole traders earning taxable income must register.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">How to Get Your TIN</h2>
            <p>
              A taxpayer can complete the FIRS TIN registration process manually or online. The manual method involves submitting incorporation documents, a utility bill, and related information in hard copy to the relevant FIRS office. The online approach allows new users to access and submit a completed form on the FIRS TIN registration portal - TaxPro Max.
            </p>
            <p>
              Once approved, FIRS issues a formal letter stating the taxpayer's name, TIN, and the monthly and annual filing obligations, and also sends login details for TaxPro Max to the registered email address. You can verify any TIN at <code>apps.firs.gov.ng/tinverification</code>.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Filing Your Tax Returns</h2>
            <p>
              Companies are required to register for tax and file their audited accounts and tax computations with the FIRS within six months of their financial year-end on a self-assessment basis, or 18 months after incorporation - whichever comes first.
            </p>
            <p>
              For individuals, the filing due date is 90 days after the end of the tax year (March 31) for employed individuals, and six months after the accounting year-end for the self-employed.
            </p>
            <p>
              Nigerian companies file their tax returns based on a self-assessment system where the taxpayer prepares annual returns and determines its own tax liability. However, the FIRS may apply a Best of Judgment (BOJ) assessment where returns are seen as deliberately misstated or not filed within the stipulated period.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Penalties for Non-Compliance</h2>
            <p>
              The administrative penalty for failing to file tax returns or for filing incomplete or inaccurate returns has increased significantly - now ₦100,000 for the first month of non-compliance and ₦50,000 for each subsequent month of continued default. Late payment of CIT also attracts a 10% penalty plus interest at the commercial rate.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">TIN and VAT Are Linked</h2>
            <p>
              The FIRS links your VAT obligations to your TIN, and VAT returns are filed using your TIN. TIN is your general taxpayer identification, while VAT registration is a specific process tied to your TIN for collecting and remitting VAT.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The Bottom Line</h2>
            <p>
              Getting your TIN is free, fast, and foundational. Tax compliance is now directly linked to business growth opportunities - without proper registration, documentation, and tax clearance, businesses may be excluded from government contracts, grants, financial incentives, and bank financing. The time to register is before you need it, not after.
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
