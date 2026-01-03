import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userStatus?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab, userStatus = 'CHECK_OUT' }) => {
    // Prevent scrolling when sidebar is open is usually handled by a useEffect in the parent or here, 
    // but for simplicity we'll focus on layout.

    if (!isOpen) return null;

    const isCheckedIn = userStatus === 'CHECK_IN';

    return (

        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Sidebar Content */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out min-h-screen">

                {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Header: Status + Profile Pic */}
                <div className="px-6 py-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-yellow-200 overflow-hidden border-2 border-white shadow-sm">
                                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                    </div>
                </div>

                {/* Tab Buttons */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {['Employees', 'Attendance', 'Time Off'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                onClose();
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Footer Check In */}
                <div className="p-4 border-t border-gray-200">
                    <button className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isCheckedIn ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                        <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {isCheckedIn ? 'Check Out' : 'Check In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
