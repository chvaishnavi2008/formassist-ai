import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/assistant", label: "Assistant" },
  { path: "/services", label: "Services" },
  { path: "/tracking", label: "Tracking" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
    >
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-plasma">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse-glow" />
        </div>
        <span className="font-display text-sm text-foreground tracking-tight">
          FormAssist AI
        </span>
      </Link>

      <div className="glass-panel rounded-full px-2 py-1.5 flex items-center gap-1">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="relative px-4 py-1.5 text-sm">
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
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="glass-panel rounded-full px-3 py-1.5">
        <select className="bg-transparent text-sm text-muted-foreground outline-none cursor-pointer">
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
          <option value="ar">AR</option>
        </select>
      </div>
    </motion.nav>
  );
};

export default Navbar;
