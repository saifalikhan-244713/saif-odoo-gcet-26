import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        // 1. Auth Check
        const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const body = await req.json();
        const { personalEmail, phoneNumber, address, city, state, country, zipCode, password } = body;

        // 2. Update User (Password)
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });
        }

        // 3. Update Profile (Contact Details)
        // We strictly filter what they can update here
        const updatedProfile = await prisma.employeeProfile.update({
            where: { userId: userId },
            data: {
                personalEmail,
                phoneNumber,
                address,
                city,
                state,
                country,
                zipCode
            }
        });

        return NextResponse.json({ message: "Profile updated successfully", profile: updatedProfile }, { status: 200 });

    } catch (error: any) {
        console.error("Update Profile Error:", error);
        return NextResponse.json({ message: "Failed to update profile", error: error.message }, { status: 500 });
    }
}
