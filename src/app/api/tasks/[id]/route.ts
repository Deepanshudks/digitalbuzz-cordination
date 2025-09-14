import { authenticateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const { id } = await params;

    const task = await db.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 200 });
    }
    const TaskUpdates = await db.taskUpdate.findMany({
      where: {
        taskId: task.id,
      },
      orderBy: { newStatus: "desc" },
    });

    return NextResponse.json({
      tasks: TaskUpdates,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const { status, remarks } = await request.json();

    if (!status || !remarks) {
      return NextResponse.json({ error: "Remark is required" });
    }

    const task = await db.task.findFirst({
      where: {
        id,
      },
    });
    if (!task) {
      return NextResponse.json({
        error: "Invalid Task id",
      });
    }

    const updatedTask = await db.taskUpdate.create({
      data: {
        taskId: task.id,
        updatedById: user.userId,
        updatedByUser: user.username,
        oldStatus: task.status,
        newStatus: status,
        remarks,
      },
    });

    return NextResponse.json({
      updatedTask,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
