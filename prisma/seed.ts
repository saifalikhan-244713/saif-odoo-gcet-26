
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with comprehensive data...');

    const password = await bcrypt.hash('password123', 10);

    const employeesData = [
        {
            firstName: 'Alex',
            lastName: 'Johnson',
            workEmail: 'alex.j@example.com',
            role: 'USER',
            systemRole: 'Employee',

            // Profile
            personalEmail: 'alex.johnson.personal@gmail.com',
            phoneNumber: '9876543210',
            gender: 'Male',
            dateOfBirth: '1990-05-15',
            address: '123 Tech Park Avenue',
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
            zipCode: '94105',
            emergencyContactName: 'Maria Johnson',
            emergencyContactNumber: '9988776655',
            department: 'Engineering',
            designation: 'Senior Developer',
            employmentStatus: 'Active',
            employmentType: 'Full-time',

            // Salary (CTC 12LPA -> 1L Monthly)
            monthlyWage: 100000,
            yearlyWage: 1200000,
            workingDaysPerWeek: 5,
            breakTimeHours: 1,

            // Components
            basicSalary: 40000, // 40%
            hra: 20000, // 20%
            standardAllowance: 10000, // 10%
            performanceBonus: 10000, // 10%
            lta: 5000, // 5%
            fixedAllowance: 15000, // Balance (15%)

            basicSalaryPercent: 40,
            hraPercent: 20,
            standardAllowancePercent: 10,
            performanceBonusPercent: 10,
            ltaPercent: 5,
            fixedAllowancePercent: 15,

            employeePfShareAmount: 4800, // 12% of Basic
            employeePfSharePercent: 12,
            employerPfShareAmount: 4800,
            employerPfSharePercent: 12,
            professionalTax: 200,
            estimatedNetPay: 95000, // Rough calc: 100k - 4.8k - 200

            // Attendance
            checkInTime: '09:00:00',
            checkOutTime: null,
            status: 'Present'
        },
        {
            firstName: 'Sarah',
            lastName: 'Jenkins',
            workEmail: 'sarah.j@example.com',
            role: 'USER',
            systemRole: 'Employee',

            // Profile
            personalEmail: 'sarah.j.creative@outlook.com',
            phoneNumber: '8765432109',
            gender: 'Female',
            dateOfBirth: '1992-08-22',
            address: '456 Design District',
            city: 'New York',
            state: 'New York',
            country: 'USA',
            zipCode: '10001',
            emergencyContactName: 'Robert Jenkins',
            emergencyContactNumber: '8877665544',
            department: 'Design',
            designation: 'UI/UX Designer',
            employmentStatus: 'Active',
            employmentType: 'Full-time',

            monthlyWage: 80000,
            yearlyWage: 960000,
            workingDaysPerWeek: 5,
            breakTimeHours: 1,

            basicSalary: 32000,
            hra: 16000,
            standardAllowance: 8000,
            performanceBonus: 8000,
            lta: 4000,
            fixedAllowance: 12000,

            basicSalaryPercent: 40,
            hraPercent: 20,
            standardAllowancePercent: 10,
            performanceBonusPercent: 10,
            ltaPercent: 5,
            fixedAllowancePercent: 15,

            employeePfShareAmount: 3840,
            employeePfSharePercent: 12,
            employerPfShareAmount: 3840,
            employerPfSharePercent: 12,
            professionalTax: 200,
            estimatedNetPay: 75960,

            // Attendance
            checkInTime: '09:15:00',
            checkOutTime: '18:20:00',
            status: 'Present'
        },
        {
            firstName: 'Marcus',
            lastName: 'Ray',
            workEmail: 'marcus.r@example.com',
            role: 'USER',
            systemRole: 'Employee',

            personalEmail: 'marcus.ray@gmail.com',
            phoneNumber: '7654321098',
            gender: 'Male',
            dateOfBirth: '1988-11-30',
            address: '789 Code Lane',
            city: 'Austin',
            state: 'Texas',
            country: 'USA',
            zipCode: '73301',
            emergencyContactName: 'Julia Ray',
            emergencyContactNumber: '7766554433',
            department: 'Engineering',
            designation: 'Backend Engineer',
            employmentStatus: 'Active',
            employmentType: 'Contract',

            monthlyWage: 120000,
            yearlyWage: 1440000,
            workingDaysPerWeek: 5,
            breakTimeHours: 1,

            basicSalary: 48000,
            hra: 24000,
            standardAllowance: 12000,
            performanceBonus: 12000,
            lta: 6000,
            fixedAllowance: 18000,

            basicSalaryPercent: 40,
            hraPercent: 20,
            standardAllowancePercent: 10,
            performanceBonusPercent: 10,
            ltaPercent: 5,
            fixedAllowancePercent: 15,

            employeePfShareAmount: 5760,
            employeePfSharePercent: 12,
            employerPfShareAmount: 5760,
            employerPfSharePercent: 12,
            professionalTax: 200,
            estimatedNetPay: 114040,

            // Attendance
            checkInTime: null,
            checkOutTime: null,
            status: 'Absent'
        },
        {
            firstName: 'Emma',
            lastName: 'Liu',
            workEmail: 'emma.l@example.com',
            role: 'USER',
            systemRole: 'Employee',

            personalEmail: 'emma.liu@hotmail.com',
            phoneNumber: '6543210987',
            gender: 'Female',
            dateOfBirth: '1995-03-10',
            address: '101 Market St',
            city: 'Seattle',
            state: 'Washington',
            country: 'USA',
            zipCode: '98101',
            emergencyContactName: 'Henry Liu',
            emergencyContactNumber: '6655443322',
            department: 'Marketing',
            designation: 'Marketing Specialist',
            employmentStatus: 'Active',
            employmentType: 'Full-time',

            monthlyWage: 70000,
            yearlyWage: 840000,
            workingDaysPerWeek: 5,
            breakTimeHours: 1,

            basicSalary: 28000,
            hra: 14000,
            standardAllowance: 7000,
            performanceBonus: 7000,
            lta: 3500,
            fixedAllowance: 10500,

            basicSalaryPercent: 40,
            hraPercent: 20,
            standardAllowancePercent: 10,
            performanceBonusPercent: 10,
            ltaPercent: 5,
            fixedAllowancePercent: 15,

            employeePfShareAmount: 3360,
            employeePfSharePercent: 12,
            employerPfShareAmount: 3360,
            employerPfSharePercent: 12,
            professionalTax: 200,
            estimatedNetPay: 66440,

            // Attendance
            checkInTime: null,
            checkOutTime: null,
            status: 'On Leave'
        },
        {
            firstName: 'David',
            lastName: 'Kim',
            workEmail: 'david.k@example.com',
            role: 'USER',
            systemRole: 'Employee',

            personalEmail: 'd.kim@yahoo.com',
            phoneNumber: '5432109876',
            gender: 'Male',
            dateOfBirth: '1993-07-25',
            address: '222 Product Rd',
            city: 'Boston',
            state: 'Massachusetts',
            country: 'USA',
            zipCode: '02108',
            emergencyContactName: 'Susan Kim',
            emergencyContactNumber: '5544332211',
            department: 'Product',
            designation: 'Product Manager',
            employmentStatus: 'Active',
            employmentType: 'Full-time',

            monthlyWage: 110000,
            yearlyWage: 1320000,
            workingDaysPerWeek: 5,
            breakTimeHours: 1,

            basicSalary: 44000,
            hra: 22000,
            standardAllowance: 11000,
            performanceBonus: 11000,
            lta: 5500,
            fixedAllowance: 16500,

            basicSalaryPercent: 40,
            hraPercent: 20,
            standardAllowancePercent: 10,
            performanceBonusPercent: 10,
            ltaPercent: 5,
            fixedAllowancePercent: 15,

            employeePfShareAmount: 5280,
            employeePfSharePercent: 12,
            employerPfShareAmount: 5280,
            employerPfSharePercent: 12,
            professionalTax: 200,
            estimatedNetPay: 104520,

            // Attendance
            checkInTime: '10:30:00',
            checkOutTime: null,
            status: 'Late In'
        },
        {
            firstName: 'Lisa',
            lastName: 'Chen',
            workEmail: 'lisa.c@example.com',
            role: 'HR',
            systemRole: 'HR',

            personalEmail: 'lisa.chen.hr@gmail.com',
            phoneNumber: '4321098765',
            gender: 'Female',
            dateOfBirth: '1989-12-12',
            address: '333 People Ops Plaza',
            city: 'Chicago',
            state: 'Illinois',
            country: 'USA',
            zipCode: '60601',
            emergencyContactName: 'Tom Chen',
            emergencyContactNumber: '4433221100',
            department: 'HR',
            designation: 'HR Manager',
            employmentStatus: 'Active',
            employmentType: 'Full-time',

            monthlyWage: 90000,
            yearlyWage: 1080000,
            workingDaysPerWeek: 5,
            breakTimeHours: 1,

            basicSalary: 36000,
            hra: 18000,
            standardAllowance: 9000,
            performanceBonus: 9000,
            lta: 4500,
            fixedAllowance: 13500,

            basicSalaryPercent: 40,
            hraPercent: 20,
            standardAllowancePercent: 10,
            performanceBonusPercent: 10,
            ltaPercent: 5,
            fixedAllowancePercent: 15,

            employeePfShareAmount: 4320,
            employeePfSharePercent: 12,
            employerPfShareAmount: 4320,
            employerPfSharePercent: 12,
            professionalTax: 200,
            estimatedNetPay: 85480,

            // Attendance
            checkInTime: '08:50:00',
            checkOutTime: '17:55:00',
            status: 'Present'
        }
    ];

    // Get initial count for serial generation
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
    let userCount = await prisma.user.count({
        where: { createdAt: { gte: startOfYear, lte: endOfYear } }
    });

    for (const emp of employeesData) {
        // Prepare IDs
        const prefix = 'OI';
        const firstPart = emp.firstName.substring(0, 2).toUpperCase();
        const lastPart = emp.lastName.substring(0, 2).toUpperCase().padEnd(2, 'X');
        const currentYear = new Date().getFullYear().toString();

        let userId: string;
        let customEmpId: string;

        const existingUser = await prisma.user.findUnique({ where: { email: emp.workEmail } });

        if (!existingUser) {
            // New User: Generate ID
            userCount++;
            const serial = userCount.toString().padStart(4, '0');
            customEmpId = `${prefix}${firstPart}${lastPart}${currentYear}${serial}`;
            const fullName = `${emp.firstName} ${emp.lastName}`;

            const user = await prisma.user.create({
                data: {
                    name: fullName,
                    firstName: emp.firstName,
                    lastName: emp.lastName,
                    email: emp.workEmail,
                    password: password,
                    role: emp.role as any,
                    empId: customEmpId,
                    status: emp.checkInTime && !emp.checkOutTime ? 'CHECK_IN' : 'CHECK_OUT',
                }
            });
            userId = user.id;
            console.log(`Created user: ${fullName} (${customEmpId})`);
        } else {
            // Existing User: Use existing ID
            userId = existingUser.id;
            customEmpId = existingUser.empId || 'UNKNOWN';
            console.log(`Updating existing user: ${emp.firstName} ${emp.lastName}`);
        }

        // 2. Upsert Profile
        const profile = await prisma.employeeProfile.upsert({
            where: { userId: userId },
            update: {
                personalEmail: emp.personalEmail,
                phoneNumber: emp.phoneNumber,
                address: emp.address,
                city: emp.city,
                state: emp.state,
                country: emp.country,
                zipCode: emp.zipCode,
                emergencyContactName: emp.emergencyContactName,
                emergencyContactNumber: emp.emergencyContactNumber,
                department: emp.department,
                designation: emp.designation,
                employmentStatus: emp.employmentStatus,
                employmentType: emp.employmentType,
                // Only update fields relevant to this seed data
            },
            create: {
                userId: userId,
                personalEmail: emp.personalEmail,
                phoneNumber: emp.phoneNumber,
                gender: emp.gender,
                dateOfBirth: emp.dateOfBirth,
                address: emp.address,
                city: emp.city,
                state: emp.state,
                country: emp.country,
                zipCode: emp.zipCode,
                emergencyContactName: emp.emergencyContactName,
                emergencyContactNumber: emp.emergencyContactNumber,
                department: emp.department,
                designation: emp.designation,
                employmentStatus: emp.employmentStatus,
                employmentType: emp.employmentType,
            }
        });

        // 3. Upsert Salary Structure
        await prisma.salaryStructure.upsert({
            where: { employeeProfileId: profile.id },
            update: {
                monthlyWage: emp.monthlyWage,
                yearlyWage: emp.yearlyWage,
                workingDaysPerWeek: emp.workingDaysPerWeek,
                breakTimeHours: emp.breakTimeHours,
                basicSalary: emp.basicSalary,
                hra: emp.hra,
                standardAllowance: emp.standardAllowance,
                performanceBonus: emp.performanceBonus,
                lta: emp.lta,
                fixedAllowance: emp.fixedAllowance,
                estimatedNetPay: emp.estimatedNetPay
            },
            create: {
                employeeProfileId: profile.id,
                monthlyWage: emp.monthlyWage,
                yearlyWage: emp.yearlyWage,
                workingDaysPerWeek: emp.workingDaysPerWeek,
                breakTimeHours: emp.breakTimeHours,

                basicSalary: emp.basicSalary,
                hra: emp.hra,
                standardAllowance: emp.standardAllowance,
                performanceBonus: emp.performanceBonus,
                lta: emp.lta,
                fixedAllowance: emp.fixedAllowance,

                basicSalaryPercent: emp.basicSalaryPercent,
                hraPercent: emp.hraPercent,
                standardAllowancePercent: emp.standardAllowancePercent,
                performanceBonusPercent: emp.performanceBonusPercent,
                ltaPercent: emp.ltaPercent,
                fixedAllowancePercent: emp.fixedAllowancePercent,

                employeePfShareAmount: emp.employeePfShareAmount,
                employeePfSharePercent: emp.employeePfSharePercent,
                employerPfShareAmount: emp.employerPfShareAmount,
                employerPfSharePercent: emp.employerPfSharePercent,
                professionalTax: emp.professionalTax,
                estimatedNetPay: emp.estimatedNetPay
            }
        });

        // 4. Create Attendance for Today (Only if not exists)
        if (emp.checkInTime) {
            const today = new Date();
            const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            const [inH, inM] = emp.checkInTime.split(':').map(Number);
            const checkInDate = new Date(today);
            checkInDate.setHours(inH, inM, 0, 0);

            let checkOutDate = null;
            let totalHours = null;

            if (emp.checkOutTime) {
                const [outH, outM] = emp.checkOutTime.split(':').map(Number);
                const d = new Date(today);
                d.setHours(outH, outM, 0, 0);
                checkOutDate = d;

                const durationMs = checkOutDate.getTime() - checkInDate.getTime();
                totalHours = durationMs / (1000 * 60 * 60);
            }

            const existingAtt = await prisma.attendance.findFirst({
                where: {
                    userId: userId,
                    date: dateOnly
                }
            });

            if (!existingAtt) {
                await prisma.attendance.create({
                    data: {
                        userId: userId,
                        date: dateOnly,
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        totalHours: totalHours ? Number(totalHours.toFixed(2)) : null,
                        status: emp.status
                    }
                });
                console.log(`Created attendance for: ${emp.firstName}`);
            }
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
