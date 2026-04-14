"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EMAIL_ROWS,
  EMAIL_COLS,
  ROW_LABELS,
  decodeHollerithCard,
} from "@/lib/hollerith";

export default function Reward() {
  const [emailCards, setEmailCards] = useState<Set<number>[]>([new Set()]);
  const [activeCard, setActiveCard] = useState(0);
  const [justPunched, setJustPunched] = useState<number | null>(null);
  const [mistakeMsg, setMistakeMsg] = useState(false);
  const [cardShake, setCardShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentCardPunched = emailCards[activeCard];

  const allDecoded = emailCards.flatMap((card) =>
    decodeHollerithCard(card, EMAIL_COLS),
  );
  const emailString = allDecoded
    .map((d) => d.char.toLowerCase())
    .join("")
    .replace(/\s+$/, "");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailString);
  const activeDecoded = decodeHollerithCard(currentCardPunched, EMAIL_COLS);
  const canSubmit = validEmail;

  function updateCard(
    cardIdx: number,
    fn: (card: Set<number>) => Set<number>,
  ) {
    setEmailCards((prev) => {
      const next = prev.map((s) => new Set(s));
      next[cardIdx] = fn(next[cardIdx]);
      return next;
    });
  }

  function addCard() {
    setEmailCards((prev) => [...prev, new Set()]);
    setActiveCard(emailCards.length);
  }

  function trashCard(idx: number) {
    if (emailCards.length <= 1) {
      setEmailCards([new Set()]);
      setActiveCard(0);
    } else {
      setEmailCards((prev) => prev.filter((_, i) => i !== idx));
      if (activeCard >= idx && activeCard > 0) setActiveCard((a) => a - 1);
      else if (activeCard >= emailCards.length - 1)
        setActiveCard(emailCards.length - 2);
    }
  }

  function switchCard(idx: number) {
    setActiveCard(idx);
  }

  function punchHole(idx: number) {
    if (currentCardPunched.has(idx)) {
      setCardShake(true);
      setMistakeMsg(true);
      setTimeout(() => setCardShake(false), 500);
      setTimeout(() => setMistakeMsg(false), 8000);
      return;
    }
    updateCard(activeCard, (card) => {
      card.add(idx);
      return card;
    });
    setJustPunched(idx % EMAIL_COLS);
    setTimeout(() => setJustPunched(null), 300);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    try {
      await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailString }),
      });
    } catch {
      // Submit anyway
    }
    setSubmitted(true);
  }

  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />

      <div className="min-h-screen flex flex-col">
        <nav className="border-b border-amber/10 bg-void/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-sm tracking-[0.3em] text-amber hover:text-amber-bright transition-colors"
            >
              PUNCHED CARDS&trade;
            </Link>
            <div className="font-mono text-xs text-fg-dim tracking-wider">
              CLAIM YOUR KIT
            </div>
          </div>
        </nav>

        <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto">
            {!submitted ? (
              <div>
                {/* Header */}
                <div className="text-center mb-10 animate-fade-up delay-1">
                  <p className="font-mono text-xs tracking-[0.4em] text-green mb-4">
                    &#9670; EXAM PASSED &#9670;
                  </p>
                  <h1 className="font-heading text-4xl sm:text-5xl text-fg-bright mb-4 leading-tight">
                    YOU&apos;VE EARNED
                    <br />
                    <span className="text-amber glow-amber">YOUR KIT</span>
                  </h1>
                  <p className="font-body text-lg text-fg-dim max-w-lg mx-auto leading-relaxed">
                    You proved your analog computing proficiency. As a reward,
                    we&apos;ll send you a free Starter Kit. Keypunch your email
                    and we&apos;ll ship it when it&apos;s ready.
                  </p>
                  <p className="font-mono text-[11px] text-fg-dim/50 max-w-md mx-auto mt-3">
                    Please bear with us. We&apos;re scaling rapidly, but the
                    correct way, using punch card technology.
                  </p>
                </div>

                {/* Email keypunch section */}
                <div className="mb-12 animate-fade-up delay-2">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-mono text-xs text-amber tracking-[0.2em]">
                      KEYPUNCH YOUR EMAIL
                    </span>
                    <span className="font-mono text-[10px] text-fg-dim/40">
                      12-ROW HOLLERITH &mdash;{" "}
                      {emailCards.length} CARD
                      {emailCards.length > 1 ? "S" : ""}
                    </span>
                  </div>

                  {/* Decoded email */}
                  <div className="bg-surface border border-amber/10 p-4 mb-4">
                    <div className="font-mono text-[10px] text-fg-dim/50 tracking-wider mb-2">
                      YOUR EMAIL:
                    </div>
                    <div className="flex flex-wrap items-center min-h-[28px]">
                      {emailCards.map((card, ci) => {
                        const dec = decodeHollerithCard(card, EMAIL_COLS);
                        return (
                          <div key={ci} className="contents">
                            {ci > 0 && (
                              <span className="text-fg-dim/10 mx-px select-none">
                                |
                              </span>
                            )}
                            {dec.map((d, i) => (
                              <span
                                key={`${ci}-${i}`}
                                className={`font-mono text-base sm:text-lg min-w-[12px] sm:min-w-[16px] text-center transition-all duration-150 ${
                                  !d.hasHoles
                                    ? "text-fg-dim/10"
                                    : ci === activeCard
                                      ? "text-amber"
                                      : "text-amber/60"
                                }`}
                              >
                                {d.hasHoles ? d.char.toLowerCase() : "\u00B7"}
                              </span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-[10px] text-fg-dim/40">
                        {emailString.length > 0
                          ? validEmail
                            ? "\u2713 Valid email"
                            : "Keep punching..."
                          : "Punch holes to encode your email"}
                      </span>
                      <span className="font-mono text-[10px] text-fg-dim/40 tabular-nums">
                        CARD {activeCard + 1} OF {emailCards.length}
                      </span>
                    </div>
                  </div>

                  {/* Hollerith quick ref */}
                  <details className="mb-4">
                    <summary className="font-mono text-[10px] text-amber/60 tracking-wider cursor-pointer hover:text-amber transition-colors select-none">
                      HOW TO PUNCH LETTERS &#9660;
                    </summary>
                    <div className="mt-3 bg-surface border border-amber/10 p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-x-4 gap-y-1 font-mono text-[11px] text-fg-dim">
                        <div><span className="text-amber/50">A&ndash;I</span> = Row 12 + Row 1&ndash;9</div>
                        <div><span className="text-amber/50">J&ndash;R</span> = Row 11 + Row 1&ndash;9</div>
                        <div><span className="text-amber/50">S&ndash;Z</span> = Row 0 + Row 2&ndash;9</div>
                      </div>
                      <div className="grid grid-cols-5 gap-1 font-mono text-[9px]">
                        {[
                          ["@", "4,8"], [".", "12,3,8"], ["-", "11"],
                          ["_", "0,5,8"], ["0&ndash;9", "row N"],
                        ].map(([ch, rows]) => (
                          <div key={ch} className="bg-elevated px-2 py-0.5 flex justify-between">
                            <span className="text-amber" dangerouslySetInnerHTML={{ __html: ch }} />
                            <span className="text-fg-dim/40" dangerouslySetInnerHTML={{ __html: rows }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>

                  {/* Card tabs */}
                  <div className="flex gap-1 mb-2">
                    {emailCards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => switchCard(i)}
                        className={`font-mono text-[10px] px-3 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                          i === activeCard
                            ? "bg-amber text-void"
                            : "bg-surface border border-amber/10 text-fg-dim hover:border-amber/25"
                        }`}
                        style={{ clipPath: "polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px)" }}
                      >
                        CARD {i + 1}
                        <span
                          onClick={(e) => { e.stopPropagation(); trashCard(i); }}
                          className={`ml-1 hover:text-red transition-colors ${i === activeCard ? "text-void/30" : "text-fg-dim/30"}`}
                        >
                          &#x2715;
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={addCard}
                      className="font-mono text-[10px] px-3 py-1.5 bg-surface border border-dashed border-amber/15 text-amber/40 hover:border-amber/30 hover:text-amber cursor-pointer transition-all"
                    >
                      + NEW CARD
                    </button>
                  </div>

                  {/* Punch card */}
                  <div
                    className={`relative w-full bg-cream p-3 sm:p-4 shadow-[0_10px_40px_rgba(255,140,0,0.06)] overflow-x-auto ${cardShake ? "animate-card-shake" : ""}`}
                    style={{ clipPath: "polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 14px)" }}
                  >
                    <div className="text-[7px] sm:text-[8px] font-mono text-cream-dark/80 tracking-[0.15em] mb-2 flex justify-between">
                      <span>EMAIL CARD {activeCard + 1} OF {emailCards.length}</span>
                      <span>12-ROW HOLLERITH</span>
                    </div>

                    <div className="min-w-[480px]">
                      {/* Column numbers */}
                      <div className="flex mb-[2px]">
                        <div className="w-7 shrink-0" />
                        <div className="flex-1 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))` }}>
                          {Array.from({ length: EMAIL_COLS }, (_, c) => (
                            <div key={c} className="text-[5px] sm:text-[6px] font-mono text-center text-cream-dark/50">
                              {activeCard * EMAIL_COLS + c + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Zone rows */}
                      <div className="flex">
                        <div className="w-7 shrink-0 flex flex-col gap-[2px] justify-center">
                          {ROW_LABELS.slice(0, 3).map((label, r) => (
                            <div key={r} className="text-[6px] sm:text-[7px] font-mono text-cream-dark/60 text-right pr-1.5 flex items-center justify-end" style={{ height: "10px" }}>
                              {label}
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))` }}>
                          {Array.from({ length: 3 * EMAIL_COLS }, (_, i) => {
                            const col = i % EMAIL_COLS;
                            const absIdx = Math.floor(i / EMAIL_COLS) * EMAIL_COLS + col;
                            const isPunched = currentCardPunched.has(absIdx);
                            return (
                              <button key={i} onClick={() => punchHole(absIdx)} className={`h-[10px] flex items-center justify-center cursor-pointer transition-all duration-150 ${justPunched === col && isPunched ? "animate-punch" : ""}`}>
                                <span className={`block w-[60%] h-[7px] rounded-[0.5px] ${isPunched ? "punch-hole-active" : "bg-cream-dark/12 hover:bg-cream-dark/22"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="flex my-[3px]">
                        <div className="w-7 shrink-0" />
                        <div className="flex-1 h-[1px] bg-cream-dark/20" />
                      </div>

                      {/* Digit rows */}
                      <div className="flex">
                        <div className="w-7 shrink-0 flex flex-col gap-[2px] justify-center">
                          {ROW_LABELS.slice(3).map((label, r) => (
                            <div key={r} className="text-[6px] sm:text-[7px] font-mono text-cream-dark/60 text-right pr-1.5 flex items-center justify-end" style={{ height: "10px" }}>
                              {label}
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))` }}>
                          {Array.from({ length: 9 * EMAIL_COLS }, (_, i) => {
                            const row = Math.floor(i / EMAIL_COLS) + 3;
                            const col = i % EMAIL_COLS;
                            const absIdx = row * EMAIL_COLS + col;
                            const isPunched = currentCardPunched.has(absIdx);
                            return (
                              <button key={i} onClick={() => punchHole(absIdx)} className={`h-[10px] flex items-center justify-center cursor-pointer transition-all duration-150 ${justPunched === col && isPunched ? "animate-punch" : ""}`}>
                                <span className={`block w-[60%] h-[7px] rounded-[0.5px] ${isPunched ? "punch-hole-active" : "bg-cream-dark/12 hover:bg-cream-dark/22"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Decoded chars */}
                      <div className="flex mt-1">
                        <div className="w-7 shrink-0" />
                        <div className="flex-1 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))` }}>
                          {activeDecoded.map((d, c) => (
                            <div key={c} className={`text-[6px] sm:text-[7px] font-mono text-center ${!d.hasHoles ? "text-cream-dark/15" : d.char === "?" ? "text-red/60" : "text-void/50"}`}>
                              {d.hasHoles ? d.char : "\u00B7"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[6px] sm:text-[7px] font-mono text-cream-dark/30 text-center">
                      PUNCHES ARE PERMANENT &mdash; MADE A MISTAKE? TRASH THE CARD AND START FRESH
                    </div>
                  </div>

                  {/* Mistake message */}
                  <div className={`mt-3 text-center transition-opacity duration-300 flex items-center justify-center gap-3 ${mistakeMsg ? "opacity-100" : "opacity-0"}`}>
                    <span className="font-mono text-[10px] text-red/70">
                      That hole is punched.
                    </span>
                    <button
                      onClick={addCard}
                      className="font-mono text-[10px] text-amber border border-amber/30 px-2.5 py-1 hover:bg-amber/10 transition-colors cursor-pointer"
                    >
                      Need a new card?
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="text-center animate-fade-up delay-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`font-mono text-sm tracking-[0.2em] px-10 py-4 transition-all duration-500 cursor-pointer ${
                      canSubmit
                        ? "bg-green text-void hover:shadow-[0_0_40px_rgba(57,255,20,0.2)]"
                        : "bg-amber/10 text-amber/30 cursor-not-allowed"
                    }`}
                  >
                    {validEmail
                      ? "CLAIM FREE STARTER KIT \u2192"
                      : emailString.length > 0
                        ? "KEEP PUNCHING\u2026"
                        : "KEYPUNCH YOUR EMAIL TO CLAIM"}
                  </button>
                </div>
              </div>
            ) : (
              /* ── SUCCESS ── */
              <div className="text-center animate-fade-up delay-1">
                <p className="font-mono text-xs tracking-[0.4em] text-green mb-4">
                  &#9670; KIT CLAIMED &#9670;
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl text-fg-bright mb-4 leading-tight">
                  YOUR STARTER KIT
                  <br />
                  <span className="text-green glow-green">IS ON THE WAY</span>
                </h1>
                <p className="font-body text-lg text-fg-dim max-w-md mx-auto leading-relaxed mb-2">
                  We&apos;ll ship your free 50-card Starter Kit to{" "}
                  <span className="text-amber font-mono text-sm">{emailString}</span>{" "}
                  as soon as our next batch clears the keypunch queue.
                </p>
                <p className="font-mono text-xs text-fg-dim/40 mb-10">
                  Your Hollerith deck has been verified, sorted, and filed.
                  <br />
                  Estimated fulfillment: when cardboard supply allows.
                </p>

                <div className="flex gap-4 justify-center">
                  <Link
                    href="/"
                    className="inline-block font-mono text-sm tracking-[0.2em] text-void bg-amber hover:bg-amber-bright px-8 py-3 transition-all duration-300"
                  >
                    &larr; BACK TO SHOP
                  </Link>
                  <Link
                    href="/guide"
                    className="inline-block font-mono text-sm tracking-[0.2em] text-amber border border-amber/30 hover:bg-amber/10 px-8 py-3 transition-all duration-300"
                  >
                    READ THE LLM GUIDE
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
