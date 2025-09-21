import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { Branch, Priority, Status } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const priorityParam = url.searchParams.get("priority");
    const branchParam = url.searchParams.get("branch");
    const teamParam = url.searchParams.get("team");
    const dateParam = url.searchParams.get("date");
    const pageParam = url.searchParams.get("page");

    const status =
      statusParam && Object.values(Status).includes(statusParam as Status)
        ? (statusParam as Status)
        : undefined;

    const branch =
      branchParam && Object.values(Branch).includes(branchParam as Branch)
        ? (branchParam as Branch)
        : undefined;

    const team = teamParam ? (teamParam as string) : undefined;

    const page = pageParam ? parseInt(pageParam) : 1;

    const perPage = 10;
    const priority =
      priorityParam &&
      Object.values(Priority).includes(priorityParam as Priority)
        ? (priorityParam as Priority)
        : undefined;

    const where: any = {
      status,
      priority,
      branch,
      assignedTo: team,
    };

    if (dateParam) {
      const start = new Date(dateParam);
      start.setHours(0, 0, 0, 0);

      const end = new Date(dateParam);
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        gte: start,
        lte: end,
      };
    }

    const counts: Record<Status | "total", number> = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      ON_HOLD: 0,
      total: 0,
    };

    const grouped = await db.task.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    grouped.forEach((item) => {
      counts[item.status] = item._count.status;
    });

    const total = await db.task.count({
      where,
    });
    counts.total = total;

    const tasks = await db.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return NextResponse.json({
      tasks: tasks,
      total,
      perPage,
      currentPage: page,
      totalPages: Math.ceil(total / perPage),
      meta: counts,
    });
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
      branch,
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
      !branch ||
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
        branch: branch as Branch,
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
