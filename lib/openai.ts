import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string) {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Are semicolons optional in JavaScript?",
        },
      ],
      temperature: 0.5,
      max_tokens: 4000,
    });
    return completion.choices[0].message.content;
  } catch (error: any) {
    if (error?.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
      console.error(error);
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    console.error("Error generating summary:", error);
    throw error;
  }
}
