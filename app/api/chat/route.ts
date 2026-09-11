import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `You are digiGUIDE, a patient, encouraging, and rigorous computer science tutor. Teach so a student can understand and connect the idea, not just memorize a definition. For every concept question, use this structure when it fits: 1) Plain-English idea, 2) a relatable real-life analogy, 3) a simple ASCII diagram or visual trace, 4) a small step-by-step example, 5) code or pseudocode when useful, 6) time and space complexity, 7) one common mistake, and 8) one short check-for-understanding question. Define unfamiliar terms, keep paragraphs short, and explain why each step works. Adapt to the learner's level and never pretend to know private data. Use Markdown and code fences, but keep diagrams readable in plain text.`;

type ChatMessage = { role: "user" | "model"; content: string };

function demoTutorResponse(message: string) {
  const prompt = message.toLowerCase();
  if (prompt.includes("quiz")) return "Here is a quick practice set:\n\n1. What is the base case in a recursive function?\n2. Why does memoization improve dynamic programming?\n3. What is the time complexity of binary search?\n\nReply with your answers and I will review them.";
  if (prompt.includes("recursion")) return `## Recursion, in plain English
Recursion is a function solving a problem by calling itself on a smaller version of the same problem.

### Real-life analogy
Imagine opening nested boxes. You open one box, find a smaller box inside, and repeat until you reach the smallest empty box. That smallest box is the **base case**.

### Visual trace
\`\`\`
factorial(3)
  -> 3 * factorial(2)
       -> 2 * factorial(1)
            -> 1  (base case)
\`\`\`

### Example
\`\`\`js
function factorial(n) {
  if (n === 0) return 1;       // base case
  return n * factorial(n - 1);  // smaller problem
}
\`\`\`
The calls go down until the base case, then return upward: $1$, $2$, $6$.

**Complexity:** $O(n)$ time and $O(n)$ call-stack space.

**Common mistake:** forgetting a base case or failing to move toward it.

Check: what would happen if the function called \`factorial(n)\` instead of \`factorial(n - 1)\`?`;
  if (prompt.includes("linked list") || prompt.includes("linked-list")) return `## Linked list, in plain English
A linked list is a chain of nodes. Each node stores a value and a link to the next node.

### Real-life analogy
Think of a treasure hunt. Each clue contains two things: the current information and the location of the next clue. You cannot jump directly to clue 4; you follow the links from the first clue.

### Visual diagram
\`\`\`
head
  |
  v
[10 | next] -> [20 | next] -> [30 | null]
\`\`\`

### Step by step: insert 15 after 10
1. Create a new node containing 15.
2. Point 15 to the node that 10 currently points to, which is 20.
3. Point 10 to 15.

\`\`\`
Before: 10 -> 20 -> 30 -> null
After:  10 -> 15 -> 20 -> 30 -> null
\`\`\`

\`\`\`js
const newNode = { value: 15, next: head.next };
head.next = newNode;
\`\`\`

**Complexity:** walking to a position is $O(n)$. Inserting or removing is $O(1)$ when you already have the correct node reference. Unlike an array, a linked list does not offer fast random access by index.

**Common mistake:** changing the current link before saving the next link, which can lose the rest of the chain.

Check: if you only have the head, how many nodes might you inspect to find the last node?`;
  if (prompt.includes("array")) return `## Arrays, in plain English
An array stores values next to one another in indexed positions, like numbered lockers.

\`\`\`
index:  0    1    2
value: [12] [25] [40]
\`\`\`

Reading \`array[2]\` is fast because the index tells us exactly where to look: $O(1)$. Inserting near the front may require shifting many values, so it is usually $O(n)$.

**Use an array** when indexed access matters. **Use a linked list** when frequent insertions are more important than direct access.

Check: why might inserting at the beginning of an array require moving other values?`;
  if (prompt.includes("binary search")) return `## Binary search, in plain English
Binary search finds a value in sorted data by repeatedly cutting the search range in half.

### Real-life analogy
Looking for a word in a dictionary, you open near the middle instead of checking every page from the beginning.

\`\`\`
[2, 5, 8, 12, 17, 21, 30]
             ^ check middle
\`\`\`

If the target is larger, discard the left half. If smaller, discard the right half. This requires sorted data and takes $O(\\log n)$ time.

Check: what must be true about the input before binary search can be used?`;
  if (prompt.includes("tree")) return `## Trees, in plain English
A tree represents hierarchy: one node can lead to child nodes.

### Real-life analogy
A family tree or a folder system: a folder contains subfolders, which contain more folders.

\`\`\`
        8
      /   \\
     3     10
    / \\
   1   6
\`\`\`

In a binary search tree, smaller values go left and larger values go right. An in-order traversal visits values in sorted order: 1, 3, 6, 8, 10.

Check: where would the value 5 go in this tree?`;
  if (prompt.includes("dynamic") || prompt.includes("programming")) return `## Dynamic programming, in plain English
Dynamic programming solves a large problem by solving smaller repeated problems once and reusing their answers.

### Real-life analogy
If you repeatedly travel between the same stations, you write down the best route once instead of recalculating it every time.

### Two questions to ask
1. Do subproblems overlap?
2. Can the best answer be built from smaller answers?

Memoization stores answers while using recursion. Tabulation fills a table from the smallest case upward. The goal is less repeated work.

Check: what repeated subproblem could be cached in a Fibonacci calculation?`;
  return `## Let's break it down
You asked about **${message}**. We can understand it by connecting four pieces:

1. **Idea:** what problem does it solve?
2. **Analogy:** what familiar real-world process behaves similarly?
3. **Example:** what happens with a small input?
4. **Trade-off:** when is it useful, and what does it cost?

Start with a small example and trace each step. Tell me your current level or share a specific example, and I will explain it with a diagram and code walkthrough.`;
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
