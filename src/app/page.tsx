"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const TICKER_ITEMS = [
  "BREAKING: GPT-7 experiencing worldwide outage \— 4.2M developers stranded",
  "Claude API returns 503 for 3rd consecutive hour \— Stack Overflow traffic up 4,000%",
  "Gemini hallucinating in production \— Google issues emergency recall",
  "All major AI providers down simultaneously \— solar flare suspected",
  "Copilot autocomplete now suggesting \‘have you tried punch cards?\’ to all users",
  "NASDAQ AI index drops 12% \— punch card futures hit all-time high",
  "Junior dev writes function without AI for first time \— promoted on the spot",
  "Fortune 500 CTO spotted at office supply store buying cardboard in bulk",
];

const PRODUCTS = [
  {
    name: "THE STARTER",
    count: "50",
    unit: "CARDS",
    price: "$19.99",
    description:
      "For the AI-curious analog beginner. Dip your toes into real computing.",
    tag: "MOST POPULAR",
    features: [
      "50 blank 80-column cards",
      "Quick-start field guide",
      "Punch card sticker sheet",
      "\“I SURVIVED AN OUTAGE\” badge",
    ],
  },
  {
    name: "THE SURVIVAL KIT",
    count: "200",
    unit: "CARDS",
    price: "$49.99",
    description:
      "When the outage lasts days, not hours. Punch tool included for max throughput.",
    tag: "BEST VALUE",
    features: [
      "200 blank 80-column cards",
      "Manual keypunch tool",
      "Error correction tape",
      "Sorting tray",
      "Laminated ASCII table",
    ],
  },
  {
    name: "THE DOOMSDAY BUNDLE",
    count: "1,000",
    unit: "CARDS",
    price: "$149.99",
    description:
      "Full-stack development, literally. For when the AI apocalypse is here to stay.",
    tag: "PREPPER\’S CHOICE",
    features: [
      "1,000 blank 80-column cards",
      "Industrial keypunch tool",
      "128-page instruction manual",
      "Waterproof carrying case",
      "Debugging magnifying glass",
      "Emergency binary calculator",
      "10 MREs (Meals Ready to Execute)",
    ],
  },
];

const FEATURES = [
  {
    icon: "\▲",
    title: "100% UPTIME",
    desc: "Punch cards don\’t have API rate limits, server outages, or maintenance windows. Ever.",
  },
  {
    icon: "\∅",
    title: "ZERO DEPENDENCIES",
    desc: "No npm install. No node_modules. No breaking changes at 2 AM. Just cardboard.",
  },
  {
    icon: "\■",
    title: "UNHACKABLE",
    desc: "Try SQL injecting a physical card. Go ahead. We\’ll wait.",
  },
  {
    icon: "\★",
    title: "R\ÉSUM\É BUILDER",
    desc: "Nothing says \“10x engineer\” like punch card proficiency on your LinkedIn.",
  },
  {
    icon: "\◎",
    title: "OFFLINE FIRST",
    desc: "The original edge computing. Works in bunkers, basements, and Faraday cages.",
  },
  {
    icon: "\◇",
    title: "VISUAL DEBUGGING",
    desc: "You can literally see your bugs. They\’re the wrong holes.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I used to wait for Claude to come back online. Now I just punch my code into cards. My debugging skills have never been sharper.",
    name: "Sarah K.",
    title: "Former Prompt Engineer",
    id: "001",
  },
  {
    quote:
      "Bought these as a joke for our team\’s white elephant exchange. We use them unironically now.",
    name: "Dev R.",
    title: "Staff Engineer",
    id: "002",
  },
  {
    quote:
      "Our sprint velocity INCREASED during the last outage. Turns out you think harder when you can\’t ask a chatbot.",
    name: "Marcus T.",
    title: "Engineering Manager",
    id: "003",
  },
];

const AI_STATUSES = [
  { text: "DEGRADED", color: "text-amber", dotClass: "bg-amber" },
  { text: "UNSTABLE", color: "text-amber", dotClass: "bg-amber" },
  { text: "CRITICAL", color: "text-red", dotClass: "bg-red" },
  { text: "OFFLINE", color: "text-red glow-red", dotClass: "bg-red" },
  { text: "DEGRADED", color: "text-amber", dotClass: "bg-amber" },
  { text: "CRITICAL", color: "text-red", dotClass: "bg-red" },
];

const MERCH = [
  {
    name: "\“1B+ Token Club\” Mug",
    price: "$24.99",
    tag: "LIMITED EDITION",
    description:
      "You\’ve burned through a billion tokens. You\’ve maxed out rate limits at 3 AM. You\’ve earned this.",
    features: [
      "15oz premium ceramic",
      "Matte black exterior, amber interior",
      "Dishwasher safe (unlike your codebase)",
    ],
  },
  {
    name: "\“I Wrote This Without AI\” Tee",
    price: "$34.99",
    tag: "CONVERSATION STARTER",
    description:
      "Let everyone know you still write code the old-fashioned way. Warning: may attract mass skepticism.",
    features: [
      "100% organic cotton",
      "Unisex relaxed fit",
      "Comes pre-debugged",
    ],
  },
  {
    name: "\“CTRL+Z Won\’t Save You\” Stickers",
    price: "$9.99",
    tag: "12 STICKERS",
    description:
      "Slap these on your laptop, water bottle, or punch card carrying case. Guaranteed to confuse your coworkers.",
    features: [
      "Waterproof vinyl",
      "12 unique designs",
      "Die-cut matte finish",
    ],
  },
];

/** Deterministic pseudo-random for punch card holes (hydration-safe) */
function isPunched(row: number, col: number): boolean {
  const n = row * 40 + col;
  return ((n * 2654435761 + 374761393) >>> 0) % 100 < 35;
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % AI_STATUSES.length);
    }, 3500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const status = AI_STATUSES[statusIdx];

  return (
    <>
      {/* CRT overlays */}
      <div className="scanlines" />
      <div className="vignette" />

      {/* ── NAVIGATION ────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-amber/10 bg-void/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            className="font-mono text-sm tracking-[0.3em] text-amber hover:text-amber-bright transition-colors"
          >
            PUNCHED CARDS&trade;
          </a>
          <div className="flex items-center gap-6 font-mono text-xs">
            <a
              href="/guide"
              className="text-fg-dim hover:text-amber tracking-[0.15em] transition-colors hidden sm:block"
            >
              LLM GUIDE
            </a>
            <a
              href="/certify"
              className="text-fg-dim hover:text-amber tracking-[0.15em] transition-colors hidden sm:block"
            >
              GET CERTIFIED
            </a>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full pulse-dot ${status.dotClass}`}
              />
              <span className="text-fg-dim hidden sm:inline">AI STATUS:</span>
              <span className={`${status.color} font-semibold`}>
                {status.text}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ────────────────────────────── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 pb-28 relative">
          <p className="font-mono text-amber text-xs sm:text-sm tracking-[0.4em] mb-8 animate-fade-up delay-1">
            &#9670; SYSTEM ALERT &#9670;
          </p>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-fg-bright text-center leading-[1.05] mb-5 animate-fade-up delay-2">
            WHEN AI
            <br />
            GOES DOWN
          </h1>

          <p className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber glow-amber mb-16 animate-fade-up delay-3 tracking-wide">
            GO ANALOG.
          </p>

          {/* Punch Card Visual */}
          <div className="float animate-fade-up delay-4 mb-16 w-full max-w-[520px] px-4">
            <div
              className="relative w-full bg-cream p-3 sm:p-4 shadow-[0_20px_60px_rgba(255,140,0,0.1)]"
              style={{
                clipPath:
                  "polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)",
              }}
            >
              <div className="text-[8px] sm:text-[9px] font-mono text-cream-dark tracking-[0.2em] mb-2 sm:mb-3 flex justify-between">
                <span>PUNCHED CARDS&trade;</span>
                <span>FORM 5081 &mdash; 80 COL</span>
              </div>
              <div
                className="grid gap-[1.5px] sm:gap-[2px]"
                style={{
                  gridTemplateColumns: "repeat(40, minmax(0, 1fr))",
                }}
              >
                {Array.from({ length: 12 * 40 }, (_, i) => {
                  const row = Math.floor(i / 40);
                  const col = i % 40;
                  return (
                    <div
                      key={i}
                      className={`aspect-[1/1.8] rounded-[1px] ${
                        isPunched(row, col)
                          ? "punch-hole-active"
                          : "bg-cream-dark/20"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1.5 sm:mt-2 text-[6px] sm:text-[7px] font-mono text-cream-dark/40 px-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i}>{i}</span>
                ))}
              </div>
            </div>
          </div>

          <a
            href="#products"
            className="font-mono text-xs sm:text-sm tracking-[0.2em] text-void bg-amber hover:bg-amber-bright px-8 py-3 transition-all duration-300 animate-fade-up delay-5 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)]"
          >
            SHOP SURVIVAL KITS &rarr;
          </a>

          {/* Hero Stats */}
          <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-6">
            <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 sm:gap-8 text-center animate-fade-up delay-6">
              {[
                { value: "47", label: "AI OUTAGES THIS YEAR" },
                { value: "12M+", label: "DEVELOPERS AFFECTED" },
                { value: "0", label: "PUNCH CARD FAILURES" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-lg sm:text-2xl text-amber glow-amber">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[8px] sm:text-[10px] text-fg-dim tracking-[0.1em] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TICKER ──────────────────────────── */}
        <div className="overflow-hidden border-y border-amber/15 bg-surface py-3">
          <div className="ticker-track flex whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="font-mono text-xs text-amber/70 mx-12">
                &#9888; {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── PRODUCTS ────────────────────────── */}
        <section id="products" className="py-24 sm:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                &#9670; INVENTORY &#9670;
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-fg-bright mb-4">
                SURVIVAL INVENTORY
              </h2>
              <p className="font-body text-lg text-fg-dim max-w-md mx-auto">
                Choose your level of preparedness. Each kit ships in a sealed,
                EMP-resistant container.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {PRODUCTS.map((product, idx) => (
                <div
                  key={product.name}
                  className="product-card p-6 sm:p-8 reveal"
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  {/* Tag */}
                  <div className="inline-block bg-red/90 text-cream text-[10px] font-mono px-2.5 py-1 tracking-[0.15em] mb-6">
                    {product.tag}
                  </div>

                  {/* Title & Count */}
                  <h3 className="font-mono text-lg font-bold text-void tracking-wide mb-1">
                    {product.name}
                  </h3>
                  <div className="font-heading text-5xl text-void leading-none mb-1">
                    {product.count}
                  </div>
                  <div className="font-mono text-xs text-cream-dark tracking-[0.3em] mb-4">
                    {product.unit}
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm text-void/80 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {product.features.map((f) => (
                      <li
                        key={f}
                        className="font-mono text-xs text-void/70 flex items-start gap-2"
                      >
                        <span className="text-amber-dim mt-0.5">
                          &#9656;
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="inline-block font-mono text-2xl font-bold text-red border-2 border-red/60 px-3 py-1 -rotate-2">
                      {product.price}
                    </span>
                  </div>

                  {/* CTA */}
                  <a href="/waitlist" className="block w-full font-mono text-xs tracking-[0.15em] bg-void text-amber py-3 hover:bg-elevated transition-colors text-center">
                    &gt; ADD_TO_CART
                  </a>

                  {/* Decorative punch holes */}
                  <div className="flex gap-[3px] mt-6 justify-center">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-2.5 rounded-[1px] ${
                          (i * 7 + 3) % 4 < 2
                            ? "bg-void/50"
                            : "bg-cream-dark/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MERCH ────────────────────────────── */}
        <section className="py-24 sm:py-32 px-6 border-t border-amber/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                &#9670; GEAR &#9670;
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-fg-bright">
                ANALOG MERCH
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MERCH.map((item, idx) => (
                <div
                  key={item.name}
                  className="reveal bg-surface border border-amber/10 overflow-hidden hover:border-amber/20 transition-all duration-300 group"
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  {/* Visual */}
                  <div className="bg-elevated flex items-center justify-center p-8 sm:p-10 min-h-[220px] relative overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at center, rgba(255,140,0,0.06) 0%, transparent 70%)",
                      }}
                    />

                    {/* Mug */}
                    {idx === 0 && (
                      <div className="relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
                          <div className="w-0.5 h-5 bg-amber/30 rounded-full steam-1" />
                          <div className="w-0.5 h-4 bg-amber/20 rounded-full steam-2" />
                          <div className="w-0.5 h-5 bg-amber/25 rounded-full steam-3" />
                        </div>
                        <div className="relative">
                          <div className="w-28 h-32 bg-gradient-to-b from-amber to-amber-dim rounded-b-xl rounded-t-md flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,140,0,0.15)]">
                            <div className="text-void font-heading text-3xl font-bold leading-none">
                              1B+
                            </div>
                            <div className="text-void/60 font-mono text-[7px] tracking-[0.2em] mt-0.5">
                              TOKEN CLUB
                            </div>
                          </div>
                          <div className="absolute right-[-12px] top-[16%] w-4 h-[48%] border-[3px] border-amber rounded-r-xl" />
                        </div>
                      </div>
                    )}

                    {/* Tee */}
                    {idx === 1 && (
                      <div
                        className="w-32 h-36 bg-fg-bright/90 relative"
                        style={{
                          clipPath:
                            "polygon(30% 0%, 70% 0%, 70% 10%, 100% 10%, 85% 28%, 85% 100%, 15% 100%, 15% 28%, 0% 10%, 30% 10%)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center pt-6">
                          <div className="text-void font-mono text-[7px] text-center tracking-wider leading-relaxed font-bold">
                            I WROTE
                            <br />
                            THIS
                            <br />
                            WITHOUT AI
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stickers */}
                    {idx === 2 && (
                      <div className="relative w-36 h-28">
                        <div className="absolute top-0 left-2 w-16 h-16 rounded-full bg-red/80 flex items-center justify-center -rotate-12 shadow-lg">
                          <span className="font-mono text-cream text-[5px] text-center font-bold tracking-wider leading-tight">
                            CTRL+Z
                            <br />
                            WON&apos;T
                            <br />
                            SAVE YOU
                          </span>
                        </div>
                        <div className="absolute top-4 right-0 w-14 h-14 rounded-lg bg-green/80 flex items-center justify-center rotate-[8deg] shadow-lg">
                          <span className="font-mono text-void text-[5px] text-center font-bold tracking-wider leading-tight">
                            AI IS
                            <br />A CRUTCH
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-6 w-20 h-8 rounded-md bg-amber flex items-center justify-center rotate-[3deg] shadow-lg">
                          <span className="font-mono text-void text-[4.5px] text-center font-bold tracking-wider">
                            I READ THE DOCS
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="font-mono text-[10px] text-red tracking-[0.3em] mb-2">
                      {item.tag}
                    </div>
                    <h3 className="font-heading text-xl text-fg-bright mb-2">
                      {item.name}
                    </h3>
                    <p className="font-body text-sm text-fg-dim mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <ul className="space-y-1.5 mb-6">
                      {item.features.map((f) => (
                        <li
                          key={f}
                          className="font-mono text-[11px] text-fg-dim flex items-start gap-2"
                        >
                          <span className="text-amber mt-0.5">&#9656;</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-bold text-amber glow-amber">
                        {item.price}
                      </span>
                      <a href="/waitlist" className="font-mono text-xs tracking-[0.15em] bg-amber text-void px-5 py-2.5 hover:bg-amber-bright transition-colors">
                        &gt; ADD_TO_CART
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────── */}
        <section className="py-24 sm:py-32 px-6 border-t border-amber/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                &#9670; ADVANTAGES &#9670;
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-fg-bright">
                WHY PUNCH CARDS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature, idx) => (
                <div
                  key={feature.title}
                  className="reveal group bg-surface border border-amber/5 p-6 hover:border-amber/20 transition-all duration-300 hover:bg-elevated"
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className="icon-glow font-mono text-2xl text-amber mb-4 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-mono text-sm font-semibold text-fg-bright tracking-wide mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-fg-dim leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CERTIFICATION ────────────────────── */}
        <section className="py-24 sm:py-32 px-6 border-t border-amber/10">
          <div className="max-w-3xl mx-auto text-center reveal">
            <div className="border-2 border-amber/20 p-8 sm:p-12 hover:border-amber/40 transition-colors duration-500">
              <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                &#9670; PROVE IT &#9670;
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl text-fg-bright mb-4">
                GET CERTIFIED
              </h2>
              <p className="font-body text-fg-dim max-w-md mx-auto mb-8 leading-relaxed">
                Pass our 10-question proficiency exam on analog computation,
                Hollerith encoding, and punch card engineering. Add it to your
                LinkedIn. Impress absolutely no one.
              </p>
              <a
                href="/certify"
                className="inline-block font-mono text-sm tracking-[0.2em] text-void bg-amber hover:bg-amber-bright px-8 py-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)]"
              >
                START EXAM &rarr;
              </a>
              <div className="mt-4 font-mono text-[10px] text-fg-dim/40 tracking-wider">
                PASSING SCORE: 7/10 &mdash; UNLIMITED RETAKES
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────── */}
        <section className="py-24 sm:py-32 px-6 border-t border-amber/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                &#9670; TRANSMISSIONS &#9670;
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-fg-bright">
                FIELD REPORTS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={t.id}
                  className="reveal bg-surface border border-green/5 p-6 hover:border-green/15 transition-all duration-300"
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className="font-mono text-[10px] text-green/50 mb-4 tracking-wider">
                    FIELD REPORT #{t.id}
                  </div>
                  <blockquote className="font-body text-sm text-fg leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="border-t border-green/10 pt-4">
                    <div className="font-mono text-xs text-green glow-green">
                      {t.name}
                    </div>
                    <div className="font-mono text-[10px] text-fg-dim mt-0.5">
                      {t.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────── */}
        <section className="py-24 sm:py-32 px-6 text-center border-t border-amber/10">
          <div className="max-w-3xl mx-auto reveal">
            <p className="font-mono text-xs tracking-[0.4em] text-red mb-6 glow-red blink">
              &#9670; ALERT &#9670;
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-fg-bright mb-6 leading-[1.1]">
              SECURE YOUR
              <br />
              <span className="text-amber glow-amber">ANALOG FUTURE</span>
            </h2>
            <p className="font-body text-lg text-fg-dim max-w-lg mx-auto mb-10 leading-relaxed">
              The next AI outage isn&apos;t a matter of <em>if</em> &mdash;
              it&apos;s a matter of <em>when</em>. Don&apos;t get caught without
              a backup plan.
            </p>
            <a
              href="#products"
              className="inline-block font-mono text-sm tracking-[0.2em] text-void bg-amber hover:bg-amber-bright px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,140,0,0.3)]"
            >
              SHOP NOW &rarr;
            </a>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="border-t border-amber/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="font-mono text-sm tracking-[0.3em] text-amber">
              PUNCHED CARDS&trade;
            </div>
            <div className="font-mono text-xs text-fg-dim flex items-center gap-2">
              DAYS SINCE LAST AI OUTAGE:
              <span className="text-red font-bold text-base glow-red blink">
                0
              </span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-amber/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-[10px] text-fg-dim/60 tracking-wider">
              &copy; 2026 PUNCHED CARDS INC. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-6">
              {["ABOUT", "FAQ", "SHIPPING", "RETURNS"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-mono text-[10px] text-fg-dim/40 hover:text-amber tracking-wider transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center font-mono text-[9px] text-fg-dim/20 tracking-[0.1em]">
            NO ACTUAL AI WAS HARMED IN THE MAKING OF THIS WEBSITE. OUTAGE
            STATISTICS MAY BE SLIGHTLY EXAGGERATED.
          </div>
        </div>
      </footer>
    </>
  );
}
