import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Google Font ─────────────────────────────────────────────────────────── */
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900;1000&display=swap";
document.head.appendChild(FONT_LINK);

const STYLE = document.createElement("style");
STYLE.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body, #root { font-family: 'Nunito', sans-serif; background: #f0fdf4; min-height: 100vh; }

  @keyframes confettiFall {
    0%   { transform: translateY(-30px) rotate(0deg) scale(1); opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateY(105vh) rotate(900deg) scale(0.5); opacity: 0; }
  }
  @keyframes popIn {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes bobble {
    0%,100% { transform: translateY(0) rotate(-3deg); }
    50%     { transform: translateY(-14px) rotate(3deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.6); opacity: 0;  }
  }
  @keyframes starSpin {
    from { transform: rotate(0deg) scale(1); }
    50%  { transform: rotate(180deg) scale(1.3); }
    to   { transform: rotate(360deg) scale(1); }
  }

  .animate-pop   { animation: popIn   .35s cubic-bezier(.34,1.56,.64,1) both; }
  .animate-slide { animation: slideUp .3s ease both; }
  .animate-fade  { animation: fadeIn  .4s ease both; }

  .btn-press:active { transform: scale(.94); }

  .option-btn {
    width: 100%; text-align: left; padding: 14px 18px;
    border-radius: 20px; border: 2.5px solid #d1fae5;
    background: #fff; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700; color: #1e3a29;
    cursor: pointer; transition: all .18s ease;
    display: flex; align-items: center; gap: 12px;
  }
  .option-btn:not([disabled]):hover {
    border-color: #10b981; background: #ecfdf5;
    transform: translateX(4px);
  }
  .option-btn.correct {
    border-color: #10b981; background: #10b981; color: #fff;
    transform: scale(1.02);
  }
  .option-btn.wrong {
    border-color: #f87171; background: #f87171; color: #fff;
  }
  .option-btn.dimmed {
    border-color: #e5e7eb; background: #f9fafb; color: #9ca3af; opacity: .6;
  }
  .option-btn[disabled] { cursor: default; }

  .cat-btn {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 16px; border: 2px solid #d1fae5;
    background: #fff; cursor: pointer; transition: all .15s ease;
    font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
    color: #374151; text-align: left;
  }
  .cat-btn:hover  { border-color: #10b981; background: #ecfdf5; transform: translateY(-2px); }
  .cat-btn.active { border-color: #059669; background: #059669; color: #fff; transform: scale(.97); }

  .diff-btn {
    padding: 14px 10px; border-radius: 20px; border: 2.5px solid #d1fae5;
    background: #fff; cursor: pointer; transition: all .15s ease;
    font-family: 'Nunito', sans-serif; text-align: center; font-weight: 800;
  }
  .diff-btn:hover  { border-color: #10b981; background: #ecfdf5; transform: translateY(-2px); }
  .diff-btn.active { border-color: #059669; background: #059669; color: #fff; }

  .count-btn {
    padding: 14px; border-radius: 16px; border: 2.5px solid #d1fae5;
    background: #fff; cursor: pointer; transition: all .15s ease;
    font-family: 'Nunito', sans-serif; font-size: 22px; font-weight: 900;
    color: #1e3a29; text-align: center;
  }
  .count-btn:hover  { border-color: #10b981; background: #ecfdf5; transform: scale(1.05); }
  .count-btn.active { border-color: #059669; background: #059669; color: #fff; }

  .progress-bar-track {
    width: 100%; height: 10px; background: #d1fae5;
    border-radius: 99px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; background: linear-gradient(90deg, #059669, #10b981);
    border-radius: 99px; transition: width .5s cubic-bezier(.4,0,.2,1);
  }

  .card {
    background: #fff; border-radius: 24px;
    border: 2px solid #d1fae5; padding: 20px;
  }
  .card-shadow { box-shadow: 0 4px 20px rgba(16,185,129,.12); }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 800;
  }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-amber { background: #fef3c7; color: #92400e; }
  .badge-red   { background: #fee2e2; color: #991b1b; }

  .star-filled { color: #f59e0b; }
  .star-empty  { color: #d1d5db; }

  .shimmer-btn {
    background: linear-gradient(90deg, #059669 0%, #10b981 40%, #34d399 60%, #059669 100%);
    background-size: 200% auto; animation: shimmer 2.4s linear infinite;
    border: none; color: #fff; font-family: 'Nunito', sans-serif;
    font-size: 20px; font-weight: 900; padding: 18px 32px;
    border-radius: 99px; cursor: pointer; transition: transform .15s, opacity .15s;
    width: 100%;
  }
  .shimmer-btn:hover   { transform: scale(1.03); opacity: .95; }
  .shimmer-btn:active  { transform: scale(.97); }
  .shimmer-btn:disabled {
    background: #e5e7eb; color: #9ca3af; animation: none; cursor: not-allowed;
    transform: none;
  }

  .did-you-know {
    background: #fffbeb; border: 2px solid #fcd34d; border-radius: 18px;
    padding: 14px 16px; margin-top: 12px; animation: slideUp .3s ease;
  }

  .result-score-ring {
    position: relative; width: 140px; height: 140px; margin: 0 auto;
  }
  .result-score-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .result-score-ring .score-text {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; transform: none;
  }
`;
document.head.appendChild(STYLE);

/* ─── Constants ───────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "quran_stories",  label: "Quran Stories",          icon: "📖" },
  { id: "prophets",       label: "Prophets in Islam",       icon: "🌟" },
  { id: "adab",           label: "Islamic Manners",         icon: "🤲" },
  { id: "history",        label: "Islamic History",         icon: "🏛️"  },
  { id: "duas",           label: "Daily Duas",              icon: "🙏" },
  { id: "ramadan",        label: "Ramadan & Fasting",       icon: "🌙" },
  { id: "prayer",         label: "Masjid & Prayer",         icon: "🕌" },
  { id: "sahaba",         label: "Companions (Sahaba)",     icon: "⭐" },
  { id: "knowledge",      label: "Islamic Knowledge",       icon: "🧠" },
];

const DIFFICULTIES = [
  { id: "easy",   label: "Easy",   ages: "Ages 8–10",  emoji: "🌱" },
  { id: "medium", label: "Medium", ages: "Ages 10–12", emoji: "🌿" },
  { id: "hard",   label: "Hard",   ages: "Ages 12–14", emoji: "🌳" },
];

const RESULT_MESSAGES = [
  "MashaAllah! You're an Islamic Trivia Champion! 🏆",
  "Knowledge is a path to Jannah! Keep it up! 📖",
  "SubhanAllah! You're so knowledgeable! ✨",
  "Allah loves those who seek knowledge! 🤲",
  "Alhamdulillah! Keep learning about Islam! 🌙",
  "Amazing effort! May Allah bless your learning! ⭐",
];

const OPTION_LETTERS = ["A", "B", "C", "D"];

/* ─── Confetti ────────────────────────────────────────────────────────────── */
const CONFETTI_COLORS = [
  "#10b981","#f59e0b","#3b82f6","#ec4899","#8b5cf6","#06b6d4","#f97316","#84cc16",
];

function Confetti({ active }) {
  const particles = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1 + Math.random() * 1.4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 7 + Math.random() * 9,
      rotation: Math.random() * 360,
      isCircle: Math.random() > 0.5,
    }))
  ).current;

  if (!active) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9999 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.isCircle ? "50%" : "3px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Score Ring ─────────────────────────────────────────────────────────── */
function ScoreRing({ score, total }) {
  const pct = total > 0 ? score / total : 0;
  const R = 56, C = 2 * Math.PI * R;
  const filled = C * pct;
  const color = pct >= 0.8 ? "#10b981" : pct >= 0.5 ? "#f59e0b" : "#f87171";

  return (
    <div className="result-score-ring">
      <svg viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke="#d1fae5" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={R} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${C}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="score-text">
        <span style={{ fontSize: 30, fontWeight: 900, color: "#1e3a29" }}>{score}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>of {total}</span>
      </div>
    </div>
  );
}

/* ─── Stars ──────────────────────────────────────────────────────────────── */
function Stars({ score, total }) {
  const pct = total > 0 ? score / total : 0;
  const filled = pct >= 0.9 ? 5 : pct >= 0.7 ? 4 : pct >= 0.5 ? 3 : pct >= 0.3 ? 2 : 1;
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", fontSize: 28 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= filled ? "star-filled" : "star-empty"}
          style={{
            display: "inline-block",
            animation: s <= filled ? `starSpin .5s ${s * 0.12}s ease both` : "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── API Call ────────────────────────────────────────────────────────────── */
async function fetchQuestions(categories, difficulty, count) {
  const catNames = categories
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const ageRange =
    difficulty === "easy" ? "8–10, use very simple language and basic concepts"
    : difficulty === "medium" ? "10–12, use moderate depth with some detail"
    : "12–14, use more detailed Islamic knowledge";

  const prompt = `You are an expert Islamic educator creating trivia questions for Muslim children.

Generate exactly ${count} trivia questions for kids ages ${ageRange}.
Topics to cover (distribute evenly): ${catNames}
Difficulty: ${difficulty}

STRICT RULES:
1. All facts must be authentic — based on Quran, Sahih Hadith, or well-established Islamic history
2. Language must be clear and age-appropriate
3. Avoid controversial topics (fiqh disputes, sectarian issues, political matters)
4. Focus on positive Islamic values, stories, worship, and knowledge
5. Each question must have exactly 4 distinct options — only ONE correct
6. The correctAnswer must be the EXACT string from the options array
7. The "didYouKnow" field is an interesting related Islamic fact (1–2 sentences)
8. Vary the categories — do not repeat the same category more than ${Math.ceil(count / categories.length) + 1} times

Return ONLY a valid JSON array. No markdown, no backticks, no preamble, no trailing text.

[
  {
    "question": "...",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": "Option B text",
    "explanation": "Brief educational explanation (2–3 sentences).",
    "category": "Category Name",
    "difficulty": "${difficulty}",
    "didYouKnow": "Interesting related fact..."
  }
]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const raw = data.content.map((b) => b.text || "").join("");

  // Robust JSON extraction
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array found in response");
  return JSON.parse(match[0]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN: WELCOME
════════════════════════════════════════════════════════════════════════════ */
function WelcomeScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "32px 24px",
        textAlign: "center", background: "linear-gradient(175deg, #ecfdf5 0%, #f0fdf4 60%, #fff 100%)",
      }}
    >
      {/* Decorative top icons */}
      <div style={{ display: "flex", gap: 18, marginBottom: 16, fontSize: 28 }}>
        {["🌙","📖","🕌","⭐","🤲"].map((e, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              animation: `bobble ${1.4 + i * 0.2}s ${i * 0.15}s ease-in-out infinite`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      {/* Title */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 56, fontWeight: 900, lineHeight: 1.1,
            background: "linear-gradient(135deg, #059669 30%, #10b981 70%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-1px",
          }}
        >
          Islam Quest
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#6b7280", marginTop: 4 }}>
          ✨ The Islamic Trivia Game ✨
        </div>
      </div>

      {/* Tagline card */}
      <div
        className="card card-shadow animate-slide"
        style={{ maxWidth: 320, margin: "24px 0", padding: "18px 22px" }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", lineHeight: 1.6 }}>
          Test your Islamic knowledge, earn stars, and discover amazing facts about Islam! 🌟
        </p>
      </div>

      {/* Feature pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
        {[
          ["⭐", "Earn Points"],
          ["🎉", "Confetti Wins"],
          ["🧠", "Learn Facts"],
          ["🏆", "Beat Your Score"],
        ].map(([icon, label]) => (
          <span key={label} className="badge badge-green" style={{ fontSize: 13 }}>
            {icon} {label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="shimmer-btn btn-press" onClick={onStart} style={{ maxWidth: 320 }}>
        🎮 Start Playing!
      </button>

      <p style={{ marginTop: 20, fontSize: 13, color: "#9ca3af", fontWeight: 700 }}>
        For Muslim kids ages 8–14
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN: SETUP
════════════════════════════════════════════════════════════════════════════ */
function SetupScreen({ onBack, onStartGame }) {
  const [selectedCats, setSelectedCats] = useState([]);
  const [difficulty, setDifficulty]     = useState("medium");
  const [count, setCount]               = useState(10);

  const toggle = (id) =>
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const selectAll = () =>
    setSelectedCats(
      selectedCats.length === CATEGORIES.length ? [] : CATEGORIES.map((c) => c.id)
    );

  const canStart = selectedCats.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh", background: "#f0fdf4", paddingBottom: 100,
        maxWidth: 520, margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(240,253,244,.95)", backdropFilter: "blur(8px)",
          padding: "16px 20px 12px", borderBottom: "2px solid #d1fae5",
          display: "flex", alignItems: "center", gap: 12,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "#ecfdf5", border: "2px solid #d1fae5",
            borderRadius: 12, padding: "6px 14px", fontFamily: "Nunito, sans-serif",
            fontSize: 14, fontWeight: 800, color: "#059669", cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#1e3a29" }}>Game Setup</span>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* ── Categories ── */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 900, color: "#1e3a29" }}>
              📚 Choose Categories
            </span>
            <button
              onClick={selectAll}
              style={{
                background: "none", border: "2px solid #10b981", borderRadius: 10,
                padding: "4px 12px", fontFamily: "Nunito, sans-serif",
                fontSize: 12, fontWeight: 800, color: "#059669", cursor: "pointer",
              }}
            >
              {selectedCats.length === CATEGORIES.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`cat-btn${selectedCats.includes(cat.id) ? " active" : ""}`}
                onClick={() => toggle(cat.id)}
              >
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{ fontSize: 12, lineHeight: 1.3 }}>{cat.label}</span>
              </button>
            ))}
          </div>
          {selectedCats.length > 0 && (
            <p style={{ fontSize: 12, color: "#059669", fontWeight: 700, marginTop: 6 }}>
              ✓ {selectedCats.length} categor{selectedCats.length > 1 ? "ies" : "y"} selected
            </p>
          )}
        </div>

        {/* ── Difficulty ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: "#1e3a29", marginBottom: 10 }}>
            🎯 Difficulty Level
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                className={`diff-btn${difficulty === d.id ? " active" : ""}`}
                onClick={() => setDifficulty(d.id)}
              >
                <div style={{ fontSize: 26, marginBottom: 4 }}>{d.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 900 }}>{d.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, marginTop: 2 }}>
                  {d.ages}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Question Count ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: "#1e3a29", marginBottom: 10 }}>
            🔢 Number of Questions
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                className={`count-btn${count === n ? " active" : ""}`}
                onClick={() => setCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Start Button */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "14px 20px 20px",
          background: "rgba(240,253,244,.96)", backdropFilter: "blur(8px)",
          borderTop: "2px solid #d1fae5",
          maxWidth: 520, margin: "0 auto",
        }}
      >
        <button
          className="shimmer-btn btn-press"
          disabled={!canStart}
          onClick={() => onStartGame(selectedCats, difficulty, count)}
        >
          {canStart
            ? `🚀 Let's Go! · ${count} Questions`
            : "Select at least one category ☝️"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN: LOADING
════════════════════════════════════════════════════════════════════════════ */
function LoadingScreen() {
  const [dots, setDots] = useState(".");
  const messages = [
    "Searching the Quran…",
    "Consulting the Hadith…",
    "Preparing your questions…",
    "Almost ready…",
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDots((p) => (p.length >= 3 ? "." : p + ".")), 500);
    const m = setInterval(() => setMsgIdx((i) => (i + 1) % messages.length), 1800);
    return () => { clearInterval(d); clearInterval(m); };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 32,
        background: "linear-gradient(175deg, #ecfdf5, #fff)", textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 72, marginBottom: 24,
          animation: "bobble 1.8s ease-in-out infinite",
        }}
      >
        🕌
      </div>
      <h2
        style={{
          fontSize: 28, fontWeight: 900, color: "#059669",
          marginBottom: 8, letterSpacing: "-0.5px",
        }}
      >
        Preparing Questions{dots}
      </h2>
      <p
        style={{
          fontSize: 15, fontWeight: 700, color: "#6b7280",
          marginBottom: 36, minHeight: 22,
          animation: "fadeIn .4s ease",
          key: msgIdx,
        }}
      >
        {messages[msgIdx]}
      </p>

      {/* Loading bubbles */}
      <div style={{ display: "flex", gap: 14 }}>
        {["📖","⭐","🌙","🤲","✨"].map((e, i) => (
          <span
            key={i}
            style={{
              fontSize: 24,
              display: "inline-block",
              animation: `bobble 1.1s ${i * 0.18}s ease-in-out infinite`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN: GAME
════════════════════════════════════════════════════════════════════════════ */
function GameScreen({ questions, onComplete }) {
  const [current, setCurrent]             = useState(0);
  const [selected, setSelected]           = useState(null);
  const [showResult, setShowResult]       = useState(false);
  const [score, setScore]                 = useState(0);
  const [points, setPoints]               = useState(0);
  const [showConfetti, setShowConfetti]   = useState(false);
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [animKey, setAnimKey]             = useState(0);

  const q          = questions[current];
  const isLast     = current + 1 >= questions.length;
  const progressPct = (current / questions.length) * 100;
  const isCorrect  = selected === q?.correctAnswer;

  const handleAnswer = useCallback(
    (option) => {
      if (selected || !q) return;
      setSelected(option);
      setShowResult(true);

      if (option === q.correctAnswer) {
        setScore((s) => s + 1);
        setPoints((p) => p + 100);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2200);
      }
      if (q.didYouKnow && Math.random() > 0.35) setShowDidYouKnow(true);
    },
    [selected, q]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete(score, points);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
      setShowDidYouKnow(false);
      setAnimKey((k) => k + 1);
    }
  }, [isLast, score, points, onComplete]);

  if (!q) return null;

  return (
    <div
      style={{
        minHeight: "100vh", background: "#f0fdf4",
        maxWidth: 520, margin: "0 auto", padding: "16px 16px 120px",
      }}
    >
      <Confetti active={showConfetti} />

      {/* ── HUD ── */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10, gap: 8,
        }}
      >
        <div
          style={{
            background: "#059669", color: "#fff", borderRadius: 14,
            padding: "8px 14px", fontWeight: 900, fontSize: 15,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          ⭐ {points.toLocaleString()}
        </div>

        <div
          style={{
            flex: 1, textAlign: "center", fontWeight: 900,
            fontSize: 14, color: "#6b7280",
          }}
        >
          Question {current + 1} / {questions.length}
        </div>

        <div
          style={{
            background: "#fef3c7", color: "#92400e", borderRadius: 14,
            padding: "8px 14px", fontWeight: 900, fontSize: 15,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          ✅ {score}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track" style={{ marginBottom: 18 }}>
        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* ── Question card ── */}
      <div
        key={animKey}
        className="card card-shadow animate-pop"
        style={{ marginBottom: 14 }}
      >
        {/* Category + Difficulty badges */}
        <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
          <span className="badge badge-green">{q.category}</span>
          <span
            className="badge"
            style={{
              background:
                q.difficulty === "easy" ? "#d1fae5"
                : q.difficulty === "medium" ? "#fef3c7"
                : "#fee2e2",
              color:
                q.difficulty === "easy" ? "#065f46"
                : q.difficulty === "medium" ? "#92400e"
                : "#991b1b",
            }}
          >
            {q.difficulty === "easy" ? "🌱" : q.difficulty === "medium" ? "🌿" : "🌳"}{" "}
            {q.difficulty}
          </span>
        </div>

        <p style={{ fontSize: 18, fontWeight: 800, color: "#1e3a29", lineHeight: 1.5 }}>
          {q.question}
        </p>
      </div>

      {/* ── Options ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          let cls = "option-btn";
          if (showResult) {
            if (opt === q.correctAnswer) cls += " correct";
            else if (opt === selected)   cls += " wrong";
            else                         cls += " dimmed";
          }

          return (
            <button
              key={i}
              className={cls}
              disabled={!!selected}
              onClick={() => handleAnswer(opt)}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span
                style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 13,
                  background:
                    !selected ? "#ecfdf5"
                    : opt === q.correctAnswer ? "rgba(255,255,255,.25)"
                    : opt === selected ? "rgba(255,255,255,.25)"
                    : "#f3f4f6",
                  color:
                    !selected ? "#059669"
                    : opt === q.correctAnswer || opt === selected ? "#fff"
                    : "#9ca3af",
                }}
              >
                {OPTION_LETTERS[i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* ── Feedback panel ── */}
      {showResult && (
        <div
          className="animate-slide"
          style={{
            background: isCorrect ? "#ecfdf5" : "#fef2f2",
            border: `2px solid ${isCorrect ? "#10b981" : "#fca5a5"}`,
            borderRadius: 20, padding: "16px 18px", marginBottom: 14,
          }}
        >
          <p
            style={{
              fontSize: 17, fontWeight: 900,
              color: isCorrect ? "#065f46" : "#991b1b",
              marginBottom: 6,
            }}
          >
            {isCorrect ? "✅ Correct! MashaAllah! 🎉" : `❌ The answer was: ${q.correctAnswer}`}
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", lineHeight: 1.55 }}>
            {q.explanation}
          </p>

          {showDidYouKnow && q.didYouKnow && (
            <div className="did-you-know">
              <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e" }}>
                🧠 Did you know?
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#78350f", marginTop: 4, lineHeight: 1.5 }}>
                {q.didYouKnow}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Next button ── */}
      {showResult && (
        <button
          className="shimmer-btn btn-press animate-slide"
          onClick={handleNext}
        >
          {isLast ? "🏆 See My Results!" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN: RESULTS
════════════════════════════════════════════════════════════════════════════ */
function ResultsScreen({ score, total, points, onPlayAgain }) {
  const pct     = total > 0 ? Math.round((score / total) * 100) : 0;
  const msgRef  = useRef(RESULT_MESSAGES[Math.floor(Math.random() * RESULT_MESSAGES.length)]);
  const showConf = pct >= 70;

  const perfLabel =
    pct >= 90 ? "🏆 Islamic Champion!"
    : pct >= 70 ? "⭐ Great Knowledge!"
    : pct >= 50 ? "📖 Keep Learning!"
    : "🌱 Practice Makes Perfect!";

  return (
    <div
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start",
        padding: "40px 20px 60px",
        background: "linear-gradient(175deg, #ecfdf5, #fff)",
        maxWidth: 440, margin: "0 auto",
      }}
    >
      <Confetti active={showConf} />

      {/* Title */}
      <div className="animate-pop" style={{ textAlign: "center", marginBottom: 24 }}>
        <p style={{ fontSize: 36 }}>🎊</p>
        <h2
          style={{
            fontSize: 32, fontWeight: 900, color: "#059669",
            letterSpacing: "-0.5px", marginTop: 4,
          }}
        >
          Quiz Complete!
        </h2>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#6b7280", marginTop: 6 }}>
          {msgRef.current}
        </p>
      </div>

      {/* Score ring */}
      <div
        className="card card-shadow animate-slide"
        style={{ width: "100%", marginBottom: 20, padding: "28px 24px", textAlign: "center" }}
      >
        <ScoreRing score={score} total={total} />

        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <Stars score={score} total={total} />
        </div>

        <p style={{ fontSize: 18, fontWeight: 900, color: "#059669" }}>{perfLabel}</p>

        {/* Stats row */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10, marginTop: 20,
          }}
        >
          {[
            { label: "Correct",  value: score,    icon: "✅" },
            { label: "Points",   value: points.toLocaleString(), icon: "⭐" },
            { label: "Score",    value: `${pct}%`, icon: "📊" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              style={{
                background: "#f0fdf4", borderRadius: 16,
                padding: "12px 8px", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1e3a29" }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement quote */}
      <div
        className="card animate-fade"
        style={{
          width: "100%", marginBottom: 24, padding: "16px 20px",
          background: "#fffbeb", borderColor: "#fcd34d",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, color: "#92400e", lineHeight: 1.6 }}>
          🌟 <em>"Seek knowledge, for seeking it is a duty upon every Muslim."</em>
          <br />
          <span style={{ fontSize: 12, color: "#b45309" }}>— Prophet Muhammad ﷺ</span>
        </p>
      </div>

      {/* Play Again */}
      <button
        className="shimmer-btn btn-press animate-slide"
        onClick={onPlayAgain}
        style={{ maxWidth: 360 }}
      >
        🔄 Play Again!
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ERROR TOAST
════════════════════════════════════════════════════════════════════════════ */
function ErrorToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="animate-slide"
      style={{
        position: "fixed", top: 16, left: 16, right: 16, zIndex: 9998,
        background: "#fee2e2", border: "2px solid #fca5a5",
        borderRadius: 18, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12,
        maxWidth: 480, margin: "0 auto",
        boxShadow: "0 4px 24px rgba(239,68,68,.2)",
      }}
    >
      <span style={{ fontSize: 22 }}>⚠️</span>
      <p style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#991b1b" }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 18, color: "#991b1b", fontWeight: 900,
        }}
      >
        ✕
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]   = useState("welcome");  // welcome | setup | loading | game | results
  const [questions, setQuestions] = useState([]);
  const [result, setResult]   = useState({ score: 0, total: 0, points: 0 });
  const [error, setError]     = useState(null);

  const handleStartSetup = () => setScreen("setup");

  const handleStartGame = async (categories, difficulty, count) => {
    setScreen("loading");
    setError(null);
    try {
      const qs = await fetchQuestions(categories, difficulty, count);
      if (!Array.isArray(qs) || qs.length === 0) throw new Error("No questions returned");
      setQuestions(qs);
      setScreen("game");
    } catch (e) {
      console.error(e);
      setError("Oops! Couldn't load questions. Please check your connection and try again.");
      setScreen("setup");
    }
  };

  const handleComplete = (score, points) => {
    setResult({ score, total: questions.length, points });
    setScreen("results");
  };

  const handlePlayAgain = () => {
    setScreen("welcome");
    setQuestions([]);
    setResult({ score: 0, total: 0, points: 0 });
  };

  return (
    <>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}

      {screen === "welcome" && <WelcomeScreen onStart={handleStartSetup} />}
      {screen === "setup"   && (
        <SetupScreen onBack={() => setScreen("welcome")} onStartGame={handleStartGame} />
      )}
      {screen === "loading" && <LoadingScreen />}
      {screen === "game"    && questions.length > 0 && (
        <GameScreen questions={questions} onComplete={handleComplete} />
      )}
      {screen === "results" && (
        <ResultsScreen
          score={result.score}
          total={result.total}
          points={result.points}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
