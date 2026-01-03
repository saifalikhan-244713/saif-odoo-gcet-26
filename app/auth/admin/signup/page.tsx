'use client';

import React, { useState } from 'react';
import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'ADMIN', // Default to ADMIN
        companyName: '',
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
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                companyName: formData.companyName,
            };

            const res = await fetch('/api/auth/admin/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                // Check if the error is a Zod error array
                if (data.errors && Array.isArray(data.errors)) {
                    throw new Error(data.errors.map((e: any) => e.message).join(', '));
                }
                throw new Error(data.message || 'Something went wrong');
            }

            // Redirect to signin
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
                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">DS</div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register Admin/HR
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Create an account for administrative access.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="First Name"
                                name="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                label="Last Name"
                                name="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <FormInput
                            label="Company Name"
                            name="companyName"
                            type="text"
                            placeholder="Acme Corp"
                            value={formData.companyName}
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="HR">HR</option>
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
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Create Account →'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
