import React, { useState, useEffect } from 'react';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';

import {
    DEPARTMENTS,
    SYSTEM_ROLES,
    EMPLOYMENT_STATUSES,
    EMPLOYMENT_TYPES,
    GENDER_OPTIONS,
    COUNTRY_OPTIONS
} from '@/lib/constants/employee';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('Basic Details');
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState<{ email: string; empId: string; password: string } | null>(null);

    // Documents State
    const [documents, setDocuments] = useState<{ id: number; name: string; file: File | null }[]>([
        { id: 1, name: '', file: null }
    ]);

    const handleDocumentChange = (id: number, field: 'name' | 'file', value: string | File | null) => {
        setDocuments(documents.map(doc =>
            doc.id === id ? { ...doc, [field]: value } : doc
        ));
    };

    const addDocument = () => {
        setDocuments([...documents, { id: Date.now(), name: '', file: null }]);
    };

    const removeDocument = (id: number) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        workEmail: '',
        // Password removed from initial state as it's auto-generated
        personalEmail: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        designation: '',
        department: '',
        systemRole: '',
        employmentStatus: 'Active',
        employmentType: 'Full-time',
        // Salary Info
        monthlyWage: '',
        yearlyWage: '',
        workingDaysPerWeek: '',
        breakTimeHours: '',

        // Component Amounts
        basicSalary: '',
        hra: '',
        standardAllowance: '',
        performanceBonus: '',
        lta: '',
        fixedAllowance: '',

        // Component Percentages
        // Component Percentages (Summing to ~100% for CTC logic)
        basicSalaryPercent: '40',
        hraPercent: '20',
        standardAllowancePercent: '10',
        performanceBonusPercent: '10',
        ltaPercent: '5',
        fixedAllowancePercent: '3',

        employeePfShareAmount: '',
        employeePfSharePercent: '12.00', // Deduction
        employerPfShareAmount: '',
        employerPfSharePercent: '12.00', // Part of CTC Cost
        professionalTax: '',
        estimatedNetPay: '',
    });

    // Salary Calculation Effect
    useEffect(() => {
        const monthly = parseFloat(formData.monthlyWage) || 0;

        // Calculate Yearly Wage
        const yearly = monthly * 12;

        // Calculate Components
        const basic = (monthly * (parseFloat(formData.basicSalaryPercent) || 0)) / 100;
        const hra = (monthly * (parseFloat(formData.hraPercent) || 0)) / 100;
        const stdAllowance = (monthly * (parseFloat(formData.standardAllowancePercent) || 0)) / 100;
        const bonus = (monthly * (parseFloat(formData.performanceBonusPercent) || 0)) / 100;
        const lta = (monthly * (parseFloat(formData.ltaPercent) || 0)) / 100;
        const fixed = (monthly * (parseFloat(formData.fixedAllowancePercent) || 0)) / 100;

        // PF Calculation (on Basic)
        const pfEmployee = (basic * (parseFloat(formData.employeePfSharePercent) || 0)) / 100;
        const pfEmployer = (basic * (parseFloat(formData.employerPfSharePercent) || 0)) / 100;

        // Net Pay Calculation
        // Formula: Gross Salary (Monthly Wage) - Deductions (Employee PF + PT)
        // Professional tax is usually input as a flat amount
        const pt = parseFloat(formData.professionalTax) || 0;
        const netPay = monthly - pfEmployee - pt;

        setFormData(prev => ({
            ...prev,
            yearlyWage: yearly > 0 ? yearly.toFixed(2) : '',
            basicSalary: basic > 0 ? basic.toFixed(2) : '',
            hra: hra > 0 ? hra.toFixed(2) : '',
            standardAllowance: stdAllowance > 0 ? stdAllowance.toFixed(2) : '',
            performanceBonus: bonus > 0 ? bonus.toFixed(2) : '',
            lta: lta > 0 ? lta.toFixed(2) : '',
            fixedAllowance: fixed > 0 ? fixed.toFixed(2) : '',
            employeePfShareAmount: pfEmployee > 0 ? pfEmployee.toFixed(2) : '',
            employerPfShareAmount: pfEmployer > 0 ? pfEmployer.toFixed(2) : '',
            estimatedNetPay: netPay > 0 ? netPay.toFixed(2) : '',
        }));
    }, [
        formData.monthlyWage,
        formData.basicSalaryPercent,
        formData.hraPercent,
        formData.standardAllowancePercent,
        formData.performanceBonusPercent,
        formData.ltaPercent,
        formData.fixedAllowancePercent,
        formData.employeePfSharePercent,
        formData.employerPfSharePercent,
        formData.professionalTax
    ]);

    if (!isOpen) return null;



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        let newValue = parseFloat(e.target.value);
        if (isNaN(newValue)) newValue = 0;
        if (newValue > 100) newValue = 100;

        const oldValue = parseFloat(formData[fieldName as keyof typeof formData] as string) || 0;
        const difference = newValue - oldValue;

        // If no change, return
        if (difference === 0) return;

        let updatedFormData = { ...formData, [fieldName]: newValue.toString() };

        // Sacrifice Order (Who loses value when someone gains, or gains when someone loses)
        // Reverse order of importance: Fixed -> LTA -> Bonus -> Standard -> HRA -> Basic
        const sacrificeOrder = [
            'fixedAllowancePercent',
            'ltaPercent',
            'performanceBonusPercent',
            'standardAllowancePercent',
            'hraPercent',
            'employerPfSharePercent',
            'employeePfSharePercent',
            'basicSalaryPercent'
        ];

        // Filter out the current field being edited
        const targets = sacrificeOrder.filter(f => f !== fieldName);

        if (difference > 0) {
            // INCREASE: Subtract from others
            let remainingDiff = difference;

            for (const target of targets) {
                if (remainingDiff <= 0.001) break;

                const currentVal = parseFloat(formData[target as keyof typeof formData] as string) || 0;

                if (currentVal > 0) {
                    const takeAmount = Math.min(currentVal, remainingDiff);
                    updatedFormData = {
                        ...updatedFormData,
                        [target]: (currentVal - takeAmount).toFixed(2)
                    };
                    remainingDiff -= takeAmount;
                }
            }
        } else {
            // DECREASE: Add to Fixed Allowance (or Basic if Fixed is the one changing)
            // Ideally, everything goes to Fixed Allowance
            let targetAdd = 'fixedAllowancePercent';
            if (fieldName === 'fixedAllowancePercent') targetAdd = 'basicSalaryPercent'; // Failover to Basic if Fixed is edited

            const currentTargetVal = parseFloat(formData[targetAdd as keyof typeof formData] as string) || 0;
            updatedFormData = {
                ...updatedFormData,
                [targetAdd]: (currentTargetVal + Math.abs(difference)).toFixed(2)
            };
        }

        setFormData(updatedFormData);
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let pass = "";
        for (let i = 0; i < 10; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSubmitError(null);
        try {
            // Auto-generate password
            const generatedPassword = generatePassword();
            const payload = { ...formData, password: generatedPassword };

            console.log("Submitting payload:", payload);
            const response = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // Success! Show success modal
                setCreatedCredentials({
                    email: formData.workEmail,
                    empId: data.user.empId || 'N/A',
                    password: generatedPassword
                });
                setShowSuccess(true);
            } else {
                setSubmitError(data.message || 'Failed to create employee');
            }
        } catch (error) {
            console.error('Error creating employee:', error);
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const handleCloseFinal = () => {
        setShowSuccess(false);
        setCreatedCredentials(null);
        // Reset form data if needed?
        onClose();
    };

    const tabs = ['Basic Details', 'Documents', 'Salary']; // Example tabs

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Success Modal Overlay */}
            {showSuccess && createdCredentials && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Employee Added!</h3>
                            <p className="text-gray-500 mt-2">The employee has been successfully onboarded. Please share these credentials with them.</p>
                        </div>

                        <div className="space-y-4 bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Work Email</label>
                                <div className="flex items-center justify-between mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                    <code className="text-gray-800 font-mono text-sm break-all">{createdCredentials.email}</code>
                                    <button onClick={() => handleCopy(createdCredentials.email)} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Copy Email">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee ID</label>
                                <div className="flex items-center justify-between mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                    <code className="text-indigo-600 font-mono font-bold text-lg">{createdCredentials.empId}</code>
                                    <button onClick={() => handleCopy(createdCredentials.empId)} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Copy ID">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Auto-Generated Password</label>
                                <div className="flex items-center justify-between mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                    <code className="text-gray-800 font-mono font-bold text-lg">{createdCredentials.password}</code>
                                    <button onClick={() => handleCopy(createdCredentials.password)} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Copy Password">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleCloseFinal}
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]"
                            >
                                Done & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Content */}
            <div className={`relative w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] transition-opacity duration-300 ${showSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Dashboard</span>
                            <span>/</span>
                            <span>Employees</span>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Create New</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Employee</h2>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details below to onboard a new team member.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
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

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'Basic Details' && (
                        <form className="space-y-8">

                            {/* Personal Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                    Personal Details
                                </h3>

                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Profile Photo Placeholder */}
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors group">
                                            <svg className="w-8 h-8 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span className="text-xs text-gray-500">Profile Photo</span>
                                    </div>

                                    {/* Fields Grid */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormInput label="First Name" name="firstName" placeholder="e.g. Jane" required onChange={handleChange} value={formData.firstName} />
                                        <FormInput label="Last Name" name="lastName" placeholder="e.g. Doe" required onChange={handleChange} value={formData.lastName} />
                                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput label="Work Email (Login)" name="workEmail" type="email" placeholder="jane.doe@company.com" required onChange={handleChange} value={formData.workEmail} />
                                            {/* Password auto-generated */}
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormInput label="Personal Email (Optional)" name="personalEmail" placeholder="jane@example.com" type="email" onChange={handleChange} value={formData.personalEmail} />
                                        </div>

                                        <FormInput label="Phone Number" name="phoneNumber" placeholder="+1 (555) 000-0000" required onChange={handleChange} value={formData.phoneNumber} />
                                        <FormSelect
                                            label="Gender"
                                            name="gender"
                                            required
                                            options={GENDER_OPTIONS}
                                            onChange={handleChange}
                                            value={formData.gender}
                                        />
                                        <FormInput label="Date of Birth" name="dateOfBirth" type="date" required onChange={handleChange} value={formData.dateOfBirth} />

                                        <div className="md:col-span-3">
                                            <FormTextarea label="Residential Address" name="address" placeholder="Street address, apartment, suite, etc." onChange={handleChange} value={formData.address} />
                                        </div>

                                        <FormInput label="City" name="city" onChange={handleChange} value={formData.city} />
                                        <FormInput label="State/Province" name="state" onChange={handleChange} value={formData.state} />
                                        <FormSelect
                                            label="Country"
                                            name="country"
                                            options={COUNTRY_OPTIONS}
                                            onChange={handleChange}
                                            value={formData.country}
                                        />

                                        <FormInput label="Zip / Pincode" name="zipCode" onChange={handleChange} value={formData.zipCode} />
                                        <FormInput label="Emergency Contact Name" name="emergencyContactName" onChange={handleChange} value={formData.emergencyContactName} />
                                        <FormInput label="Emergency Contact Number" name="emergencyContactNumber" onChange={handleChange} value={formData.emergencyContactNumber} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Employment Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>
                                    Employment Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormInput label="Designation / Job Title" name="designation" placeholder="e.g. Senior Product Designer" required onChange={handleChange} value={formData.designation} />
                                    <FormSelect
                                        label="Department"
                                        name="department"
                                        required
                                        options={DEPARTMENTS}
                                        onChange={handleChange}
                                        value={formData.department}
                                    />
                                    <FormSelect
                                        label="System Role"
                                        name="systemRole"
                                        required
                                        options={SYSTEM_ROLES}
                                        onChange={handleChange}
                                        value={formData.systemRole}
                                    />
                                    <FormSelect
                                        label="Employment Status"
                                        name="employmentStatus"
                                        options={EMPLOYMENT_STATUSES}
                                        onChange={handleChange}
                                        value={formData.employmentStatus}
                                    />
                                    <FormSelect
                                        label="Employment Type"
                                        name="employmentType"
                                        options={EMPLOYMENT_TYPES}
                                        onChange={handleChange}
                                        value={formData.employmentType}
                                    />
                                </div>
                            </div>

                        </form>
                    )}

                    {activeTab === 'Documents' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Employee Documents</h2>
                                <p className="text-gray-500">Upload necessary documents for the employee.</p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                                {documents.map((doc, index) => (
                                    <div key={doc.id} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <FormInput
                                                label="Document Name"
                                                placeholder="e.g. ID Proof, PAN Card"
                                                value={doc.name}
                                                onChange={(e) => handleDocumentChange(doc.id, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-700 block mb-2">Upload File</label>
                                            <input
                                                type="file"
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100
                                                    border border-gray-300 rounded-lg p-1.5"
                                                onChange={(e) => handleDocumentChange(doc.id, 'file', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </div>
                                        {documents.length > 1 && (
                                            <button
                                                onClick={() => removeDocument(doc.id)}
                                                className="mb-1.5 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={addDocument}
                                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Add Another Document
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Salary' && (
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
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex flex-col gap-4">
                    {submitError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {submitError}
                        </div>
                    )}
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                Save as Draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2.5 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Create Employee
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

};

export default AddEmployeeModal;
