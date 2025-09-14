import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password, role, branch } = await request.json();

    if (!username || !password || !role || !branch) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const validRoles = ["RM", "OPS", "ADMIN"];
    const validBranches = ["MUMBAI", "NOIDA", "GURGAON", "PUNE", "BANGALORE"];

    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    if (!validBranches.includes(branch)) {
      return NextResponse.json({ message: "Invalid branch" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        branch,
      },
    });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
