import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AIOrb from "@/components/AIOrb";
import FloatingEntity from "@/components/FloatingEntity";
import { sendToWebhook } from "@/lib/webhook";
import { useLanguage } from "@/contexts/LanguageContext";

const services = [
  { name: "Passport", icon: "🛂", x: 12, y: 20 },
  { name: "Driver License", icon: "🚗", x: 78, y: 15 },
  { name: "Birth Certificate", icon: "📜", x: 8, y: 65 },
  { name: "Tax Filing", icon: "💰", x: 82, y: 60 },
  { name: "Social Security", icon: "🏛️", x: 20, y: 42 },
  { name: "Marriage License", icon: "💍", x: 72, y: 38 },
  { name: "Visa Application", icon: "✈️", x: 35, y: 12 },
  { name: "Business License", icon: "📋", x: 60, y: 75 },
  { name: "Property Tax", icon: "🏠", x: 88, y: 82 },
  { name: "Healthcare", icon: "🏥", x: 5, y: 85 },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      setIsProcessing(true);
      setResponse("");
      const result = await sendToWebhook(query, language);
      setIsProcessing(false);
      setResponse(result.text || "Response received.");
    },
    [query, language]
  );

  const matchingServices = query.trim()
    ? services.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {services.map((s, i) => (
          <FloatingEntity
            key={s.name}
            {...s}
            delay={i * 0.15}
            highlighted={matchingServices.some((m) => m.name === s.name)}
            onClick={() => navigate(`/service/${s.name.toLowerCase().replace(/\s+/g, "-")}`)}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl w-full">
          <AIOrb size={180} isProcessing={isProcessing} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl text-gradient-plasma mb-3">
              {t("home.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("home.subtitle")}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full"
          >
            <div className="glass-panel-strong rounded-2xl p-1.5 flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("home.placeholder")}
                className="flex-1 bg-transparent px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none text-lg"
              />
              <motion.button
                type="submit"
                className="magnetic-btn bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {t("home.processing")}
                  </motion.span>
                ) : (
                  t("home.ask")
                )}
              </motion.button>
            </div>
          </motion.form>

          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel rounded-2xl p-6 w-full"
              >
                <p className="text-foreground leading-relaxed">{response}</p>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    className="magnetic-btn bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/assistant")}
                  >
                    {t("home.continue")}
                  </motion.button>
                  <motion.button
                    className="magnetic-btn bg-muted text-muted-foreground px-4 py-2 rounded-xl text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/services")}
                  >
                    {t("home.browse")}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-8 text-center"
          >
            <div>
              <span className="font-display text-xl text-primary">14,202</span>
              <p className="text-xs text-muted-foreground mt-1">Federal Requirements</p>
            </div>
            <div>
              <span className="font-display text-xl text-primary">500+</span>
              <p className="text-xs text-muted-foreground mt-1">Services</p>
            </div>
            <div>
              <span className="font-display text-xl text-primary">24/7</span>
              <p className="text-xs text-muted-foreground mt-1">AI Support</p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
