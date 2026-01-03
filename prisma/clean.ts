import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up seed data...');

    const emailsToDelete = [
        'alex.j@example.com',
        'sarah.j@example.com',
        'marcus.r@example.com',
        'emma.l@example.com',
        'david.k@example.com',
        'lisa.c@example.com'
    ];

    try {
        // 1. Find users to delete
        const users = await prisma.user.findMany({
            where: { email: { in: emailsToDelete } }
        });
        const userIds = users.map(u => u.id);

        if (userIds.length === 0) {
            console.log('No users found to cleanup.');
            return;
        }

        console.log(`Found ${userIds.length} users to delete. Cleaning up related data...`);

        // 2. Delete Attendance (Depends on User)
        await prisma.attendance.deleteMany({
            where: { userId: { in: userIds } }
        });
        console.log('Deleted Attendance records.');

        // 3. Find Profiles to delete related Salary/Documents
        const profiles = await prisma.employeeProfile.findMany({
            where: { userId: { in: userIds } }
        });
        const profileIds = profiles.map(p => p.id);

        if (profileIds.length > 0) {
            // 4. Delete SalaryStructure (Depends on Profile)
            await prisma.salaryStructure.deleteMany({
                where: { employeeProfileId: { in: profileIds } }
            });
            console.log('Deleted SalaryStructure records.');

            // 5. Delete EmployeeDocuments (Depends on Profile)
            await prisma.employeeDocument.deleteMany({
                where: { employeeProfileId: { in: profileIds } }
            });
            console.log('Deleted EmployeeDocument records.');

            // 6. Delete EmployeeProfile (Depends on User)
            await prisma.employeeProfile.deleteMany({
                where: { id: { in: profileIds } }
            });
            console.log('Deleted EmployeeProfile records.');
        }

        // 7. Delete User
        const deletedUsers = await prisma.user.deleteMany({
            where: { id: { in: userIds } }
        });

        console.log(`Successfully deleted ${deletedUsers.count} users.`);
    } catch (error) {
        console.error('Error cleaning up:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
