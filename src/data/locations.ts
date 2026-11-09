export interface LocationItem {
  id: string;
  city: string;
  country: string;
  role: string;
  status: string;
  lat: number;
  lng: number;
  coordinates: string;
  focus: string[];
  latency: string;
}

export const LOCATIONS: LocationItem[] = [
  {
    id: "hyderabad",
    city: "Hyderabad",
    country: "India",
    role: "Global Headquarters & Silicon Labs",
    status: "Primary R&D Foundry",
    lat: 17.385,
    lng: 78.4867,
    coordinates: "17.3850° N, 78.4867° E",
    focus: [
      "Neuro HGI Die Physical Design & Packaging",
      "Mentneo Foundation LLM Pre-training",
      "Real-time Neural Audio Synthesis",
    ],
    latency: "4.2 ms Core Interconnect",
  },
  {
    id: "kakinada",
    city: "Kakinada",
    country: "India",
    role: "Edge Compute & Sovereign Datacenter Campus",
    status: "Operational Tier-4 Enclave",
    lat: 16.9891,
    lng: 82.2475,
    coordinates: "16.9891° N, 82.2475° E",
    focus: [
      "Sovereign Air-Gapped Government Deployments",
      "Green-Energy Liquid-Cooled Cluster (Hydro-Backed)",
      "High-Density Distributed Vector Shards",
    ],
    latency: "6.8 ms Sovereign Transit",
  },
  {
    id: "san-francisco",
    city: "San Francisco",
    country: "United States",
    role: "Frontier Research & Ecosystem Alliances",
    status: "Research Office",
    lat: 37.7749,
    lng: -122.4194,
    coordinates: "37.7749° N, 122.4194° W",
    focus: [
      "Formal Logic Alignment & Mechanistic Interpretability",
      "Distributed Cluster Compute Partnerships",
      "Model Context Protocol (MCP) Standards Council",
    ],
    latency: "18.4 ms Trans-Pacific Mesh",
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    role: "European Enclaves & Regulatory Alignment",
    status: "European Operations",
    lat: 51.5074,
    lng: -0.1278,
    coordinates: "51.5074° N, 0.1278° W",
    focus: [
      "EU AI Act & Sovereign Enclave Cryptography",
      "Financial Services & Sovereign Wealth Deployments",
      "European Telephony Interoperability (Saadhyam)",
    ],
    latency: "12.1 ms Atlantic Fiber",
  },
];
