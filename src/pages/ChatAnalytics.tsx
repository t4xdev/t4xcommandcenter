import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  predefinedQuestions,
  aiResponses,
  type ChatMessage,
  type PredefinedQuestion,
} from "@/data/dashboardData";

const categoryColors: Record<string, string> = {
  operations: "bg-info/10 text-info border-info/20",
  finance: "bg-warning/10 text-warning border-warning/20",
  sales: "bg-success/10 text-success border-success/20",
  leadership: "bg-secondary/10 text-secondary border-secondary/20",
};

const categoryLabels: Record<string, string> = {
  operations: "Operations",
  finance: "Finance",
  sales: "Sales",
  leadership: "Leadership",
};

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-primary" : "bg-secondary"}`}>
        {isUser ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-secondary-foreground" />}
      </div>
      <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
        isUser ? "bg-primary text-primary-foreground" : "card-elevated text-card-foreground"
      }`}>
        {msg.content.split("\n").map((line, i) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-bold mb-1">{line.replace(/\*\*/g, "")}</p>;
          }
          if (line.startsWith("| ")) {
            return <p key={i} className="font-mono text-[11px] text-muted-foreground">{line}</p>;
          }
          if (line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
            return <p key={i} className="ml-2 mb-0.5">{line}</p>;
          }
          if (line.trim() === "") return <br key={i} />;
          return <p key={i} className="mb-1">{line.replace(/\*\*/g, "")}</p>;
        })}
      </div>
    </div>
  );
}

export default function ChatAnalytics() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the **Conversational Analytics Assistant**. Select a predefined question from the right panel or type your own query to get AI-powered insights.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string, questionId?: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = questionId && aiResponses[questionId]
        ? aiResponses[questionId]
        : "I'm analyzing your query against the latest data. Based on current metrics, here's what I found:\n\nThis is a complex query that would typically be processed through the analytics engine. In the full system, this would connect to the MySQL database and local LLM for real-time analysis.\n\n**Recommendation:** Please select one of the predefined questions for detailed insights, or refine your query with specific metric names.";

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuestionClick = (q: PredefinedQuestion) => {
    handleSend(q.question, q.id);
  };

  const groupedQuestions = predefinedQuestions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, PredefinedQuestion[]>);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Conversational Analytics Assistant" subtitle="Ask questions, get AI-powered business insights" />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="card-elevated px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && handleSend(input)}
                placeholder="Type your analytics query..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => input.trim() && handleSend(input)}
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Predefined Questions Panel */}
        <div className="w-80 border-l border-border bg-card/30 overflow-auto p-5 hidden lg:block">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-semibold text-foreground">Quick Analytics</h3>
          </div>

          {Object.entries(groupedQuestions).map(([category, questions]) => (
            <div key={category} className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {categoryLabels[category]}
              </p>
              <div className="space-y-1.5">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 hover:shadow-sm ${categoryColors[category]}`}
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
