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

        // 2. Check if already checked in today (basic check)
        // We could also check if user.status is 'CHECK_IN'
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (user.status === 'CHECK_IN') {
            return NextResponse.json({ success: false, message: 'Already checked in' }, { status: 400 });
        }

        // 3. Create Attendance Record
        const today = new Date();
        // Reset time to 00:00:00 for the date field
        const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Determine status (e.g. Late In if after 9:30 AM)
        let status = 'Present';
        const startOfWork = new Date(Date.now());
        startOfWork.setHours(9, 30, 0, 0); // 9:30 AM

        if (today > startOfWork) {
            status = 'Late In';
        }

        const attendance = await prisma.attendance.create({
            data: {
                userId: userId,
                date: dateOnly,
                checkIn: today,
                status: status
            }
        });

        // 4. Update User Status
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'CHECK_IN' }
        });

        return NextResponse.json({ success: true, message: 'Checked in successfully', attendance });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
