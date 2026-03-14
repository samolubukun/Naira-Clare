"use client"
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react'
import moment from 'moment';
import Link from 'next/link';
import React, { useContext } from 'react'
import { Plus, Receipt, ArrowUpRight, ArrowDownRight, Wallet, Clock } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

function RecentActivity() {
  const { userData } = useContext(UserContext);
  // Reusing financial queries for list (simulated as scans in old pattern)
  const invoices = useQuery(api.finance.getInvoices, userData ? { userId: userData._id } : "skip");
  const income = useQuery(api.finance.getIncome, userData ? { userId: userData._id } : "skip");
  
  const loading = !invoices || !income;

  // Merge and sort activities
  const activities = [
      ...(invoices || []).map(inv => ({ 
          id: inv._id, 
          type: 'invoice', 
          title: `Invoice to ${inv.clientName || 'Client'}`, 
          amount: inv.amount, 
          status: inv.status,
          date: inv._creationTime 
      })),
      ...(income || []).map(inc => ({ 
          id: inc._id, 
          type: 'income', 
          title: `Income: ${inc.source}`, 
          amount: inc.amount, 
          status: 'earned',
          date: inc.date 
      }))
  ].sort((a, b) => b.date - a.date).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-5 bg-[#2D5A27] rounded-full'></div>
          <h2 className='font-bold text-base md:text-lg'>Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-5 bg-[#2D5A27] rounded-full'></div>
          <h2 className='font-bold text-base md:text-lg text-[#0f172a]'>Recent Activity</h2>
        </div>
        <Link href='/dashboard/invoices'>
          <Button variant='outline' size='sm' className='h-8 rounded-xl hover:bg-gray-50 border-gray-100 font-bold text-[10px]'>
            <Receipt className='w-3 h-3 mr-1.5 text-[#2D5A27]' />
            All Invoices
          </Button>
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className='text-center py-10 px-4'>
          <div className='w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <Clock className='w-8 h-8 text-[#2D5A27]' />
          </div>
          <h3 className='text-[#0f172a] font-black text-sm mb-1 tracking-tight'>No activities yet</h3>
          <p className='text-[11px] text-muted-foreground mb-6 max-w-[200px] mx-auto font-medium'>
            Log your first income or create an invoice to see it here.
          </p>
          <Link href='/dashboard/invoices'>
            <Button className='h-9 rounded-xl px-6 font-black text-xs bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/10'>
               <Plus className='w-3 h-3 mr-1.5' />
               New Invoice
            </Button>
          </Link>
        </div>
      ) : (
        <div className='space-y-2.5'>
          {activities.map((activity) => (
            <div key={activity.id} className='group flex justify-between items-start bg-white hover:bg-gray-50/50 rounded-2xl p-3 border border-gray-50 hover:border-[#2D5A27]/20 transition-all duration-300 shadow-sm'>
              <div className='flex gap-3 items-start min-w-0 flex-1'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'} border border-white/10 shadow-inner`}>
                  {activity.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <h3 className='font-black text-[12px] text-[#0f172a] group-hover:text-[#2D5A27] transition-colors leading-tight'>
                      {activity.title}
                    </h3>
                    <Badge className={`text-[7px] px-1 py-0 font-black uppercase tracking-widest border-none h-3.5 ${activity.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className='text-[9px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-tighter'>
                    {moment(activity.date).fromNow()}
                  </p>
                </div>
              </div>
              <div className='text-right ml-3 pt-0.5'>
                <p className={`font-black text-xs ${activity.type === 'income' ? 'text-emerald-600' : 'text-[#0f172a]'}`}>
                    ₦{(activity.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentActivity
