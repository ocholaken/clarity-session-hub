# 🧠 Clarity Session Hub — AI-Powered Mental Health Marketplace for Africa

> **Kenya has 1 psychologist per 10,000 people. We are fixing that.**

**Live Production:** https://clarity-session-hub.vercel.app/counselors  
**Homepage:** https://clarity-session-hub.vercel.app  
**Track:** Qhala x Mistral AI for Good | Africa's Mental Health Crisis

---

### 🔥 THE CRISIS - Why We Exist

- **1 in 4** Kenyan youth suffers anxiety/depression (WHO reports 40% spike post-COVID)
- **1 psychologist per 10,000 people** - all in Nairobi
- **13M students** in Rift Valley with no access - facing school pressure, ADHD, grief, PTSD, GBV
- **Barriers:** Stigma ("Utaonekana umerukwa"), Cost KES 3,000/session, English-only cold bots, no triage
- **Current directories = phone book:** No risk detection, no matching, no follow-up. Result: 70% dropout, crises escalate to dropout & suicide.

### 💡 THE SOLUTION - Mistral as Core Intelligence

**Clarity Session Hub is NOT a chatbot. It is an Intelligence Layer over a licensed workforce.**

We built 3 engines on **Mistral 7B / Mixtral 8x7B**:

**1. Triage Engine:** Mistral classifies free-text intake in Swahili/Sheng/English like "Niko na stress ya exam bana" into Child/Teen/ADHD/Grief/PTSD + urgency Low/Medium/High/Crisis in <2 sec.

**2. RAG Matching Engine:** Matches to 5 licensed counselors with 223+ reviews:
- Dr. Pauline Oyuga (MSc Sunderland UK, 66 reviews) - Child, Family
- Anne (D.KIPC, 8+ yrs) - Teen Trauma, Anxiety  
- Bella (Child Specialist, 4.8★ 58 reviews) - ADHD
- Sarah Akoth (4.9★ 49 reviews) - Grief, PTSD
- +1 Associate - GBV

**3. Co-Pilot Engine:** Mistral auto-drafts SOAP notes, care plans, psychoeducation - cuts 60% admin time. Human approves.

We don't replace therapists. We make them 3x more efficient and 10x more accessible.

### 🏗️ TECH STACK

- Frontend: Next.js 14, TypeScript, React, shadcn-ui, Tailwind, PWA <50kb
- Backend: Supabase (RLS encrypted, HIPAA-aligned), PostgreSQL pgvector for RAG
- AI Core: Mistral 7B/Mixtral 8x7B API + Gemini empathy layer
- Payments: M-Pesa Daraja API
- Infra: Vercel, offline-first, quantized Mistral 7B for 4GB RAM, USSD *384# planned

### 🌍 AFRICAN CONTEXT - Built for Africa, Not Ported

**Language:** Mistral fine-tuned for Sheng/Swahili/English code-switching.
**Culture:** Faith-sensitive, collectivist-aware, stigma-aware anonymous mode, gender preference for GBV survivors.
**Low-Resource:** PWA <50kb works on 2G Tecno, offline intake, USSD planned.
**Privacy:** RLS-secured, encrypted - disclosure is risky in villages.
**Local:** Kenyan-licensed counselors, piloting in Kisumu campuses (Kakamega, Busia), not Nairobi.

### 📈 TRACTION

- ✅ Live MVP: /counselors page with 5 real profiles
- ✅ 223+ Verified Reviews
- ✅ 5 Licensed Counselors onboarded
- ✅ Supabase RLS implemented
- ✅ PWA Deployed on Vercel

### 🚀 Getting Started

Requirements: Node.js 18+ and npm

npm install
npm run dev

Env:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MISTRAL_API_KEY=
VITE_GEMINI_API_KEY=

### 🗺️ Roadmap

Q1 2026: Kisumu pilots - 1,000 users
Q2 2026: M-Pesa KES 999/month + USSD
Q3 2026: 47 counties - 50 counselors, 10k users
Q4 2026: B2B schools & NGOs

### 👥 Team

Team of 6: Developers + 5 Licensed Kenyan Counselors (223+ reviews). Tech + Clinical moat.

Built with ❤️ in Kisumu, Siayafor Africa's youth.

Contact: ocholakenna1@gmail.com | Live: https://clarity-session-hub.vercel.app
