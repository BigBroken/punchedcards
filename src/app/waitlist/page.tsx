"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════
   12-ROW HOLLERITH PUNCH CARD ENCODING
   Rows (top to bottom): 12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
   Zone punches: 12, 11, 0 (top three rows)
   Digit punches: 0-9
   Characters = combinations of zone + digit punches
   ═══════════════════════════════════════════ */

const EMAIL_ROWS = 12;
const EMAIL_COLS = 32;
const ROW_LABELS = ["12", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Hollerith encoding: character → row indices (0=row12, 1=row11, 2=row0, 3=row1, ..., 11=row9)
const HOLLERITH: Record<string, number[]> = {
  " ": [],
  // Digits: single punch in corresponding row
  "0": [2], "1": [3], "2": [4], "3": [5], "4": [6],
  "5": [7], "6": [8], "7": [9], "8": [10], "9": [11],
  // A-I: zone 12 + digit 1-9
  "A": [0, 3], "B": [0, 4], "C": [0, 5], "D": [0, 6], "E": [0, 7],
  "F": [0, 8], "G": [0, 9], "H": [0, 10], "I": [0, 11],
  // J-R: zone 11 + digit 1-9
  "J": [1, 3], "K": [1, 4], "L": [1, 5], "M": [1, 6], "N": [1, 7],
  "O": [1, 8], "P": [1, 9], "Q": [1, 10], "R": [1, 11],
  // S-Z: zone 0 + digit 2-9
  "S": [2, 4], "T": [2, 5], "U": [2, 6], "V": [2, 7],
  "W": [2, 8], "X": [2, 9], "Y": [2, 10], "Z": [2, 11],
  // Special characters (IBM 029 keypunch encoding)
  ".": [0, 5, 10],    // 12, 3, 8
  "@": [6, 10],        // 4, 8
  "-": [1],            // 11
  "_": [2, 7, 10],     // 0, 5, 8
  "+": [0, 8, 10],     // 12, 6, 8
  "/": [2, 3],         // 0, 1
  ",": [2, 5, 10],     // 0, 3, 8
  "#": [5, 10],        // 3, 8
  "!": [0, 4, 10],     // 12, 2, 8
  "&": [0],            // 12
  "*": [1, 6, 10],     // 11, 4, 8
  "=": [8, 10],        // 6, 8
  "'": [7, 10],        // 5, 8
  "%": [2, 6, 10],     // 0, 4, 8
  "(": [0, 7, 10],     // 12, 5, 8
  ")": [1, 7, 10],     // 11, 5, 8
};

// Reverse lookup: sorted row indices → character
const HOLLERITH_DECODE: Record<string, string> = {};
for (const [char, rows] of Object.entries(HOLLERITH)) {
  if (rows.length > 0) {
    HOLLERITH_DECODE[[...rows].sort((a, b) => a - b).join(",")] = char;
  }
}


function decodeHollerithCard(
  punched: Set<number>,
  cols: number,
): { char: string; hasHoles: boolean }[] {
  return Array.from({ length: cols }, (_, col) => {
    const rows: number[] = [];
    for (let r = 0; r < EMAIL_ROWS; r++) {
      if (punched.has(r * cols + col)) rows.push(r);
    }
    if (rows.length === 0) return { char: "", hasHoles: false };
    const key = rows.sort((a, b) => a - b).join(",");
    return { char: HOLLERITH_DECODE[key] || "?", hasHoles: true };
  });
}


/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function Waitlist() {
  const [emailCards, setEmailCards] = useState<Set<number>[]>([new Set()]);
  const [activeCard, setActiveCard] = useState(0);
  const [justPunched, setJustPunched] = useState<number | null>(null);
  const [mistakeMsg, setMistakeMsg] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentCardPunched = emailCards[activeCard];

  // Decode all cards into one email string (lowercased)
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

  /* ── card helpers ── */

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
      // Last card — reset it to blank
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

  /* ── punch a hole (permanent — no undo) ── */

  function punchHole(idx: number) {
    if (currentCardPunched.has(idx)) {
      // Already punched — show mistake message
      setMistakeMsg(true);
      setTimeout(() => setMistakeMsg(false), 3000);
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
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailString }),
      });
    } catch {
      // Submit anyway — the card has been filed locally
    }
    setSubmitted(true);
  }

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */

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
              WAITLIST
            </div>
          </div>
        </nav>

        <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto">
            {!submitted ? (
              <div>
                {/* Header */}
                <div className="text-center mb-10 animate-fade-up delay-1">
                  <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                    &#9670; OUT OF STOCK &#9670;
                  </p>
                  <h1 className="font-heading text-4xl sm:text-5xl text-fg-bright mb-4 leading-tight">
                    DEMAND HAS
                    <br />
                    EXCEEDED SUPPLY
                  </h1>
                  <p className="font-body text-lg text-fg-dim max-w-lg mx-auto leading-relaxed">
                    We do things the right way. The old-fashioned way. Our
                    entire operation &mdash; inventory, fulfillment, customer
                    service &mdash; runs on punch cards. No databases. No cloud.
                    Just 80 columns of truth.
                  </p>
                  <p className="font-body text-fg-dim/70 mt-3 max-w-md mx-auto">
                    Keypunch your email below and we&apos;ll notify you when the
                    next batch clears the keypunch queue.
                  </p>
                </div>

                <div className="mb-12 animate-fade-up delay-2">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-mono text-xs text-amber tracking-[0.2em]">
                      KEYPUNCH YOUR EMAIL
                    </span>
                    <span className="font-mono text-[10px] text-fg-dim/40">
                      12-ROW HOLLERITH ENCODING &mdash;{" "}
                      {emailCards.length} CARD
                      {emailCards.length > 1 ? "S" : ""} IN DECK
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
                                {d.hasHoles ? d.char.toLowerCase() : "\·"}
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
                            ? "\✓ Valid email"
                            : "Keep punching..."
                          : "Punch holes in the card below to encode your email"}
                      </span>
                      <span className="font-mono text-[10px] text-fg-dim/40 tabular-nums">
                        CARD {activeCard + 1} OF {emailCards.length}
                      </span>
                    </div>
                  </div>

                  {/* Hollerith reference */}
                  <details className="mb-4 group">
                    <summary className="font-mono text-[10px] text-amber/60 tracking-wider cursor-pointer hover:text-amber transition-colors select-none">
                      HOW TO PUNCH LETTERS &#9660;
                    </summary>
                    <div className="mt-3 bg-surface border border-amber/10 p-4 sm:p-5 space-y-4">
                      <p className="font-body text-sm text-fg-dim leading-relaxed">
                        Each column encodes one character. Punch the right
                        combination of a <strong>zone row</strong> (12, 11, or
                        0) and a <strong>digit row</strong> (1&ndash;9) to form
                        a letter. Punches are permanent &mdash; just like real
                        cardboard.
                      </p>

                      <div>
                        <div className="font-mono text-[9px] text-amber/50 tracking-wider mb-2">
                          LETTERS
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1 font-mono text-[11px] text-fg-dim">
                          <div>
                            <span className="text-amber/50">A&ndash;I</span> =
                            Row 12 + Row 1&ndash;9
                          </div>
                          <div>
                            <span className="text-amber/50">J&ndash;R</span> =
                            Row 11 + Row 1&ndash;9
                          </div>
                          <div>
                            <span className="text-amber/50">S&ndash;Z</span> =
                            Row 0 + Row 2&ndash;9
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-9 gap-1 font-mono text-[9px]">
                          {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(
                            (ch, i) => (
                              <div
                                key={ch}
                                className="text-center bg-elevated px-1 py-0.5"
                              >
                                <span className="text-amber">{ch}</span>
                                <span className="text-fg-dim/40">
                                  {" "}
                                  12,{i + 1}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="mt-1 grid grid-cols-9 gap-1 font-mono text-[9px]">
                          {["J", "K", "L", "M", "N", "O", "P", "Q", "R"].map(
                            (ch, i) => (
                              <div
                                key={ch}
                                className="text-center bg-elevated px-1 py-0.5"
                              >
                                <span className="text-amber">{ch}</span>
                                <span className="text-fg-dim/40">
                                  {" "}
                                  11,{i + 1}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="mt-1 grid grid-cols-9 gap-1 font-mono text-[9px]">
                          {["S", "T", "U", "V", "W", "X", "Y", "Z"].map(
                            (ch, i) => (
                              <div
                                key={ch}
                                className="text-center bg-elevated px-1 py-0.5"
                              >
                                <span className="text-amber">{ch}</span>
                                <span className="text-fg-dim/40">
                                  {" "}
                                  0,{i + 2}
                                </span>
                              </div>
                            ),
                          )}
                          <div />
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[9px] text-amber/50 tracking-wider mb-2">
                          DIGITS &amp; EMAIL SPECIALS
                        </div>
                        <div className="grid grid-cols-5 gap-1 font-mono text-[9px]">
                          {[
                            ["0", "0"],
                            ["1", "1"],
                            ["2", "2"],
                            ["3", "3"],
                            ["4", "4"],
                            ["5", "5"],
                            ["6", "6"],
                            ["7", "7"],
                            ["8", "8"],
                            ["9", "9"],
                            ["@", "4,8"],
                            [".", "12,3,8"],
                            ["-", "11"],
                            ["_", "0,5,8"],
                            ["+", "12,6,8"],
                          ].map(([ch, rows]) => (
                            <div
                              key={ch}
                              className="bg-elevated px-2 py-0.5 flex justify-between"
                            >
                              <span className="text-amber">{ch}</span>
                              <span className="text-fg-dim/40">{rows}</span>
                            </div>
                          ))}
                        </div>
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
                        style={{
                          clipPath:
                            "polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px)",
                        }}
                      >
                        CARD {i + 1}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            trashCard(i);
                          }}
                          className={`ml-1.5 hover:text-red transition-colors ${
                            i === activeCard
                              ? "text-void/30"
                              : "text-fg-dim/30"
                          }`}
                          title="Trash this card"
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
                    className="relative w-full bg-cream p-3 sm:p-4 shadow-[0_10px_40px_rgba(255,140,0,0.06)] overflow-x-auto"
                    style={{
                      clipPath:
                        "polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 14px)",
                    }}
                  >
                    <div className="text-[7px] sm:text-[8px] font-mono text-cream-dark tracking-[0.15em] mb-2 flex justify-between">
                      <span>
                        EMAIL CARD {activeCard + 1} OF{" "}
                        {emailCards.length}
                      </span>
                      <span>12-ROW HOLLERITH</span>
                    </div>

                    <div className="min-w-[480px]">
                      {/* Column numbers */}
                      <div className="flex mb-[2px]">
                        <div className="w-7 shrink-0" />
                        <div
                          className="flex-1 grid gap-[2px]"
                          style={{
                            gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from({ length: EMAIL_COLS }, (_, c) => (
                            <div
                              key={c}
                              className="text-[4px] sm:text-[5px] font-mono text-center text-cream-dark/25"
                            >
                              {activeCard * EMAIL_COLS + c + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Zone rows: 12, 11, 0 */}
                      <div className="flex">
                        <div className="w-7 shrink-0 flex flex-col gap-[2px] justify-center">
                          {ROW_LABELS.slice(0, 3).map((label, r) => (
                            <div
                              key={r}
                              className="text-[5px] sm:text-[6px] font-mono text-cream-dark/30 text-right pr-1.5 leading-none flex items-center justify-end"
                              style={{ height: "10px" }}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                        <div
                          className="flex-1 grid gap-[2px]"
                          style={{
                            gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from(
                            { length: 3 * EMAIL_COLS },
                            (_, i) => {
                              const col = i % EMAIL_COLS;
                              const absIdx =
                                Math.floor(i / EMAIL_COLS) * EMAIL_COLS + col;
                              const isPunched =
                                currentCardPunched.has(absIdx);
                              return (
                                <button
                                  key={i}
                                  onClick={() => punchHole(absIdx)}
                                  className={`h-[10px] rounded-[1px] cursor-pointer transition-all duration-150 ${
                                    isPunched
                                      ? "punch-hole-active"
                                      : "bg-cream-dark/10 hover:bg-cream-dark/18"
                                  } ${justPunched === col && isPunched ? "animate-punch" : ""}`}
                                />
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Zone/digit separator */}
                      <div className="flex my-[3px]">
                        <div className="w-7 shrink-0" />
                        <div className="flex-1 h-[1px] bg-cream-dark/20" />
                      </div>

                      {/* Digit rows: 1-9 */}
                      <div className="flex">
                        <div className="w-7 shrink-0 flex flex-col gap-[2px] justify-center">
                          {ROW_LABELS.slice(3).map((label, r) => (
                            <div
                              key={r}
                              className="text-[5px] sm:text-[6px] font-mono text-cream-dark/30 text-right pr-1.5 leading-none flex items-center justify-end"
                              style={{ height: "10px" }}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                        <div
                          className="flex-1 grid gap-[2px]"
                          style={{
                            gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from(
                            { length: 9 * EMAIL_COLS },
                            (_, i) => {
                              const row = Math.floor(i / EMAIL_COLS) + 3;
                              const col = i % EMAIL_COLS;
                              const absIdx = row * EMAIL_COLS + col;
                              const isPunched =
                                currentCardPunched.has(absIdx);
                              return (
                                <button
                                  key={i}
                                  onClick={() => punchHole(absIdx)}
                                  className={`h-[10px] rounded-[1px] cursor-pointer transition-all duration-150 ${
                                    isPunched
                                      ? "punch-hole-active"
                                      : "bg-cream-dark/10 hover:bg-cream-dark/18"
                                  } ${justPunched === col && isPunched ? "animate-punch" : ""}`}
                                />
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Decoded chars under each column */}
                      <div className="flex mt-1">
                        <div className="w-7 shrink-0" />
                        <div
                          className="flex-1 grid gap-[2px]"
                          style={{
                            gridTemplateColumns: `repeat(${EMAIL_COLS}, minmax(0, 1fr))`,
                          }}
                        >
                          {activeDecoded.map((d, c) => (
                            <div
                              key={c}
                              className={`text-[6px] sm:text-[7px] font-mono text-center ${
                                !d.hasHoles
                                  ? "text-cream-dark/15"
                                  : d.char === "?"
                                    ? "text-red/60"
                                    : "text-void/50"
                              }`}
                            >
                              {d.hasHoles ? d.char : "\·"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[6px] sm:text-[7px] font-mono text-cream-dark/30 text-center">
                      EACH COLUMN = ONE CHARACTER &mdash; ZONE PUNCH (12, 11,
                      0) + DIGIT PUNCH (1&ndash;9) &mdash; PUNCHES ARE PERMANENT
                    </div>
                  </div>

                  {/* Mistake message */}
                  <div className={`mt-2 text-center transition-opacity duration-300 ${mistakeMsg ? "opacity-100" : "opacity-0"}`}>
                    <span className="font-mono text-[10px] text-red/70">
                      Can&apos;t unpunch cardboard. Trash this card and start
                      fresh.
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="text-center animate-fade-up delay-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`font-mono text-sm tracking-[0.2em] px-10 py-4 transition-all duration-500 cursor-pointer ${
                      canSubmit
                        ? "bg-amber text-void hover:bg-amber-bright hover:shadow-[0_0_40px_rgba(255,140,0,0.3)]"
                        : "bg-amber/10 text-amber/30 cursor-not-allowed"
                    }`}
                  >
                    {validEmail
                      ? "SUBMIT REGISTRATION \→"
                      : emailString.length > 0
                        ? "KEEP PUNCHING\…"
                        : "KEYPUNCH YOUR EMAIL TO SUBMIT"}
                  </button>
                  <p className="font-mono text-[9px] text-fg-dim/50 mt-3">
                    BY SUBMITTING YOU AGREE TO RECEIVE EXACTLY ONE (1) EMAIL.
                  </p>
                </div>
              </div>
            ) : (
              /* ── SUCCESS ── */
              <div className="text-center animate-fade-up delay-1">
                <p className="font-mono text-xs tracking-[0.4em] text-green mb-4">
                  &#9670; CARDS FILED &#9670;
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl text-fg-bright mb-4 leading-tight">
                  YOUR {emailCards.length} PUNCH CARD
                  {emailCards.length > 1 ? "S" : ""}
                  <br />
                  <span className="text-green glow-green">
                    {emailCards.length > 1
                      ? "HAVE BEEN FILED"
                      : "HAS BEEN FILED"}
                  </span>
                </h1>

                <p className="font-body text-lg text-fg-dim max-w-md mx-auto leading-relaxed mb-2">
                  We&apos;ll reach out to{" "}
                  <span className="text-amber font-mono text-sm">
                    {emailString}
                  </span>{" "}
                  as soon as the next batch clears the keypunch queue.
                </p>
                <p className="font-mono text-xs text-fg-dim/40 mb-8">
                  Your {emailCards.length}-card Hollerith deck has been
                  verified, sorted, and filed.
                  <br />
                  Estimated processing time: 3&ndash;7 business days per card.
                </p>

                {/* Mini receipts */}
                <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto mb-10">
                  {emailCards.map((card, ci) => {
                    const dec = decodeHollerithCard(card, EMAIL_COLS);
                    return (
                      <div
                        key={ci}
                        className="bg-cream p-2.5 shadow-md text-left w-36"
                        style={{
                          clipPath:
                            "polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)",
                        }}
                      >
                        <div className="text-[6px] font-mono text-cream-dark tracking-wider mb-1">
                          CARD {ci + 1} &mdash; HOLLERITH
                        </div>
                        <div className="font-mono text-[8px] text-void/60 break-all leading-tight">
                          {dec
                            .map((d) => d.char.toLowerCase())
                            .join("")
                            .trimEnd() || "(empty)"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/"
                  className="inline-block font-mono text-sm tracking-[0.2em] text-void bg-amber hover:bg-amber-bright px-8 py-3 transition-all duration-300"
                >
                  &larr; BACK TO SHOP
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
