import { UserButton } from '@stackframe/stack'
import React from 'react'

function AppHeader() {
    return (
        <div className="flex justify-end w-full">
            <UserButton />
        </div>
    )
}

export default AppHeader