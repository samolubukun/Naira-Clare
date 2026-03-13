import { UserButton } from '@stackframe/stack'
import React from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'

function AppHeader() {
    return (
        <div className="flex justify-end items-center gap-4 w-full">
            <Link 
                href="/dashboard/profile" 
                className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-[#008751] transition-all duration-300 group"
                title="Settings & Profile"
            >
                <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </Link>
            <UserButton />
        </div>
    )
}

export default AppHeader