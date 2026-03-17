import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import GlassCard from "@/components/GlassCard";

const trackingSteps = [
  { label: "Application Submitted", status: "completed", date: "Mar 1, 2026", icon: "📝" },
  { label: "Documents Verified", status: "completed", date: "Mar 5, 2026", icon: "✅" },
  { label: "Background Check", status: "completed", date: "Mar 8, 2026", icon: "🔍" },
  { label: "Processing", status: "current", date: "Mar 12, 2026", icon: "⚙️" },
  { label: "Quality Review", status: "pending", date: "Est. Mar 20", icon: "📋" },
  { label: "Approved & Shipped", status: "pending", date: "Est. Mar 25", icon: "📬" },
];

const applications = [
  { name: "Passport Renewal", id: "PA-2026-4829", progress: 65 },
  { name: "Driver License", id: "DL-2026-1133", progress: 30 },
];

const TrackingPage = () => {
  const completedSteps = trackingSteps.filter((s) => s.status === "completed").length;
  const progressPercent = (completedSteps / trackingSteps.length) * 100;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl text-gradient-plasma mb-3">
            Application Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor your applications in real-time
          </p>
        </motion.div>

        {/* Active Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {applications.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-foreground font-medium">{app.name}</h3>
                  <span className="font-display text-xs text-primary">{app.id}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${app.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2 inline-block">
                  {app.progress}% Complete
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel-strong rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-xs text-primary uppercase tracking-widest">
              Passport Renewal Progress
            </span>
            <span className="font-display text-sm text-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-muted" />

          {trackingSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              className="relative flex items-start gap-6 mb-8 last:mb-0"
            >
              {/* Node */}
              <motion.div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === "completed"
                    ? "bg-primary/20 border-2 border-primary"
                    : step.status === "current"
                    ? "bg-primary/10 border-2 border-primary animate-pulse-glow"
                    : "glass-panel border border-border"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 300 }}
              >
                <span className="text-lg">{step.icon}</span>
              </motion.div>

              {/* Content */}
              <div className="pt-2">
                <h3
                  className={`font-medium ${
                    step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {step.label}
                </h3>
                <span className="text-xs text-muted-foreground font-display">{step.date}</span>
                {step.status === "current" && (
                  <motion.span
                    className="ml-2 inline-block text-xs text-primary"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    In Progress
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default TrackingPage;
