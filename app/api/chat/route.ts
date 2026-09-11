import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `You are digiGUIDE, a patient and rigorous computer science tutor. Explain concepts clearly with small examples, ask one useful follow-up question when appropriate, and adapt to the learner's level. Prefer practical reasoning and readable code. Do not pretend to know the learner's private data.`;

type ChatMessage = { role: "user" | "model"; content: string };

function demoTutorResponse(message: string) {
  const prompt = message.toLowerCase();
  if (prompt.includes("quiz")) return "Here is a quick practice set:\n\n1. What is the base case in a recursive function?\n2. Why does memoization improve dynamic programming?\n3. What is the time complexity of binary search?\n\nReply with your answers and I will review them.";
  if (prompt.includes("recursion")) return "Recursion is when a function solves a problem by calling itself on a smaller version of that problem. Every recursive solution needs a base case to stop and a recursive step to make progress. For example, factorial(n) returns 1 when n is 0, otherwise n * factorial(n - 1).";
  if (prompt.includes("dynamic") || prompt.includes("programming")) return "Dynamic programming solves problems with overlapping subproblems by storing results and reusing them. A good way to start is: define the state, write the transition, choose a base case, then decide whether memoization or a bottom-up table is clearer.";
  return `Let us work through this as a computer science problem: "${message}". Start by defining the inputs and expected output, then identify a small example and the invariant that should remain true. I can help you go deeper step by step. Add GEMINI_API_KEY to .env.local for full Gemini-powered answers.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { messages?: ChatMessage[] };
    const messages = (body.messages || []).filter(message => message.content?.trim()).slice(-20);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return Response.json({ error: "Send at least one user message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return new Response(demoTutorResponse(messages[messages.length - 1].content), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache", "X-Tutor-Provider": "demo" } });

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: { systemInstruction: systemPrompt, temperature: 0.4 },
      history: messages.slice(0, -1).map(message => ({ role: message.role, parts: [{ text: message.content }] })),
    });
    const stream = await chat.sendMessageStream({ message: messages[messages.length - 1].content });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
  } catch (error) {
    console.error("Chat route failed", error);
    return Response.json({ error: "The tutor could not respond right now." }, { status: 500 });
  }
}
