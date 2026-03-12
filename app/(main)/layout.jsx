"use client"
import React, { useState } from 'react'
import AppHeader from './_components/AppHeader'
import LiveTaxMeter from './_components/LiveTaxMeter'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import Image from 'next/image'

function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className='min-h-screen bg-slate-50 flex'>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-shrink-0 border-r border-gray-100 bg-white flex-col sticky top-0 h-screen overflow-y-auto no-scrollbar transition-all duration-300 relative ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
                <LiveTaxMeter isCollapsed={isCollapsed} />
                
                {/* Collapse Toggle Button (Desktop) */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-8 -right-4 w-8 h-8 border border-gray-100 bg-white rounded-xl shadow-xl z-50 hover:bg-[#008751] hover:text-white transition-all duration-300 flex items-center justify-center p-0 group/toggle"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col overflow-y-auto no-scrollbar z-60 animate-in slide-in-from-left duration-300">
                        <div className="absolute top-4 right-4 z-10">
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-xl hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-400" />
                            </Button>
                        </div>
                        <LiveTaxMeter />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Header (Slim & Clean) */}
                <div className='h-16 shadow-sm flex justify-between items-center px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40'>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-xl">
                            <Menu className="w-5 h-5 text-[#0f172a]" />
                        </Button>
                        <div className="lg:hidden flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                                <Image src="/nairaclarelogo.jpg" alt="Logo" width={32} height={32} className="object-cover h-full w-full" />
                            </div>
                            <span className="text-xl font-black text-[#0f172a] tracking-tighter">NairaClare</span>
                        </div>
                    </div>
                    <AppHeader />
                </div>

                <div className='p-3 md:p-8 lg:p-12 max-w-7xl w-full mx-auto'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout