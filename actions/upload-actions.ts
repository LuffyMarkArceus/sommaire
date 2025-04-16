"use server";

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
      summary = await generateSummaryFromOpenAI(pdfText);
      console.log({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      // call gemini code here to try again
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `File Upload Failed - ${error}`,
      data: null,
    };
  }
}
