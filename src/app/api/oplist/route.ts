import { db } from "@/lib/db";

export async function GET(equest: Request) {
  try {
    const response = await db.user.findMany({
      where: {
        role: "OPS",
      },
    });
    if (response) {
      return Response.json({
        list: response,
      });
    }
  } catch (e) {
    return Response.json({
      error: "Some error occured",
    });
  }
}
