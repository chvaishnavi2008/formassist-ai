import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";

const serviceData: Record<string, {
  name: string; icon: string; overview: string;
  steps: { title: string; description: string }[];
  fields: string[];
}> = {
  "passport-application": {
    name: "Passport Application", icon: "🛂",
    overview: "Apply for a new U.S. passport or renew your existing passport. Processing times vary from 6-8 weeks (routine) to 2-3 weeks (expedited).",
    steps: [
      { title: "Determine Application Type", description: "Decide if you need Form DS-11 (first-time) or DS-82 (renewal)." },
      { title: "Gather Documents", description: "Proof of citizenship, photo ID, and passport photo." },
      { title: "Complete the Form", description: "Fill out the application form carefully." },
      { title: "Calculate Fees", description: "Application fee varies by type and speed." },
      { title: "Submit Application", description: "Visit acceptance facility or mail your application." },
    ],
    fields: ["Full Legal Name", "Date of Birth", "Social Security Number", "Mailing Address", "Emergency Contact"],
  },
  "driver-license": {
    name: "Driver License", icon: "🚗",
    overview: "Get or renew your driver's license through your state's DMV.",
    steps: [
      { title: "Check Eligibility", description: "Must meet age and residency requirements." },
      { title: "Gather Documents", description: "Proof of identity, residency, and SSN." },
      { title: "Schedule Appointment", description: "Book a DMV visit online." },
      { title: "Pass Tests", description: "Written knowledge test and road test if applicable." },
      { title: "Receive License", description: "Get temporary license, permanent arrives by mail." },
    ],
    fields: ["Full Name", "Date of Birth", "SSN", "Address", "Vision Test Results"],
  },
};

const ServiceDetailPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const service = serviceData[name || ""] || serviceData["passport-application"];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground hover:text-primary mb-8 flex items-center gap-1 transition-colors"
          onClick={() => navigate("/services")}
        >
          ← Back to Services
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Overview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass-panel-strong rounded-3xl p-8 text-center sticky top-24">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h1 className="font-display text-2xl text-gradient-plasma mb-4">{service.name}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.overview}</p>

              <div className="mt-6 space-y-2">
                <h3 className="font-display text-xs text-primary uppercase tracking-widest">Required Fields</h3>
                {service.fields.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="glass-panel rounded-lg px-3 py-2 text-sm text-muted-foreground"
                  >
                    {f}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Steps */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-display text-sm text-primary uppercase tracking-widest mb-4">
              Step-by-Step Guide
            </h2>
            {service.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-panel rounded-2xl p-6 relative overflow-hidden group"
              >
                {/* Light beam on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-beam" />
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>

                {/* Connector line */}
                {i < service.steps.length - 1 && (
                  <div className="absolute left-[2.05rem] bottom-0 w-px h-4 bg-gradient-to-b from-primary/20 to-transparent translate-y-full" />
                )}
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: service.steps.length * 0.15 + 0.3 }}
              className="magnetic-btn w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/assistant")}
            >
              Start Application with AI Guide →
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServiceDetailPage;
