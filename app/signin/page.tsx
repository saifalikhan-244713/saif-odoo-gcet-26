'use client';

import React, { useState } from 'react';
import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { ROLE_REDIRECTS, DEFAULT_REDIRECT } from '@/constants/routes';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("hello");
            console.log(data);

            if (!res.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }


            // ... (existing imports)

            // Inside handleSubmit function, after successful login:
            // Save token (locally for now, usually handled by HttpOnly cookie or session provider)
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('status', data.status);
            // localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            const redirectPath = ROLE_REDIRECTS[data.role] || DEFAULT_REDIRECT;
            router.push(redirectPath);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-center text-sm text-blue-600 mb-8 cursor-pointer hover:underline">
                        Enter your credentials to access the console
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <FormInput
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" // Keeping manual input for custom label layout or use FormInput and custom label prop? FormInput is simpler.
                                required
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>


                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </div>
                </div>
                <div className="mt-6 flex justify-center space-x-6 text-xs text-gray-400">
                    <span>Terms of Service</span>
                    <span>Privacy Policy</span>
                    <span>Help Center</span>
                </div>
            </div>
        </div>
    );
}
