import React, { useState } from 'react';
import BasicDetailsTab from '@/components/admin/tabs/BasicDetailsTab';
import SalaryTab from '@/components/admin/tabs/SalaryTab';
import AttendanceHistoryTab from '@/components/admin/tabs/AttendanceHistoryTab';

interface EmployeeViewProps {
    user: any;
    onUpdate: () => void; // Trigger refresh after update
}

const EmployeeView: React.FC<EmployeeViewProps> = ({ user, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('My Profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Prepare Initial Data for Forms
    // We map the deeply nested user object to the flat structure expected by BasicDetailsTab
    const profile = user.employeeProfile || {};
    const salary = profile.salaryStructure || {};

    // We need to maintain a local state for the editable fields in Basic Details
    // BasicDetailsTab expects a specific structure. We'll create a wrapper or just reuse it carefully.
    // NOTE: BasicDetailsTab has many fields. We only want to allow editing some.
    // Strategy: We pass the full data, but we might need to modify BasicDetailsTab to accept "readOnly" props 
    // OR we just use a simplified form for "My Profile" if BasicDetailsTab is too Admin-focused.
    // Given the request "he will be able to see all the details... from there only he can edit password... and basic contact details",
    // reusing the tabs in "View Mode" (disabled inputs) is best, except for specific editable ones.

    // Let's create a specific state for the "Edit Profile" action which might be a subset.

    const [formData, setFormData] = useState({
        // Read Only Fields (Populated for display)
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        workEmail: user.email || '',
        designation: profile.designation || '',
        department: profile.department || '',
        // ... mapped fields

        // Editable Fields
        personalEmail: profile.personalEmail || '',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        zipCode: profile.zipCode || '',

        // Security
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setMessage(null);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/employee/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    personalEmail: formData.personalEmail,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zipCode: formData.zipCode
                })
            });

            if (!res.ok) throw new Error('Failed to update profile');

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            onUpdate(); // Refresh data
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage(null);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/employee/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    password: formData.newPassword
                })
            });

            if (!res.ok) throw new Error('Failed to update password');

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['My Profile', 'Attendance', 'Salary', 'Security'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">Employee ID: <span className="font-mono font-medium text-indigo-600">{user.empId}</span></p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {profile.designation || 'Employee'}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 overflow-y-auto">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {activeTab === 'My Profile' && (
                    <div className="max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <h3 className="text-lg font-medium text-gray-900 col-span-full border-b pb-2">Basic Info (Read Only)</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" value={user.firstName} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" value={user.lastName} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Work Email</label>
                                <input type="text" value={user.email} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <input type="text" value={profile.department} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h3 className="text-lg font-medium text-gray-900 col-span-full border-b pb-2 mt-4">Contact Details (Editable)</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Personal Email</label>
                                <input name="personalEmail" type="email" value={formData.personalEmail} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input name="phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input name="city" type="text" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input name="state" type="text" value={formData.state} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input name="country" type="text" value={formData.country} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                <input name="zipCode" type="text" value={formData.zipCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={handleSaveProfile} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Attendance' && (
                    <AttendanceHistoryTab employeeId={user.id} />
                )}

                {activeTab === 'Salary' && (
                    <div className="pointer-events-none opacity-90">
                        {/* We recycle SalaryTab but disable interaction via CSS and props if supported, or just render it */}
                        {/* Needs data mapping */}
                        <SalaryTab
                            formData={{
                                ...salary,
                                basicSalaryPercent: salary.basicSalaryPercent?.toString(),
                                // ... map all decimals to strings for the component
                            } as any}
                            handleChange={() => { }}
                            handlePercentChange={() => { }}
                        />
                        <div className="mt-4 text-center text-sm text-gray-500 italic">
                            * Salary details are read-only. Contact HR for discrepancies.
                        </div>
                    </div>
                )}

                {activeTab === 'Security' && (
                    <div className="max-w-md mx-auto mt-10">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
                            </div>
                            <button onClick={handleChangePassword} disabled={loading} className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeView;
