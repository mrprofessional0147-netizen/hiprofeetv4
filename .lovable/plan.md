# Advisor Experience v2 — Receptionist + Routed Consultation

Goal: the AI on `/advisor` should feel like the receptionist + junior consultant of a real consulting firm — never a chatbot. The homepage's only job stays "get people into the AI".

## 1. New advisor flow (state machine)

Replace the current single free-form chat on `/advisor` with a guided experience with clear phases. State stored in component + persisted per conversation:

```text
welcome  →  route pick (A/B/C/D)  →  guided chat  →  (optional) share-something  →  finalize  →  progress screen  →  email capture  →  delivered
```

### Welcome screen
- Big line: "Welcome to HIPROFEET. I'm your Business Growth Advisor. How can I help you today?"
- 4 large tap cards (not chips):
  - 📈 Understand why my business isn't growing → Route A
  - 💬 Speak with a real Business Growth Expert → Route B
  - 🛠 I know what I need — order a solution → Route C
  - ❓ I have another business question → Route D

### Route A — Assessment
- AI preface: "I'll help you understand what may be limiting growth. I may ask for your website, social pages or screenshots."
- Guided questions (business, goal, biggest challenge) then adaptive follow-ups.
- AI may request assets; every request states WHY.
- Ends with "Prepare my Growth Review" CTA → progress screen → email capture.

### Route B — Book a human expert
- Warm framing, list of consultation topics (checklist visual).
- Single CTA: "Book Consultation" → routes to existing order flow for the consultation service (create `consultation` service in `src/data/services.ts` if missing) with SNAPORA coupon still supported → WhatsApp handoff on `/success`.

### Route C — I know what I need
- AI asks "What are you looking for?" with quick chips (Website, Branding, Content, Assessment, Marketing Strategy, Trust, Testimonials, Followers, Views, Other).
- Maps intent to service(s) and drops the same high-contrast order CTA card already used today.

### Route D — Open question
- Free chat. AI answers, then when it detects enough context, offers "Continue as full Assessment" or "Talk to a human expert".

### Global rules (system prompt update in `src/routes/api.advisor.ts`)
- One clear next step at end of every reply.
- Never force uploads — only when relevant, always with WHY.
- Keep existing consultant tone + `/order/ID` CTA convention.

## 2. Persistent "📎 Share Something for Review"
- Floating pill inside the chat panel, visible in every route.
- Opens a sheet: paste URL(s) (website, FB, IG, TikTok, GBP, WhatsApp) and/or upload files (screenshots, logo, flyers, docs, product photos).
- Uploads go to a new **private** `assessment-uploads` bucket, scoped by `user_id/conversation_id/…`. Anonymous users get a client-generated session id kept in `localStorage` and stored on the conversation row.
- Each share becomes a system-authored assistant turn: "Shared: website https://… + 2 screenshots" so the model sees it.
- Signed URLs generated server-side when the model needs to reference an image.

## 3. Growth Review generation + email
- New CTA on Route A end: "Prepare my Growth Review".
- Progress screen (client-only, staged text): "Reviewing your business…", "Identifying growth opportunities…", "Preparing recommendations…", "Building your Growth Review…".
- Behind the scenes, new server route `/api/growth-review` (createFileRoute server handler) calls Lovable AI with the full transcript + shared assets metadata and returns a structured JSON review: `{ executive_summary, strengths[], opportunities[], priority_recommendations[], next_steps[], suggested_services[] }`.
- Email capture screen: "Where should we send your report?" → single email input + "Send My Growth Review" button.
- Server sends a branded HTML email via the existing Gmail connector (reuse pattern from `notify-customer.functions.ts`), with sections rendered from the JSON review, footer CTA "Book a Human Consultation".
- Store the review in a new `growth_reviews` table linked to `conversation_id`, `user_id` (nullable), `email`, `review_json`, `created_at` so it becomes the seed of the customer profile database.

## 4. Data model additions (single migration)
- `assessment_uploads` table: id, conversation_id, user_id (nullable), session_id (text, nullable), kind (`url` | `file`), value (text url or storage path), label, created_at. RLS: owner (by user_id or session_id via header) can read/insert; admin all.
- `growth_reviews` table: id, conversation_id, user_id (nullable), email, business_name (nullable), industry (nullable), review_json (jsonb), sent_at, created_at. RLS as above.
- Extend `conversations` with `route` (`A|B|C|D`), `session_id` (text, nullable), `business_name`, `industry`.
- Storage: create private `assessment-uploads` bucket + policies mirroring `receipts`.
- Add all required GRANTs.

## 5. Admin dashboard additions
- New "Growth Reviews" panel on `/admin` listing recent reviews with email, business name, route taken, and a modal to view the JSON review + shared assets.
- Existing conversations list stays; add route badge.

## 6. Homepage
- No structural change. Keep the two entry paths but update the primary CTA copy to "Start Free Business Assessment" pointing to `/advisor` (already does). Secondary copy for expert path unchanged.

## Technical notes
- Reuse existing `parseReply` and CTA card component.
- Route-selection UI = a new `<WelcomeGate />` inside `advisor.tsx`; once a route is picked it's persisted on the conversation row so refresh restores state.
- Progress screen uses `framer-motion` staged text (existing dep).
- All new server work is `createFileRoute` server handlers under `src/routes/api.*` — no edge functions, matches the current pattern.
- Email send uses the same Gmail connector call pattern as `notify-customer.functions.ts` (forward to `hiprofitafrica2021@gmail.com` + the visitor's email).

## Out of scope (can be follow-ups)
- Long-term "6 months later" relationship marketing automation.
- Rich in-app rendering of the Growth Review (email-first for now; can add `/review/:id` page next).
- Multi-language / voice input.

Confirm and I'll build it in one pass: migration → shared UI (welcome gate, share sheet, progress screen) → server routes (`/api/growth-review`, upload signing, email send) → admin panel.
