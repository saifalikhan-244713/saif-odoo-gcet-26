'use client';

import AddEmployeeModal from '@/components/admin/AddEmployeeModal';
import AttendanceTab from '@/components/admin/tabs/AttendanceTab';
import EmployeeListCard from '@/components/employee/EmployeeListCard';
import Sidebar from '@/components/shared/Sidebar';
import Pagination from '@/components/shared/Pagination';
import { useRouter } from 'next/navigation';

import React, { useState, useEffect } from 'react';

interface Employee {
    id: string;
    empId?: string; // Custom ID for display
    name: string;
    role: string;
    dept: string;
    status: string;
    avatar: string;
}

export default function AdminDashboard() {
    const router = useRouter(); // Initialize router
    const [activeTab, setActiveTab] = useState('Employees');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [userStatus, setUserStatus] = useState('CHECK_OUT');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // Dropdown state
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/admin/employees', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setEmployees(data.employees);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, [isAddEmployeeModalOpen]);

    React.useEffect(() => {
        const storedStatus = localStorage.getItem('status');
        const role = localStorage.getItem('role');

        if (role === 'ADMIN' || role === 'HR') {
            setUserStatus('CHECK_OUT'); // Default to Green "Check In" button for Admin/HR
        } else if (storedStatus) {
            setUserStatus(storedStatus);
        }
    }, []);

    const handleLogout = () => {
        // Clear all auth related items
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('status');

        // Redirect to login
        router.push('/signin');
    };

    const handleAttendanceToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const endpoint = userStatus === 'CHECK_IN' ? '/api/attendance/check-out' : '/api/attendance/check-in';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                const newStatus = userStatus === 'CHECK_IN' ? 'CHECK_OUT' : 'CHECK_IN';
                setUserStatus(newStatus);
                localStorage.setItem('status', newStatus);
            } else {
                alert(data.message || 'Error updating attendance');
            }
        } catch (error) {
            console.error('Attendance error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    // Filter Logic
    const filteredEmployees = employees.filter(emp => {
        const query = searchQuery.toLowerCase();
        return (
            emp.name.toLowerCase().includes(query) ||
            emp.role.toLowerCase().includes(query) ||
            (emp.empId && emp.empId.toLowerCase().includes(query))
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Sidebar
                // ... (props)
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userStatus={userStatus}
                onToggleStatus={handleAttendanceToggle}
            />

            <AddEmployeeModal
                isOpen={isAddEmployeeModalOpen || !!selectedEmployee}
                onClose={() => {
                    setIsAddEmployeeModalOpen(false);
                    setSelectedEmployee(null);
                }}
                employeeId={selectedEmployee?.empId || selectedEmployee?.id}
                initialData={selectedEmployee ? {
                    firstName: selectedEmployee.name.split(' ')[0],
                    lastName: selectedEmployee.name.split(' ').slice(1).join(' '),
                    department: selectedEmployee.dept,
                    designation: selectedEmployee.role,
                    // We need to fetch full details really, but this is a start for visual
                    // To do this properly, AddEmployeeModal should probably fetch details by ID if provided
                } : undefined}
            />

            {/* Navbar */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-12">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
                        <span className="text-xl font-bold text-gray-900">SyncHR</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex space-x-6">
                        {['Employees', 'Attendance', 'Time Off'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-indigo-600 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Desktop Check In and Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={handleAttendanceToggle}
                            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${userStatus === 'CHECK_IN' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${userStatus === 'CHECK_IN' ? 'bg-red-600' : 'bg-green-600'}`}></span>
                            {userStatus === 'CHECK_IN' ? 'Check Out' : 'Check In'}
                        </button>

                        {/* Profile Dropdown Container */}
                        <div className="relative">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                                <div className="w-10 h-10 rounded-full bg-yellow-200 overflow-hidden border-2 border-white shadow-sm">
                                    <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
                                </div>
                                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 animate-in fade-in zoom-in duration-100 origin-top-right z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                                        <p className="text-xs text-gray-500 truncate">admin@synchr.com</p>
                                    </div>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        Profile Settings
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Hamburger + Status Dot */}
                    <div className="flex md:hidden items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="px-8 py-8">

                {activeTab === 'Employees' && (
                    <>
                        {/* Action Header */}
                        <div className="flex justify-between items-center mb-8">
                            <button
                                onClick={() => setIsAddEmployeeModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                            >
                                <span className="text-xl leading-none">+</span> New Employee
                            </button>

                            <div className="relative w-96">
                                <input
                                    type="text"
                                    placeholder="Search employees by name, role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 placeholder-gray-400"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>


                        {/* Employee Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredEmployees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((emp) => (
                                <EmployeeListCard
                                    key={emp.id}
                                    employee={emp}
                                    onClick={() => setSelectedEmployee(emp)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={employees.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}

                {activeTab === 'Attendance' && <AttendanceTab />}

            </main>

            {/* Footer Copyright */}
            <footer className="py-8 text-center text-gray-400 text-sm">
                &copy; 2024 Dayflow Inc. All rights reserved.
            </footer>
        </div>
    );
}
