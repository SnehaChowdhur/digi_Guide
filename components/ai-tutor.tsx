"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, BrainCircuit, Check, Copy, LoaderCircle, Sparkles, User } from "lucide-react";

type Message = { id: number; role: "user" | "model"; content: string; streaming?: boolean };

const quickPrompts = [
  "Explain Dynamic Programming with a real-life analogy",
  "How does memoization differ from recursion?",
  "Generate a 3-question practice quiz on Trees",
  "Walk through Binary Search step-by-step",
];

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
          const inlineTokens = para.split(/(\*\*.*?\*\*|`.*?`)/g);
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

export default function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "model",
      content:
        "Hi! I'm digiGUIDE, your computer science adaptive tutor. What concept or problem would you like to explore together?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Personalize greeting if user is saved in localStorage
    try {
      const stored = window.localStorage.getItem("digiguide-user");
      if (stored) {
        const user = JSON.parse(stored) as { name?: string };
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

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = input.trim();
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content: text }) => ({
            role,
            content: text,
          })),
        }),
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
    textarea.current?.focus();
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
        <span className="tutor-status">
          <i /> Tutor ready
        </span>
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
        <span>Suggested topics:</span>
        {quickPrompts.map((prompt) => (
          <button key={prompt} onClick={() => selectPrompt(prompt)}>
            <Sparkles size={12} />
            {prompt}
          </button>
        ))}
      </div>
      <form className="chat-composer" onSubmit={send}>
        <textarea
          ref={textarea}
          rows={1}
          value={input}
          placeholder="Ask digiGUIDE anything about data structures or algorithms..."
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
        digiGUIDE can make mistakes. Use it to build intuition, then verify your code.
      </p>
    </section>
  );
}

