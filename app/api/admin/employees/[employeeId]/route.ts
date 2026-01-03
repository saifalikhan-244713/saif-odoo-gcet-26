import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth'; // Ensure this exists or use bcrypt directly if not exported

const prisma = new PrismaClient();

// Helper to safely parse decimals
const toDec = (val: string | number | undefined | null) => {
    if (!val) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
};

// Helper to determine where clause
const getWhereClause = (id: string) => {
    // Basic check: if it looks like the custom ID format (starts with OI) use empId
    // Otherwise assume it's a UUID
    if (id.startsWith('OI')) {
        return { empId: id };
    }
    return { id };
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ employeeId: string }> }
) {
    try {
        const { employeeId } = await params;

        if (!employeeId) {
            return NextResponse.json({ success: false, message: "Missing Employee ID" }, { status: 400 });
        }

        const where = getWhereClause(employeeId);

        const user = await prisma.user.findUnique({
            where,
            include: {
                employeeProfile: {
                    include: {
                        salaryStructure: true,
                        documents: true
                    }
                },
                attendance: {
                    take: 1,
                    orderBy: { date: 'desc' }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Remove sensitive hash
        const { password, ...safeUser } = user;

        return NextResponse.json({ success: true, employee: safeUser }, { status: 200 });

    } catch (error: any) {
        console.error("GET_EMPLOYEE_ERROR", error);
        return NextResponse.json({ success: false, message: "Internal Error", error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ employeeId: string }> }
) {
    try {
        const { employeeId } = await params;
        const body = await request.json();

        if (!employeeId) {
            return NextResponse.json({ success: false, message: "Missing Employee ID" }, { status: 400 });
        }

        const where = getWhereClause(employeeId);

        // First find the user's UUID if we only have empId, because update transactions usually rely on UUID linking
        // Or we can simple key everything off the user found via 'where'
        const existingUser = await prisma.user.findUnique({ where });

        if (!existingUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const targetUserId = existingUser.id; // Correct UUID to use for relations

        // 1. Separate Data
        const {
            firstName, lastName, workEmail, role, systemRole,
            personalEmail, phoneNumber, gender, dateOfBirth,
            address, city, state, country, zipCode,
            emergencyContactName, emergencyContactNumber,
            department, designation, employmentStatus, employmentType,

            // Salary
            monthlyWage, yearlyWage, workingDaysPerWeek, breakTimeHours,
            basicSalary, hra, standardAllowance, performanceBonus, lta, fixedAllowance,
            basicSalaryPercent, hraPercent, standardAllowancePercent, performanceBonusPercent, ltaPercent, fixedAllowancePercent,
            employeePfShareAmount, employeePfSharePercent,
            employerPfShareAmount, employerPfSharePercent,
            professionalTax, estimatedNetPay
        } = body;


        // 2. Transaction Update
        const updatedUser = await prisma.$transaction(async (tx) => {

            // Update User Base
            const user = await tx.user.update({
                where: { id: targetUserId },
                data: {
                    name: `${firstName} ${lastName}`,
                    firstName,
                    lastName,
                    email: workEmail,
                    // role: role || systemRole, // Assuming role updates are allowed
                }
            });

            // Update Profile
            const profile = await tx.employeeProfile.upsert({
                where: { userId: targetUserId },
                create: {
                    userId: targetUserId,
                    personalEmail, phoneNumber, gender, dateOfBirth,
                    address, city, state, country, zipCode,
                    emergencyContactName, emergencyContactNumber,
                    department, designation, employmentStatus, employmentType
                },
                update: {
                    personalEmail, phoneNumber, gender, dateOfBirth,
                    address, city, state, country, zipCode,
                    emergencyContactName, emergencyContactNumber,
                    department, designation, employmentStatus, employmentType
                }
            });

            // Update Salary
            await tx.salaryStructure.upsert({
                where: { employeeProfileId: profile.id },
                create: {
                    employeeProfileId: profile.id,
                    monthlyWage: toDec(monthlyWage),
                    yearlyWage: toDec(yearlyWage),
                    workingDaysPerWeek: Number(workingDaysPerWeek) || 0,
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
                    estimatedNetPay: toDec(estimatedNetPay)
                },
                update: {
                    monthlyWage: toDec(monthlyWage),
                    yearlyWage: toDec(yearlyWage),
                    workingDaysPerWeek: Number(workingDaysPerWeek) || 0,
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
                    estimatedNetPay: toDec(estimatedNetPay)
                }
            });

            return user;
        });

        return NextResponse.json({ success: true, message: "Employee updated successfully", user: updatedUser });

    } catch (error: any) {
        console.error("UPDATE_EMPLOYEE_ERROR", error);
        return NextResponse.json({ success: false, message: "Failed to update employee", error: error.message }, { status: 500 });
    }
}
