"use client";

import React, { useState, useEffect } from "react";
import { ProductItem } from "@/data/products";

export default function ProductVisualizer({ product }: { product: ProductItem }) {
  switch (product.interactiveType) {
    case "tensor":
      return <TensorVisualizer />;
    case "chat_reasoning":
      return <ChatReasoningVisualizer />;
    case "dsp_waveform":
      return <DspWaveformVisualizer />;
    case "rag_vector":
      return <RagVectorVisualizer />;
    case "studio_timeline":
      return <StudioTimelineVisualizer />;
    case "agent_dag":
      return <AgentDagVisualizer />;
    case "saadhyam_telemetry":
      return <SaadhyamTelemetryVisualizer />;
    default:
      return null;
  }
}

/* 01: Mentneo LLM - Tensor Matrix & Throughput Stream */
function TensorVisualizer() {
  const [tokensEmitted, setTokensEmitted] = useState(14820);
  const [activeHead, setActiveHead] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokensEmitted((prev) => prev + Math.floor(Math.random() * 5 + 3));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white/80">
            CLUSTER: H100_SXM5_8X · NODE_04
          </span>
        </div>
        <div className="font-mono text-xs text-[#7DD3FC]">
          {tokensEmitted.toLocaleString()} TOKENS EMITTED
        </div>
      </div>

      {/* Attention Heatmap Matrix */}
      <div className="my-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-2">
          <span>SPARSE-DENSE ROUTING MATRIX (128 EXPERTS)</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((h) => (
              <button
                key={h}
                onClick={() => setActiveHead(h)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  activeHead === h
                    ? "bg-[#7DD3FC] text-black font-semibold"
                    : "bg-white/5 text-white/50 hover:text-white"
                }`}
              >
                H0{h}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-16 gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
          {Array.from({ length: 64 }).map((_, i) => {
            const intensity = ((i * activeHead * 17) % 100) / 100;
            return (
              <div
                key={i}
                className="h-4 rounded-sm transition-all duration-300"
                style={{
                  backgroundColor: intensity > 0.4 ? "#7DD3FC" : "#ffffff",
                  opacity: Math.max(0.1, intensity),
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Real-time Kernel Stream Log */}
      <div className="font-mono text-[11px] text-white/60 space-y-1 bg-black/40 p-3 rounded-lg border border-white/5">
        <div className="flex justify-between">
          <span className="text-white/40">KERNEL: flash_attn_3_fwd_fp8</span>
          <span className="text-[#10B981]">0.84ms / batch</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">SPECULATIVE VERIFIER</span>
          <span className="text-white/90">Branch Consensus: 99.8%</span>
        </div>
      </div>
    </div>
  );
}

/* 02: Mentneo Chat - Dual Pane Reasoning & Proof Verification */
function ChatReasoningVisualizer() {
  const [proofStep, setProofStep] = useState(2);

  const steps = [
    { name: "Hypothesis_01", status: "VALID", time: "1.2ms" },
    { name: "Lemma_Tarski_FixedPoint", status: "VERIFIED", time: "2.4ms" },
    { name: "Invariant_Preservation", status: "SOLVED", time: "0.8ms" },
    { name: "Output_Emission_Lock", status: "APPROVED", time: "0.3ms" },
  ];

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      {/* Left: Input & Synthetic Synthesis */}
      <div className="flex flex-col justify-between border-r border-white/10 pr-4">
        <div>
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wideMono block mb-1">
            QUERY INTAKE
          </span>
          <p className="text-xs text-white/90 font-mono bg-white/[0.03] p-2.5 rounded border border-white/5">
            &quot;Formulate inductive proof for topological convergence in distributed state consensus under Byzantine conditions.&quot;
          </p>
        </div>
        <div className="mt-3">
          <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wideMono block mb-1">
            OUTPUT COMMITMENT
          </span>
          <p className="text-xs text-white/70 leading-relaxed font-mono">
            Lemma proved via Lean4 kernel: Under bounded clock drift δ &lt; 4ms, the fixed-point lattice preserves monotonic progression with probability 1.0.
          </p>
        </div>
        <div className="pt-2 font-mono text-[10px] text-white/40 flex justify-between">
          <span>LATENCY: 11.2ms</span>
          <span className="text-[#10B981]">HALLUCINATION CHECK: 0.00%</span>
        </div>
      </div>

      {/* Right: Formal Proof Tree */}
      <div className="flex flex-col justify-between pl-0 md:pl-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wideMono">
            LEAN4 / MONTE CARLO PROOF TREE
          </span>
          <button
            onClick={() => setProofStep((prev) => (prev >= 3 ? 0 : prev + 1))}
            className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Step ({proofStep + 1}/4)
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((st, i) => (
            <div
              key={st.name}
              className={`p-2 rounded border transition-colors flex items-center justify-between font-mono text-[11px] ${
                i <= proofStep
                  ? "bg-white/[0.04] border-white/20 text-white"
                  : "bg-white/[0.01] border-white/5 text-white/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>{st.name}</span>
              </div>
              <span className="text-[10px] text-white/50">{st.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-white/10 font-mono text-[10px] text-white/50 flex justify-between">
          <span>BRANCHES EVALUATED</span>
          <span className="text-white">32 PATHS/SEC</span>
        </div>
      </div>
    </div>
  );
}

/* 03: Mentneo Voice - Full Duplex Acoustic Waveform */
function DspWaveformVisualizer() {
  const [interrupted, setInterrupted] = useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white">
            DIRECT ACOUSTIC SYNTHESIS · 48KHZ / 24-BIT
          </span>
        </div>
        <button
          onClick={() => {
            setInterrupted(true);
            setTimeout(() => setInterrupted(false), 1200);
          }}
          className="px-3 py-1 rounded bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 font-mono text-[10px] text-[#38BDF8] transition-colors"
        >
          {interrupted ? "INTERRUPTING..." : "TRIGGER VOICE INTERRUPT"}
        </button>
      </div>

      {/* Dual Waveforms: Model Output & User Speech */}
      <div className="my-6 space-y-4">
        <div>
          <div className="flex justify-between font-mono text-[10px] text-white/40 mb-1">
            <span>MODEL AUDIO EMISSION (SUB-120MS)</span>
            <span className={interrupted ? "text-[#F59E0B]" : "text-[#38BDF8]"}>
              {interrupted ? "INSTANT BACK-OFF (-68dB)" : "ACTIVE STREAMING"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 h-16 bg-white/[0.02] p-2 rounded-lg border border-white/5">
            {Array.from({ length: 36 }).map((_, i) => {
              const baseHeight = interrupted ? 10 : 25 + Math.sin(i * 0.4) * 35 + 30;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all duration-150"
                  style={{
                    height: `${baseHeight}%`,
                    backgroundColor: interrupted ? "#F59E0B" : "#38BDF8",
                    opacity: 0.3 + (i % 5) * 0.15,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-between font-mono text-[10px] text-white/40 mb-1">
            <span>USER MICROPHONE INPUT (ACOUSTIC ECHO CANCELLATION)</span>
            <span className="text-white/60">GAIN: +3.2 dB</span>
          </div>
          <div className="flex items-center gap-1.5 h-8 bg-white/[0.01] p-1.5 rounded border border-white/5">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-white/20 transition-all"
                style={{
                  height: interrupted ? `${40 + ((i * 11) % 60)}%` : "15%",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Telemetry Bottom */}
      <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-white/50 border-t border-white/10 pt-3">
        <div>
          <span className="block text-white/30">ROUND TRIP</span>
          <span className="text-white font-semibold">118 ms</span>
        </div>
        <div>
          <span className="block text-white/30">DSP BACK-OFF</span>
          <span className="text-[#38BDF8] font-semibold">42 ms</span>
        </div>
        <div>
          <span className="block text-white/30">NOISE FLOOR</span>
          <span className="text-white font-semibold">-68 dB</span>
        </div>
      </div>
    </div>
  );
}

/* 04: Mentneo Search - High-Dimensional Vector Space & Rerank */
function RagVectorVisualizer() {
  const [selectedDoc, setSelectedDoc] = useState(0);

  const candidates = [
    { title: "Sec_10K_AirGap_Protocol.pdf", score: "0.984", latency: "1.4ms", type: "Dense" },
    { title: "FedRAMP_High_Audit_2025.tar", score: "0.941", latency: "2.1ms", type: "Cross-Enc" },
    { title: "Silicon_Die_Interconnect_Spec.xml", score: "0.892", latency: "1.3ms", type: "BM25+HNSW" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white">
            10B+ VECTOR TOPOGRAPHY (HNSW + FLASH-RANK)
          </span>
        </div>
        <span className="font-mono text-xs text-[#10B981]">P99: 4.8ms</span>
      </div>

      {/* Vector Match Candidates */}
      <div className="my-4 space-y-2">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wideMono block">
          RERANKED SPAN RESULTS (100% BYTE-EXACT CITATION)
        </span>
        {candidates.map((cand, i) => (
          <div
            key={cand.title}
            onClick={() => setSelectedDoc(i)}
            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              selectedDoc === i
                ? "bg-[#10B981]/10 border-[#10B981]/40 text-white"
                : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#10B981]">{cand.score}</span>
              <div>
                <p className="font-mono text-xs">{cand.title}</p>
                <p className="font-mono text-[9px] text-white/40">{cand.type} Index</p>
              </div>
            </div>
            <span className="font-mono text-[10px] text-white/40">{cand.latency}</span>
          </div>
        ))}
      </div>

      {/* Active Snippet Grounding */}
      <div className="p-3 rounded bg-white/[0.02] border border-white/10 font-mono text-[10px] text-white/70">
        <div className="text-white/40 mb-1 flex justify-between">
          <span>GROUNDED CITATION (EXACT BYTES 40182 - 40490)</span>
          <span className="text-[#10B981]">SHA-256 MATCHED</span>
        </div>
        <p className="text-white/80 line-clamp-2">
          &quot;...enclave cryptographic boundary completely isolates cryptographic signing keys within isolated hardware SRAM with zero off-die leakage...&quot;
        </p>
      </div>
    </div>
  );
}

/* 05: Mentneo Studio - 4K Video Scrubber & Geometry Consistency */
function StudioTimelineVisualizer() {
  const [frame, setFrame] = useState(48);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white">
            SPATIO-TEMPORAL DIT · 4K DCI @ 60FPS
          </span>
        </div>
        <span className="font-mono text-xs text-[#F59E0B]">
          FRAME {String(frame).padStart(3, "0")} / 120
        </span>
      </div>

      {/* Simulated 4K Cinematic Viewport */}
      <div className="relative my-4 h-44 rounded-lg border border-white/10 bg-[#0E0D0B] overflow-hidden flex items-center justify-center">
        {/* Abstract Product Render Consistency Canvas */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Wireframe Geometry that shifts smoothly with frame scrub */}
          <div
            className="w-32 h-32 border border-[#F59E0B]/40 rounded-lg flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `rotate(${frame * 1.5}deg) scale(${1 + (frame % 20) * 0.005})`,
            }}
          >
            <div className="w-20 h-20 border border-white/30 rounded-md flex items-center justify-center">
              <span className="font-mono text-[9px] text-[#F59E0B]">
                CAD_LOCK
              </span>
            </div>
          </div>
          {/* Subtle lighting gradient */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-100"
            style={{
              background: `radial-gradient(circle at ${30 + (frame / 120) * 40}% 40%, rgba(245,158,11,0.18), transparent 70%)`,
            }}
          />
        </div>
        <div className="absolute top-2 right-2 font-mono text-[9px] px-2 py-0.5 rounded bg-black/70 border border-white/10 text-white/80">
          DRIFT &lt; 0.02 mm
        </div>
      </div>

      {/* Frame Scrubber Control */}
      <div>
        <div className="flex justify-between font-mono text-[10px] text-white/40 mb-1">
          <span>TIMELINE SCRUB (PRORES 4444 XQ)</span>
          <span className="text-white/80">COLOR: ACEScg 12-BIT</span>
        </div>
        <input
          type="range"
          min={0}
          max={120}
          value={frame}
          onChange={(e) => setFrame(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
        />
      </div>
    </div>
  );
}

/* 06: Autonomous Agents - DAG Self-Healing Consensus */
function AgentDagVisualizer() {
  const [activeNode, setActiveNode] = useState(2);

  const nodes = [
    { id: "A", title: "Task Decomp", status: "VERIFIED" },
    { id: "B", title: "Sandbox Exec", status: "VERIFIED" },
    { id: "C", title: "MicroVM Test", status: "RETRY_HEALED" },
    { id: "D", title: "Consensus Quorum", status: "ACTIVE" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white">
            ASYNC DAG SWARM · 50,000+ NODES
          </span>
        </div>
        <span className="font-mono text-xs text-[#60A5FA]">SELF-HEALING: 96.4%</span>
      </div>

      {/* Directed Acyclic Graph Nodes */}
      <div className="my-4 grid grid-cols-4 gap-2">
        {nodes.map((n, i) => (
          <div
            key={n.id}
            onClick={() => setActiveNode(i)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
              activeNode === i
                ? "bg-[#60A5FA]/15 border-[#60A5FA]/60 text-white"
                : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/30"
            }`}
          >
            <span className="font-mono text-xs font-bold block mb-1">
              NODE_{n.id}
            </span>
            <span className="text-[10px] block text-white/90 truncate">{n.title}</span>
            <span
              className={`font-mono text-[9px] mt-1 block ${
                n.status === "RETRY_HEALED"
                  ? "text-[#F59E0B]"
                  : n.status === "ACTIVE"
                  ? "text-[#60A5FA]"
                  : "text-[#10B981]"
              }`}
            >
              {n.status}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Sandbox Execution Log */}
      <div className="p-3 rounded bg-black/70 border border-white/5 font-mono text-[10px] space-y-1">
        <div className="text-white/40 flex justify-between">
          <span>GVISOR MICROVM #8919</span>
          <span className="text-[#10B981]">ZERO PRIVILEGE ESCALATION</span>
        </div>
        <p className="text-[#60A5FA]">
          [SWARM] Agent_03 detected assertion violation on line 42. Auto-generating AST fix...
        </p>
        <p className="text-white/80">
          [HEALED] Mutation candidate passes 14/14 unit tests. Committing to consensus lattice.
        </p>
      </div>
    </div>
  );
}

/* 07: Saadhyam - Enterprise Voice Telephony Console */
function SaadhyamTelemetryVisualizer() {
  const [activeCalls, setActiveCalls] = useState(104812);

  useEffect(() => {
    const int = setInterval(() => {
      setActiveCalls((prev) => prev + Math.floor(Math.random() * 7 - 3));
    }, 400);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white">
            SAADHYAM TELEPHONY KERNEL · SIP TRUNK
          </span>
        </div>
        <span className="font-mono text-xs text-white">
          {activeCalls.toLocaleString()} CONCURRENT CALLS
        </span>
      </div>

      {/* Real-time Call Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
        <div className="p-2.5 rounded bg-white/[0.03] border border-white/10 text-center">
          <span className="font-mono text-[9px] text-white/40 uppercase block">RESOLUTION</span>
          <span className="font-mono text-sm font-bold text-white">88.7%</span>
          <span className="text-[9px] text-white/40 block">Zero human handoff</span>
        </div>
        <div className="p-2.5 rounded bg-white/[0.03] border border-white/10 text-center">
          <span className="font-mono text-[9px] text-white/40 uppercase block">SENTIMENT</span>
          <span className="font-mono text-sm font-bold text-[#10B981]">94.2%</span>
          <span className="text-[9px] text-white/40 block">Real-time pitch DSP</span>
        </div>
        <div className="p-2.5 rounded bg-white/[0.03] border border-white/10 text-center">
          <span className="font-mono text-[9px] text-white/40 uppercase block">DIALECT FIDELITY</span>
          <span className="font-mono text-sm font-bold text-white">24</span>
          <span className="text-[9px] text-white/40 block">Vernacular accents</span>
        </div>
        <div className="p-2.5 rounded bg-white/[0.03] border border-white/10 text-center">
          <span className="font-mono text-[9px] text-white/40 uppercase block">CRM SYNC</span>
          <span className="font-mono text-sm font-bold text-[#7DD3FC]">&lt; 180ms</span>
          <span className="text-[9px] text-white/40 block">Salesforce & SAP</span>
        </div>
      </div>

      {/* Real-time Voice Call Telemetry Stream */}
      <div className="p-3 rounded bg-white/[0.02] border border-white/10 font-mono text-[10px] space-y-1">
        <div className="text-white/40 flex justify-between">
          <span>LINE_ID: #IN-TEL-90812 · HYD_GATEWAY</span>
          <span className="text-[#10B981]">SIP 200 OK</span>
        </div>
        <p className="text-white/90">
          Caller inquiry: &quot;Please reschedule bulk solar inverter delivery to Kakinada manufacturing unit.&quot;
        </p>
        <div className="text-white/50 flex justify-between pt-1 border-t border-white/5">
          <span>INTENT: RESCHEDULE_DISPATCH</span>
          <span className="text-[#7DD3FC]">ERP DB UPDATED</span>
        </div>
      </div>
    </div>
  );
}
