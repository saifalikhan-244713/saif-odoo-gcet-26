import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { AUTH_ERRORS } from '@/constants/errors';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('ADMIN SIGNUP BODY:', body);
    const { firstName, lastName, companyName, email, password, role } = body;

    // Manual Validation
    if (!firstName || firstName.length < 2) {
      return NextResponse.json({ success: false, message: AUTH_ERRORS.FIRST_NAME_TOO_SHORT }, { status: 400 });
    }
    if (!lastName || lastName.length < 2) {
      return NextResponse.json({ success: false, message: AUTH_ERRORS.LAST_NAME_TOO_SHORT }, { status: 400 });
    }
    if (!companyName || companyName.length < 2) {
      return NextResponse.json({ success: false, message: AUTH_ERRORS.COMPANY_NAME_REQUIRED }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: AUTH_ERRORS.INVALID_EMAIL }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, message: AUTH_ERRORS.PASSWORD_TOO_SHORT }, { status: 400 });
    }
    if (role !== 'ADMIN' && role !== 'HR') {
      return NextResponse.json({ success: false, message: AUTH_ERRORS.INVALID_ROLE }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: AUTH_ERRORS.EMAIL_EXISTS },
        { status: 400 }
      );
    }

    // --- ID GENERATION LOGIC ---
    // Format: OI + First 2 letters of First Name + First 2 letters of Last Name + Year + Serial

    // 1. Prefix
    const prefix = 'OI';

    // 2. Name Partials (Uppercase)
    const firstPart = firstName.substring(0, 2).toUpperCase();
    const lastPart = lastName.substring(0, 2).toUpperCase();

    // 3. Year
    const currentYear = new Date().getFullYear().toString();

    // 4. Serial
    // Count users created in the current year to generate serial
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

    const userCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfYear,
          lte: endOfYear
        }
      }
    });

    // Pad with zeros to ensure 4 digits (e.g., 1 -> 0001)
    const serial = (userCount + 1).toString().padStart(4, '0');

    // Final ID
    const empId = `${prefix}${firstPart}${lastPart}${currentYear}${serial}`;

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        companyName,
        empId,
      },
    });

    console.log('CREATED USER:', user);

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        role: user.role,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          empId: user.empId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('ADMIN_SIGNUP_ERROR', error);
    return NextResponse.json(
      { success: false, message: AUTH_ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
