import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FormInput;
