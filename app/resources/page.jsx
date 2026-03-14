import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Briefcase, Receipt } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Tax Resources | NairaClare',
  description: 'Comprehensive guides on Nigerian tax laws, compliance requirements, and business financial management.',
};

const resources = [
  {
    title: "Understanding Nigerian Tax Law: The 2025 Reforms Explained",
    description: "Nigeria's tax system underwent its most significant overhaul in decades. Learn about the new Nigeria Tax Act, the consolidated Development Levy, Capital Gains Tax changes, and what replaced FIRS.",
    href: "/resources/understanding-nigerian-tax-law",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "TIN Registration & Tax Filing: Your First Step to Compliance",
    description: "Before your business can file a single return or open a corporate bank account in Nigeria, you need a Tax Identification Number (TIN). Find out how to register and file your returns.",
    href: "/resources/tin-registration-and-tax-filing",
    icon: FileText,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "PAYE & Payroll Compliance: A Guide for Nigerian Employers",
    description: "As an employer, you are the collection agent for personal income tax. Understand the new 2026 tax bands, employer obligations, and stricter penalties for non-compliance.",
    href: "/resources/paye-and-payroll-compliance",
    icon: Briefcase,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "VAT Compliance & E-Invoicing: What Every Nigerian Business Must Know in 2026",
    description: "Mandatory e-invoicing now extends to small and medium businesses. Learn about expanded input VAT recovery, zero-rated vs. exempt supplies, and the new digital workflow.",
    href: "/resources/vat-compliance-and-einvoicing",
    icon: Receipt,
    color: "bg-orange-50 text-orange-600",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Tax <span className="text-[#008751]">Resources</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Stay informed with our comprehensive guides on Nigerian tax laws, compliance requirements, and business financial management.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-16">
            {resources.map((resource, i) => (
              <Link key={i} href={resource.href} className="group block h-full">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-[#008751]/30">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${resource.color}`}>
                    <resource.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#008751] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                    {resource.description}
                  </p>
                  <div className="flex items-center text-[#008751] font-semibold text-sm">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2 group-[.hover]:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm text-center">
            <p className="text-sm text-gray-500 italic">
              <strong>Disclaimer:</strong> This content is for informational purposes only and does not constitute professional tax advice. Consult a qualified tax professional or visit nrs.gov.ng for official guidance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
