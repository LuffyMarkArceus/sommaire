"use server";

import generateSummaryFromGemini from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";

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
    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        userId,
        fileName,
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
