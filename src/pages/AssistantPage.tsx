import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AIOrb from "@/components/AIOrb";
import Waveform from "@/components/Waveform";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  service?: string;
  steps?: string[];
  link?: string;
}

const mockResponses: Record<string, Omit<Message, "id" | "role">> = {
  passport: {
    content: "I'll help you with your passport application. Here's what you need:",
    service: "Passport Application",
    steps: [
      "Complete Form DS-11 (first-time) or DS-82 (renewal)",
      "Gather proof of citizenship (birth certificate or naturalization)",
      "Provide a valid photo ID",
      "Get a passport photo taken",
      "Submit application at acceptance facility or by mail",
    ],
    link: "https://travel.state.gov/content/travel/en/passports.html",
  },
  default: {
    content: "I can help you navigate government services. Tell me what you need assistance with — passports, licenses, tax filing, or any other service.",
  },
};

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your FormAssist AI guide. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const key = input.toLowerCase().includes("passport") ? "passport" : "default";
      const resp = mockResponses[key];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        ...resp,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-4 px-4 flex flex-col max-w-3xl mx-auto">
        {/* Mini Orb */}
        <div className="flex justify-center mb-4">
          <AIOrb size={60} isProcessing={isTyping} />
        </div>

        <h2 className="font-display text-xl text-center text-gradient-plasma mb-6">
          AI Assistant
        </h2>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-primary/15 border border-primary/20"
                      : "glass-panel-strong"
                  }`}
                >
                  <p className="text-foreground leading-relaxed">{msg.content}</p>

                  {msg.service && (
                    <div className="mt-3 glass-panel rounded-xl p-3">
                      <span className="text-xs text-primary font-display">SERVICE DETECTED</span>
                      <p className="text-sm text-foreground mt-1 font-medium">{msg.service}</p>
                    </div>
                  )}

                  {msg.steps && (
                    <div className="mt-3 space-y-2">
                      {msg.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <span className="text-primary font-display text-xs mt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {msg.link && (
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-xs text-primary underline underline-offset-2"
                    >
                      Official Website →
                    </a>
                  )}

                  {msg.role === "assistant" && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isPlaying ? "⏸ Pause" : "🔊 Listen"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-panel-strong rounded-2xl p-4">
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Waveform */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center mb-4"
            >
              <Waveform isPlaying={isPlaying} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <form onSubmit={handleSend}>
          <div className="glass-panel-strong rounded-2xl p-1.5 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any government service..."
              className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none"
            />
            <motion.button
              type="submit"
              className="magnetic-btn bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default AssistantPage;
