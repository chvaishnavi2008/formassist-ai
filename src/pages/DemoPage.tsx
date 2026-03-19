import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AIOrb from "@/components/AIOrb";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendToWebhook } from "@/lib/webhook";
import { Upload, FileText, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface DemoStep {
  text: string;
  service?: string;
  link?: string;
}

interface ScanResult {
  [key: string]: string;
}

const DemoPage = () => {
  const { language, t } = useLanguage();
  const [service, setService] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<DemoStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [serviceLink, setServiceLink] = useState("");

  // Document scanning
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStart = async () => {
    if (!service.trim() || isLoading) return;
    setIsLoading(true);
    setSteps([]);
    setCurrentStep(0);

    const resp = await sendToWebhook(service, language, 1);
    setServiceName(resp.service || service);
    setServiceLink(resp.link || "");

    const allSteps: DemoStep[] = (resp.steps || [resp.text || "Processing..."]).map(
      (s: string) => ({ text: s, service: resp.service, link: resp.link })
    );
    setSteps(allSteps);
    setIsLoading(false);
  };

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      // Fetch next steps from API
      setIsLoading(true);
      const resp = await sendToWebhook(service, language, currentStep + 2);
      if (resp.steps?.length) {
        setSteps((prev) => [
          ...prev,
          ...resp.steps!.map((s: string) => ({ text: s })),
        ]);
        setCurrentStep((p) => p + 1);
      }
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setScanResults(null);
    setIsScanning(true);
    setScanProgress(0);

    // Animate scan progress
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const res = await fetch(
        "https://rushyanth.app.n8n.cloud/webhook-test/formassist-ai",
        { method: "POST", body: formData }
      );

      clearInterval(interval);
      setScanProgress(100);

      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("json")) {
          const data = await res.json();
          setScanResults(
            data.extracted || data.fields || data.data || {
              Name: data.name || "—",
              "Date of Birth": data.dob || data.date_of_birth || "—",
              "ID Number": data.id_number || data.id || "—",
              Address: data.address || "—",
            }
          );
        } else {
          setScanResults({ Result: await res.text() });
        }
      } else {
        setScanResults({ Error: "Could not process document. Please try again." });
      }
    } catch {
      clearInterval(interval);
      setScanProgress(100);
      setScanResults({ Error: "Failed to reach server. Please try again." });
    }

    setIsScanning(false);
  };

  const progress = steps.length ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-8 px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <AIOrb size={60} isProcessing={isLoading || isScanning} />
        </div>

        <h2 className="font-display text-2xl text-center text-gradient-plasma mb-2">
          {t("demo.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-8">{t("demo.subtitle")}</p>

        {/* Demo Input */}
        <div className="glass-panel-strong rounded-2xl p-6 mb-8">
          <div className="flex gap-3">
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder={t("demo.input_placeholder")}
              className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none border border-border rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
            <motion.button
              onClick={handleStart}
              disabled={isLoading || !service.trim()}
              className="magnetic-btn bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("demo.start")}
            </motion.button>
          </div>
        </div>

        {/* Steps Output */}
        <AnimatePresence>
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-6 mb-8"
            >
              {/* Service header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-primary font-display">SERVICE</span>
                  <h3 className="text-lg font-medium text-foreground">{serviceName}</h3>
                </div>
                {serviceLink && (
                  <a
                    href={serviceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-btn bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                  >
                    Website <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-muted mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        i <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < currentStep ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <p className="text-sm text-foreground">{step.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Next Step */}
              <motion.button
                onClick={handleNextStep}
                disabled={isLoading}
                className="magnetic-btn bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>{t("demo.next_step")} <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Scanner */}
        <div className="glass-panel-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground">{t("demo.upload_title")}</h3>
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileUpload}
          />

          <motion.button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {uploadedFile ? uploadedFile.name : t("demo.upload_btn")}
            </span>
          </motion.button>

          {/* Scanning animation */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <p className="text-sm text-primary mb-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("demo.scanning")}
                </p>
                {/* Scan line effect */}
                <div className="relative w-full h-32 rounded-xl bg-muted/30 border border-border overflow-hidden">
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-muted mt-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan Results */}
          <AnimatePresence>
            {scanResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h4 className="text-sm font-display text-primary mb-3">{t("demo.extracted")}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(scanResults).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-panel rounded-xl p-4"
                    >
                      <span className="text-xs text-muted-foreground uppercase">{key}</span>
                      <p className="text-foreground font-medium mt-1">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default DemoPage;
