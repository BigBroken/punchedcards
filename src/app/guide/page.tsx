import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Build an LLM with Punch Cards — A Complete Guide | PUNCHED CARDS",
  description:
    "A comprehensive, technically accurate step-by-step guide to building a GPT-2-class large language model using 80-column punch cards. ~150 million cards required.",
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function CardCount({
  count,
  label,
  running,
}: {
  count: string;
  label: string;
  running?: string;
}) {
  return (
    <div className="my-8 border border-amber/20 bg-surface p-6">
      <div className="font-mono text-[10px] text-amber tracking-[0.3em] mb-3">
        PUNCH CARD COUNT
      </div>
      <div className="font-mono text-2xl text-amber glow-amber mb-1">
        {count}
      </div>
      <div className="font-mono text-xs text-fg-dim">{label}</div>
      {running && (
        <div className="mt-3 pt-3 border-t border-amber/10 font-mono text-[10px] text-fg-dim/60">
          RUNNING TOTAL: <span className="text-amber/60">{running}</span>
        </div>
      )}
    </div>
  );
}

function renderLine(line: string) {
  const parts = line.split(/(\d+\^{[^}]+})/g);
  return parts.map((part, i) => {
    const m = part.match(/^(\d+)\^{([^}]+)}$/);
    if (m) return <span key={i}>{m[1]}<sup>{m[2]}</sup></span>;
    return part;
  });
}

function Calc({ lines }: { lines: string[]; }) {
  return (
    <div className="my-6 bg-elevated p-4 font-mono text-sm text-fg-dim overflow-x-auto leading-relaxed">
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.startsWith("=")
              ? "border-t border-amber/10 mt-1 pt-1 text-amber"
              : ""
          }
        >
          {renderLine(line)}
        </div>
      ))}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 border-l-2 border-red bg-red/5 p-4">
      <div className="font-mono text-[10px] text-red tracking-[0.3em] mb-2">
        WARNING
      </div>
      <div className="font-body text-sm text-fg-dim leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 border-l-2 border-green bg-green/5 p-4">
      <div className="font-mono text-[10px] text-green tracking-[0.3em] mb-2">
        TIP
      </div>
      <div className="font-body text-sm text-fg-dim leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function SectionHead({ id, num, title }: { id: string; num: string; title: string }) {
  return (
    <h2
      id={id}
      className="font-heading text-2xl sm:text-3xl text-fg-bright mt-20 mb-6 scroll-mt-20"
    >
      <span className="font-mono text-sm text-amber mr-3">{num}.</span>
      {title}
    </h2>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Guide() {
  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />

      {/* Nav */}
      <nav className="border-b border-amber/10 bg-void/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-[0.3em] text-amber hover:text-amber-bright transition-colors"
          >
            PUNCHED CARDS&trade;
          </Link>
          <div className="font-mono text-xs text-fg-dim tracking-wider">
            TECHNICAL GUIDE
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* ── TITLE ── */}
        <header className="mb-16">
          <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
            &#9670; COMPREHENSIVE GUIDE &#9670;
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-fg-bright leading-[1.1] mb-6">
            How to Build an LLM
            <br />
            with Punch Cards
          </h1>
          <p className="font-body text-lg text-fg-dim leading-relaxed mb-8">
            A step-by-step technical guide to building a GPT-2-class large
            language model using nothing but standard IBM 80-column punch
            cards. We assume no prior punch card experience, but a strong
            foundation in linear algebra and a high tolerance for large numbers
            is recommended.
          </p>

          {/* Model specs */}
          <div className="border border-amber/20 bg-surface p-6">
            <div className="font-mono text-[10px] text-amber tracking-[0.3em] mb-4">
              TARGET MODEL SPECIFICATIONS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-sm">
              {[
                ["Architecture", "Transformer (decoder)"],
                ["Parameters", "124 million"],
                ["Layers", "12"],
                ["Embedding Dim", "768"],
                ["Attention Heads", "12"],
                ["Vocab Size", "50,257"],
                ["Context Length", "1,024 tokens"],
                ["Precision", "float32 (4 bytes)"],
                ["Reference", "GPT-2 Small"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-[10px] text-fg-dim/60 tracking-wider">
                    {label}
                  </div>
                  <div className="text-fg-bright">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── TABLE OF CONTENTS ── */}
        <nav className="mb-16 border border-amber/10 p-6 bg-surface">
          <div className="font-mono text-[10px] text-amber tracking-[0.3em] mb-4">
            TABLE OF CONTENTS
          </div>
          <ol className="space-y-2 font-mono text-sm">
            {[
              ["prerequisites", "Prerequisites & Bill of Materials"],
              ["math", "Floating-Point Arithmetic Library"],
              ["matrix", "Matrix Operations Library"],
              ["tokenizer", "Build the Tokenizer (BPE)"],
              ["corpus", "Prepare the Training Corpus"],
              ["architecture", "Define the Transformer Architecture"],
              ["weights", "Initialize Model Weights"],
              ["forward", "Implement the Forward Pass"],
              ["loss", "Compute the Loss Function"],
              ["backprop", "Implement Backpropagation"],
              ["optimizer", "Implement the Adam Optimizer"],
              ["training", "Run the Training Loop"],
              ["inference", "Run Inference"],
              ["summary", "Total Requirements Summary"],
            ].map(([id, title], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-fg-dim hover:text-amber transition-colors"
                >
                  <span className="text-fg-dim/40 inline-block w-8">
                    {String(i).padStart(2, "0")}
                  </span>
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ═══════════════════════════════════════
            SECTIONS
            ═══════════════════════════════════════ */}

        {/* ── 00. PREREQUISITES ── */}
        <SectionHead id="prerequisites" num="00" title="Prerequisites & Bill of Materials" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Before writing a single line of punched code, you need to secure the
          physical infrastructure. Building an LLM is primarily a logistics
          problem. The math is straightforward. The scale is not.
        </p>

        <div className="my-8 border border-amber/20 bg-surface p-6">
          <div className="font-mono text-[10px] text-amber tracking-[0.3em] mb-4">
            REQUIRED MATERIALS
          </div>
          <ul className="space-y-3 font-mono text-sm text-fg-dim">
            {[
              "~150,000,000 blank IBM 80-column punch cards",
              "3× industrial keypunch machines (IBM 029 or equivalent)",
              "2× mechanical card sorters (IBM 083, 1,000 cards/min)",
              "1× tabulating machine (IBM 407)",
              "12+ trained keypunch operators (3 shifts, 24/7)",
              "2,500 sq ft warehouse (climate-controlled, low humidity)",
              "200+ filing cabinets (5-drawer, letter-size)",
              "Mathematical reference tables: log, exp, tanh, erf",
              "128-page procedure manual (you’ll write this yourself)",
              "~9.5 trillion years of uninterrupted labor",
              "Coffee (amount: unbounded)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-amber mt-0.5">&#9656;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Warning>
          The total weight of punch cards required for this project is
          approximately <strong>265 metric tons</strong>. Verify that your
          warehouse floor can support this load. Standard commercial flooring
          is rated for ~250 kg/m². You will need reinforced flooring.
        </Warning>

        {/* ── 01. MATH LIBRARY ── */}
        <SectionHead id="math" num="01" title="Floating-Point Arithmetic Library" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Neural networks run on floating-point math. Every parameter is a
          32-bit float. You need four fundamental operations (add, subtract,
          multiply, divide) plus transcendental functions (exp, log, tanh, sqrt)
          for activation functions and softmax.
        </p>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          On punch cards, you’ll implement these as <strong>lookup tables</strong> and{" "}
          <strong>procedure decks</strong>. A procedure deck is a sequence of
          cards that, when fed through the tabulating machine, performs a
          specific operation on input cards and produces output cards.
        </p>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          REQUIRED LOOKUP TABLES
        </h3>
        <ul className="space-y-2 font-body text-sm text-fg-dim mb-4">
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Multiplication table</strong> — Pre-computed products for
              common mantissa pairs. 10,000 entries × 8 bytes = 80,000 bytes = 1,000 cards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Exponential table (eˣ)</strong> — Required for softmax
              and GELU. 5,000 entries × 8 bytes = 500 cards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Natural log table</strong> — Required for cross-entropy loss.
              5,000 entries × 8 bytes = 500 cards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Tanh / erf table</strong> — Required for GELU activation.
              5,000 entries × 8 bytes = 500 cards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Reciprocal square root table</strong> — Required for layer
              normalization. 2,000 entries × 8 bytes = 200 cards.
            </span>
          </li>
        </ul>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Additionally, you need procedure decks for interpolation (values
          between table entries), carry propagation, and IEEE 754 special cases
          (NaN, infinity, denormalized numbers). Approximately 300 procedure cards.
        </p>

        <CardCount count="3,000" label="math library (lookup tables + procedures)" running="3,000" />

        {/* ── 02. MATRIX OPS ── */}
        <SectionHead id="matrix" num="02" title="Matrix Operations Library" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Transformers are matrix multiplication engines. You need procedures for:
          matrix–matrix multiply, matrix–vector multiply, element-wise operations
          (add, multiply, apply activation), transpose, and row-wise softmax.
        </p>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          The core operation is matrix multiplication. For matrices A (m×k) and
          B (k×n), the result C (m×n) requires m×n×k multiply-accumulate
          operations. Each one involves a table lookup (multiply), then an
          addition with carry propagation.
        </p>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          TIME PER MATRIX MULTIPLY
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          A skilled operator using pre-computed lookup tables can perform one
          float32 multiply-accumulate in approximately <strong>30 seconds</strong>,
          including card retrieval, lookup, punching the result, and filing.
        </p>

        <Calc
          lines={[
            "Example: multiply two 768 × 768 matrices",
            "Operations: 768 × 768 × 768 = 452,984,832",
            "Time: 452,984,832 × 30 sec = 13,589,544,960 sec",
            "= 430.7 years per matrix multiply",
          ]}
        />

        <Warning>
          A single transformer layer requires approximately 14 matrix
          multiplications. At this rate, one forward pass through one layer
          takes about 6,030 years. Plan accordingly.
        </Warning>

        <CardCount count="500" label="matrix operation procedure decks" running="3,500" />

        {/* ── 03. TOKENIZER ── */}
        <SectionHead id="tokenizer" num="03" title="Build the Tokenizer (BPE)" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Before training, text must be converted into integer token IDs using
          Byte-Pair Encoding (BPE). GPT-2 uses a vocabulary of 50,257 tokens.
          You need to store:
        </p>

        <ul className="space-y-2 font-body text-sm text-fg-dim mb-4">
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Vocabulary mapping</strong> — 50,257 token entries, each mapping
              a token ID to its byte sequence. Average ~10 bytes per entry.
              502,570 bytes = 6,282 cards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Merge table</strong> — ~50,000 BPE merge rules specifying
              which byte pairs merge in what priority. ~20 bytes per rule.
              1,000,000 bytes = 12,500 cards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Encoding procedure deck</strong> — The algorithm for applying
              merges to raw text. ~200 cards.
            </span>
          </li>
        </ul>

        <Tip>
          File the vocabulary cards alphabetically by token bytes and use
          tab dividers. You’ll be looking up tokens billions of times.
          An index system will save you centuries.
        </Tip>

        <CardCount count="19,000" label="tokenizer (vocabulary + merge table + procedures)" running="22,500" />

        {/* ── 04. CORPUS ── */}
        <SectionHead id="corpus" num="04" title="Prepare the Training Corpus" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          GPT-2 was trained on WebText, approximately 40 GB of text. We’ll use a
          modest 10 GB subset. After tokenization, this yields approximately 2.5
          billion tokens, stored as 2-byte (uint16) token IDs.
        </p>

        <Calc
          lines={[
            "Raw text: 10 GB = 10,737,418,240 bytes",
            "Raw text cards: 10,737,418,240 ÷ 80 = 134,217,728 cards",
            "",
            "Tokenized: ~2.5 billion tokens × 2 bytes = 5,000,000,000 bytes",
            "Tokenized cards: 5,000,000,000 ÷ 80 = 62,500,000 cards",
          ]}
        />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          You only need the tokenized version for training. Store the raw text
          separately as a reference archive. The tokenized corpus must be
          organized into sequences of 1,024 tokens each for training batches.
        </p>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          SHUFFLING THE DATASET
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Training requires random access to sequences. Using an IBM 083 card
          sorter at 1,000 cards/minute, a single shuffle of the tokenized
          corpus takes:
        </p>

        <Calc
          lines={[
            "62,500,000 cards ÷ 1,000 cards/min = 62,500 minutes",
            "= 1,042 hours",
            "= 43.4 days per shuffle",
          ]}
        />

        <Warning>
          You will need to re-shuffle the corpus each epoch. Budget 43 days per
          epoch just for data shuffling. With a standard training run of 3–10
          epochs, that’s 130–434 days of pure card sorting.
        </Warning>

        <CardCount count="62,500,000" label="tokenized training corpus" running="62,522,500" />

        {/* ── 05. ARCHITECTURE ── */}
        <SectionHead id="architecture" num="05" title="Define the Transformer Architecture" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Create a specification deck that defines every layer, dimension, and
          connection in the model. This is your blueprint — the punch card
          equivalent of a model config file.
        </p>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-fg-dim overflow-x-auto leading-relaxed">
          <div className="text-amber/60 mb-2">// architecture.deck</div>
          <div>EMBEDDING:  vocab=50257, dim=768</div>
          <div>POSITION:   max_len=1024, dim=768</div>
          <div className="text-amber/60 mt-2 mb-1">// repeat 12×</div>
          <div>LAYER_NORM: dim=768</div>
          <div>ATTENTION:  heads=12, dim=768, head_dim=64</div>
          <div>RESIDUAL:   add</div>
          <div>LAYER_NORM: dim=768</div>
          <div>FFN:        dim=768, hidden=3072, activation=GELU</div>
          <div>RESIDUAL:   add</div>
          <div className="text-amber/60 mt-2 mb-1">// output</div>
          <div>LAYER_NORM: dim=768</div>
          <div>LINEAR:     in=768, out=50257 (tied with embedding)</div>
          <div>SOFTMAX:    dim=50257</div>
        </div>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          The GELU activation function is critical. Its formula requires
          computing:
        </p>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-amber overflow-x-auto">
          GELU(x) = 0.5 × x × (1 + tanh(√(2/π) × (x + 0.044715 × x³)))
        </div>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          For each of the 3,072 hidden units, per layer, per token, per training
          step. This is why your tanh lookup table needs to be very thorough.
        </p>

        <CardCount count="500" label="architecture specification deck" running="62,523,000" />

        {/* ── 06. WEIGHTS ── */}
        <SectionHead id="weights" num="06" title="Initialize Model Weights" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          The model has 124 million parameters. Each is a 32-bit floating-point
          number (4 bytes). They must be initialized with small random values
          using Xavier/Glorot initialization:
        </p>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-amber overflow-x-auto">
          W ~ Uniform(-√(6 / (fan_in + fan_out)), √(6 / (fan_in + fan_out)))
        </div>

        <Calc
          lines={[
            "Parameters: 124,000,000",
            "Bytes per parameter: 4 (float32)",
            "Total bytes: 496,000,000",
            "Cards: 496,000,000 ÷ 80 = 6,200,000",
          ]}
        />

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          RANDOM NUMBER GENERATION
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          You have no PRNG. Recommended approaches:
        </p>
        <ul className="space-y-2 font-body text-sm text-fg-dim mb-4">
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Physical entropy</strong> — Flip a coin for each bit. For 496
              million bytes × 8 bits = 3.97 billion coin flips. At 3 flips per
              second, this takes approximately 42 years.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5 font-mono">&#9656;</span>
            <span>
              <strong>Atmospheric noise</strong> — Record radio static, convert
              amplitude samples to bits. Faster, but requires additional equipment.
            </span>
          </li>
        </ul>

        <Tip>
          Pre-punch a set of &quot;random number cards&quot; using atmospheric noise.
          Store them in a separate cabinet labeled &quot;ENTROPY RESERVE.&quot; You will
          need these again for dropout (if you implement regularization).
        </Tip>

        <CardCount count="6,200,000" label="initial model weights" running="68,723,000" />

        {/* ── 07. FORWARD PASS ── */}
        <SectionHead id="forward" num="07" title="Implement the Forward Pass" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          The forward pass converts a sequence of 1,024 token IDs into a
          probability distribution over the next token. Here is every operation
          you must perform, in order:
        </p>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          STEP 7.1: TOKEN EMBEDDING
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Look up each of the 1,024 input tokens in the embedding weight matrix
          (50,257 × 768). Each lookup retrieves a 768-dimensional vector.
          Result: a 1,024 × 768 matrix. This is a card lookup operation — find
          the right card among 50,257 filed entries, 1,024 times.
        </p>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          STEP 7.2: POSITIONAL ENCODING
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Add the positional embedding matrix (1,024 × 768) element-wise to the
          token embeddings. This is 786,432 floating-point additions.
        </p>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          STEP 7.3: TRANSFORMER LAYERS (×12)
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          For each of the 12 layers, perform the following sub-steps:
        </p>

        <div className="my-6 bg-elevated p-5 font-mono text-sm text-fg-dim overflow-x-auto space-y-4">
          <div>
            <div className="text-amber/60 mb-1">// 7.3a: Layer Normalization</div>
            <div>Compute mean and variance over dim=768 for each of 1,024 positions</div>
            <div>Normalize, scale (γ), and shift (β)</div>
            <div className="text-fg-dim/40">Ops: ~3 × 1,024 × 768 = 2,359,296</div>
          </div>
          <div>
            <div className="text-amber/60 mb-1">// 7.3b: Multi-Head Self-Attention</div>
            <div>Project Q, K, V: three (1024×768) × (768×768) matmuls</div>
            <div>Split into 12 heads of dim 64</div>
            <div>Attention scores: Q × Kᵀ for each head: (1024×64) × (64×1024)</div>
            <div>Scale by 1/√64 = 1/8</div>
            <div>Apply causal mask (upper triangle → -∞)</div>
            <div>Softmax over each row (1,024 exp + div operations per row)</div>
            <div>Weighted sum: attn × V for each head</div>
            <div>Concatenate heads, project: (1024×768) × (768×768)</div>
            <div className="text-fg-dim/40">Ops: ~4 × 1,024 × 768 × 768 + 2 × 12 × 1,024 × 1,024 × 64</div>
            <div className="text-fg-dim/40">≈ 2.42 billion + 1.61 billion = ~4.03 billion</div>
          </div>
          <div>
            <div className="text-amber/60 mb-1">// 7.3c: Residual Connection</div>
            <div>Add attention output to layer input: 786,432 additions</div>
          </div>
          <div>
            <div className="text-amber/60 mb-1">// 7.3d: Layer Normalization (again)</div>
            <div className="text-fg-dim/40">Ops: ~2,359,296</div>
          </div>
          <div>
            <div className="text-amber/60 mb-1">// 7.3e: Feed-Forward Network</div>
            <div>Linear 768 → 3072: (1024×768) × (768×3072) matmul</div>
            <div>GELU activation: 3,145,728 evaluations (lookup + interpolate)</div>
            <div>Linear 3072 → 768: (1024×3072) × (3072×768) matmul</div>
            <div className="text-fg-dim/40">Ops: ~2 × 1,024 × 768 × 3,072 = ~4.83 billion</div>
          </div>
          <div>
            <div className="text-amber/60 mb-1">// 7.3f: Residual Connection</div>
            <div>Add FFN output to sub-layer input: 786,432 additions</div>
          </div>
        </div>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          TOTAL FORWARD PASS COMPUTE
        </h3>

        <Calc
          lines={[
            "Per layer: ~8.9 billion FLOPs",
            "12 layers: ~106.8 billion FLOPs",
            "Output projection + softmax: ~79 million FLOPs",
            "Total per forward pass: ~107 billion FLOPs",
            "",
            "At 30 sec/FLOP: 107 × 10^{9} × 30 = 3.21 × 10^{11} seconds",
            "= 1,017 years per forward pass",
          ]}
        />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          The forward pass also requires <strong>scratch space cards</strong> to
          store intermediate activations. These are reusable between passes.
        </p>

        <Calc
          lines={[
            "Activations per layer: 1,024 × 768 × 4 bytes = 3.15 MB",
            "Attention matrices: 12 heads × 1,024 × 1,024 × 4 = 50.3 MB",
            "FFN intermediates: 1,024 × 3,072 × 4 = 12.6 MB",
            "Total scratch per layer: ~66 MB",
            "All 12 layers: ~792 MB (must store all for backprop)",
            "= 792,000,000 ÷ 80 = 9,900,000 cards",
          ]}
        />

        <Warning>
          You must keep all intermediate activations from the forward pass in
          order to compute gradients during backpropagation. Do not discard or
          re-file scratch cards until backprop is complete. Label every scratch
          card with its layer index and position.
        </Warning>

        <CardCount count="9,900,000" label="scratch space cards (reusable per step)" running="78,623,000" />

        {/* ── 08. LOSS ── */}
        <SectionHead id="loss" num="08" title="Compute the Loss Function" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          GPT-2 uses cross-entropy loss: for each position in the sequence,
          compute the negative log probability of the correct next token.
        </p>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-amber overflow-x-auto">
          L = -(1/T) ∑ log(p(correct_token))
        </div>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          After softmax gives you a probability distribution over 50,257 tokens,
          look up the probability assigned to the correct token and take its
          natural log. This requires your log lookup table from Step 01.
          Repeat for all 1,024 positions and average.
        </p>

        <CardCount count="100" label="loss computation procedure deck" running="78,623,100" />

        {/* ── 09. BACKPROP ── */}
        <SectionHead id="backprop" num="09" title="Implement Backpropagation" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Backpropagation computes the gradient of the loss with respect to
          every parameter in the network by applying the chain rule in reverse
          order through every layer. The compute is approximately{" "}
          <strong>2× the forward pass</strong>.
        </p>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          For each layer (in reverse, 12 → 1), you must:
        </p>

        <ol className="space-y-2 font-body text-sm text-fg-dim mb-4 list-decimal list-inside">
          <li>Compute gradients for the FFN weights (two large matmuls)</li>
          <li>Backprop through GELU (element-wise, using the GELU derivative lookup table)</li>
          <li>Compute gradients for the attention projection weights</li>
          <li>Backprop through softmax attention (per-head)</li>
          <li>Compute gradients for Q, K, V projection weights (three matmuls)</li>
          <li>Backprop through layer normalization (involves stored means/variances)</li>
          <li>Accumulate gradients through residual connections</li>
        </ol>

        <Calc
          lines={[
            "Backward FLOPs ≈ 2 × forward FLOPs",
            "= 2 × 107 billion = ~214 billion FLOPs",
            "At 30 sec/FLOP: ~203,000 years per backward pass",
          ]}
        />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          You must also <strong>store the gradients</strong> for all 124 million
          parameters. That’s another full set of weight cards:
        </p>

        <CardCount count="6,200,000" label="gradient storage cards" running="84,823,100" />

        {/* ── 10. OPTIMIZER ── */}
        <SectionHead id="optimizer" num="10" title="Implement the Adam Optimizer" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Adam maintains two running averages per parameter: the first moment
          (mean of gradients, <em>m</em>) and the second moment (mean of squared
          gradients, <em>v</em>). This requires two additional complete copies
          of the parameter storage.
        </p>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-fg-dim overflow-x-auto leading-relaxed">
          <div className="text-amber/60 mb-2">// Adam update for each parameter θ:</div>
          <div>m = β₁ × m + (1 - β₁) × gradient</div>
          <div>v = β₂ × v + (1 - β₂) × gradient²</div>
          <div>m̂ = m / (1 - β₁ᵗ)</div>
          <div>v̂ = v / (1 - β₂ᵗ)</div>
          <div className="text-amber">θ = θ - lr × m̂ / (√v̂ + ε)</div>
        </div>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Each parameter update involves ~15 floating-point operations. For 124
          million parameters, that’s 1.86 billion operations per training step
          just for the optimizer.
        </p>

        <Calc
          lines={[
            "m storage: 124M × 4 bytes = 496 MB = 6,200,000 cards",
            "v storage: 124M × 4 bytes = 496 MB = 6,200,000 cards",
            "Optimizer compute: 1.86B FLOPs × 30 sec = 1,770 years/step",
          ]}
        />

        <CardCount count="12,400,000" label="Adam optimizer state (m + v)" running="97,223,100" />

        {/* ── 11. TRAINING LOOP ── */}
        <SectionHead id="training" num="11" title="Run the Training Loop" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          You now have all the components. The training loop is:
        </p>

        <div className="my-6 bg-elevated p-5 font-mono text-sm text-fg-dim overflow-x-auto leading-relaxed">
          <div className="text-amber/60 mb-2">// training loop</div>
          <div>for epoch in 1..3:</div>
          <div className="pl-4">shuffle(training_corpus)       // 43 days</div>
          <div className="pl-4">for batch in batches:</div>
          <div className="pl-8">activations = forward(batch)  // 1,017 years</div>
          <div className="pl-8">loss = cross_entropy(...)      // 2 days</div>
          <div className="pl-8">gradients = backward(...)      // 2,034 years</div>
          <div className="pl-8">adam_update(weights, grads)    // 1,770 years</div>
          <div className="pl-8">if step % 5000 == 0:</div>
          <div className="pl-12">checkpoint(weights)           // 6.2M cards</div>
        </div>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          TOTAL TRAINING STEPS
        </h3>

        <Calc
          lines={[
            "Training tokens: 2.5 billion",
            "Sequence length: 1,024",
            "Sequences: 2,500,000,000 ÷ 1,024 ≈ 2,441,406",
            "Batch size: 1 (limited by operator throughput)",
            "Steps per epoch: 2,441,406",
            "Epochs: 3",
            "Total steps: 7,324,218",
          ]}
        />

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          TOTAL TRAINING TIME
        </h3>

        <Calc
          lines={[
            "FLOPs per step: ~321 billion (forward + backward)",
            "Optimizer per step: ~1.86 billion",
            "Total FLOPs per step: ~323 billion",
            "",
            "Total FLOPs: 7,324,218 steps × 323 × 10^{9} = 2.37 × 10^{18}",
            "",
            "At 30 sec/FLOP (1 operator):",
            "= 2.37 × 10^{18} × 30 = 7.1 × 10^{19} seconds",
            "= 2.25 × 10^{12} years",
            "= 2.25 trillion years",
          ]}
        />

        <div className="my-8 border-2 border-red/40 bg-red/5 p-6 text-center">
          <div className="font-mono text-xs text-red tracking-[0.3em] mb-3">
            TIMELINE CONTEXT
          </div>
          <div className="font-heading text-3xl text-fg-bright mb-2">
            163×
          </div>
          <div className="font-body text-fg-dim">
            the current age of the universe (13.8 billion years)
          </div>
        </div>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          PARALLELIZATION
        </h3>
        <p className="font-body text-fg-dim leading-relaxed mb-4">
          You can reduce training time by hiring more operators. Matrix
          operations are embarrassingly parallel — each element of the output
          can be computed independently.
        </p>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-fg-dim overflow-x-auto leading-relaxed">
          <div>1 operator: ......... 2.25 trillion years</div>
          <div>10 operators: ........ 225 billion years</div>
          <div>1,000 operators: ..... 2.25 billion years</div>
          <div>1,000,000 operators: . 2.25 million years</div>
          <div className="text-amber">7,000,000 operators: . ~321,000 years</div>
        </div>

        <Tip>
          At 7 million parallel operators, training completes in approximately
          the time since humans first developed agriculture. This is the
          minimum viable staffing level for a single training run.
        </Tip>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          Checkpoint cards (saving weights every 5,000 steps):
        </p>

        <Calc
          lines={[
            "Checkpoints: 7,324,218 ÷ 5,000 ≈ 1,465 saves",
            "Cards per checkpoint: 6,200,000",
            "Total checkpoint cards: 1,465 × 6,200,000 = 9,083,000,000",
          ]}
        />

        <Warning>
          Checkpoint storage alone requires 9 billion cards, weighing
          approximately 16,000 metric tons. You will need a second warehouse.
          Consider checkpointing less frequently.
        </Warning>

        <CardCount
          count="9,083,000,000"
          label="training checkpoints (every 5,000 steps)"
          running="9,180,223,100"
        />

        {/* ── 12. INFERENCE ── */}
        <SectionHead id="inference" num="12" title="Run Inference" />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          After training, you can generate text. Inference is autoregressive: to
          generate N tokens, you run the forward pass N times, each time
          appending the predicted token to the input sequence.
        </p>

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          To generate a single token:
        </p>

        <Calc
          lines={[
            "1 forward pass: ~107 billion FLOPs",
            "At 30 sec/FLOP: 1,017 years",
            "",
            "To generate a 100-token response:",
            "= 100 × 1,017 years",
            "= 101,700 years per response",
          ]}
        />

        <p className="font-body text-fg-dim leading-relaxed mb-4">
          You’ll also need to implement <strong>temperature scaling</strong> and{" "}
          <strong>top-k sampling</strong> during token selection. Temperature
          divides the logits by a scalar before softmax. Top-k requires sorting
          50,257 values to find the k largest — approximately 16 minutes on the
          card sorter per token generated.
        </p>

        <Tip>
          For faster inference, consider pre-computing a KV cache: store the
          key and value matrices from previous positions so you only compute
          attention for the new token. This reduces per-token compute from
          O(n²) to O(n), at the cost of additional cache storage cards.
        </Tip>

        {/* ── 13. SUMMARY ── */}
        <SectionHead id="summary" num="13" title="Total Requirements Summary" />

        <div className="my-8 border-2 border-amber/40 bg-surface p-6 sm:p-8">
          <div className="font-mono text-[10px] text-amber tracking-[0.4em] mb-6 text-center">
            FINAL PROJECT TALLY
          </div>

          <div className="space-y-4 font-mono text-sm">
            {[
              ["Punch Cards (training)", "~9.18 billion"],
              ["Stack Height", "~1,634 km (2× height of ISS orbit)"],
              ["Total Weight", "~16,194 metric tons"],
              ["Total FLOPs", "~2.37 × 10^{18}"],
              ["Time (1 operator)", "2.25 trillion years"],
              ["Time (1M operators)", "2.25 million years"],
              ["Universes Required", "~163"],
              ["Warehouses Required", "≥2"],
              ["Filing Cabinets", "~200,000"],
              ["Coffee (estimated)", "∞"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-baseline border-b border-amber/5 pb-2"
              >
                <span className="text-fg-dim">{label}</span>
                <span className="text-amber glow-amber text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          COST ESTIMATE
        </h3>

        <Calc
          lines={[
            "Cards at $0.01/card: 9.18B × $0.01 = $91,800,000",
            "Keypunch machines: 3 × $8,500 = $25,500",
            "Card sorters: 2 × $12,000 = $24,000",
            "Warehouse (2,500 sqft/yr): ~$30,000/yr",
            "Operators (1M × $50k/yr × 2.25M yrs): $112,500,000,000,000,000",
            "",
            "= ~$112.5 quadrillion",
            "(approximately 1,000× current global GDP)",
          ]}
        />

        <h3 className="font-mono text-sm text-fg-bright tracking-wider mt-8 mb-4">
          FOR COMPARISON
        </h3>

        <div className="my-6 bg-elevated p-4 font-mono text-sm text-fg-dim overflow-x-auto leading-relaxed">
          <div>Training GPT-2 Small on a single A100 GPU: ~24 hours</div>
          <div>Training GPT-2 Small on punch cards: ~2.25 trillion years</div>
          <div className="mt-2 text-amber">
            The GPU is approximately 8.2 × 10^{15} times faster.
          </div>
        </div>

        <p className="font-body text-lg text-fg-dim leading-relaxed my-8 text-center italic">
          Or you could just use a GPU. Your call.
        </p>

        {/* CTA */}
        <div className="mt-16 border-t border-amber/10 pt-12 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
            &#9670; READY TO START? &#9670;
          </p>
          <p className="font-body text-fg-dim mb-6">
            Pick up your first 9.18 billion cards and get punching.
          </p>
          <Link
            href="/#products"
            className="inline-block font-mono text-sm tracking-[0.2em] text-void bg-amber hover:bg-amber-bright px-8 py-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)]"
          >
            SHOP PUNCH CARDS &rarr;
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-amber/10 py-8 px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/"
            className="font-mono text-xs text-fg-dim/40 hover:text-amber tracking-wider transition-colors"
          >
            &larr; BACK TO PUNCHED CARDS&trade;
          </Link>
        </div>
      </footer>
    </>
  );
}
