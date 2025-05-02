"use server";

import { getDbConnection } from "@/lib/db";
import generateSummaryFromGemini from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFilenameAsTitle } from "@/utils/format-uitls";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File Upload Failed - No uploadResponse",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File Upload Failed - No pdfURL",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log({ pdfText });

    let summary;
    try {
      // summary = await generateSummaryFromOpenAI(pdfText);    // Needs credits
      summary = await generateSummaryFromGemini(pdfText); // Free alternative
      console.log({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      // call gemini code here to try again

      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        return {
          success: false,
          message:
            "Rate limit exceeded. Please try again later or try a smaller document.",
          data: null,
        };

        // Use if mainis OpenAI and gemini is fallback.
        // try {
        //   summary = await generateSummaryFromGemini(pdfText);
        //   console.log("Gemini summary generated successfully:", { summary });
        // } catch (geminiError) {
        //   console.error("Gemini also failed to generate summary:", geminiError);
        //   return {
        //     success: false,
        //     message: "Failed to generate summary with both OpenAI and Gemini",
        //     data: null,
        //   };
        // }
      }
      if (!summary) {
        return {
          success: false,
          message: "Failed to generate summary",
          data: null,
        };
      }
    }

    const fname = formatFilenameAsTitle(fileName);
    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        userId,
        fname,
        summary,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `File Upload Failed - ${error}`,
      data: null,
    };
  }
}

async function savedPdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const sql = await getDbConnection();
    const result = await sql`
      INSERT INTO pdf_summaries (
        user_id, 
        original_file_url, 
        summary_text, 
        title, 
        file_name
      ) VALUES (
       ${userId}, 
       ${fileUrl},
       ${summary},
       ${title},
       ${fileName}
      ) RETURNING id`;
    console.log("SQL QUERY RESULT: \n", result);

    return {
      id: result[0].id,
    };
  } catch (error) {
    console.error("Error saving PDF summary:", error);
    return null;
  }
}

export async function storePdfSummaryAction({
  userId, // Optional, can be derived from auth context
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  let savedSummary = null;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    savedSummary = await savedPdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });
    // This should be the summary you want to save, e.g., from generatePdfSummary
    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, Please try again...",
      };
    }
  } catch (error) {
    console.error("Error storing PDF summary:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }

  // Revalidate for Cache
  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: "PDF summary stored successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
