import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // 1. Get Token
        const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Verify Token
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        // 3. Fetch User with Profile, Salary, and Attendance
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                employeeProfile: {
                    include: {
                        salaryStructure: true,
                        documents: true
                    }
                },
                attendance: {
                    orderBy: { date: 'desc' },
                    take: 30 // Last 30 days history
                }
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 4. Return Data
        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
