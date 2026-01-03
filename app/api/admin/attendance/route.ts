import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // Default to today
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // 1. Fetch All Users to determine who is absent
        const allUsers = await prisma.user.findMany({
            where: { role: { not: 'ADMIN' } }, // Exclude admin from attendance? Or include. Usually admins don't mark attendance.
            include: { employeeProfile: true },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Fetch Attendance for Today
        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                date: startOfDay
            },
            include: { user: { include: { employeeProfile: true } } }
        });

        // 3. Merge Data
        // Map of userId -> Attendance Record
        const attendanceMap = new Map();
        attendanceRecords.forEach(record => {
            attendanceMap.set(record.userId, record);
        });

        const attendanceList = allUsers.map(user => {
            const record = attendanceMap.get(user.id);
            const employeeProfile = user.employeeProfile;

            // Format checkIn/Out time
            const formatTime = (date: Date | null) => {
                if (!date) return '--:--';
                return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            };

            // Format Total Hours
            const formatHours = (decimalHours: number | null) => {
                if (!decimalHours) return '--:--';
                const hours = Math.floor(decimalHours);
                const minutes = Math.round((decimalHours - hours) * 60);
                return `${hours}h ${minutes}m`;
            };

            return {
                id: user.empId || user.id.slice(0, 6).toUpperCase(), // Use empId or fallback
                name: user.name,
                department: employeeProfile?.department || 'N/A',
                checkIn: record ? formatTime(record.checkIn) : '--:--',
                checkOut: record ? formatTime(record.checkOut) : '--:--',
                totalHours: record ? formatHours(Number(record.totalHours)) : '--:--',
                status: record ? record.status : 'Absent', // If no record, they are Absent
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`
            };
        });

        // 4. Calculate Stats
        const total = allUsers.length;
        const present = attendanceRecords.length; // Approximate, simplistic
        const absent = total - present;
        // On Leave would require a Leave table. For now we just say Total - Present = Absent.

        const stats = {
            total,
            present,
            onLeave: 0, // Mocked for now
            absent
        };

        return NextResponse.json({ success: true, attendance: attendanceList, stats });

    } catch (error) {
        console.error('Fetch attendance error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
