import React from 'react';

interface Employee {
    id: string;
    name: string;
    role: string;
    dept: string;
    status: string;
    avatar: string;
}

interface EmployeeListCardProps {
    employee: Employee;
}

const EmployeeListCard: React.FC<EmployeeListCardProps> = ({ employee }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center relative group">

            {/* Status Dot */}
            <div className="absolute top-4 right-4">
                {employee.status === 'active' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                {employee.status === 'on-leave' && <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>}
                {employee.status === 'remote' && <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>}
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
                <span className="font-mono">{employee.id}</span>
                <span>Dept: <span className="font-medium text-gray-900">{employee.dept}</span></span>
            </div>
        </div>
    );
};

export default EmployeeListCard;
