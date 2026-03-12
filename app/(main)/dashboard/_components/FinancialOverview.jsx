"use client"
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react'
import React, { useContext } from 'react'
import { TrendingUp, TrendingDown, Minus, BarChart3, Wallet, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

function FinancialOverview() {
  const { userData } = useContext(UserContext);
  const taxSummary = useQuery(api.finance.getTaxSummary, userData ? { userId: userData._id } : "skip");
  const stats = useQuery(api.finance.getDashboardStats, userData ? { userId: userData._id } : "skip");

  const loading = !taxSummary || !stats;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-[#2D5A27] rounded-full'></div>
          <h2 className='font-bold text-lg md:text-xl'>Financial Overview</h2>
        </div>
        <Skeleton className="h-32 w-full rounded-[2rem]" />
        <Skeleton className="h-20 w-full rounded-[2rem]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const getComplianceColor = () => {
      const score = stats?.complianceScore || 0;
      if (score >= 80) return 'text-emerald-600';
      if (score >= 60) return 'text-amber-600';
      return 'text-rose-600';
  };

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-6 bg-[#2D5A27] rounded-full'></div>
          <h2 className='font-bold text-lg md:text-xl text-[#0f172a]'>Financial Overview</h2>
        </div>
        <Link href='/dashboard/tax-engine'>
          <Button variant='outline' size='sm' className='rounded-xl hover:bg-gray-50 border-gray-100 font-bold text-xs'>
            <BarChart3 className='w-4 h-4 mr-2 text-[#2D5A27]' />
            Tax Details
          </Button>
        </Link>
      </div>

      <div className='space-y-6'>
        {/* Effective Tax Rate / Score Card */}
        <Card className='bg-gradient-to-r from-emerald-50 to-white border-emerald-100 overflow-hidden shadow-sm rounded-[2rem]'>
          <CardContent className='p-6'>
            <div className="flex justify-between items-start mb-2">
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Effective Tax Rate</p>
                <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
            </div>
            <div className='flex items-end gap-2'>
              <span className={`text-4xl font-black text-[#0f172a]`}>
                  {(taxSummary?.effectiveRate || 0).toFixed(1)}%
              </span>
              <span className='text-gray-400 font-bold mb-1 uppercase text-[10px] tracking-widest'>of total income</span>
            </div>
            <div className="relative mt-5">
              <Progress
                value={taxSummary?.effectiveRate || 0}
                max={30} // Typical max effective rate in Nigeria for high earners
                className='h-2.5 rounded-full bg-emerald-100/50'
                indicatorClassName="bg-gradient-to-r from-[#8FAF6A] to-[#2D5A27]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actionable Trend Card */}
        <Card className='bg-white border border-gray-100 shadow-sm rounded-[2rem]'>
          <CardContent className='p-5 flex items-center justify-between'>
            <div>
              <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2'>Compliance Status</p>
              <div className='flex items-center gap-3'>
                <div className={`p-2 rounded-xl bg-emerald-50`}>
                  <TrendingUp className='w-5 h-5 text-emerald-600' />
                </div>
                <span className={`font-black text-sm uppercase tracking-tight text-emerald-600`}>
                  TCC READY
                </span>
              </div>
            </div>
            <div className="text-right px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100">
                <span className='text-xl font-black text-[#0f172a]'>
                  {stats?.complianceScore || 0}%
                </span>
                <p className='text-[8px] uppercase font-black text-gray-400 tracking-tighter'>Confidence Score</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className='grid grid-cols-2 gap-4'>
          <Card className='bg-blue-50/30 border-blue-100/50 shadow-none rounded-[1.5rem]'>
            <CardContent className='p-4 text-center'>
              <p className='text-lg font-black text-[#0f172a] mb-1'>₦{(stats?.taxSaved || 0).toLocaleString()}</p>
              <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Tax Saved (AI)</p>
            </CardContent>
          </Card>
          <Card className='bg-orange-50/30 border-orange-100/50 shadow-none rounded-[1.5rem]'>
            <CardContent className='p-4 text-center'>
              <p className='text-lg font-black text-[#0f172a] mb-1'>{stats?.daysToDeadline || 0}</p>
              <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Days to Filing</p>
            </CardContent>
          </Card>
        </div>

        <Link href='/dashboard/compliance'>
          <Button variant='ghost' className='w-full rounded-xl py-6 font-bold text-sm text-gray-500 hover:bg-gray-50 hover:text-[#2D5A27] transition-all'>
            <ShieldCheck className='w-4 h-4 mr-2' />
            Full Compliance Report
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default FinancialOverview
