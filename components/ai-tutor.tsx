"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, BrainCircuit, LoaderCircle, Sparkles, User } from "lucide-react";

type Message = { id: number; role: "user" | "model"; content: string; streaming?: boolean };
const prompts = ["Explain Concept", "Generate Practice Quiz"];
const starters: Message[] = [{ id: 1, role: "model", content: "Hi Alex. I’m digiGUIDE, your computer science tutor. What concept would you like to work through?" }];

export default function AiTutor() {
  const [messages, setMessages] = useState<Message[]>(starters);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    const receivePrompt = (event: Event) => { const prompt = (event as CustomEvent<string>).detail; if (prompt) setInput(prompt); };
    window.addEventListener("digiguide:tutor-prompt", receivePrompt);
    return () => window.removeEventListener("digiguide:tutor-prompt", receivePrompt);
  }, []);
  const resize = () => { const element = textarea.current; if (element) { element.style.height = "0px"; element.style.height = `${Math.min(element.scrollHeight, 150)}px`; } };
  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const userMessage: Message = { id: Date.now(), role: "user", content };
    const assistantId = Date.now() + 1;
    setInput(""); setLoading(true); if (textarea.current) textarea.current.style.height = "auto";
    setMessages(current => [...current, userMessage, { id: assistantId, role: "model", content: "", streaming: true }]);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, userMessage].map(({ role, content: text }) => ({ role, content: text })) }) });
      if (!response.ok || !response.body) { const data = await response.json().catch(() => ({})); throw new Error(data.error || "Tutor unavailable"); }
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = "";
      while (true) { const { value, done } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); setMessages(current => current.map(message => message.id === assistantId ? { ...message, content: answer } : message)); }
      setMessages(current => current.map(message => message.id === assistantId ? { ...message, streaming: false } : message));
    } catch (error) { setMessages(current => current.map(message => message.id === assistantId ? { ...message, content: error instanceof Error ? error.message : "The tutor could not respond.", streaming: false } : message)); }
    finally { setLoading(false); }
  };
  const quickPrompt = (prompt: string) => setInput(prompt === prompts[0] ? "Explain dynamic programming with a small example." : "Generate a 3-question practice quiz on dynamic programming.");
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } };

  return <section className="tutor-panel"><header className="tutor-header"><div className="tutor-title"><div className="tutor-icon"><BrainCircuit size={20} /></div><div><div className="kicker">digiGUIDE tutor</div><h2>Learn by thinking it through.</h2><p>Ask for an explanation, an example, or a practice challenge.</p></div></div><span className="tutor-status"><i /> Tutor ready</span></header><div className="chat-history" aria-live="polite">{messages.map(message => <div className={`chat-message ${message.role}`} key={message.id}><div className="message-avatar">{message.role === "model" ? <Bot size={15} /> : <User size={15} />}</div><div className="message-bubble">{message.content || <span className="typing"><i /><i /><i /></span>}{message.streaming && message.content && <span className="stream-caret" />}</div></div>)}<div ref={bottom} /></div><div className="quick-prompts"><span>Try asking</span>{prompts.map(prompt => <button key={prompt} onClick={() => quickPrompt(prompt)}><Sparkles size={13} />{prompt}</button>)}</div><form className="chat-composer" onSubmit={send}><textarea ref={textarea} rows={1} value={input} placeholder="Ask digiGUIDE anything about computer science..." onChange={event => { setInput(event.target.value); resize(); }} onKeyDown={keyDown} aria-label="Message digiGUIDE" /><button type="submit" disabled={!input.trim() || loading} aria-label="Send message">{loading ? <LoaderCircle className="spin" size={18} /> : <ArrowUp size={18} />}</button></form><p className="composer-note">digiGUIDE can make mistakes. Use it to reason, then verify important details.</p></section>;
}
