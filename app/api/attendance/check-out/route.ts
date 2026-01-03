import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
        // 1. Verify Authentication
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 });
        }

        const userId = decoded.userId;

        // 2. Find Active Attendance (where status is CHECK_IN or checkOut is null)
        // We find the latest attendance record for today that hasn't been closed
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const attendance = await prisma.attendance.findFirst({
            where: {
                userId: userId,
                date: startOfDay,
                checkOut: null
            }
        });

        if (!attendance) {
            // Fallback: If no today's record, user might have forgotten to check out yesterday?
            // For simplicity, we error out or check user status.
            return NextResponse.json({ success: false, message: 'No active check-in found for today' }, { status: 400 });
        }

        // 3. Calculate Hours
        const checkOutTime = new Date();
        const durationMs = checkOutTime.getTime() - new Date(attendance.checkIn).getTime();
        const durationHours = durationMs / (1000 * 60 * 60); // Hours in decimal

        // 4. Update Attendance
        await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: checkOutTime,
                totalHours: durationHours
            }
        });

        // 5. Update User Status
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'CHECK_OUT' }
        });

        return NextResponse.json({ success: true, message: 'Checked out successfully' });

    } catch (error) {
        console.error('Check-out error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
