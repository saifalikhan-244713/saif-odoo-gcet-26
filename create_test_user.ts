
// import fetch from 'node-fetch';

async function main() {
    const payload = {
        firstName: "Auto",
        lastName: "Test",
        workEmail: `auto.test.${Date.now()}@example.com`,
        password: "password123",
        systemRole: "Employee",
        personalEmail: "auto.test@personal.com",
        monthlyWage: "60000",
        department: "Testing",
        designation: "Bot"
    };

    console.log("Creating user...", payload.workEmail);
    const res = await fetch('http://localhost:3000/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success && data.user) {
        // Check if profile exists in the response or need to verify DB
        // The POST returns 'user' which is the transaction result.
        // In route.ts, it returns 'user' object from prisma.create, which MIGHT NOT include relations unless include is used.
        // Let's check DB immediately after.
    }
}

main().catch(console.error);
