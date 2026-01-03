import React from 'react';
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

interface BasicDetailsTabProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const BasicDetailsTab: React.FC<BasicDetailsTabProps> = ({ formData, handleChange }) => {
    return (
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
    );
};

export default BasicDetailsTab;
