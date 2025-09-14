import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { Priority, Status } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const priorityParam = url.searchParams.get("priority");

    const status =
      statusParam && Object.values(Status).includes(statusParam as Status)
        ? (statusParam as Status)
        : undefined;

    const priority =
      priorityParam &&
      Object.values(Priority).includes(priorityParam as Priority)
        ? (priorityParam as Priority)
        : undefined;

    const tasks = await db.task.findMany({
      where: {
        status,
        priority,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      clientName,
      assignedBy,
      priority,
      assignedTo,
      deadline,
      status,
    } = await request.json();

    if (
      !title ||
      !description ||
      !clientName ||
      !assignedBy ||
      !assignedTo ||
      !deadline
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const validUser = await db.user.findUnique({
      where: { id: user.userId },
    });

    if (!validUser) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    const task = await db.task.create({
      data: {
        title,
        description,
        clientName,
        assignedBy,
        priority: (priority as Priority) || Priority.MEDIUM,
        status: (status as Status) || Status.PENDING,
        deadline: new Date(deadline),
        branch: user.branch,
        createdById: user.userId,
        createdByUser: user.username,
        assignedTo,
      },
    });

    await db.taskUpdate.create({
      data: {
        taskId: task.id,
        updatedById: user.userId,
        oldStatus: Status.PENDING,
        newStatus: task.status,
        updatedByUser: user.username,
        remarks: "Task created",
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
