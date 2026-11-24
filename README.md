# Stark Industries — J.A.R.V.I.S. LLM Pipeline Explorer
### Mark LXXXV Tactical 3D HUD Edition

Interactive 3D visualization and analysis suite for Transformer Large Language Models, rebuilt in an authentic **Iron Man / Stark Industries / J.A.R.V.I.S. Tactical HUD** theme.

Inspired by [Nexus AI LLM Pipeline](https://nexus-ai-llm-pipeline.vercel.app/).

---

## 🚀 Features

- **Mark-LXXXV Tactical UI**: Stark Crimson, Hot-Rod Gold, Arc Reactor Cyan, and Titanium Carbon aesthetic with tactical reticles, HUD corner framing, and live telemetry status readouts.
- **Animated Arc Reactor**: Multi-tier orbital rings with rotating segmented cyan conduits and a pulsing vibranium core.
- **Web Audio API Tactical Sound Synthesizer**: Native audio synthesis providing JARVIS tactical clicks, repulsor blast execution sounds, and target lock alerts.
- **Interactive 5-Stage LLM Pipeline**:
  1. **Discrete Tokenization**: Byte-Pair Encoding (BPE) subword splitting, token frequency metrics, byte sizes, and interactive token inspector.
  2. **Positional Encodings**: Sinusoidal sequence encoding ($PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d})$) with interactive dimension breakdown.
  3. **High-Dimensional Vector Embeddings**: Continuous 16-D vector space, 2D Tensor Heatmap, Cosine Similarity matrix, and a 3D Three.js Universe with floating Arc Reactor token nodes.
  4. **Scaled Dot-Product Multi-Head Attention**: 4 attention heads, Query/Key/Value subspace projections, 2D attention weight heatmap, Causal attention mask switch (BERT vs GPT), threshold slider, and 3D glowing repulsor attention arcs.
  5. **Softmax & Next-Token Decoding**: Logits scaling, dynamic Temperature slider ($0.1$ to $1.8$), Shannon Entropy uncertainty gauge, and an autoregressive append button to recursively generate text.
- **Stark Telemetry Console**: Live event stream with timestamps, severity levels, and clipboard export.
- **Theory of LLMs Compendium**: Holographic knowledge base modal with 8 deep-dive curriculum modules featuring LaTeX formulas rendered via KaTeX.

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (Custom Stark Industries HUD Theme)
- **Three.js** (3D Vector Universe & 3D Attention Arcs)
- **Lucide Icons**
- **KaTeX** (Mathematical formula rendering)
- **Canvas Confetti**
- **Web Audio API** (Sound design)

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Dhanraj-singh1/LLM-Pipeline-Explorer.git

# Enter the project directory
cd LLM-Pipeline-Explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the interface.

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 📜 License

MIT License. Designed for Stark Industries Tactical Computing.
