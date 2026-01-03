import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { Role, UserStatus } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            firstName, lastName, workEmail, password, personalEmail,
            phoneNumber, gender, dateOfBirth, address, city, state, country, zipCode,
            emergencyContactName, emergencyContactNumber,
            designation, department, systemRole, employmentStatus, employmentType,
            // Salary
            monthlyWage, yearlyWage, workingDaysPerWeek, breakTimeHours,
            basicSalary, hra, standardAllowance, performanceBonus, lta, fixedAllowance,
            basicSalaryPercent, hraPercent, standardAllowancePercent, performanceBonusPercent, ltaPercent, fixedAllowancePercent,
            employeePfShareAmount, employeePfSharePercent, employerPfShareAmount, employerPfSharePercent,
            professionalTax, estimatedNetPay,
            documents
        } = body;

        // Basic Validation
        if (!workEmail || !password || !firstName || !lastName || !systemRole) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email: workEmail } });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Work email already exists' }, { status: 400 });
        }

        // Role Mapping
        let role: Role = Role.USER;
        if (systemRole === 'Admin') role = Role.ADMIN;
        if (systemRole === 'HR') role = Role.HR;
        // 'Employee' and 'Manager' default to USER

        // Generate Emp ID
        const prefix = 'OI';
        const firstPart = firstName.substring(0, 2).toUpperCase();
        const lastPart = lastName.substring(0, 2).toUpperCase();
        const currentYear = new Date().getFullYear().toString();
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

        const userCount = await prisma.user.count({
            where: { createdAt: { gte: startOfYear, lte: endOfYear } }
        });

        const serial = (userCount + 1).toString().padStart(4, '0');
        const empId = `${prefix}${firstPart}${lastPart}${currentYear}${serial}`;

        const hashedPassword = await hashPassword(password);

        // Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    firstName,
                    lastName,
                    email: workEmail,
                    password: hashedPassword,
                    role: role,
                    status: UserStatus.CHECK_OUT,
                    empId,
                }
            });

            // 2. Create Profile
            const profile = await tx.employeeProfile.create({
                data: {
                    userId: user.id,
                    personalEmail,
                    phoneNumber,
                    gender,
                    dateOfBirth,
                    address,
                    city,
                    state,
                    country,
                    zipCode,
                    emergencyContactName,
                    emergencyContactNumber,
                    department,
                    designation,
                    employmentStatus,
                    employmentType,
                }
            });

            // 3. Create Salary Structure
            const toDec = (val: string | number) => val ? val : 0;

            await tx.salaryStructure.create({
                data: {
                    employeeProfileId: profile.id,
                    monthlyWage: toDec(monthlyWage),
                    yearlyWage: toDec(yearlyWage),
                    workingDaysPerWeek: parseInt(String(workingDaysPerWeek || '0')),
                    breakTimeHours: toDec(breakTimeHours),
                    basicSalary: toDec(basicSalary),
                    hra: toDec(hra),
                    standardAllowance: toDec(standardAllowance),
                    performanceBonus: toDec(performanceBonus),
                    lta: toDec(lta),
                    fixedAllowance: toDec(fixedAllowance),
                    basicSalaryPercent: toDec(basicSalaryPercent),
                    hraPercent: toDec(hraPercent),
                    standardAllowancePercent: toDec(standardAllowancePercent),
                    performanceBonusPercent: toDec(performanceBonusPercent),
                    ltaPercent: toDec(ltaPercent),
                    fixedAllowancePercent: toDec(fixedAllowancePercent),
                    employeePfShareAmount: toDec(employeePfShareAmount),
                    employeePfSharePercent: toDec(employeePfSharePercent),
                    employerPfShareAmount: toDec(employerPfShareAmount),
                    employerPfSharePercent: toDec(employerPfSharePercent),
                    professionalTax: toDec(professionalTax),
                    estimatedNetPay: toDec(estimatedNetPay),
                }
            });

            // 4. Documents (Placeholder)
            if (documents && Array.isArray(documents)) {
                for (const doc of documents) {
                    if (doc.name) {
                        await tx.employeeDocument.create({
                            data: {
                                employeeProfileId: profile.id,
                                name: doc.name,
                                // fileUrl: ... handle upload ...
                            }
                        });
                    }
                }
            }

            return user;
        });

        return NextResponse.json({ success: true, user: result }, { status: 201 });

    } catch (error) {
        console.error("CREATE_EMPLOYEE_ERROR", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: [Role.USER, Role.HR, Role.ADMIN]
                }
            },
            include: {
                employeeProfile: true,
                attendance: {
                    where: {
                        date: {
                            gte: startOfDay,
                            lt: endOfDay
                        }
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const employees = users.map(user => {
            let status = 'remote'; // Default (Blue Arrow)

            // Check Attendance for today
            const todayAttendance = user.attendance[0];

            if (todayAttendance) {
                if (['Present', 'Late In', 'Half Day'].includes(todayAttendance.status)) {
                    status = 'active'; // Green Dot
                } else if (todayAttendance.status === 'On Leave') {
                    status = 'on-leave'; // Yellow Dot
                } else if (todayAttendance.status === 'Absent') {
                    status = 'absent'; // Red Dot (Will add support)
                }
            } else if (user.status === 'CHECK_IN') {
                // Fallback to User status if attendance record missing but user is checked in
                status = 'active';
            }

            return {
                id: user.id,
                empId: user.empId || 'N/A',
                name: user.name,
                role: user.employeeProfile?.designation || user.role,
                dept: user.employeeProfile?.department || 'N/A',
                status: status,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
            };
        });

        return NextResponse.json({ success: true, employees });
    } catch (error) {
        console.error("FETCH_EMPLOYEES_ERROR", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
