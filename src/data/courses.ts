export interface CourseItem {
  id: string;
  code: string;
  title: string;
  level: string;
  duration: string;
  modules: number;
  description: string;
  syllabus: string[];
  prerequisites: string;
}

export const COURSES: CourseItem[] = [
  {
    id: "kernel-engineering",
    code: "ML-801",
    title: "Kernel Engineering for LLMs",
    level: "Advanced",
    duration: "10 Weeks",
    modules: 12,
    description:
      "Write bare-metal GPU kernels from scratch. Master Triton, CUDA memory hierarchies, warp-level primitives, and custom FlashAttention-3 operators for frontier model architectures.",
    syllabus: [
      "GPU Architecture & Thread Block Cluster Scheduling",
      "SRAM Shared Memory Banks & Coalesced Memory Access",
      "FlashAttention-3 Forward & Backward Kernel Implementation",
      "FP8 Tensor Core GEMM & Dynamic Quantization Kernels",
    ],
    prerequisites: "C++, Systems Programming, Matrix Calculus",
  },
  {
    id: "post-training-rlhf",
    code: "ML-802",
    title: "Post-Training: RLHF, DPO & Speculative Alignment",
    level: "Advanced",
    duration: "8 Weeks",
    modules: 8,
    description:
      "Go beyond base pretraining. Learn reward model training, Direct Preference Optimization (DPO), Kahneman-Tversky Optimization (KTO), and Monte Carlo Tree Search verification.",
    syllabus: [
      "Bradley-Terry Preference Modeling & Implicit Reward Dynamics",
      "DPO vs PPO: Loss Formulations & Stability Bounds",
      "Speculative Decoding with Small Verifier Models",
      "Formal Logic Alignment via Synthetic Verification Enclaves",
    ],
    prerequisites: "PyTorch, Transformers, Probability & Optimization",
  },
  {
    id: "distributed-inference",
    code: "ML-704",
    title: "High-Throughput Distributed Inference",
    level: "Intermediate / Advanced",
    duration: "6 Weeks",
    modules: 7,
    description:
      "Architect multi-node inference clusters serving millions of concurrent requests. PagedAttention, continuous batching, pipeline and tensor parallelization across NVLink clusters.",
    syllabus: [
      "PagedAttention & Virtual Memory KV-Cache Management",
      "Continuous Batching & Chunked Prefill Algorithms",
      "Tensor, Pipeline, and Sequence Parallelism (Megatron-LM)",
      "vLLM & TensorRT-LLM Internal Engine Internals",
    ],
    prerequisites: "Linux Internals, Distributed Systems, Python",
  },
  {
    id: "agentic-swarms",
    code: "ML-603",
    title: "Agentic Swarm Orchestration & Tool DAGs",
    level: "Intermediate",
    duration: "6 Weeks",
    modules: 6,
    description:
      "Design deterministic multi-agent swarms with self-healing DAG execution, Model Context Protocol (MCP) tool integration, Byzantine consensus, and cryptographic state tracking.",
    syllabus: [
      "State Machines & Directed Acyclic Execution Graphs",
      "Model Context Protocol (MCP) Tool Calling Standard",
      "Multi-Agent Consensus, Escalation & Dynamic Self-Healing",
      "Sandboxed Code Execution via MicroVMs & gVisor",
    ],
    prerequisites: "Python, Async Programming, Graph Data Structures",
  },
  {
    id: "neuromorphic-silicon",
    code: "ML-905",
    title: "Neuromorphic & Photonic Silicon Architectures",
    level: "Specialized Frontier",
    duration: "12 Weeks",
    modules: 14,
    description:
      "Explore non-von-Neumann computing paradigms. Spiking neural networks, sub-milliwatt analog matrix-vector multipliers, and photonic interconnects for the 2.2 mm Neuro HGI class.",
    syllabus: [
      "Spike-Timing-Dependent Plasticity (STDP) in Silicon",
      "Crossbar Array Memristive Matrix Multipliers",
      "Photonic Waveguide Interconnects & Sub-Picosecond Latency",
      "Thermal & Power Budgeting in 2.2 mm Die Packaging",
    ],
    prerequisites: "VLSI Basics, Digital Circuit Design, Signal Processing",
  },
];
