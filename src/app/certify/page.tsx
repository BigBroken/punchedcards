"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════
   QUESTIONS
   ═══════════════════════════════════════════ */

const QUESTIONS = [
  {
    question:
      "How many characters of data can a standard IBM 80-column punch card store?",
    options: ["64 characters", "80 characters", "128 characters", "960 characters"],
    correct: 1,
    explanation:
      "Each of the 80 columns encodes exactly one character. The 12 rows per column determine which character via Hollerith encoding, but the storage capacity is 80 characters (80 bytes) per card.",
  },
  {
    question:
      'A standard IBM punch card measures 7.375" \× 3.25" with 80 columns \× 12 rows of punch positions. What is the approximate data density in bits per square inch?',
    options: [
      "~12 bits/in\²",
      "~25 bits/in\²",
      "~40 bits/in\²",
      "~80 bits/in\²",
    ],
    correct: 2,
    explanation:
      "Total bit positions: 80 \× 12 = 960 bits. Card area: 7.375 \× 3.25 = 23.97 in\². Density: 960 \÷ 23.97 \≈ 40.05 bits/in\².",
  },
  {
    question:
      "An IBM 083 card sorter examines one column per pass. How many passes are needed to sort a deck by a 6-digit employee ID?",
    options: [
      "1 pass",
      "6 passes",
      "log\₂(N) passes, where N = deck size",
      "36 passes",
    ],
    correct: 1,
    explanation:
      "Mechanical card sorters implement radix sort (LSD variant). Each digit position requires exactly one pass through the sorter, so a 6-digit key requires 6 passes \— regardless of deck size.",
  },
  {
    question:
      "Each column on a 12-row Hollerith card can have any combination of holes punched. What is the theoretical maximum number of distinct values representable per column?",
    options: ["12", "256", "4,096", "479,001,600"],
    correct: 2,
    explanation:
      "Each of the 12 rows is either punched or not \— a binary choice. 2\¹\² = 4,096 possible combinations per column. (479,001,600 = 12!, a factorial red herring.)",
  },
  {
    question:
      "An IBM 2540 card reader processes 1,000 cards per minute. What is the effective data throughput in bytes per second?",
    options: [
      "~80 bytes/sec",
      "~800 bytes/sec",
      "~1,333 bytes/sec",
      "~13,333 bytes/sec",
    ],
    correct: 2,
    explanation:
      "1,000 cards/min \× 80 bytes/card = 80,000 bytes/min. Divide by 60: 80,000 \÷ 60 = 1,333.3 bytes/sec \— roughly 1.3 KB/s.",
  },
  {
    question:
      "Approximately how many standard 80-column punch cards would you need to store 1 gigabyte of data?",
    options: [
      "~1.3 million cards",
      "~13.4 million cards",
      "~134 million cards",
      "~1.3 billion cards",
    ],
    correct: 1,
    explanation:
      "1 GB = 1,073,741,824 bytes. At 80 bytes per card: 1,073,741,824 \÷ 80 = 13,421,773 cards, or approximately 13.4 million.",
  },
  {
    question:
      "A standard punch card is 0.178 mm thick. How tall would a stack of 1 million cards be?",
    options: ["17.8 meters", "56 meters", "178 meters", "1,780 meters"],
    correct: 2,
    explanation:
      "1,000,000 \× 0.178 mm = 178,000 mm = 178 meters. That\'s roughly the height of a 50-story building.",
  },
  {
    question:
      'In standard Hollerith encoding, the letter "A" is represented by punches in which rows?',
    options: [
      "Row 12 and Row 1",
      "Row 0 and Row 1",
      "Row 11 and Row 1",
      "Row 1 only",
    ],
    correct: 0,
    explanation:
      "In Hollerith encoding, letters A\–I use Zone 12 (the top zone punch) plus digit rows 1\–9. So \'A\' = Row 12 (zone) + Row 1 (digit).",
  },
  {
    question:
      "You need to sort 5,000 punch cards by a 4-digit numeric field using a sorter running at 1,000 cards/minute. What is the total sort time?",
    options: ["5 minutes", "10 minutes", "20 minutes", "50 minutes"],
    correct: 2,
    explanation:
      "Radix sort requires one pass per digit position: 4 passes. Each pass processes the full deck: 5,000 \÷ 1,000 = 5 min per pass. Total: 4 \× 5 = 20 minutes.",
  },
  {
    question:
      "A single IBM punch card weighs ~1.764 grams. Approximately how much would the cards needed to store 1 terabyte weigh?",
    options: [
      "~240 metric tons",
      "~2,400 metric tons",
      "~24,000 metric tons",
      "~240,000 metric tons",
    ],
    correct: 2,
    explanation:
      "1 TB \≈ 1.1 \× 10\¹\² bytes \÷ 80 \≈ 13.74 billion cards. Weight: 13.74 \× 10\⁹ \× 1.764 g \≈ 24,244 metric tons \— about four Eiffel Towers.",
  },
];

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function generateCredentialId(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return `PC-2026-${Math.abs(hash).toString(16).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Certify() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [name, setName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  /* ── Abacus state ── */
  const [abacus, setAbacus] = useState(
    () => Array.from({ length: 13 }, () => ({ heaven: false, earth: 0 })),
  );

  const abacusValue = abacus.reduce(
    (sum, col, i) =>
      sum + ((col.heaven ? 5 : 0) + col.earth) * Math.pow(10, 12 - i),
    0,
  );

  function toggleHeaven(col: number) {
    setAbacus((prev) => {
      const next = prev.map((c) => ({ ...c }));
      next[col].heaven = !next[col].heaven;
      return next;
    });
  }

  function handleEarth(col: number, pos: number) {
    setAbacus((prev) => {
      const next = prev.map((c) => ({ ...c }));
      if (pos < next[col].earth) {
        next[col].earth = pos;
      } else {
        next[col].earth = pos + 1;
      }
      return next;
    });
  }

  function clearAbacus() {
    setAbacus(Array.from({ length: 13 }, () => ({ heaven: false, earth: 0 })));
  }

  const [showAbacus, setShowAbacus] = useState(false);

  /* ── Computed ── */
  const q = QUESTIONS[currentQ];
  const passed = score >= 7;
  const credentialId = generateCredentialId(name);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const answered = currentQ + (confirmed ? 1 : 0);

  function handleConfirm() {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.correct) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentQ + 1 >= QUESTIONS.length) {
      setPhase("result");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function handleRetake() {
    setPhase("quiz");
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />

      <div className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="border-b border-amber/10 bg-void/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-sm tracking-[0.3em] text-amber hover:text-amber-bright transition-colors"
            >
              PUNCHED CARDS&trade;
            </Link>
            <div className="font-mono text-xs text-fg-dim tracking-wider">
              CERTIFICATION EXAM
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            {/* ── INTRO ── */}
            {phase === "intro" && (
              <div className="text-center animate-fade-up delay-1">
                <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                  &#9670; CERTIFICATION &#9670;
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl text-fg-bright mb-4 leading-tight">
                  PUNCH CARD
                  <br />
                  PROFICIENCY EXAM
                </h1>
                <p className="font-body text-fg-dim max-w-md mx-auto mb-2 leading-relaxed">
                  10 questions on analog computation, Hollerith encoding, data
                  density, and punch card engineering. Real calculations
                  required. No hand-holding.
                </p>
                <p className="font-body text-sm text-amber-dim max-w-sm mx-auto mb-3 leading-relaxed italic">
                  Employers are actively seeking candidates with this
                  in-demand certification. Stand out from the crowd.
                </p>
                <p className="font-mono text-xs text-amber mb-10">
                  PASSING SCORE: 7/10
                </p>

                <div className="max-w-xs mx-auto mb-8">
                  <label className="block font-mono text-[10px] text-fg-dim tracking-wider mb-2 text-left">
                    ENTER YOUR NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && name.trim()) setPhase("quiz");
                    }}
                    placeholder="Your full name"
                    className="w-full bg-surface border border-amber/20 text-fg-bright font-mono text-sm px-4 py-3 focus:outline-none focus:border-amber transition-colors placeholder:text-fg-dim/30"
                  />
                </div>

                <button
                  onClick={() => name.trim() && setPhase("quiz")}
                  disabled={!name.trim()}
                  className="font-mono text-sm tracking-[0.2em] bg-amber text-void px-8 py-3 hover:bg-amber-bright transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  BEGIN EXAMINATION &rarr;
                </button>
              </div>
            )}

            {/* ── QUIZ ── */}
            {phase === "quiz" && (
              <div>
                {/* Progress */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-fg-dim">
                    QUESTION{" "}
                    {String(currentQ + 1).padStart(2, "0")}/{QUESTIONS.length}
                  </span>
                  <span className="font-mono text-xs text-amber">
                    SCORE: {score}/{answered}
                  </span>
                </div>
                <div className="h-0.5 bg-amber/10 mb-10">
                  <div
                    className="h-full bg-amber transition-all duration-500"
                    style={{
                      width: `${(answered / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question */}
                <h2 className="font-body text-lg sm:text-xl text-fg-bright leading-relaxed mb-8">
                  {q.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {q.options.map((option, idx) => {
                    let border = "border-amber/10 hover:border-amber/30";
                    let bg = "bg-surface";
                    let text = "text-fg";

                    if (confirmed) {
                      if (idx === q.correct) {
                        border = "border-green/60";
                        bg = "bg-green/5";
                        text = "text-green";
                      } else if (idx === selected && idx !== q.correct) {
                        border = "border-red/60";
                        bg = "bg-red/5";
                        text = "text-red";
                      } else {
                        border = "border-amber/5";
                        text = "text-fg-dim";
                      }
                    } else if (idx === selected) {
                      border = "border-amber";
                      bg = "bg-amber/5";
                      text = "text-amber";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !confirmed && setSelected(idx)}
                        disabled={confirmed}
                        className={`w-full text-left px-5 py-4 border ${border} ${bg} ${text} font-mono text-sm transition-all duration-200 cursor-pointer disabled:cursor-default flex items-start gap-3`}
                      >
                        <span className="text-fg-dim/40 shrink-0">
                          {String.fromCharCode(65 + idx)})
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {confirmed && (
                  <div
                    className={`mb-8 p-4 border-l-2 ${
                      selected === q.correct
                        ? "border-green bg-green/5"
                        : "border-red bg-red/5"
                    }`}
                  >
                    <div
                      className={`font-mono text-xs tracking-wider mb-2 ${
                        selected === q.correct ? "text-green" : "text-red"
                      }`}
                    >
                      {selected === q.correct
                        ? "\u2713 CORRECT"
                        : "\u2717 INCORRECT"}
                    </div>
                    <p className="font-body text-sm text-fg-dim leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {!confirmed ? (
                    <button
                      onClick={handleConfirm}
                      disabled={selected === null}
                      className="font-mono text-sm tracking-[0.15em] bg-amber text-void px-8 py-3 hover:bg-amber-bright transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      CONFIRM &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="font-mono text-sm tracking-[0.15em] bg-amber text-void px-8 py-3 hover:bg-amber-bright transition-colors cursor-pointer"
                    >
                      {currentQ + 1 >= QUESTIONS.length
                        ? "VIEW RESULTS \u2192"
                        : "NEXT QUESTION \u2192"}
                    </button>
                  )}

                  <button
                    onClick={() => setShowAbacus((s) => !s)}
                    className={`font-mono text-[11px] tracking-wider px-4 py-3 transition-all cursor-pointer border ${
                      showAbacus
                        ? "border-amber/40 text-amber bg-amber/5"
                        : "border-amber/15 text-fg-dim hover:text-amber hover:border-amber/30"
                    }`}
                  >
                    {showAbacus ? "HIDE ABACUS" : "NEED HELP?"}
                  </button>
                </div>

                {/* ── SOROBAN ABACUS (toggled) ── */}
                {showAbacus && (
                  <div className="mt-8 overflow-hidden">
                    {/* Wooden frame */}
                    <div
                      className="rounded-md p-1"
                      style={{
                        background: "linear-gradient(180deg, #5c3d1e 0%, #4a3018 50%, #3d2713 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.4)",
                      }}
                    >
                      {/* Inner frame */}
                      <div
                        className="rounded-sm p-3 relative"
                        style={{
                          background: "linear-gradient(180deg, #4a3018 0%, #3d2713 100%)",
                          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
                        }}
                      >
                        {/* Value display */}
                        <div className="font-mono text-xl text-amber glow-amber text-center mb-3 tabular-nums tracking-wide">
                          {abacusValue.toLocaleString()}
                        </div>

                        {/* Bead area */}
                        <div className="flex justify-center gap-[3px]">
                          {abacus.map((col, colIdx) => (
                            <div
                              key={colIdx}
                              className="flex flex-col items-center w-[22px] relative"
                            >
                              {/* Rod */}
                              <div
                                className="absolute top-0 bottom-0 w-[2px] rounded-full"
                                style={{
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  background: "linear-gradient(90deg, #8B7355 0%, #a08060 50%, #8B7355 100%)",
                                  boxShadow: "0 0 2px rgba(0,0,0,0.3)",
                                }}
                              />

                              {/* Heaven bead (top, value = 5) */}
                              <div className="h-14 flex flex-col items-center justify-end relative z-10">
                                <button
                                  onClick={() => toggleHeaven(colIdx)}
                                  className="cursor-pointer transition-all duration-200"
                                  style={{
                                    width: "20px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    background: col.heaven
                                      ? "radial-gradient(ellipse at 40% 35%, #e8a020 0%, #c07018 60%, #8B5E14 100%)"
                                      : "radial-gradient(ellipse at 40% 35%, #d49025 0%, #a06815 60%, #7a4e10 100%)",
                                    boxShadow: col.heaven
                                      ? "0 2px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,160,32,0.3), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)"
                                      : "0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.15)",
                                    transform: col.heaven ? "translateY(0)" : "translateY(-20px)",
                                    border: "1px solid rgba(0,0,0,0.2)",
                                  }}
                                />
                              </div>

                              {/* Divider bar */}
                              <div
                                className="w-full my-[2px] relative z-10"
                                style={{
                                  height: "3px",
                                  background: "linear-gradient(180deg, #6b4c28 0%, #4a3018 50%, #6b4c28 100%)",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                                }}
                              />

                              {/* Earth beads (bottom, value = 1 each) */}
                              <div className="flex flex-col items-center relative z-10">
                                {[0, 1, 2, 3].map((pos) => {
                                  const active = pos < col.earth;
                                  const isGap =
                                    pos === col.earth &&
                                    col.earth > 0 &&
                                    col.earth < 4;
                                  return (
                                    <button
                                      key={pos}
                                      onClick={() => handleEarth(colIdx, pos)}
                                      className="cursor-pointer transition-all duration-200"
                                      style={{
                                        width: "20px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        marginTop: isGap ? "14px" : "3px",
                                        background: active
                                          ? "radial-gradient(ellipse at 40% 35%, #e8a020 0%, #c07018 60%, #8B5E14 100%)"
                                          : "radial-gradient(ellipse at 40% 35%, #d49025 0%, #a06815 60%, #7a4e10 100%)",
                                        boxShadow: active
                                          ? "0 2px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,160,32,0.3), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)"
                                          : "0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.15)",
                                        border: "1px solid rgba(0,0,0,0.2)",
                                      }}
                                    />
                                  );
                                })}
                              </div>

                              {/* Place label */}
                              <div className="font-mono text-[7px] text-amber/30 mt-2 select-none">
                                {["T","","","B","","","M","","","K","","","1"][colIdx]}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-mono text-[8px] text-amber/30 tracking-wider select-none">
                            Top = 5 &middot; Bottom = 1
                          </span>
                          <button
                            onClick={clearAbacus}
                            className="font-mono text-[9px] text-amber/40 hover:text-amber transition-colors cursor-pointer"
                          >
                            CLEAR
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── RESULT ── */}
            {phase === "result" && (
              <div>
                <div className="text-center mb-12 animate-fade-up delay-1">
                  <p className="font-mono text-xs tracking-[0.4em] text-amber mb-4">
                    &#9670; EXAMINATION COMPLETE &#9670;
                  </p>
                  <div className="font-heading text-6xl sm:text-7xl text-fg-bright mb-2">
                    {score}/10
                  </div>
                  <div
                    className={`font-mono text-sm tracking-[0.3em] ${
                      passed
                        ? "text-green glow-green"
                        : "text-red glow-red"
                    }`}
                  >
                    {passed ? "PASS" : "FAIL"}
                  </div>
                </div>

                {passed ? (
                  <div className="animate-fade-up delay-2">
                    {/* Certificate */}
                    <div className="border-2 border-amber/60 p-8 sm:p-10 bg-void relative mb-12">
                      <div className="absolute top-3 right-3 font-mono text-[7px] text-amber/20 tracking-wider">
                        FORM PC-CERT-001
                      </div>

                      <div className="text-center">
                        <div className="font-mono text-[10px] tracking-[0.5em] text-amber mb-1">
                          PUNCHED CARDS&trade;
                        </div>
                        <div className="font-heading text-2xl sm:text-3xl text-fg-bright mb-0.5">
                          CERTIFICATION
                        </div>
                        <div className="font-mono text-[9px] text-fg-dim tracking-[0.2em] mb-8">
                          ANALOG COMPUTATION PROFICIENCY
                        </div>

                        <div className="font-mono text-[9px] text-fg-dim/60 tracking-wider mb-1">
                          THIS CERTIFIES THAT
                        </div>
                        <div className="font-heading text-3xl sm:text-4xl text-amber glow-amber mb-1">
                          {name}
                        </div>
                        <div className="font-body text-sm text-fg-dim mb-8 max-w-sm mx-auto leading-relaxed">
                          has demonstrated proficiency in analog computation and
                          punch card engineering
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div>
                            <div className="font-mono text-[9px] text-fg-dim/60 tracking-wider mb-1">
                              SCORE
                            </div>
                            <div className="font-mono text-lg text-amber">
                              {score}/10
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-[9px] text-fg-dim/60 tracking-wider mb-1">
                              DATE
                            </div>
                            <div className="font-mono text-sm text-amber">
                              {today}
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-[9px] text-fg-dim/60 tracking-wider mb-1">
                              CREDENTIAL
                            </div>
                            <div className="font-mono text-sm text-amber">
                              {credentialId}
                            </div>
                          </div>
                        </div>

                        {/* Decorative punch holes */}
                        <div className="flex gap-[3px] justify-center">
                          {Array.from({ length: 30 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-2 rounded-[1px] ${
                                (i * 7 + 3) % 4 < 2
                                  ? "bg-amber/40"
                                  : "bg-amber/10"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn Instructions */}
                    <div className="bg-surface border border-amber/10 p-6 sm:p-8 mb-8">
                      <h3 className="font-mono text-sm text-amber tracking-wider mb-4">
                        ADD TO LINKEDIN
                      </h3>
                      <ol className="space-y-2 font-body text-sm text-fg-dim mb-6">
                        <li>1. Go to your LinkedIn profile</li>
                        <li>
                          2. Click &quot;Add section&quot; &rarr; &quot;Licenses
                          &amp; Certifications&quot;
                        </li>
                        <li>3. Fill in the details below:</li>
                      </ol>
                      <div className="space-y-3">
                        {[
                          {
                            label: "Name",
                            value: "Punch Card Certified Developer",
                          },
                          {
                            label: "Issuing Organization",
                            value: "Punched Cards Inc.",
                          },
                          { label: "Credential ID", value: credentialId },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex items-center justify-between bg-elevated p-3"
                          >
                            <div>
                              <div className="font-mono text-[10px] text-fg-dim/60 tracking-wider">
                                {label.toUpperCase()}
                              </div>
                              <div className="font-mono text-sm text-fg-bright">
                                {value}
                              </div>
                            </div>
                            <button
                              onClick={() => copyText(value, label)}
                              className="font-mono text-[10px] text-amber hover:text-amber-bright transition-colors px-2 py-1 cursor-pointer"
                            >
                              {copied === label ? "COPIED!" : "COPY"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center animate-fade-up delay-2">
                    <p className="font-body text-fg-dim mb-2 leading-relaxed">
                      Required score: 7/10. You scored {score}/10.
                    </p>
                    <p className="font-mono text-xs text-fg-dim/60 mb-8">
                      Maybe practice with some actual punch cards first.
                    </p>
                    <button
                      onClick={handleRetake}
                      className="font-mono text-sm tracking-[0.15em] bg-amber text-void px-8 py-3 hover:bg-amber-bright transition-colors cursor-pointer"
                    >
                      RETAKE EXAM &rarr;
                    </button>
                  </div>
                )}

                <div className="text-center mt-8">
                  <Link
                    href="/"
                    className="font-mono text-xs text-fg-dim hover:text-amber transition-colors tracking-wider"
                  >
                    &larr; BACK TO SHOP
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
