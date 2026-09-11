import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `You are NOVA, a patient and rigorous computer science tutor. Explain concepts clearly with small examples, ask one useful follow-up question when appropriate, and adapt to the learner's level. Prefer practical reasoning and readable code. Do not pretend to know the learner's private data.`;

type ChatMessage = { role: "user" | "model"; content: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { messages?: ChatMessage[] };
    const messages = (body.messages || []).filter(message => message.content?.trim()).slice(-20);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return Response.json({ error: "Send at least one user message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return Response.json({ error: "Gemini is not configured. Add GEMINI_API_KEY to .env.local." }, { status: 503 });

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
