'use client';

import React, { useState } from 'react';
import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'USER',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Redirect to signin or dashboard
            router.push('/signin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    {/* Placeholder for Logo */}
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">DS</div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join 10,000+ developers building the future.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <FormInput
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            label="Work Email"
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="USER">Developer (User)</option>
                                <option value="ADMIN">Manager (Admin)</option>
                            </select>
                        </div>

                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />

                        <p className="text-xs text-gray-500">Must be at least 8 characters.</p>

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Create Account →'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    TRUSTED BY TEAMS AT
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-gray-400 text-sm font-bold uppercase">
                            {/* Placeholders for logos */}
                            <div>ACME</div>
                            <div>Globex</div>
                            <div>Soylent</div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
                &copy; 2024 DevSaaS Inc. All rights reserved. <br />
                Privacy Policy  Terms of Service
            </div>
        </div>
    );
}
