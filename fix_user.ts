import { prisma } from './lib/prisma';

async function main() {
    const empId = 'OISAKH20260010';
    console.log(`Fixing user ${empId}...`);

    const user = await prisma.user.findUnique({ where: { empId } });
    if (!user) {
        console.log("User not found!");
        return;
    }

    console.log("Found User ID:", user.id);

    // Check if profile exists purely by userId
    const existingProfile = await prisma.employeeProfile.findUnique({
        where: { userId: user.id }
    });

    if (existingProfile) {
        console.log("Profile ALREADY EXISTS:", existingProfile.id);
        // If it exists, why didn't check_db find it?
        // Maybe relation issue?
        return;
    }

    console.log("Creating missing profile...");

    // Create Default Profile
    const profile = await prisma.employeeProfile.create({
        data: {
            userId: user.id,
            personalEmail: 'fix@example.com', // Placeholder
            department: 'Pending',
            designation: 'Pending',
            employmentStatus: 'Active',
            employmentType: 'Full-time'
        }
    });
    console.log("Created Profile:", profile.id);

    // Create Default Salary
    await prisma.salaryStructure.create({
        data: {
            employeeProfileId: profile.id,
            monthlyWage: 0,
            workingDaysPerWeek: 5,
            basicSalaryPercent: 40,
            hraPercent: 20
        }
    });
    console.log("Created Salary Structure");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
