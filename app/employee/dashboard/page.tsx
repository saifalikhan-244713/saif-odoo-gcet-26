'use client';

import React, { useEffect, useState } from 'react';
import EmployeeView from '@/components/employee/EmployeeView';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }

        try {
            const res = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                router.push('/signin');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        document.cookie = 'token=; Max-Age=0; path=/;';
        router.push('/signin');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Employee Navbar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Employee Portal</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">Hello, {user.firstName}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <EmployeeView user={user} onUpdate={fetchUser} />
            </main>
        </div>
    );
}
