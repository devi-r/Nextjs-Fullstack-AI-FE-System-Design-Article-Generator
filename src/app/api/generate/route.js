// app/api/generate/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Set the runtime to 'edge' for best streaming performance on Vercel
export const runtime = "edge";

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

  // 1. We create a new ReadableStream. The browser will begin to read from it immediately.
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const finalPrompt = masterPrompt.replace("{{SYSTEM_NAME}}", systemName);

        // 2. We call the AI's streaming method
        const streamingResult = await model.generateContentStream(finalPrompt);

        // 3. We use a TextEncoder to convert strings to bytes (Uint8Array) for the stream
        const encoder = new TextEncoder();

        // 4. We loop through the AI's stream and pipe it to our own stream controller
        for await (const chunk of streamingResult.stream) {
          const text = chunk.text();
          if (text) {
            // Enqueue the encoded text chunk
            controller.enqueue(encoder.encode(text));
          }
        }

        // 5. Once the AI stream is done, we close our own stream
        controller.close();
      } catch (error) {
        console.error("Error during AI stream generation:", error);
        // In case of an error, we communicate it to the client
        const errorMsg = encoder.encode(
          `\n\n[ERROR]: Failed to generate stream. Please try again.`
        );
        controller.enqueue(errorMsg);
        controller.close();
      }
    },
  });

  // 6. We return our stream as the response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
