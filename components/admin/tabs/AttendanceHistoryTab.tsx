import React from 'react';
import Pagination from '@/components/shared/Pagination';

interface AttendanceHistoryTabProps {
    employeeId: string; // To fetch data in future
}

const AttendanceHistoryTab: React.FC<AttendanceHistoryTabProps> = ({ employeeId }) => {
    // Mock Data for UI Dev
    const stats = {
        totalWorkingDays: 22,
        presentDays: 18,
        halfDays: 1,
        leaveTaken: 1,
        totalHours: '145h'
    };

    const historyData = [
        { date: 'Oct 24, 2023', checkIn: '09:00 AM', checkOut: '--:--', workingHours: '--', status: 'Active', color: 'bg-blue-100 text-blue-700' },
        { date: 'Oct 23, 2023', checkIn: '09:05 AM', checkOut: '06:10 PM', workingHours: '09h 05m', status: 'Present', color: 'bg-green-100 text-green-700' },
        { date: 'Oct 22, 2023', checkIn: '--:--', checkOut: '--:--', workingHours: '00h 00m', status: 'Weekend', color: 'bg-gray-100 text-gray-600' },
        { date: 'Oct 21, 2023', checkIn: '--:--', checkOut: '--:--', workingHours: '00h 00m', status: 'Weekend', color: 'bg-gray-100 text-gray-600' },
        { date: 'Oct 20, 2023', checkIn: '09:00 AM', checkOut: '01:00 PM', workingHours: '04h 00m', status: 'Half Day', color: 'bg-yellow-100 text-yellow-700' },
        { date: 'Oct 19, 2023', checkIn: '08:55 AM', checkOut: '06:05 PM', workingHours: '09h 10m', status: 'Present', color: 'bg-green-100 text-green-700' },
        { date: 'Oct 18, 2023', checkIn: '--:--', checkOut: '--:--', workingHours: '00h 00m', status: 'Leave (SL)', color: 'bg-red-100 text-red-700' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Total Working Days</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalWorkingDays}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Present Days</p>
                    <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Half Days</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.halfDays}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Leave Taken</p>
                    <p className="text-2xl font-bold text-red-600">0{stats.leaveTaken}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.totalHours}</p>
                </div>
            </div>

            {/* History Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Attendance History (Oct 2023)</h3>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                        Download Report
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Check In</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Working Hours</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {historyData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{row.checkIn}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{row.checkOut}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{row.workingHours}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${row.color}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mocked for now) */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <Pagination
                        currentPage={1}
                        totalItems={22}
                        itemsPerPage={7}
                        onPageChange={() => { }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistoryTab;
