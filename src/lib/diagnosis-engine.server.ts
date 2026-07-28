// Diagnosis question set + scoring + AI report generation.
// Server-only.

export type Pillar = "awareness" | "acquisition" | "conversion" | "retention" | "measurement";

export type Choice = { value: string; label: string; score: number }; // score 0..4

export type Question = {
  id: string;
  pillar: Pillar;
  prompt: string;
  helper?: string;
  choices: Choice[];
  allowNote?: boolean;
};

// Two questions per pillar → 10 total. Max raw = 10 * 4 = 40 → normalized to 100.
export const QUESTIONS: Question[] = [
  // Awareness
  {
    id: "aw1",
    pillar: "awareness",
    prompt: "How do most of your customers find you today?",
    helper: "Pick the one closest to reality.",
    choices: [
      { value: "referrals-only", label: "Word of mouth / referrals only", score: 1 },
      { value: "walk-in", label: "Walk-in / local foot traffic", score: 1 },
      { value: "social-organic", label: "Organic social media posts", score: 2 },
      { value: "paid-ads", label: "Paid ads (Facebook / IG / TikTok / Google)", score: 4 },
      { value: "seo-content", label: "Google search / content / SEO", score: 4 },
      { value: "not-sure", label: "Honestly, I'm not sure", score: 0 },
    ],
  },
  {
    id: "aw2",
    pillar: "awareness",
    prompt: "How consistently do you show up in front of new potential customers?",
    choices: [
      { value: "never", label: "Rarely — we mostly wait for people to come", score: 0 },
      { value: "sometimes", label: "When I remember / when things slow down", score: 1 },
      { value: "weekly", label: "Weekly, but not systematic", score: 2 },
      { value: "daily-manual", label: "Daily, but done manually by me/staff", score: 3 },
      { value: "systematic", label: "Daily, systematised with paid + organic", score: 4 },
    ],
    allowNote: true,
  },
  // Acquisition
  {
    id: "ac1",
    pillar: "acquisition",
    prompt: "How many new leads (people who show interest) do you get in a typical week?",
    choices: [
      { value: "0-2", label: "0–2", score: 0 },
      { value: "3-10", label: "3–10", score: 1 },
      { value: "11-30", label: "11–30", score: 2 },
      { value: "31-100", label: "31–100", score: 3 },
      { value: "100+", label: "100+", score: 4 },
    ],
  },
  {
    id: "ac2",
    pillar: "acquisition",
    prompt: "Do you have a repeatable way to bring in new leads on demand?",
    helper: "e.g. an ad campaign, a landing page + traffic, an outbound process",
    choices: [
      { value: "none", label: "No — leads come randomly", score: 0 },
      { value: "one-channel", label: "One channel, on and off", score: 2 },
      { value: "one-channel-consistent", label: "One channel, running consistently", score: 3 },
      { value: "multi", label: "Two or more channels, running consistently", score: 4 },
    ],
  },
  // Conversion
  {
    id: "cv1",
    pillar: "conversion",
    prompt: "When a new lead reaches you (DM, call, WhatsApp), how fast do you usually respond?",
    choices: [
      { value: "hours-days", label: "Hours to days — whenever I see it", score: 0 },
      { value: "1-hour", label: "Within an hour, when I'm free", score: 2 },
      { value: "15-min", label: "Under 15 minutes, most of the time", score: 3 },
      { value: "instant", label: "Instantly — automated first reply", score: 4 },
    ],
  },
  {
    id: "cv2",
    pillar: "conversion",
    prompt: "Do you have a clear script or process for turning a lead into a paying customer?",
    choices: [
      { value: "none", label: "No — every conversation is different", score: 0 },
      { value: "informal", label: "Informal, in my head", score: 1 },
      { value: "written", label: "Written, but not always followed", score: 3 },
      { value: "written-tracked", label: "Written, followed, and tracked", score: 4 },
    ],
    allowNote: true,
  },
  // Retention
  {
    id: "rt1",
    pillar: "retention",
    prompt: "After a customer buys once, what happens next?",
    choices: [
      { value: "nothing", label: "Nothing — we hope they come back", score: 0 },
      { value: "adhoc", label: "We message them occasionally", score: 1 },
      { value: "sometimes", label: "We follow up but not consistently", score: 2 },
      { value: "planned", label: "Planned follow-ups (email/WhatsApp/SMS)", score: 3 },
      { value: "automated", label: "Automated retention & loyalty system", score: 4 },
    ],
  },
  {
    id: "rt2",
    pillar: "retention",
    prompt: "Roughly what share of your monthly revenue comes from repeat customers?",
    choices: [
      { value: "unknown", label: "I don't know", score: 0 },
      { value: "0-10", label: "Under 10%", score: 1 },
      { value: "10-30", label: "10–30%", score: 2 },
      { value: "30-60", label: "30–60%", score: 3 },
      { value: "60+", label: "Over 60%", score: 4 },
    ],
  },
  // Measurement
  {
    id: "ms1",
    pillar: "measurement",
    prompt: "Do you know which channel or activity brings you the most customers?",
    choices: [
      { value: "no", label: "No, honestly", score: 0 },
      { value: "guess", label: "I have a rough guess", score: 1 },
      { value: "ask", label: "I ask customers when I remember", score: 2 },
      { value: "tracked", label: "Yes, I track it", score: 4 },
    ],
  },
  {
    id: "ms2",
    pillar: "measurement",
    prompt: "How do you decide what to do next in your marketing?",
    choices: [
      { value: "gut", label: "Gut feel / what feels urgent", score: 0 },
      { value: "copy", label: "Copy what competitors are doing", score: 1 },
      { value: "advice", label: "Advice from friends or online gurus", score: 2 },
      { value: "data", label: "Based on numbers from my own business", score: 4 },
    ],
    allowNote: true,
  },
];

export const PILLAR_META: Record<Pillar, { label: string; blurb: string }> = {
  awareness: { label: "Awareness", blurb: "How consistently new customers discover you." },
  acquisition: { label: "Acquisition", blurb: "How reliably you generate new leads." },
  conversion: { label: "Conversion", blurb: "How well leads become paying customers." },
  retention: { label: "Retention", blurb: "How much repeat revenue you keep." },
  measurement: { label: "Measurement", blurb: "How much of your growth is decision-guided vs guesswork." },
};

export type Answer = { value: string; note?: string };
export type Answers = Record<string, Answer>;

export function scoreAnswers(answers: Answers) {
  const pillarRaw: Record<Pillar, { got: number; max: number }> = {
    awareness: { got: 0, max: 0 },
    acquisition: { got: 0, max: 0 },
    conversion: { got: 0, max: 0 },
    retention: { got: 0, max: 0 },
    measurement: { got: 0, max: 0 },
  };
  for (const q of QUESTIONS) {
    const ans = answers[q.id];
    pillarRaw[q.pillar].max += 4;
    if (!ans) continue;
    const ch = q.choices.find((c) => c.value === ans.value);
    if (ch) pillarRaw[q.pillar].got += ch.score;
  }
  const pillar_scores = Object.fromEntries(
    Object.entries(pillarRaw).map(([k, v]) => [k, v.max ? Math.round((v.got / v.max) * 100) : 0])
  ) as Record<Pillar, number>;
  const totals = Object.values(pillarRaw).reduce(
    (acc, v) => ({ got: acc.got + v.got, max: acc.max + v.max }),
    { got: 0, max: 0 }
  );
  const score = totals.max ? Math.round((totals.got / totals.max) * 100) : 0;
  return { score, pillar_scores };
}

export type ReportPayload = {
  headline: string;
  summary: string;
  strengths: string[];
  bottlenecks: string[];
  opportunities: string[];
  recommendations: { title: string; detail: string }[];
  next_step: string;
};

function fallbackReport(
  input: { name: string; business_name?: string | null; industry?: string | null; score: number; pillar_scores: Record<Pillar, number>; answers: Answers }
): ReportPayload {
  const worst = (Object.entries(input.pillar_scores) as [Pillar, number][]).sort((a, b) => a[1] - b[1]);
  const [w1, w2, w3] = worst;
  const best = worst[worst.length - 1];
  return {
    headline: `${input.business_name || input.name}'s Customer Acquisition Score: ${input.score}/100`,
    summary: `Your business currently scores ${input.score}/100 on the HIPROFEET Customer Acquisition framework. The biggest constraints on your growth are ${PILLAR_META[w1[0]].label.toLowerCase()} and ${PILLAR_META[w2[0]].label.toLowerCase()}.`,
    strengths: [
      `Strongest area: ${PILLAR_META[best[0]].label} (${best[1]}/100).`,
      "You already have a running business generating revenue — that is the hardest part.",
    ],
    bottlenecks: [
      `${PILLAR_META[w1[0]].label} is your #1 constraint (${w1[1]}/100). ${PILLAR_META[w1[0]].blurb}`,
      `${PILLAR_META[w2[0]].label} is limiting throughput (${w2[1]}/100).`,
      `${PILLAR_META[w3[0]].label} needs attention (${w3[1]}/100).`,
    ],
    opportunities: [
      "Fixing your #1 bottleneck alone typically unlocks 1.5×–3× more customers within 30–60 days.",
      "You are leaking demand in the follow-up gap — most Nigerian businesses lose 40–70% of warm leads here.",
      "You currently rely too much on guesswork rather than data. Even basic tracking removes wasted spend.",
    ],
    recommendations: [
      { title: `Fix ${PILLAR_META[w1[0]].label} first`, detail: "Focus every operational hour and every marira spent on this one area for the next 30 days. Do not spread thin." },
      { title: "Install one repeatable lead source", detail: "Pick one channel (paid ads is fastest) and run it daily. Consistency beats variety." },
      { title: "Book a 45-minute strategist call", detail: "The report shows what to fix. The consultation shows exactly how to fix it for your specific business, in your industry, at your scale." },
    ],
    next_step:
      "Book a Strategy Session with a Hiprofeet Growth Strategist to build your 30-day customer acquisition plan.",
  };
}

export async function generateReport(input: {
  name: string;
  business_name?: string | null;
  industry?: string | null;
  revenue_band?: string | null;
  answers: Answers;
  score: number;
  pillar_scores: Record<Pillar, number>;
}): Promise<ReportPayload> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return fallbackReport(input);

  const rendered = QUESTIONS.map((q) => {
    const a = input.answers[q.id];
    const label = q.choices.find((c) => c.value === a?.value)?.label ?? "(not answered)";
    return `- ${PILLAR_META[q.pillar].label} · ${q.prompt}\n  Answer: ${label}${a?.note ? `\n  Note: ${a.note}` : ""}`;
  }).join("\n");

  const system = `You are HIPROFEET's Business Growth Intelligence engine. Voice: strategic consultant. Analytical, confident, specific, never hype. Nigerian business context. Naira. Short crisp sentences. No emojis. No fluff.

You will receive a business's Customer Acquisition Diagnosis inputs and computed pillar scores. Return ONE compact JSON object with these exact fields:

{
  "headline": string,                          // 1 line, includes score /100
  "summary": string,                            // 2–3 sentences plain-English diagnosis
  "strengths": string[],                        // 3 items, each 1 sentence
  "bottlenecks": string[],                      // 3 items, each 1 sentence, ordered by severity
  "opportunities": string[],                    // 3 items, each 1 sentence, concrete
  "recommendations": [{"title": string, "detail": string}], // exactly 3, ordered by priority
  "next_step": string                           // one short push toward booking a strategist
}

Rules:
- Be specific to the answers. Reference the actual weakest pillars.
- Do NOT try to solve every problem in the report — leave room for the strategist call to add value.
- Do NOT recommend specific HIPROFEET services by name; the report educates and qualifies.
- Return ONLY the JSON object, nothing else.`;

  const user = `Business: ${input.business_name || "(unnamed)"}
Owner: ${input.name}
Industry: ${input.industry || "unspecified"}
Revenue band: ${input.revenue_band || "unspecified"}
Overall score: ${input.score}/100
Pillar scores: ${JSON.stringify(input.pillar_scores)}

Answers:
${rendered}`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });
    if (!res.ok) {
      console.error("generateReport gateway failed", res.status, await res.text().catch(() => ""));
      return fallbackReport(input);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) return fallbackReport(input);
    const parsed = JSON.parse(content) as ReportPayload;
    // sanity
    if (!parsed.recommendations || parsed.recommendations.length < 3) return fallbackReport(input);
    return parsed;
  } catch (e) {
    console.error("generateReport threw", (e as Error).message);
    return fallbackReport(input);
  }
}
