"use client"
import { api } from '@/convex/_generated/api';
import { useUser } from '@stackframe/stack'
import { useMutation, useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react'
import { UserContext } from './_context/UserContext';

function AuthProvider({ children }) {

    const user = useUser();
    const CreateUser = useMutation(api.users.CreateUser);

    // Use useQuery to get real-time updates for user data
    const convexUserData = useQuery(api.users.getUserByEmail,
        user?.primaryEmail ? { email: user.primaryEmail } : "skip"
    );

    const [userData, setUserData] = useState();

    // Still need to ensure user exists
    useEffect(() => {
        if (user && user.primaryEmail) {
            CreateNewUser();
        }
    }, [user])

    // Update local context state when convex data changes
    useEffect(() => {
        if (convexUserData) {
            setUserData(convexUserData);
        }
    }, [convexUserData])

    const CreateNewUser = async () => {
        try {
            const result = await CreateUser({
                name: user?.displayName || undefined,
                email: user?.primaryEmail
            });
            // Initial set, subsequent updates come from useQuery
            if (!userData) setUserData(result);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    return (
        <div>
            <UserContext.Provider value={{ userData, setUserData }}>
                {children}
            </UserContext.Provider>
        </div>
    )
}

export default AuthProvider