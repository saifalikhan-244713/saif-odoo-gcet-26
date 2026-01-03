import React from 'react';
import FormInput from '@/components/FormInput';

interface SalaryTabProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handlePercentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SalaryTab: React.FC<SalaryTabProps> = ({ formData, handleChange, handlePercentChange }) => {
    return (
        <div className="space-y-8">

            {/* Header Info */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Salary Info</h2>
                <p className="text-gray-500">Configure compensation structure, earnings, and deductions.</p>
            </div>

            {/* Wage Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Monthly Wage</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                            <input type="number" name="monthlyWage" className="w-full pl-8 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="50000" onChange={handleChange} value={formData.monthlyWage} />
                            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">/ Month</span>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Yearly Wage</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                            <input type="number" name="yearlyWage" className="w-full pl-8 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" placeholder="600000" value={formData.yearlyWage} readOnly />
                            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">/ Year</span>
                        </div>
                    </div>
                    <div>
                        <FormInput label="Working Days / Week" name="workingDaysPerWeek" placeholder="e.g., 5" onChange={handleChange} value={formData.workingDaysPerWeek} />
                    </div>
                    <div>
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-2">Break Time</label>
                            <div className="relative">
                                <input type="text" name="breakTimeHours" className="w-full pl-4 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 1" onChange={handleChange} value={formData.breakTimeHours} />
                                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">/ Hours</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Salary Components - Left Side (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Salary Components
                            </h3>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active Structure</span>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Basic Salary', name: 'basicSalary', percentName: 'basicSalaryPercent', subtext: 'Define Basic salary from company cost, compute based on monthly wages.' },
                                { label: 'House Rent Allowance', name: 'hra', percentName: 'hraPercent', subtext: 'HRA provided to employees, typically 50% of the basic salary.' },
                                { label: 'Standard Allowance', name: 'standardAllowance', percentName: 'standardAllowancePercent', subtext: 'Fixed amount provided to employee as part of their salary.' },
                                { label: 'Performance Bonus', name: 'performanceBonus', percentName: 'performanceBonusPercent', subtext: 'Variable amount paid during payroll. Calculated as % of basic.' },
                                { label: 'Leave Travel Allowance', name: 'lta', percentName: 'ltaPercent', subtext: '' },
                                { label: 'Fixed Allowance', name: 'fixedAllowance', percentName: 'fixedAllowancePercent', subtext: 'Balancing figure to match total wage.' },
                            ].map((item, idx) => (
                                <div key={idx} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <label className="text-sm font-medium text-gray-900 block mb-2">{item.label}</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                name={item.name}
                                                className="w-full pl-8 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                                placeholder="0.00"
                                                value={formData[item.name as keyof typeof formData]}
                                                readOnly
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400 text-xs">/ month</span>
                                        </div>
                                        <div className="relative w-32">
                                            <input
                                                type="number"
                                                name={item.percentName}
                                                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
                                                onChange={handlePercentChange}
                                                value={formData[item.percentName as keyof typeof formData]}
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
                                        </div>
                                    </div>
                                    {item.subtext && <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Deductions & Net Pay */}
                <div className="space-y-6">
                    {/* PF Contribution */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            PF Contribution
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Employee Share</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                        <input type="number" name="employeePfShareAmount" className="w-full pl-7 py-2 border border-gray-300 rounded-md text-sm bg-gray-50" placeholder="3000.00" value={formData.employeePfShareAmount} readOnly />
                                    </div>
                                    <div className="relative w-28">
                                        <input type="number" name="employeePfSharePercent" className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm text-right" onChange={handleChange} value={formData.employeePfSharePercent} />
                                        <span className="absolute right-8 top-2.5 text-gray-400 text-xs">%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Calculated on Basic Salary</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Employer Share</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                        <input type="number" name="employerPfShareAmount" className="w-full pl-7 py-2 border border-gray-300 rounded-md text-sm bg-gray-50" placeholder="3000.00" value={formData.employerPfShareAmount} readOnly />
                                    </div>
                                    <div className="relative w-28">
                                        <input type="number" name="employerPfSharePercent" className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm text-right" onChange={handleChange} value={formData.employerPfSharePercent} />
                                        <span className="absolute right-8 top-2.5 text-gray-400 text-xs">%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Calculated on Basic Salary</p>
                            </div>
                        </div>
                    </div>

                    {/* Tax Deductions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
                            Tax Deductions
                        </h3>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Professional Tax</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                <input type="number" name="professionalTax" className="w-full pl-8 pr-16 py-2 border border-gray-300 rounded-lg" placeholder="200.00" onChange={handleChange} value={formData.professionalTax} />
                                <span className="absolute right-3 top-2.5 text-gray-400 text-xs">/ month</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Deducted from the Gross salary.</p>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">Estimated Net Pay</span>
                            <span className="text-2xl font-bold text-gray-900">₹ {formData.estimatedNetPay || '0.00'}</span>
                        </div>
                        <div className="w-full bg-indigo-200 h-1.5 rounded-full mb-2">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-right text-xs text-gray-500">After PF & PT deductions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryTab;
