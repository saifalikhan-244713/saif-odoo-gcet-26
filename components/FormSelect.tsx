import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, options, error, className, ...props }) => {
    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    } ${className}`}
                {...props}
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FormSelect;
