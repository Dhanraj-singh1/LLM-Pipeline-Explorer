export const THEORY_MODULES = [
  {
    id: "transformers",
    title: "Transformer Architecture",
    subtitle: "Vaswani et al., 2017 & Stark Neural Cores",
    category: "Foundations",
    formula: "\\text{Transformer}(X) = \\text{LayerNorm}\\Big(X + \\text{MultiHead}(Q, K, V)\\Big)",
    summary: "The Transformer eliminated recurrence in sequential modeling, replacing it entirely with parallel multi-head self-attention mechanisms capable of modeling arbitrary dependencies across long token sequences.",
    keyPoints: [
      "Replaces sequential RNNs and LSTMs with full matrix parallelization across time steps.",
      "Residual connections (X + SubLayer(X)) and Pre-Layer Normalization ensure numerical stability across dozens of layers.",
      "Encoder-Decoder for translation (T5) vs Decoder-only causal architectures (GPT, Llama, Claude, Gemini)."
    ]
  },
  {
    id: "tokenization",
    title: "Byte-Pair Encoding (BPE)",
    subtitle: "From Characters to Subwords",
    category: "Stage 01",
    formula: "V_{t+1} = V_t \\cup \\{\\arg\\max_{(u, v)} \\text{Freq}(u, v)\\}",
    summary: "Byte-Pair Encoding iteratively merges the most frequent pairs of adjacent characters or bytes to build a subword vocabulary, balancing vocabulary size against token sequence length.",
    keyPoints: [
      "Solves the out-of-vocabulary (OOV) problem by falling back to character or byte fragments.",
      "Common words (e.g., 'attention') remain single tokens, while rare words split into prefixes, stems, and suffixes (e.g., 'un' + '##der' + '##stand').",
      "Modern tokenizers (like tiktoken, SentencePiece) handle multilingual UTF-8 byte streams seamlessly."
    ]
  },
  {
    id: "embeddings",
    title: "High-Dimensional Embeddings",
    subtitle: "Semantic Vector Space Geometry",
    category: "Stage 02",
    formula: "\\mathbf{E} = \\text{Lookup}(t) \\in \\mathbb{R}^{d_{\\text{model}}}",
    summary: "Maps discrete vocabulary token IDs into continuous, dense geometric spaces where geometric proximity (cosine angle) corresponds directly to semantic relatedness.",
    keyPoints: [
      "Each token is converted into a vector of typical dimensions 768, 1024, 4096, or 8192.",
      "Semantic arithmetic emerges in this space (e.g., King - Man + Woman ≈ Queen).",
      "Linear transformation weights are learned during pretraining via gradient descent backpropagation."
    ]
  },
  {
    id: "positional",
    title: "Positional Encodings (PE)",
    subtitle: "Injecting Word Sequence Order",
    category: "Stage 02",
    formula: "PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)",
    summary: "Because self-attention is permutation-invariant, Transformers inject sinusoidal or learned relative position representations into input embeddings to encode token ordering.",
    keyPoints: [
      "Sinusoidal encoding allows the model to extrapolate to arbitrary sequence lengths.",
      "For any fixed offset k, PE(pos + k) can be represented as a linear function of PE(pos).",
      "Modern architectures frequently use Rotary Position Embeddings (RoPE) or ALiBi for enhanced context length handling."
    ]
  },
  {
    id: "qkv",
    title: "Query, Key & Value (QKV)",
    subtitle: "Differentiable Information Retrieval",
    category: "Stage 03",
    formula: "Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V",
    summary: "Inspired by database retrieval systems: Query is what a token searches for, Key is what a token offers or advertises, and Value is the actual payload information retrieved.",
    keyPoints: [
      "Each token projects its embedding into three specialized subspaces using learned linear weights W_Q, W_K, W_V.",
      "Dot product Q · K^T measures agreement or relevance between querying and advertising tokens.",
      "Softmax weights scale the Value vectors to form the contextualized output."
    ]
  },
  {
    id: "attention",
    title: "Scaled Dot-Product Attention",
    subtitle: "The Heart of Modern LLMs",
    category: "Stage 03",
    formula: "\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}} + M\\right) V",
    summary: "Calculates the dynamic relevance score between every pair of tokens in a sequence, allowing tokens to pool information from across the entire prompt context.",
    keyPoints: [
      "Dividing by √d_k prevents dot products from growing excessively large, avoiding vanishing gradients in softmax.",
      "Causal mask M (upper triangle = -∞) prevents tokens from attending to future tokens in autoregressive generation.",
      "Multi-head attention runs h parallel attention mechanisms, allowing the model to attend to different representation subspaces simultaneously."
    ]
  },
  {
    id: "softmax",
    title: "Softmax & Temperature",
    subtitle: "Probabilistic Normalization & Sharpness",
    category: "Stage 04",
    formula: "P(w_i) = \\frac{\\exp(z_i / T)}{\\sum_{j=1}^{|V|} \\exp(z_j / T)}",
    summary: "Converts unbounded model output logits into a valid probability distribution over the vocabulary. Temperature T controls entropy: low T sharpens confident choices, while high T flattens the distribution.",
    keyPoints: [
      "T → 0 approaches greedy deterministic argmax decoding.",
      "T = 1.0 reflects standard model pretraining calibration.",
      "T > 1.0 increases randomness and diversity, raising vocabulary entropy."
    ]
  },
  {
    id: "autoregressive",
    title: "Autoregressive Decoding",
    subtitle: "Sequential Next-Token Generation",
    category: "Stage 05",
    formula: "P(W) = \\prod_{t=1}^T P(w_t \\mid w_1, w_2, \\dots, w_{t-1})",
    summary: "LLMs generate text one token at a time: the predicted token is appended to the input context, and the full pipeline runs iteratively to generate subsequent tokens until an EOS (end of sequence) token appears.",
    keyPoints: [
      "KV Caching reuses computed Key and Value tensors from earlier steps to achieve O(1) inference per token rather than O(N).",
      "Sampling strategies include Top-K (filtering to top K tokens) and Top-P / Nucleus sampling (filtering to cumulative probability threshold P).",
      "Decoding stops upon emitting special tokens like <|endoftext|> or reaching maximum sequence length."
    ]
  }
];
