import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "te";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "nav.home": { en: "Home", hi: "होम", te: "హోమ్" },
  "nav.assistant": { en: "Assistant", hi: "सहायक", te: "సహాయకుడు" },
  "nav.services": { en: "Services", hi: "सेवाएं", te: "సేవలు" },
  "nav.tracking": { en: "Tracking", hi: "ट्रैकिंग", te: "ట్రాకింగ్" },
  "nav.demo": { en: "Demo", hi: "डेमो", te: "డెమో" },
  "home.title": { en: "FormAssist AI", hi: "FormAssist AI", te: "FormAssist AI" },
  "home.subtitle": { en: "The complexity of government, distilled into a conversation.", hi: "सरकार की जटिलता, एक बातचीत में सरल।", te: "ప్రభుత్వ సంక్లిష్టత, సంభాషణలో సరళం." },
  "home.placeholder": { en: "What government service do you need?", hi: "आपको कौन सी सरकारी सेवा चाहिए?", te: "మీకు ఏ ప్రభుత్వ సేవ కావాలి?" },
  "home.ask": { en: "Ask AI", hi: "AI से पूछें", te: "AI ని అడగండి" },
  "home.processing": { en: "Processing...", hi: "प्रोसेसिंग...", te: "ప్రాసెసింగ్..." },
  "home.continue": { en: "Continue with AI", hi: "AI के साथ जारी रखें", te: "AI తో కొనసాగించు" },
  "home.browse": { en: "Browse Services", hi: "सेवाएं देखें", te: "సేవలు చూడండి" },
  "assistant.title": { en: "AI Assistant", hi: "AI सहायक", te: "AI సహాయకుడు" },
  "assistant.welcome": { en: "Hello! I'm your FormAssist AI guide. How can I help you today?", hi: "नमस्ते! मैं आपका FormAssist AI गाइड हूं। आज मैं आपकी कैसे मदद कर सकता हूं?", te: "హలో! నేను మీ FormAssist AI గైడ్. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?" },
  "assistant.placeholder": { en: "Ask about any government service...", hi: "किसी भी सरकारी सेवा के बारे में पूछें...", te: "ఏదైనా ప్రభుత్వ సేవ గురించి అడగండి..." },
  "assistant.send": { en: "Send", hi: "भेजें", te: "పంపు" },
  "demo.title": { en: "Live Demo", hi: "लाइव डेमो", te: "లైవ్ డెమో" },
  "demo.subtitle": { en: "Experience FormAssist AI in action", hi: "FormAssist AI को एक्शन में देखें", te: "FormAssist AI ని అనుభవించండి" },
  "demo.input_placeholder": { en: "Enter service (e.g., Passport)", hi: "सेवा दर्ज करें (जैसे, पासपोर्ट)", te: "సేవను నమోదు చేయండి (ఉదా., పాస్‌పోర్ట్)" },
  "demo.start": { en: "Start Demo", hi: "डेमो शुरू करें", te: "డెమో ప్రారంభించండి" },
  "demo.next_step": { en: "Next Step", hi: "अगला कदम", te: "తదుపరి దశ" },
  "demo.upload_title": { en: "Document Scanner", hi: "दस्तावेज़ स्कैनर", te: "డాక్యుమెంట్ స్కానర్" },
  "demo.upload_btn": { en: "Upload your document", hi: "अपना दस्तावेज़ अपलोड करें", te: "మీ డాక్యుమెంట్ అప్‌లోడ్ చేయండి" },
  "demo.scanning": { en: "Scanning document...", hi: "दस्तावेज़ स्कैन हो रहा है...", te: "డాక్యుమెంట్ స్కాన్ అవుతోంది..." },
  "demo.extracted": { en: "Extracted Information", hi: "निकाली गई जानकारी", te: "సేకరించిన సమాచారం" },
  "tracking.title": { en: "Application Tracking", hi: "आवेदन ट्रैकिंग", te: "దరఖాస్తు ట్రాకింగ్" },
  "services.title": { en: "Services Explorer", hi: "सेवा एक्सप्लोरर", te: "సేవల అన్వేషకుడు" },
  "lang.en": { en: "EN", hi: "EN", te: "EN" },
  "lang.hi": { en: "HI", hi: "HI", te: "HI" },
  "lang.te": { en: "TE", hi: "TE", te: "TE" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => translations[key]?.[language] || translations[key]?.en || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
