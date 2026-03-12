import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white pt-24">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200">
              <Shield className="w-6 h-6 text-[#2D5A27]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Privacy Policy</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Last updated: March 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Eye className="w-4 h-4" />
                </span>
                <span>Our Commitment</span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                NairaClare ("we," "our," or "us") is dedicated to the highest standards of data privacy and security. 
                As your always-on Nigerian accountant, we recognize the sensitivity of your financial information. 
                This policy outlines how we collect and safeguard your data to ensure NTA 2025 compliance.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Database className="w-4 h-4" />
                </span>
                <span>Financial & Personal Data</span>
              </h2>

              <h3 className="text-lg font-black text-[#0f172a] mb-4">Account Information</h3>
              <ul className="list-disc list-inside text-gray-500 space-y-3 mb-8 font-medium">
                <li>Professional identity (Name, Email, NIN/TIN where applicable)</li>
                <li>Employment type (Solo, Salaried, or Business Owner)</li>
                <li>State of residence for LIRS/FIRS jurisdiction mapping</li>
              </ul>

              <h3 className="text-lg font-black text-[#0f172a] mb-4">Financial Logs</h3>
              <ul className="list-disc list-inside text-gray-500 space-y-3 mb-8 font-medium">
                <li>Income streams and source documentation</li>
                <li>Deductible expense records and receipt images</li>
                <li>Payroll structures and employee schedules</li>
                <li>Bank statement exports for automated categorization</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Users className="w-4 h-4" />
                </span>
                <span>Purpose of Processing</span>
              </h2>
              <ul className="list-disc list-inside text-gray-500 space-y-3 font-medium">
                <li>Real-time calculation of NTA 2025 tax liabilities</li>
                <li>Generation of automated VAT and WHT schedules</li>
                <li>Compliance monitoring and TCC readiness tracking</li>
                <li>AI-driven anomaly detection to minimize filing risks</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Lock className="w-4 h-4" />
                </span>
                <span>Bank-Grade Security</span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                Your data is encrypted at rest and in transit. We leverage Convex's secure infrastructure to ensure 
                that your financial records are only accessible by you and authorized NairaClare automated engines.
              </p>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 italic text-sm text-emerald-800 font-bold">
                "We do not sell your financial data. Your trust is our core asset."
              </div>
            </section>

            {/* Contact */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#2D5A27] text-white mr-4 shadow-lg shadow-emerald-900/20">
                  <Mail className="w-4 h-4" />
                </span>
                <span>Compliance Team</span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                Questions about your data or Nigerian tax compliance?
              </p>
              <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                <p className="text-[#0f172a] font-black">NairaClare Privacy & Compliance</p>
                <p className="text-gray-500 font-medium">Email: hello@nairaclare.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}