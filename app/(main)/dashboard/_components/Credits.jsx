import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from '@/components/ui/progress';
import { useUser } from '@stackframe/stack';
import { Zap, MessageCircle, BarChart3, Scan, FileText, User } from 'lucide-react';
import Image from 'next/image';
import React, { useContext } from 'react'
import { CREDIT_LIMITS, DEFAULT_CREDITS } from '@/config/credits';
import { UserContext } from '@/app/_context/UserContext'

function Credits() {
    const { userData } = useContext(UserContext);
    const user = useUser();

    // Unified credits from the user data
    const credits = userData?.credits ?? 0;
    const maxCredits = DEFAULT_CREDITS; // For visual progress anchoring

    const CalculateProgress = () => {
        const pct = maxCredits > 0 ? (credits / maxCredits) * 100 : 0;
        return Math.min(100, Math.max(0, Math.round(pct)));
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-6">
                <div className='flex gap-4 items-center'>
                    {user?.profileImageUrl ? (
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#008751]/20">
                            <Image src={user.profileImageUrl}
                                alt={user?.displayName || 'User avatar'}
                                fill
                                className='object-cover'
                            />
                        </div>
                    ) : (
                        <div className='w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#008751]/10 flex items-center justify-center text-[#008751] border-2 border-[#008751]/20'>
                            <User className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h2 className='text-lg font-black text-[#0f172a] truncate tracking-tight'>{user?.displayName || user?.primaryEmail?.split('@')[0] || 'User'}</h2>
                        <p className='text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest truncate'>{user?.primaryEmail}</p>
                    </div>
                </div>

                <div className="space-y-6 pt-2">
                    {/* Unified Credits */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className={`font-black flex items-center gap-2 text-xs md:text-sm uppercase tracking-tighter ${credits <= 0 ? 'text-rose-500' : 'text-[#0f172a]'}`}>
                                <Zap className='w-4 h-4 text-[#008751]' /> Available Credits
                            </h2>
                            <Badge variant={credits <= 0 ? "destructive" : "outline"} className={`font-black rounded-lg ${credits > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}`}>
                                {credits} TOTAL
                            </Badge>
                        </div>
                        <Progress value={CalculateProgress()} className='h-2.5 bg-gray-100 rounded-full' indicatorClassName="bg-gradient-to-r from-[#008751] to-[#2D5A27]" />
                        
                        {/* Transaction Costs Info */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                <Scan className="w-3 h-3 text-gray-400" />
                                <span className="text-[9px] font-bold text-gray-500">Audit: {CREDIT_LIMITS.FREE_PLAN.AI_AUDIT_COST}cr</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                <MessageCircle className="w-3 h-3 text-gray-400" />
                                <span className="text-[9px] font-bold text-gray-500">Chat: {CREDIT_LIMITS.FREE_PLAN.AI_CHAT_COST}cr</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span className="text-[9px] font-bold text-gray-500">Scan: {CREDIT_LIMITS.FREE_PLAN.RECEIPT_SCAN_COST}cr</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                <BarChart3 className="w-3 h-3 text-gray-400" />
                                <span className="text-[9px] font-bold text-gray-500">Import: {CREDIT_LIMITS.FREE_PLAN.BANK_IMPORT_COST}cr</span>
                            </div>
                        </div>

                        {credits <= 0 && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl mt-2">
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest text-center">
                                    Out of credits. Credits refill monthly!
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
                        <h2 className='font-black text-xs md:text-sm text-[#0f172a] uppercase tracking-tighter'>Account Status</h2>
                        <Badge variant="outline" className="font-black border-emerald-100 bg-emerald-50/50 text-emerald-700 rounded-lg">
                            ACTIVE
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Credits