/**
 * LLM Pipeline Mathematical Engine
 * Implements Tokenization, Sinusoidal Positional Encoding,
 * High-Dimensional Embeddings, Multi-Head Attention (QKV),
 * Causal Masking, and Softmax Next-Token Probability Generation.
 */

// 32-bit Murmur-inspired string hash for deterministic parameter generation
export function hashString(str, seed = 0) {
  let h = seed ^ 3735928559;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

// Deterministic pseudo-random float in [0, 1)
export function pseudoRandom(seed) {
  const s = Math.sin(seed) * 10000;
  return s - Math.floor(s);
}

// Vector Dot Product
export function dotProduct(a, b) {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

// Vector Euclidean Norm (L2)
export function vectorNorm(v) {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

// Cosine Similarity between two vectors
export function cosineSimilarity(a, b) {
  const normA = vectorNorm(a);
  const normB = vectorNorm(b);
  if (normA === 0 || normB === 0) return 0;
  return dotProduct(a, b) / (normA * normB);
}

// Iron Man / Stark Industries Palette for Tokens
const STARK_TOKEN_COLORS = [
  "#ffd700", // Stark Gold
  "#ef4444", // Stark Red
  "#00f5ff", // Arc Cyan
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#38bdf8", // Sky Blue
  "#eab308", // Yellow Gold
  "#fb7185", // Crimson Light
  "#14b8a6", // Teal
  "#a855f7", // Violet
];

/**
 * Stage 01 & 02: Tokenization & Embedding Pipeline
 * Breaks prompt into subwords (Byte-Pair style), generates
 * raw embeddings, computes sinusoidal PE, and creates 3D topological coordinates.
 */
export function processTokens(promptText) {
  let text = promptText;
  if (!text || text.trim().length === 0) {
    text = "Attention is all you need";
  }

  // Split into words, punctuation, and spaces
  const rawTokens = text.match(/\w+|[^\w\s]|\s+/g) || [text];
  const tokens = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const raw = rawTokens[i];
    if (raw.trim() === "") {
      // Space prefix for following token
      if (i + 1 < rawTokens.length) {
        rawTokens[i + 1] = " " + rawTokens[i + 1];
      }
      continue;
    }

    const clean = raw.replace(/\s+/g, "");
    // Subword splitting for longer words (mimicking Byte-Pair Encoding)
    const isCommonWord = ["attention", "language", "intelligence", "transformer"].includes(clean.toLowerCase());
    if (clean.length > 7 && /^[A-Za-z]+$/.test(clean) && !isCommonWord) {
      const splitIdx = Math.floor(clean.length * 0.55);
      const part1 = raw.startsWith(" ") ? " " + clean.slice(0, splitIdx) : clean.slice(0, splitIdx);
      const part2 = "##" + clean.slice(splitIdx);
      tokens.push({ text: part1, cleanText: clean.slice(0, splitIdx) });
      tokens.push({ text: part2, cleanText: clean.slice(splitIdx) });
    } else {
      tokens.push({ text: raw, cleanText: clean });
    }
  }

  // Count frequencies
  const freqMap = new Map();
  tokens.forEach(t => {
    const key = t.cleanText.toLowerCase();
    freqMap.set(key, (freqMap.get(key) || 0) + 1);
  });

  const dim = 16; // 16-dimensional embedding model representation

  return tokens.map((tokenObj, idx) => {
    const tokenHash = hashString(tokenObj.cleanText);
    const color = STARK_TOKEN_COLORS[idx % STARK_TOKEN_COLORS.length];

    // 1. Raw Semantic Embedding
    const rawEmbedding = [];
    for (let d = 0; d < dim; d++) {
      const val = (pseudoRandom(hashString(`${tokenObj.cleanText}_raw_${d}`, 42)) * 2 - 1) * 0.9;
      rawEmbedding.push(parseFloat(val.toFixed(4)));
    }

    // 2. Sinusoidal Positional Encoding
    // PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
    const positionalEmbedding = [];
    for (let d = 0; d < dim; d++) {
      const iVal = Math.floor(d / 2);
      const divTerm = Math.pow(10000, (2 * iVal) / dim);
      const peVal = d % 2 === 0 
        ? Math.sin(idx / divTerm) 
        : Math.cos(idx / divTerm);
      positionalEmbedding.push(parseFloat(peVal.toFixed(4)));
    }

    // 3. Combined Final Embedding = Raw + Positional
    const finalEmbedding = rawEmbedding.map((rVal, d) => {
      const combined = (rVal * 0.65 + positionalEmbedding[d] * 0.35);
      return parseFloat(combined.toFixed(4));
    });

    // 4. 3D Coordinates for Interactive Three.js Universe
    // Project high-dimensional vectors to 3D space with deterministic PCA-like layout
    const x = (finalEmbedding[0] * 3.5 + finalEmbedding[1] * 2.0 + Math.sin(idx * 0.8) * 1.5);
    const y = (finalEmbedding[2] * 3.0 + finalEmbedding[3] * 1.8 + Math.cos(idx * 0.8) * 1.2);
    const z = (finalEmbedding[4] * 3.5 + finalEmbedding[5] * 2.2 + (idx - tokens.length / 2) * 0.7);

    return {
      id: `token-${idx}-${tokenObj.cleanText}`,
      index: idx,
      text: tokenObj.text,
      cleanText: tokenObj.cleanText,
      position: idx,
      frequency: freqMap.get(tokenObj.cleanText.toLowerCase()) || 1,
      color,
      rawEmbedding,
      positionalEmbedding,
      finalEmbedding,
      coords3D: [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2)), parseFloat(z.toFixed(2))]
    };
  });
}

/**
 * Stage 03: Multi-Head Scaled Dot-Product Attention Engine
 * Projects tokens into Query, Key, Value spaces across H heads,
 * scales by sqrt(d_k), computes attention matrix, applies causal mask,
 * and extracts top connections.
 */
export function computeMultiHeadAttention(tokens, causalMask = false, numHeads = 4) {
  const n = tokens.length;
  if (n === 0) {
    return { heads: [], averageMatrix: [], topConnections: [] };
  }

  const dModel = 16;
  const dK = dModel / numHeads; // 4 dimensions per head
  const scale = Math.sqrt(dK);

  const headDescriptions = [
    "Head 1: Syntactic Relations & Grammar Flow",
    "Head 2: Semantic Alignment & Context Pairing",
    "Head 3: Positional Proximity & Local Window",
    "Head 4: Long-Range Cross-Token Dependencies"
  ];

  const heads = [];

  for (let h = 0; h < numHeads; h++) {
    // Generate projection weight matrices W_Q, W_K, W_V
    const W_Q = [], W_K = [], W_V = [];
    for (let r = 0; r < dModel; r++) {
      W_Q[r] = []; W_K[r] = []; W_V[r] = [];
      for (let c = 0; c < dK; c++) {
        W_Q[r][c] = (pseudoRandom(hashString(`h${h}_wq_${r}_${c}`, 101)) * 2 - 1) * 0.5;
        W_K[r][c] = (pseudoRandom(hashString(`h${h}_wk_${r}_${c}`, 202)) * 2 - 1) * 0.5;
        W_V[r][c] = (pseudoRandom(hashString(`h${h}_wv_${r}_${c}`, 303)) * 2 - 1) * 0.5;
      }
    }

    // Compute Q, K, V for each token
    const Q = [], K = [], V = [];
    for (let i = 0; i < n; i++) {
      const emb = tokens[i].finalEmbedding;
      Q[i] = []; K[i] = []; V[i] = [];
      for (let c = 0; c < dK; c++) {
        let qVal = 0, kVal = 0, vVal = 0;
        for (let r = 0; r < dModel; r++) {
          qVal += emb[r] * W_Q[r][c];
          kVal += emb[r] * W_K[r][c];
          vVal += emb[r] * W_V[r][c];
        }
        Q[i][c] = qVal;
        K[i][c] = kVal;
        V[i][c] = vVal;
      }
    }

    // Compute Scaled Dot Product (Q · K^T) / sqrt(dK)
    const rawScores = [];
    for (let i = 0; i < n; i++) {
      rawScores[i] = [];
      for (let j = 0; j < n; j++) {
        // Causal masking: if j > i, token i cannot attend to future token j
        if (causalMask && j > i) {
          rawScores[i][j] = -1e9;
          continue;
        }

        let score = dotProduct(Q[i], K[j]) / scale;
        // Bias according to head specialty
        if (h === 2) {
          // Positional bias
          const dist = Math.abs(i - j);
          score += 1.0 / (dist + 1);
        } else if (h === 0 && Math.abs(i - j) === 1) {
          // Adjacent grammatical syntax
          score += 0.8;
        }
        rawScores[i][j] = score;
      }
    }

    // Softmax normalization per row
    const attentionWeights = [];
    for (let i = 0; i < n; i++) {
      let maxScore = -Infinity;
      for (let j = 0; j < n; j++) {
        if (rawScores[i][j] > maxScore) maxScore = rawScores[i][j];
      }

      let expSum = 0;
      const exps = [];
      for (let j = 0; j < n; j++) {
        const e = Math.exp(rawScores[i][j] - maxScore);
        exps.push(e);
        expSum += e;
      }

      attentionWeights[i] = exps.map(e => parseFloat((expSum > 0 ? e / expSum : 0).toFixed(4)));
    }

    heads.push({
      headIndex: h,
      description: headDescriptions[h],
      Q, K, V,
      rawScores,
      attentionWeights
    });
  }

  // Average Attention Matrix across all heads
  const averageMatrix = [];
  for (let i = 0; i < n; i++) {
    averageMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let h = 0; h < numHeads; h++) {
        sum += heads[h].attentionWeights[i][j];
      }
      averageMatrix[i][j] = parseFloat((sum / numHeads).toFixed(4));
    }
  }

  // Extract top connections for 3D attention arcs
  const topConnections = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && averageMatrix[i][j] > 0.08) {
        topConnections.push({
          fromIdx: i,
          toIdx: j,
          fromToken: tokens[i].cleanText,
          toToken: tokens[j].cleanText,
          weight: averageMatrix[i][j]
        });
      }
    }
  }

  topConnections.sort((a, b) => b.weight - a.weight);

  return {
    heads,
    averageMatrix,
    topConnections: topConnections.slice(0, 30)
  };
}

/**
 * Stage 04 & 05: Softmax & Next-Token Prediction Engine
 * Computes output logits, scales by Temperature, runs Softmax,
 * calculates Shannon entropy, and predicts top next tokens.
 */
export function predictNextToken(tokens, temperature = 0.7) {
  if (!tokens || tokens.length === 0) {
    const fallback = {
      token: "...",
      id: 999,
      logit: 5.0,
      probability: 1.0,
      cumulativeProb: 1.0,
      color: "#00f5ff"
    };
    return {
      topToken: fallback,
      candidates: [fallback],
      entropy: 0.0,
      rawLogits: []
    };
  }

  const lastToken = tokens[tokens.length - 1];
  const lastClean = lastToken.cleanText.toLowerCase();

  // Vocabulary of candidate next tokens with contextual relevance
  const VOCABULARY = [
    { token: "language", baseWeight: 4.8 },
    { token: "intelligence", baseWeight: 4.6 },
    { token: "systems", baseWeight: 4.2 },
    { token: "representation", baseWeight: 4.0 },
    { token: "matrix", baseWeight: 3.9 },
    { token: "quantum", baseWeight: 3.8 },
    { token: "nanotechnology", baseWeight: 3.7 },
    { token: "armor", baseWeight: 3.6 },
    { token: "protocol", baseWeight: 3.5 },
    { token: "transformers", baseWeight: 3.4 },
    { token: "neural", baseWeight: 3.3 },
    { token: "vectors", baseWeight: 3.1 },
    { token: "computation", baseWeight: 3.0 },
    { token: "synthesis", baseWeight: 2.8 },
    { token: "architecture", baseWeight: 2.7 }
  ];

  // Dynamically boost based on the last prompt token
  const scored = VOCABULARY.map((item, idx) => {
    let logit = item.baseWeight + (pseudoRandom(hashString(`${lastClean}_${item.token}`, idx)) * 1.6 - 0.8);
    
    // Semantic heuristics for coherence
    if (lastClean.includes("iron") || lastClean.includes("stark")) {
      if (["armor", "protocol", "nanotechnology", "quantum"].includes(item.token)) logit += 3.2;
    } else if (lastClean.includes("attention") || lastClean.includes("need")) {
      if (["for", "language", "transformers", "understanding"].includes(item.token)) logit += 3.5;
    } else if (lastClean.includes("quantum") || lastClean.includes("energy")) {
      if (["matrix", "systems", "synthesis", "protocol"].includes(item.token)) logit += 3.0;
    } else if (lastClean.includes("neural") || lastClean.includes("model")) {
      if (["architecture", "intelligence", "vectors", "computation"].includes(item.token)) logit += 3.1;
    }

    return {
      token: item.token,
      id: hashString(item.token) % 50000,
      logit: parseFloat(logit.toFixed(3))
    };
  });

  // Safe temperature clamp
  const safeTemp = Math.max(0.05, Math.min(2.0, temperature));

  // Softmax with temperature scaling: P(i) = exp(z_i / T) / sum(exp(z_j / T))
  const maxScaledLogit = Math.max(...scored.map(s => s.logit / safeTemp));
  const exps = scored.map(s => Math.exp(s.logit / safeTemp - maxScaledLogit));
  const sumExps = exps.reduce((acc, v) => acc + v, 0);

  const candidatesWithProb = scored.map((s, idx) => ({
    ...s,
    probability: exps[idx] / sumExps,
    color: STARK_TOKEN_COLORS[idx % STARK_TOKEN_COLORS.length]
  }));

  // Sort descending by probability
  candidatesWithProb.sort((a, b) => b.probability - a.probability);

  // Compute cumulative probabilities and Shannon Entropy
  let cumProb = 0;
  let entropy = 0;
  const candidates = candidatesWithProb.map(c => {
    cumProb += c.probability;
    if (c.probability > 0) {
      entropy -= c.probability * Math.log2(c.probability);
    }
    return {
      ...c,
      probability: parseFloat(c.probability.toFixed(4)),
      cumulativeProb: parseFloat(cumProb.toFixed(4))
    };
  });

  return {
    topToken: candidates[0],
    candidates: candidates.slice(0, 8),
    entropy: parseFloat(entropy.toFixed(3)),
    rawLogits: scored
  };
}
