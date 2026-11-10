export interface ProductMetric {
  label: string;
  value: string;
  detail?: string;
}

export type ProductGroup = "Intelligence" | "AI Humans" | "Silicon";

export type VisualType =
  | "aiml"
  | "deeplearning"
  | "saadhyam"
  | "ai_human_sara"
  | "ai_human_diya"
  | "ai_human_valmiki"
  | "ai_human_rudra"
  | "ai_human_law"
  | "neuro_chip";

export interface HumanProfile {
  role: string;
  speakingStatus: string;
  initials: string;
}

export interface ProductItem {
  id: string;
  index: string;
  group: ProductGroup;
  name: string;
  tagline: string;
  promise: string;
  highlights: string[];
  metrics: ProductMetric[];
  accent: string;
  bgShade: string;
  visualType: VisualType;
  humanProfile?: HumanProfile;
}

export const PRODUCTS: ProductItem[] = [
  // ─── Group A: Intelligence ──────────────────────────────────────────
  {
    id: "ai-ml-solutions",
    index: "01",
    group: "Intelligence",
    name: "AI / ML Solutions",
    tagline: "Applied Enterprise Models",
    promise: "Applied machine learning built for real business problems.",
    highlights: [
      "Custom predictive scoring, forecasting, and causal inference engines",
      "Continuous model retraining pipelines anchored to sovereign data streams",
      "Sub-millisecond inference embedded directly into operational software",
    ],
    metrics: [
      { label: "Accuracy lift", value: "+38%" },
      { label: "P99 latency", value: "3.2 ms" },
      { label: "Data sovereignty", value: "100%" },
    ],
    accent: "#7EA4D4", // Refined ice slate
    bgShade: "#08090C",
    visualType: "aiml",
  },
  {
    id: "deep-learning",
    index: "02",
    group: "Intelligence",
    name: "Deep Learning",
    tagline: "Bespoke Neural Architectures",
    promise: "Custom neural architectures, training and deployment.",
    highlights: [
      "Tailored transformer and diffusion architectures engineered from first principles",
      "Distributed FP8 cluster orchestration with automated gradient balancing",
      "Quantized low-power edge deployment across air-gapped infrastructure",
    ],
    metrics: [
      { label: "Training speedup", value: "4.2x" },
      { label: "Quant precision", value: "FP8 / INT4" },
      { label: "Memory footprint", value: "-62%" },
    ],
    accent: "#9D9CE0", // Calm lavender mist
    bgShade: "#090A0E",
    visualType: "deeplearning",
  },
  {
    id: "saadhyam",
    index: "03",
    group: "Intelligence",
    name: "Saadhyam",
    tagline: "Sovereign Foundation Model",
    promise: "Mentneo's own foundation model, built in-house.",
    highlights: [
      "Native multi-modal tensor architecture trained on sovereign domain corpus",
      "Formal logic verification gates ensuring zero hallucination drift",
      "1.2M token linear-memory context window with instant retrieval",
    ],
    metrics: [
      { label: "Context window", value: "1.2M tokens" },
      { label: "Throughput", value: "320 tok/s" },
      { label: "Hallucination delta", value: "< 0.08%" },
    ],
    accent: "#668CF0", // Refined royal indigo
    bgShade: "#0A0B10",
    visualType: "saadhyam",
  },

  // ─── Group B: AI Humans ─────────────────────────────────────────────
  {
    id: "sara",
    index: "04",
    group: "AI Humans",
    name: "Sara",
    tagline: "Voice Calling Specialist",
    promise: "AI voice calling agent that talks like a human.",
    highlights: [
      "Natural conversational cadence with dynamic acoustic breath and pause modeling",
      "Instant semantic interruption handling with sub-120ms round-trip reaction",
      "Automated enterprise CRM telemetry synchronization and call synthesis",
    ],
    metrics: [
      { label: "Response latency", value: "118 ms" },
      { label: "Call resolution", value: "89.4%" },
      { label: "Vernacular dialects", value: "24+" },
    ],
    accent: "#D28E9E", // Muted rose quartz
    bgShade: "#0D090B",
    visualType: "ai_human_sara",
    humanProfile: {
      role: "Conversational Telephony Specialist",
      speakingStatus: "Speaking with empathy",
      initials: "SR",
    },
  },
  {
    id: "diya",
    index: "05",
    group: "AI Humans",
    name: "Diya",
    tagline: "Digital Marketing Workforce",
    promise: "AI digital marketing workforce.",
    highlights: [
      "Autonomous campaign strategy, copywriting, and multi-format asset synthesis",
      "Real-time creative optimization with predictive ROAS attribution modeling",
      "24/7 cross-channel sentiment monitoring and adaptive audience messaging",
    ],
    metrics: [
      { label: "ROAS increase", value: "+46%" },
      { label: "Asset velocity", value: "50x" },
      { label: "Channels managed", value: "12 live" },
    ],
    accent: "#D69F68", // Warm champagne amber
    bgShade: "#0D0A08",
    visualType: "ai_human_diya",
    humanProfile: {
      role: "Growth & Brand Strategy Director",
      speakingStatus: "Analyzing audience signals",
      initials: "DY",
    },
  },
  {
    id: "valmiki",
    index: "06",
    group: "AI Humans",
    name: "Valmiki",
    tagline: "Enterprise Knowledge & Narrative",
    promise: "AI human synthesizing strategic enterprise knowledge and narratives.",
    highlights: [
      "Petabyte-scale institutional memory indexing across disparate repositories",
      "Authoritative executive briefings and structured organizational knowledge",
      "Deterministic source provenance with byte-exact citations and cryptographic proof",
    ],
    metrics: [
      { label: "Synthesis ratio", value: "10,000 : 1" },
      { label: "Citation fidelity", value: "100%" },
      { label: "Query latency", value: "4.2 ms" },
    ],
    accent: "#7DB299", // Serene sage eucalyptus
    bgShade: "#080C0A",
    visualType: "ai_human_valmiki",
    humanProfile: {
      role: "Strategic Knowledge Synthesizer",
      speakingStatus: "Synthesizing briefing",
      initials: "VM",
    },
  },
  {
    id: "rudra",
    index: "07",
    group: "AI Humans",
    name: "Rudra",
    tagline: "Operations & Mission Orchestration",
    promise: "AI human orchestrating resilient operations and autonomous workflows.",
    highlights: [
      "Orchestrates distributed multi-agent DAGs with Byzantine fault tolerance",
      "Autonomous real-time anomaly mitigation and self-healing task execution",
      "Continuous mission-critical telemetry monitoring in air-gapped enclaves",
    ],
    metrics: [
      { label: "Self-healing rate", value: "98.2%" },
      { label: "Task throughput", value: "50k ops/s" },
      { label: "SLA uptime", value: "99.999%" },
    ],
    accent: "#7094C6", // Tactical steel blue
    bgShade: "#080A0E",
    visualType: "ai_human_rudra",
    humanProfile: {
      role: "Swarm Orchestrator & Operations",
      speakingStatus: "Monitoring system equilibrium",
      initials: "RD",
    },
  },
  {
    id: "law-ai",
    index: "08",
    group: "AI Humans",
    name: "Law AI",
    tagline: "Legal Research & Statutory Drafting",
    promise: "AI legal assistant for legal research and drafting.",
    highlights: [
      "Exhaustive statutory cross-referencing and precedential risk analysis",
      "Precision clause drafting with clause-by-clause audit and redline provenance",
      "Strict attorney-client isolation ensuring zero egress or telemetry retention",
    ],
    metrics: [
      { label: "Research time", value: "-85%" },
      { label: "Precedent accuracy", value: "99.8%" },
      { label: "Jurisdictions", value: "45+" },
    ],
    accent: "#BDA588", // Warm platinum bronze
    bgShade: "#0C0B0A",
    visualType: "ai_human_law",
    humanProfile: {
      role: "Legal Research & Statutory Drafting",
      speakingStatus: "Auditing statutory clauses",
      initials: "LW",
    },
  },

  // ─── Group C: Silicon Architecture ──────────────────────────────────
  {
    id: "neuro-hgi-chip",
    index: "09",
    group: "Silicon",
    name: "Neuro HGI",
    tagline: "Heterogeneous Silicon Substrate",
    promise: "Next-generation silicon substrate built specifically for frontier intelligence.",
    highlights: [
      "Monolithic 2.2 mm silicon die with high-density optical memory interconnects",
      "680 TFLOPS FP8 compute capacity packaged within an 11.8W thermal envelope",
      "Direct physical hardware bridge for on-premises sovereign compute clusters",
    ],
    metrics: [
      { label: "Die dimension", value: "2.2 mm" },
      { label: "Compute density", value: "680 TFLOPS" },
      { label: "Thermal budget", value: "11.8 W" },
    ],
    accent: "#F59E0B", // Silicon amber
    bgShade: "#0F0E0A",
    visualType: "neuro_chip",
  },
];

// ─── Hero Card Fan (7 Domain & Product Cards, Centre = Flagship) ─────
export type HeroVisualType =
  | "saadhyam_orb"
  | "language_streaming"
  | "voice_waveform"
  | "growth_chart"
  | "education_path"
  | "iot_nodes"
  | "neuro_chip_render"
  | "ai_human_silhouette";

export interface HeroFanCard {
  id: string;
  label: string;
  name: string;
  promise: string;
  description: string;
  visualType: HeroVisualType;
  accent: string;
  glowColor: string;
  href: string;
  sceneIndex?: number;
}

export const HERO_FAN_CARDS: HeroFanCard[] = [
  {
    id: "hero-llm",
    label: "Language AI",
    name: "LLM & Conversational AI",
    promise: "Language models that understand India's languages.",
    description:
      "Multilingual foundation reasoning with deep semantic understanding of Indian dialects and formal logic validation.",
    visualType: "language_streaming",
    accent: "#7EA4D4",
    glowColor: "rgba(126, 164, 212, 0.28)",
    href: "#chapter-3",
    sceneIndex: 0,
  },
  {
    id: "hero-sara",
    label: "Voice AI",
    name: "Sara",
    promise: "An AI voice agent that makes and answers calls like a person.",
    description:
      "Full-duplex conversational voice telephony with sub-120ms latency and real-time CRM telemetry integration.",
    visualType: "voice_waveform",
    accent: "#D28E9E",
    glowColor: "rgba(210, 142, 158, 0.28)",
    href: "#chapter-3",
    sceneIndex: 3,
  },
  {
    id: "hero-diya",
    label: "Digital marketing",
    name: "Diya",
    promise: "An AI marketing workforce for growing businesses.",
    description:
      "Autonomous creative campaign generation across copy, visual, and video with real-time ROAS optimization.",
    visualType: "growth_chart",
    accent: "#D69F68",
    glowColor: "rgba(214, 159, 104, 0.28)",
    href: "#chapter-3",
    sceneIndex: 4,
  },
  {
    id: "hero-saadhyam",
    label: "Foundation model",
    name: "Saadhyam",
    promise: "Our own foundation model.",
    description:
      "Pre-trained on verified domain corpus with native multi-modal tensor kernels, linear memory scaling, and zero hallucination drift.",
    visualType: "saadhyam_orb",
    accent: "#668CF0",
    glowColor: "rgba(102, 140, 240, 0.35)",
    href: "#chapter-3",
    sceneIndex: 2,
  },
  {
    id: "hero-saadhyam",
    label: "AI Workforce",
    name: "Saadhyam Platform",
    promise: "Build, deploy and manage AI Humans that work like employees at www.saadhyam.com.",
    description:
      "Digital employees for voice calling, sales, marketing, operations, legal research, and enterprise automation.",
    visualType: "ai_human_silhouette",
    accent: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.28)",
    href: "#chapter-6",
  },
  {
    id: "hero-iot",
    label: "IoT",
    name: "IoT & Embedded",
    promise: "Connected devices, sensors and smart hardware.",
    description:
      "Ultra-low-power firmware, telemetry streaming, and edge intelligence designed for resilient sovereign infrastructure.",
    visualType: "iot_nodes",
    accent: "#7DB299",
    glowColor: "rgba(125, 178, 153, 0.28)",
    href: "#chapter-5",
  },
  {
    id: "hero-chip",
    label: "Hardware, coming soon",
    name: "Neuro HGI Chip",
    promise: "Our upcoming 2.2 mm neuromorphic chip.",
    description:
      "Monolithic silicon substrate delivering 680 TFLOPS FP8 compute capacity within an 11.8-watt thermal budget.",
    visualType: "neuro_chip_render",
    accent: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.35)",
    href: "#chapter-4",
    sceneIndex: 8,
  },
];
