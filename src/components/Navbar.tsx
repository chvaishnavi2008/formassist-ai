import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const navItems = [
  { path: "/", labelKey: "nav.home" },
  { path: "/assistant", labelKey: "nav.assistant" },
  { path: "/services", labelKey: "nav.services" },
  { path: "/demo", labelKey: "nav.demo" },
  { path: "/tracking", labelKey: "nav.tracking" },
];

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हिं" },
  { value: "te", label: "తె" },
];

const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4"
    >
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-plasma">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse-glow" />
        </div>
        <span className="font-display text-sm text-foreground tracking-tight hidden sm:inline">
          FormAssist AI
        </span>
      </Link>

      <div className="glass-panel rounded-full px-1.5 py-1.5 flex items-center gap-0.5 overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="relative px-3 md:px-4 py-1.5 text-xs md:text-sm whitespace-nowrap">
            {location.pathname === item.path && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-full bg-primary/15 border border-primary/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(item.labelKey)}
            </span>
          </Link>
        ))}
      </div>

      <div className="glass-panel rounded-full px-1 py-1 flex items-center gap-0.5">
        {languages.map((lang) => (
          <motion.button
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              language === lang.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {lang.label}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;
