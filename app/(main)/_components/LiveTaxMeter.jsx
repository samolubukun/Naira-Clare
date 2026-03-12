"use client"
import React, { useContext } from 'react';
import { UserContext } from '@/app/_context/UserContext';
import { LayoutDashboard, Wallet, Receipt, FileText, MessageSquare, FolderCheck, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStackApp } from '@stackframe/stack';

function LiveTaxMeter({ isCollapsed }) {
    const { userData } = useContext(UserContext);
    const pathname = usePathname();
    const stack = useStackApp();

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Income', href: '/dashboard/income', icon: Wallet },
        { label: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
        { label: 'Invoices', href: '/dashboard/invoices', icon: FileText },
        { label: 'Tax Assistant', href: '/dashboard/chat', icon: MessageSquare },
        { label: 'Filing', href: '/dashboard/filing', icon: FolderCheck },
    ];

    const handleLogout = () => {
        stack.signOut();
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Logo Section */}
            <Link href="/" className={`flex items-center gap-4 group px-6 pt-10 pb-10 transition-all ${isCollapsed ? 'px-5' : ''}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0 border border-gray-100">
                    <Image src="/nairaclarelogo.jpg" alt="NairaClare Logo" width={40} height={40} className="object-cover h-full w-full" />
                </div>
                {!isCollapsed && <span className="text-2xl font-black text-[#0f172a] tracking-tighter">NairaClare</span>}
            </Link>

            {/* Quick Navigation */}
            <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative ${isActive ? 'bg-[#008751]/10 text-[#008751]' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-[#008751]' : 'text-gray-400 group-hover:text-[#0f172a]'}`} />
                            {!isCollapsed && <span className={`text-sm font-black tracking-tight ${isActive ? 'text-[#0f172a]' : 'text-gray-500 group-hover:text-[#0f172a]'}`}>{item.label}</span>}
                            
                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-16 bg-[#0f172a] text-white text-[10px] font-black py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className={`px-3 py-6 border-t border-gray-100 transition-all`}>
                <button 
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group text-rose-500 hover:bg-rose-50`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-black tracking-tight">Logout</span>}
                    {isCollapsed && (
                        <div className="absolute left-16 bg-rose-600 text-white text-[10px] font-black py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            Logout
                        </div>
                    )}
                </button>
                {!isCollapsed && (
                    <div className="mt-4 px-4 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#008751]" />
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">NTA 2026 Compliant</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LiveTaxMeter;
