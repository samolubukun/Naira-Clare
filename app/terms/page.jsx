import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, AlertTriangle, Users, Gavel, Shield, Clock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white pt-24">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200">
              <FileText className="w-6 h-6 text-[#2D5A27]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Terms of Use</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Last updated: March 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
          <div className="prose prose-lg max-w-none">

            {/* Agreement */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center gap-3">
                <Gavel className="w-5 h-5 text-[#2D5A27]" />
                Agreement to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                By accessing and using NairaClare ("the Service"), you agree to be bound by these Terms of Use. 
                NairaClare is a financial management and tax compliance platform designed for the Nigerian market.
              </p>
            </section>

            {/* Financial Disclaimer */}
            <section className="mb-12">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-black text-[#2D5A27] mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <span>Financial Advisor Disclaimer</span>
                </h2>
                <p className="text-emerald-900 leading-relaxed font-bold">
                  NairaClare provides automated tax calculations based on NTA 2025/2026 regulations for educational 
                  and record-keeping purposes. We are not a licensed accounting firm or financial advisor. 
                  Final tax filings should be verified by a certified professional or official FIRS/LIRS portals.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-4">The NairaClare Service</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">NairaClare provides:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 text-gray-600 font-bold uppercase text-[10px] tracking-widest">
                <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">✓ AI Receipt Scanning</li>
                <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">✓ NTA 2025 Tax Meter</li>
                <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">✓ Smart Invoicing & WHT</li>
                <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">✓ Bank Statement Parsing</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Users className="w-4 h-4" />
                </span>
                <span>Your Obligations</span>
              </h2>
              <ul className="list-disc list-inside text-gray-500 space-y-3 font-medium">
                <li>You must provide accurate financial data for correct tax calculations.</li>
                <li>NairaClare is for personal and business financial logging only.</li>
                <li>You are responsible for the legality of the documents (receipts/statements) you upload.</li>
              </ul>
            </section>

            {/* Account Termination */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-4">Data Ownership</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                You retain full ownership of your financial data. NairaClare does not share your specific 
                transaction details with any third party except as required by Nigerian law or with your 
                explicit export action.
              </p>
            </section>

            {/* IP */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-4">Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                The NairaClare name, logo, tax engine logic, and UI are the property of NairaClare. 
                Unauthorized reproduction of our proprietary NTA 2025 calculation models is strictly prohibited.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Clock className="w-4 h-4" />
                </span>
                <span>Updates</span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                We update these terms to reflect changes in Nigerian tax laws (FIRS/LIRS circulars). 
                Continued use of NairaClare after updates constitutes acceptance.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}