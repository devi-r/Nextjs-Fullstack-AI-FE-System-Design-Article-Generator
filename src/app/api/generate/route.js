import { GoogleGenerativeAI } from "@google/generative-ai";

// By defaulting to Vercel's Node.js serverless runtime, we get true streaming.
// The "typing" animation will be handled on the client for a better UX.

export async function POST(request) {
  const { systemName } = await request.json();

  const apiKey = process.env.GEMINI_API_KEY;
  const masterPrompt = process.env.MASTER_PROMPT;

  if (!apiKey || !masterPrompt) {
    return new Response(
      JSON.stringify({ error: "Server configuration error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const finalPrompt = masterPrompt.replace("{{SYSTEM_NAME}}", systemName);

        const streamingResult = await model.generateContentStream(finalPrompt);

        // a simple, efficient pipe.
        // It forwards chunks from the AI to the client as fast as they arrive.
        for await (const chunk of streamingResult.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (error) {
        console.error("Error during AI stream generation:", error);
        const errorMsg = encoder.encode(
          `\n\n[ERROR]: An error occurred while generating the article. The model may be unavailable or the API key may be invalid.`
        );
        controller.enqueue(errorMsg);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
