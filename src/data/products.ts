export interface ProductMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProductItem {
  id: string;
  index: string;
  name: string;
  tagline: string;
  category: string;
  headline: string;
  description: string;
  accent: string;
  bgShade: string;
  metrics: ProductMetric[];
  status: string;
  interactiveType:
    | "tensor"
    | "chat_reasoning"
    | "dsp_waveform"
    | "rag_vector"
    | "studio_timeline"
    | "agent_dag"
    | "saadhyam_telemetry";
  specs: { label: string; value: string }[];
}

export const PRODUCTS: ProductItem[] = [
  {
    id: "mentneo-llm",
    index: "01",
    name: "Mentneo LLM",
    tagline: "Frontier Foundation Architecture",
    category: "Foundation Models",
    headline: "Deterministic reasoning at tensor scale.",
    description:
      "A dense-sparse hybrid transformer trained from ground zero on sovereign corpus. Features dynamic speculative decoding, formal logic verification gates, and native multi-modal tensor kernels designed for zero-hallucination enterprise synthesis.",
    accent: "#7DA4D8", // Refined Ice Slate
    bgShade: "#07080A",
    status: "v3.4 Production Ready",
    metrics: [
      { label: "Token Throughput", value: "318 tok/s", detail: "On H100 SXM5 8-way" },
      { label: "Context Window", value: "1.2M tokens", detail: "Linear memory scaling" },
      { label: "Hallucination Delta", value: "< 0.08%", detail: "Benchmarked on FactTruth" },
    ],
    interactiveType: "tensor",
    specs: [
      { label: "Architecture", value: "MoE 128E / 16A active" },
      { label: "Precision", value: "FP8 / INT4 Hybrid Quant" },
      { label: "Inference Latency", value: "11.2ms TTFT" },
      { label: "Alignment", value: "Direct Preference DPO + RLAIF" },
    ],
  },
  {
    id: "mentneo-chat",
    index: "02",
    name: "Mentneo Chat",
    tagline: "Auditable Reasoning Workspace",
    category: "Conversational Cognition",
    headline: "Dual-pane thought inspection with source proofs.",
    description:
      "Every response exposes its internal tree-of-thought graph before output commitment. Users and engineers verify intermediate hypotheses, inspect mathematical proofs, and pinpoint exact source citations in real time.",
    accent: "#8EA0B8", // Platinum Slate
    bgShade: "#0A0C0F",
    status: "Enterprise GA",
    metrics: [
      { label: "Proof Verification", value: "99.94%", detail: "Formal Lean4 solver check" },
      { label: "Branch Exploration", value: "32 paths/sec", detail: "Monte Carlo tree search" },
      { label: "Telemetry Egress", value: "0 bytes", detail: "Air-gapped safe" },
    ],
    interactiveType: "chat_reasoning",
    specs: [
      { label: "Interference Guard", value: "Cryptographic Attestation" },
      { label: "Workspace Mode", value: "Multi-Session Ephemeral" },
      { label: "Branch Control", value: "Interactive Forking" },
      { label: "Export Standard", value: "SARIF & Markdown Provenance" },
    ],
  },
  {
    id: "mentneo-voice",
    index: "03",
    name: "Mentneo Voice",
    tagline: "Sub-120ms Full-Duplex DSP",
    category: "Acoustic Intelligence",
    headline: "Conversational presence with acoustic physics.",
    description:
      "Direct neural audio synthesis without intermediate text-to-speech hops. Operates full duplex with semantic interruption handling, breath modeling, prosody modulation, and room-acoustic reverberation matching.",
    accent: "#2F5BFF", // Signature Electric Blue
    bgShade: "#0E1013",
    status: "Low-Latency Kernel v2",
    metrics: [
      { label: "End-to-End Latency", value: "118 ms", detail: "Mic to speaker round-trip" },
      { label: "Interruption Detection", value: "42 ms", detail: "Instant DSP back-off" },
      { label: "Sample Precision", value: "48 kHz / 24-bit", detail: "Uncompressed lossless" },
    ],
    interactiveType: "dsp_waveform",
    specs: [
      { label: "Duplex Mode", value: "Binaural Full-Duplex" },
      { label: "Acoustic Engine", value: "Direct WaveNet Neural DSP" },
      { label: "Languages", value: "28 Sovereign & Regional" },
      { label: "Noise Floor", value: "-68 dB cancellation" },
    ],
  },
  {
    id: "mentneo-search",
    index: "04",
    name: "Mentneo Search (RAG)",
    tagline: "Deterministic Vector Topography",
    category: "Retrieval & Grounding",
    headline: "Sub-millisecond retrieval with geometric rerank.",
    description:
      "Combines dense 1536-dimensional semantic embeddings with sparse BM25 lexical constraints and neural cross-encoders. Guarantees deterministic recall across billions of technical documents, contracts, and clinical records.",
    accent: "#7EB8A2", // Sovereign Sage
    bgShade: "#080C0A",
    status: "Distributed Cluster v4",
    metrics: [
      { label: "Index Scale", value: "10B+ vectors", detail: "HNSW multi-sharded" },
      { label: "P99 Query Time", value: "4.8 ms", detail: "SIMD AVX-512 accelerated" },
      { label: "Citation Accuracy", value: "100%", detail: "Direct span byte-matching" },
    ],
    interactiveType: "rag_vector",
    specs: [
      { label: "Vector Index", value: "Native C++ HNSW / ScaNN" },
      { label: "Reranker", value: "Cross-Encoder FlashRank" },
      { label: "Ingestion Rate", value: "125k docs / min" },
      { label: "Data Sovereign", value: "On-Prem / S3 Compatible" },
    ],
  },
  {
    id: "mentneo-studio",
    index: "05",
    name: "Mentneo Studio",
    tagline: "Coherent Generative Ad & Video Engine",
    category: "Generative Video & Media",
    headline: "Temporal consistency across frames and product geometry.",
    description:
      "Engineered for high-end advertising, product visualization, and cinematic sequence synthesis. Preserves exact CAD dimensions, lighting topology, and typography across 4K HDR 60fps frame generation without morphing artifacts.",
    accent: "#C49F6E", // Muted Ochre
    bgShade: "#0E0D0B",
    status: "Cinematic Beta",
    metrics: [
      { label: "Frame Consistency", value: "99.8%", detail: "Optical flow trajectory loss" },
      { label: "Output Resolution", value: "4K DCI @ 60fps", detail: "ProRes 4444 XQ" },
      { label: "Geometry Drift", value: "< 0.02 mm", detail: "CAD boundary constraint" },
    ],
    interactiveType: "studio_timeline",
    specs: [
      { label: "Temporal Model", value: "Diffusion Spatio-Temporal DiT" },
      { label: "Color Space", value: "ACEScg / Rec.2020 12-bit" },
      { label: "Camera Control", value: "6-DOF Motion Vector Control" },
      { label: "Rendering Farm", value: "Auto-Scaling Distributed Ray" },
    ],
  },
  {
    id: "autonomous-agents",
    index: "06",
    name: "Autonomous Agents",
    tagline: "Self-Healing DAG Orchestration",
    category: "Agentic Systems",
    headline: "Deterministic multi-agent swarms with formal consensus.",
    description:
      "Deploys autonomous swarms of specialized sub-agents that plan, execute, verify, and self-heal complex multi-stage tasks. Operates with explicit sandboxing, cryptographic auditing, and formal human-in-the-loop escalation gates.",
    accent: "#7899E8", // Cobalt Slate
    bgShade: "#0B0E14",
    status: "Swarm Orchestrator v2.1",
    metrics: [
      { label: "Self-Healing Rate", value: "96.4%", detail: "Automated retry & branch repair" },
      { label: "Max DAG Nodes", value: "50,000+", detail: "Asynchronous task graph" },
      { label: "Sandbox Isolation", value: "MicroVM / gVisor", detail: "Zero privilege escalation" },
    ],
    interactiveType: "agent_dag",
    specs: [
      { label: "Execution Graph", value: "Directed Acyclic Directed Graph" },
      { label: "Consensus Model", value: "Byzantine Fault Tolerant Voting" },
      { label: "Tool Connectivity", value: "MCP / OpenAPI / GraphQL" },
      { label: "Memory Subsystem", value: "Hierarchical Episodic Vector" },
    ],
  },
  {
    id: "saadhyam",
    index: "07",
    name: "Saadhyam",
    tagline: "Autonomous Voice Calling Agent",
    category: "Enterprise Voice Agents",
    headline: "Mission-critical outbound & inbound enterprise telephony.",
    description:
      "Enterprise-grade autonomous telephone intelligence capable of managing 100,000 concurrent calls. Features sub-second CRM telemetry sync, multi-lingual vernacular dialect adaptation, and real-time regulatory compliance scrubbing.",
    accent: "#8EA0B8", // Platinum Titanium
    bgShade: "#101216",
    status: "Enterprise Production",
    metrics: [
      { label: "Concurrent Lines", value: "100k+", detail: "Elastic SIP trunking" },
      { label: "Call Resolution", value: "88.7%", detail: "Zero human intervention required" },
      { label: "Dialect Fidelity", value: "24 Accents", detail: "Native cadence preservation" },
    ],
    interactiveType: "saadhyam_telemetry",
    specs: [
      { label: "Telephony Stack", value: "WebRTC / SIP Trunk Carrier" },
      { label: "CRM Integrations", value: "Salesforce / SAP / Zendesk" },
      { label: "Compliance", value: "TRAI, FCC, GDPR, HIPAA Ready" },
      { label: "Sentiment Scoring", value: "10Hz Acoustic Pitch Analysis" },
    ],
  },
];
