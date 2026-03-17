import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import GlassCard from "@/components/GlassCard";

const services = [
  { name: "Passport Application", icon: "🛂", description: "Apply for or renew your passport", category: "Identity" },
  { name: "Driver License", icon: "🚗", description: "Get or renew your driver's license", category: "Identity" },
  { name: "Birth Certificate", icon: "📜", description: "Request certified birth certificate copies", category: "Records" },
  { name: "Tax Filing", icon: "💰", description: "File federal and state taxes", category: "Finance" },
  { name: "Social Security", icon: "🏛️", description: "Social security benefits and cards", category: "Benefits" },
  { name: "Marriage License", icon: "💍", description: "Apply for a marriage license", category: "Records" },
  { name: "Visa Application", icon: "✈️", description: "Apply for travel or work visas", category: "Immigration" },
  { name: "Business License", icon: "📋", description: "Register a new business", category: "Business" },
  { name: "Property Tax", icon: "🏠", description: "Pay or dispute property taxes", category: "Finance" },
  { name: "Healthcare", icon: "🏥", description: "Enroll in healthcare programs", category: "Benefits" },
  { name: "Voter Registration", icon: "🗳️", description: "Register to vote or update info", category: "Civic" },
  { name: "Building Permit", icon: "🏗️", description: "Apply for construction permits", category: "Business" },
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl text-gradient-plasma mb-3">
            Services Explorer
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Navigate the constellation of government services. Each node is a gateway to guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <GlassCard
                onClick={() =>
                  navigate(`/service/${service.name.toLowerCase().replace(/\s+/g, "-")}`)
                }
                glowColor={i % 2 === 0 ? "plasma" : "signal"}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{service.icon}</div>
                  <div className="flex-1">
                    <span className="text-[10px] font-display text-primary/60 uppercase tracking-widest">
                      {service.category}
                    </span>
                    <h3 className="text-foreground font-medium mt-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default ServicesPage;
