"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, BrainCircuit, Check, Copy, LoaderCircle, RotateCcw, Sparkles, User } from "lucide-react";

type Message = { id: number; role: "user" | "model"; content: string; streaming?: boolean };

const CHAT_STORAGE_KEY = "digiguide_tutor_messages_v2";

const defaultPrompts = [
  "Explain Dynamic Programming with a real-life analogy",
  "How does memoization differ from recursion?",
  "Generate a 3-question practice quiz on Trees",
  "Walk through Binary Search step-by-step",
];

const topicFollowUps: Record<string, string[]> = {
  "Recursion": [
    "Can you give another example of it in Python?",
    "What is the space complexity of the call stack?",
    "What happens if the base case is missing?",
    "Give me a 3-question practice quiz on Recursion",
  ],
  "Dynamic Programming": [
    "Can you give another example of it in Python?",
    "How does tabulation differ from memoization?",
    "What is the space complexity optimization here?",
    "Quiz me on Dynamic Programming",
  ],
  "Trees & BST": [
    "Can you give another example of it in Python?",
    "Show in-order vs pre-order traversal code",
    "What is the time complexity in balanced vs skewed BST?",
    "Quiz me on Trees and Binary Search Trees",
  ],
  "Linked Lists": [
    "Can you give another example of it in Python?",
    "Show Floyd's cycle detection algorithm",
    "Compare Linked List vs Array time complexity",
    "Quiz me on Linked Lists",
  ],
  "Binary Search": [
    "Can you give another example of it in Python?",
    "Why must the array be sorted first?",
    "How does O(log n) scale with 1 million elements?",
    "Quiz me on Binary Search",
  ],
  "Arrays": [
    "Can you give another example of it in Python?",
    "Show the Sliding Window pattern code",
    "Why is inserting at index 0 an O(n) operation?",
    "Quiz me on Arrays and Two Pointers",
  ],
  "Memoization": [
    "Can you give another example of it in Python?",
    "Show an LRU Cache implementation with @lru_cache",
    "What are the memory trade-offs of caching?",
    "Quiz me on Memoization",
  ],
  "Graphs": [
    "Can you give another example of it in Python?",
    "Why does BFS find the shortest path but DFS doesn't?",
    "Show Dijkstra's algorithm in Python",
    "Quiz me on Graphs and BFS/DFS",
  ],
  "Python DSA": [
    "Can you give another example of it in Python?",
    "Compare time complexity of list vs set vs dict",
    "Show generator expressions for memory efficiency",
    "Quiz me on Python Data Structures",
  ],
};

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language || "code"}</span>
        <button type="button" className="code-copy-btn" onClick={copy} aria-label="Copy code">
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="code-snippet">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  if (!content) return null;
  // Separate out code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="formatted-tutor-message">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const raw = part.slice(3, -3);
          const newlineIdx = raw.indexOf("\n");
          let lang = "code";
          let codeText = raw;
          if (newlineIdx !== -1) {
            const firstWord = raw.slice(0, newlineIdx).trim();
            if (/^[a-zA-Z0-9#+_-]+$/.test(firstWord)) {
              lang = firstWord;
              codeText = raw.slice(newlineIdx + 1);
            }
          }
          return <CodeBlock key={index} language={lang} code={codeText.trim()} />;
        }

        // Regular text formatting (paragraphs, bold, inline code)
        const paragraphs = part.split(/\n\s*\n/);
        return paragraphs.map((para, pIdx) => {
          if (!para.trim()) return null;
          // Simple inline formatting for bold **...** and code `...`
          const inlineTokens = para.split(/(\**.*?\**|`.*?`)/g);
          return (
            <p key={`${index}-${pIdx}`} style={{ margin: "6px 0", lineHeight: 1.55 }}>
              {inlineTokens.map((token, tIdx) => {
                if (token.startsWith("**") && token.endsWith("**")) {
                  return <strong key={tIdx}>{token.slice(2, -2)}</strong>;
                }
                if (token.startsWith("`") && token.endsWith("`")) {
                  return (
                    <code
                      key={tIdx}
                      style={{
                        background: "rgba(15, 119, 112, 0.1)",
                        color: "var(--teal)",
                        padding: "2px 5px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "0.92em",
                      }}
                    >
                      {token.slice(1, -1)}
                    </code>
                  );
                }
                return token;
              })}
            </p>
          );
        });
      })}
    </div>
  );
}

export default function AiTutor({ initialPrompt }: { initialPrompt?: string } = {}) {
  // Restore messages from localStorage or initialize with personalized greeting
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "model",
      content:
        "Hi! I'm digiGUIDE, your computer science adaptive tutor. What concept or problem would you like to explore together?",
    },
  ]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  // Initialize and restore saved chat on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
      // If no saved chat, personalize default greeting
      const storedUser = window.localStorage.getItem("digiguide-user");
      if (storedUser) {
        const user = JSON.parse(storedUser) as { name?: string };
        const firstName = user.name ? user.name.split(" ")[0] : "there";
        setMessages([
          {
            id: 1,
            role: "model",
            content: `Hi ${firstName}! I'm digiGUIDE, your adaptive CS tutor. Which topic from your digital twin shall we tackle today?`,
          },
        ]);
      }
    } catch {
      // Keep default
    }
  }, []);

  // Save messages to localStorage on updates (stripping streaming flags)
  useEffect(() => {
    try {
      if (messages.length > 0) {
        const clean = messages.map((m) => ({ ...m, streaming: false }));
        window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(clean));
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  // Handle incoming initial prompt (e.g. from Notes Hub "Ask AI Tutor")
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setInput(initialPrompt);
      setTimeout(() => {
        if (textarea.current) {
          textarea.current.focus();
          textarea.current.style.height = "0px";
          textarea.current.style.height = `${Math.min(textarea.current.scrollHeight, 150)}px`;
        }
      }, 100);
    }
  }, [initialPrompt]);

  // Detect active topic from the entire conversation history
  const activeTopic = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const text = messages[i].content.toLowerCase();
      if (text.includes("recursion") || text.includes("factorial") || text.includes("call stack")) return "Recursion";
      if (text.includes("dynamic programming") || text.includes("knapsack") || text.includes("tabulation") || text.includes("fibonacci")) return "Dynamic Programming";
      if (text.includes("memoization") || text.includes("lru")) return "Memoization";
      if (text.includes("tree") || text.includes("bst") || text.includes("in-order") || text.includes("pre-order")) return "Trees & BST";
      if (text.includes("linked list") || text.includes("head node") || text.includes("pointer")) return "Linked Lists";
      if (text.includes("binary search") || text.includes("sorted array") || text.includes("search space")) return "Binary Search";
      if (text.includes("two pointers") || text.includes("sliding window") || text.includes("subarray") || text.includes("array")) return "Arrays";
      if (text.includes("graph") || text.includes("bfs") || text.includes("dfs") || text.includes("dijkstra")) return "Graphs";
      if (text.includes("python") || text.includes("complexity") || text.includes("big o")) return "Python DSA";
    }
    return null;
  }, [messages]);

  // Dynamic context-aware suggestion prompts
  const activePrompts = useMemo(() => {
    if (activeTopic && topicFollowUps[activeTopic]) {
      return topicFollowUps[activeTopic];
    }
    return defaultPrompts;
  }, [activeTopic]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resize = () => {
    const element = textarea.current;
    if (element) {
      element.style.height = "0px";
      element.style.height = `${Math.min(element.scrollHeight, 150)}px`;
    }
  };

  const clearChat = () => {
    try {
      window.localStorage.removeItem(CHAT_STORAGE_KEY);
      let firstName = "there";
      const stored = window.localStorage.getItem("digiguide-user");
      if (stored) {
        const user = JSON.parse(stored) as { name?: string };
        if (user.name) firstName = user.name.split(" ")[0];
      }
      setMessages([
        {
          id: Date.now(),
          role: "model",
          content: `Hi ${firstName}! I have reset our conversation memory. Which topic would you like to explore next?`,
        },
      ]);
    } catch {
      setMessages([
        {
          id: Date.now(),
          role: "model",
          content: "Conversation reset. What concept would you like to explore?",
        },
      ]);
    }
  };

  const send = async (event?: FormEvent, textToSend?: string) => {
    event?.preventDefault();
    const content = (textToSend || input).trim();
    if (!content || loading) return;

    const userMessage: Message = { id: Date.now(), role: "user", content };
    const assistantId = Date.now() + 1;
    setInput("");
    setLoading(true);
    if (textarea.current) textarea.current.style.height = "auto";
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "model", content: "", streaming: true },
    ]);

    try {
      // Send full conversation history so backend engine has multi-turn context
      const payloadMessages = [...messages, userMessage].map(({ role, content: text }) => ({
        role,
        content: text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Tutor service currently unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((msg) => (msg.id === assistantId ? { ...msg, content: answer } : msg))
        );
      }
      setMessages((current) =>
        current.map((msg) => (msg.id === assistantId ? { ...msg, streaming: false } : msg))
      );
    } catch (error) {
      setMessages((current) =>
        current.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: error instanceof Error ? error.message : "The tutor could not respond.",
                streaming: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const selectPrompt = (promptText: string) => {
    setInput(promptText);
    if (textarea.current) {
      textarea.current.focus();
      textarea.current.style.height = "0px";
      textarea.current.style.height = `${Math.min(textarea.current.scrollHeight, 150)}px`;
    }
  };

  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  return (
    <section className="tutor-panel">
      <header className="tutor-header">
        <div className="tutor-title">
          <div className="tutor-icon">
            <BrainCircuit size={20} />
          </div>
          <div>
            <div className="kicker">digiGUIDE AI Tutor</div>
            <h2>Learn by thinking it through.</h2>
            <p>Ask for conceptual analogies, step-by-step traces, or practice challenges.</p>
          </div>
        </div>

        <div className="tutor-header-right">
          {activeTopic && (
            <span className="tutor-context-chip" title="Chatbot is referencing this topic from previous messages">
              <Sparkles size={12} /> Active Context: <strong>{activeTopic}</strong>
            </span>
          )}
          <span className="tutor-status">
            <i /> Tutor ready
          </span>
          {messages.length > 1 && (
            <button
              type="button"
              className="tutor-reset-btn"
              onClick={clearChat}
              title="Reset conversation memory and start a new topic"
              aria-label="New Chat"
            >
              <RotateCcw size={12} /> New Chat
            </button>
          )}
        </div>
      </header>

      <div className="chat-history" aria-live="polite">
        {messages.map((message) => (
          <div className={`chat-message ${message.role}`} key={message.id}>
            <div className="message-avatar">
              {message.role === "model" ? <Bot size={15} /> : <User size={15} />}
            </div>
            <div className="message-bubble">
              {message.content ? (
                <FormattedContent content={message.content} />
              ) : (
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              )}
              {message.streaming && message.content && <span className="stream-caret" />}
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>

      <div className="quick-prompts">
        <span className="quick-prompts-label">
          <Sparkles size={11} />
          {activeTopic ? `Suggested for ${activeTopic}:` : "Suggested topics:"}
        </span>
        {activePrompts.map((prompt) => (
          <button key={prompt} onClick={() => selectPrompt(prompt)} type="button">
            {prompt}
          </button>
        ))}
      </div>

      <form className="chat-composer" onSubmit={send}>
        <textarea
          ref={textarea}
          rows={1}
          value={input}
          placeholder={
            activeTopic
              ? `Ask a follow-up about ${activeTopic}, request another example, or test your code...`
              : "Ask digiGUIDE anything about data structures or algorithms..."
          }
          onChange={(event) => {
            setInput(event.target.value);
            resize();
          }}
          onKeyDown={keyDown}
          aria-label="Message digiGUIDE"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Send message"
        >
          {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowUp size={18} />}
        </button>
      </form>
      <p className="composer-note">
        digiGUIDE references your ongoing chat history. Use &quot;New Chat&quot; in the top right to start a fresh topic.
      </p>
    </section>
  );
}
