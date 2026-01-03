import React, { useState, useEffect } from 'react';
import BasicDetailsTab from '@/components/admin/tabs/BasicDetailsTab';
import DocumentsTab from '@/components/admin/tabs/DocumentsTab';
import SalaryTab from '@/components/admin/tabs/SalaryTab';

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
                        <BasicDetailsTab formData={formData} handleChange={handleChange} />
                    )}

                    {activeTab === 'Documents' && (
                        <DocumentsTab
                            documents={documents}
                            handleDocumentChange={handleDocumentChange}
                            addDocument={addDocument}
                            removeDocument={removeDocument}
                        />
                    )}

                    {activeTab === 'Salary' && (
                        <SalaryTab
                            formData={formData}
                            handleChange={handleChange}
                            handlePercentChange={handlePercentChange}
                        />
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
