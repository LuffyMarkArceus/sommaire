"use server";

import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction({
  summaryId,
}: {
  summaryId: string;
}) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }
    const sql = await getDbConnection();
    const result =
      await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId} AND user_id = ${userId} RETURNING id`;

    // TODO:
    // Need to delete the original file from uploadthing as well,
    // once data is deleted from table.

    if (result.length > 0) {
      revalidatePath("/dashboard");
      return { success: true, message: "Summary deleted successfully" };
    }
    return {
      success: false,
      message: "Summary not found or not owned by user",
    };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return { success: false, message: "Failed to delete summary" };
  }
}
