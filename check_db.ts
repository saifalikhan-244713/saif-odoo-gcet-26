
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking user data...");
    const user = await prisma.user.findUnique({
        where: { empId: 'OISAKH20260010' },
        include: {
            employeeProfile: {
                include: {
                    salaryStructure: true
                }
            }
        }
    });
    console.log("PROFILE:", user?.employeeProfile);
    console.log("SALARY:", user?.employeeProfile?.salaryStructure);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
