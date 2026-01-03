import React from 'react';

interface Employee {
    id: string;
    empId?: string;
    name: string;
    role: string;
    dept: string;
    status: string;
    avatar: string;
}

interface EmployeeListCardProps {
    employee: Employee;
    onClick?: () => void;
}

const EmployeeListCard: React.FC<EmployeeListCardProps> = ({ employee, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center relative group cursor-pointer"
        >

            {/* Status Dot */}
            <div className="absolute top-4 right-4">
                <div className={`w-3 h-3 rounded-full ${employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden ring-4 ring-gray-50/50">
                <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <h3 className="text-gray-900 font-semibold text-lg">{employee.name}</h3>
            <p className="text-gray-500 text-sm mb-6">{employee.role}</p>

            {/* Footer Info */}
            <div className="w-full flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-4 mt-auto">
                <span className="font-mono">{employee.empId || employee.id}</span>
                <span>Dept: <span className="font-medium text-gray-900">{employee.dept}</span></span>
            </div>
        </div>
    );
};

export default EmployeeListCard;
