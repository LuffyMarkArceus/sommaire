"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";

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
    console.log(pdfText);
  } catch (error) {
    return {
      success: false,
      message: `File Upload Failed - ${error}`,
      data: null,
    };
  }
}
