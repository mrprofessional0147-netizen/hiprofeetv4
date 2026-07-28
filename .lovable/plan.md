# HCAS V1 — Diagnosis to Consultation Funnel

## What the site becomes

One purpose: **identify → qualify → educate → book a strategist.**
Everything else (existing 12 services, orders, coupons) moves off the main path but stays reachable via a small "For existing clients" footer link.

## User journey

```text
Home ──► Diagnosis (conversational)
          │
          ├─► name + email
          │      ↓
          │   OTP code (Gmail)     ← toggleable in admin
          │      ↓
          │   verified
          ▼
    Personalized Report  ─(email w/ private link)→  /report/{token}
                          │
                          └─► "Book Strategy Session" → WhatsApp
                                (+2349014244117, prefilled context)
```

## 1. Homepage (rebuild)

Single dominant CTA: **"Start Your Free Customer Acquisition Diagnosis"**. Supporting sections:
- Hero — one message: *"We help businesses build predictable customer acquisition systems."* Single primary button. No secondary "browse services" button.
- Trust bar — outcomes, not logos ("Diagnosis in 5 min · Private · No signup required to start")
- "How it works" — 3 steps: Diagnose → Report → Strategy Session
- FAQ (4-5 questions max)
- Footer with tiny "For existing HIPROFEET clients →" link to `/services`

No services grid, no product previews, no testimonials of services delivered.

## 2. Conversational diagnosis (`/diagnosis`)

Feels like a chat, not a form. AI adapts follow-ups based on prior answers. Scored across 5 pillars (each 0-20 → total 0-100):

1. **Awareness** — how customers currently find them
2. **Acquisition** — active channels & consistency
3. **Conversion** — website/DM-to-sale process
4. **Retention** — follow-up & repeat purchase
5. **Measurement** — tracking what works

Flow:
- Intro turn from AI
- 8–10 questions with structured multi-choice + one open follow-up per pillar
- Progress bar (5 pillars)
- End: name + email inputs
- Submit → generates report server-side, triggers OTP if enabled

## 3. Email verification (togglable)

- `app_config.require_email_verification` boolean, editable from Admin.
- When ON: submit → 6-digit code emailed via Gmail connector → verify screen → report unlocks.
- When OFF: skip straight to report page.
- Codes: 10-min expiry, max 5 attempts, hashed in DB, resend allowed after 60s.

## 4. Personalized report (`/report/$token`)

Access via unguessable token in URL (crypto-random 32 chars) — no login required. Rendered on-site with premium HIPROFEET styling. Sections:
- **Customer Acquisition Score** (big number 0-100 + pillar breakdown chart)
- Key strengths (3-4)
- Biggest bottlenecks (3-4)
- Missed opportunities (3-4)
- Priority recommendations (3, ordered)
- **Primary CTA card**: "Book a Strategy Session with a Hiprofeet Growth Strategist"
  - Shows: ~~₦15,000~~ **₦4,500 introductory rate**
  - Single button → WhatsApp `+2349014244117` with prefilled message including their name, business, score, top bottleneck
- No pricing shown before this point.

Email version (Gmail) contains the link + a text summary + same CTA.

## 5. Consultation request tracking

Clicking the WhatsApp CTA:
- POST `/api/consultation-request` first (server logs consultation_requests row with diagnosis_id + intent timestamp)
- Then opens WhatsApp

Admin can see which diagnoses converted to consultation clicks.

## 6. Admin dashboard additions

New tabs alongside existing Overview / Orders:
- **Diagnoses** — table: name, email, business, score, verification status, source, created_at, "View report" link
- **Consultations** — table: name, business, score, requested_at, status (new/contacted/booked/closed), notes, WhatsApp button, mark-status control
- **Funnel** — 4-step funnel numbers: started → completed diagnosis → verified email → clicked book. Conversion % between steps. Bottleneck breakdown (aggregate scores across pillars).
- **Settings** — verification on/off toggle (writes `app_config`)

Existing Overview keeps stats, existing Orders tab stays for legacy customers.

## 7. Existing services

- `/services` — new dedicated page listing the 12 services (moved from homepage)
- `/order/*`, `/orders`, `/admin` orders tab — unchanged
- `/advisor` — redirects to `/diagnosis`
- Footer: "For existing HIPROFEET clients →"

## Data model (single migration)

```sql
diagnoses            id, session_token, name, email, business_name, industry,
                     revenue_band, answers jsonb, score int, report jsonb,
                     status, verified_at, report_token unique, source, ip,
                     created_at, updated_at

email_verifications  id, diagnosis_id, email, code_hash, expires_at,
                     verified_at, attempts, created_at

consultation_requests id, diagnosis_id, clicked_at, status, admin_notes,
                     created_at, updated_at

app_config           id 'singleton', require_email_verification bool,
                     updated_at
```

RLS: all locked to admin-only via `has_role`. Report page reads via server function using `report_token` — no client-side reads of `diagnoses`. All new tables get GRANTs + admin RLS.

## Files

```text
migration                                 4 tables + policies + config seed
src/routes/index.tsx                      rebuild — single CTA
src/components/home-sections.tsx          rebuild — Hero/HowItWorks/FAQ only
src/routes/diagnosis.tsx                  new — conversational flow + verify UI
src/routes/report.$token.tsx              new — personalized report page
src/routes/services.tsx                   new — moved services grid
src/routes/advisor.tsx                    replace with redirect to /diagnosis
src/routes/api.diagnosis.chat.ts          AI adaptive questions
src/routes/api.diagnosis.finalize.ts      score + build report + OTP send
src/routes/api.diagnosis.verify.ts        code check + report email + unlock
src/routes/api.diagnosis.resend.ts        resend OTP w/ cooldown
src/routes/api.consultation.request.ts    log click + return WhatsApp URL
src/lib/report-generation.ts              server-only: scoring + AI report
src/lib/hcas-config.ts                    server-only: verification flag reader
src/routes/admin.tsx                      add Diagnoses/Consultations/Funnel/Settings tabs
src/components/layout.tsx                 footer: existing-clients link, nav simplify
```

## Out of scope (V1)

- Auth-gated report page (token URL is sufficient for V1; can add later)
- In-app calendar / Google Calendar sync (WhatsApp handoff replaces this)
- Analytics beyond in-admin funnel (no GA/PostHog yet)
- Follow-up drip emails referencing the assessment (email 1 only; sequence is V2)
- Migrating existing chat history/growth reviews (kept as historical data; new flow uses new tables)

Confirm and I'll build it in one pass: migration → homepage → diagnosis flow → verification → report page → admin extensions → services move → footer.