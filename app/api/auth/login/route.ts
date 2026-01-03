import { NextResponse } from 'next/server';
import { UserStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';
import { AUTH_ERRORS } from '@/constants/errors';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: AUTH_ERRORS.MISSING_CREDENTIALS },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: AUTH_ERRORS.INVALID_CREDENTIALS },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: AUTH_ERRORS.INVALID_CREDENTIALS },
                { status: 401 }
            );
        }

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Update User Status to CHECK_IN
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { status: UserStatus.CHECK_IN },
        });

        return NextResponse.json(
            {
                success: true,
                token,
                role: user.role,
                status: updatedUser.status,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('LOGIN_ERROR', error);
        return NextResponse.json(
            { success: false, message: AUTH_ERRORS.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
