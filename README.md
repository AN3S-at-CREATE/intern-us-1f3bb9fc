# Intern US – Bridging South African Students and Industry

Intern US is a digital platform designed to help South African final-year students break the **“no experience, no job”** loop by connecting them with high-quality internships, WIL (Work-Integrated Learning) placements, and graduate opportunities. :contentReference[oaicite:0]{index=0}  

Unlike generic job boards, Intern US focuses on **final-year and penultimate-year students** and the employers who want a curated, work-ready talent pipeline, not thousands of random CVs.   

---

## Why Intern US Exists

South Africa’s youth employment landscape is brutal:

- **46% youth unemployment** (ages 15–34), with ~3.4 million young people out of work.  
- **58.7% of unemployed youth have no prior work experience**, locking them out of “entry-level” roles that still demand experience.   
- Job-seeking is expensive: young people spend around **R938/month** on transport, data, printing, and admin just to look for work. :contentReference[oaicite:3]{index=3}  
- Employers complain of “**credentialed but not always competent**” graduates and struggle to recruit critical skills, even while unemployment stays high.   

At the same time, the ecosystem is **crowded and fragmented**:

- Government-backed, zero-rated platforms like **SAYouth.mobi** + Harambee dominate high-volume matching.  
- Universities run their own closed career portals and fairs.  
- Private job boards and agencies chase the same graduates with transactional CV-matching.   

Intern US is built to occupy the **“missing middle”**:  
> Quality-at-scale, final-year focused, skills-aware matching that serves students, employers, and universities at the same time.   

---

## Vision & Positioning

**Vision:**  
A mobile-first, data-light, POPIA-compliant platform that turns final-year students into **visible, verifiable, and work-ready talent**, while giving employers and universities a shared infrastructure for internships, WIL, and graduate pathways.   

**Core Differentiators**

- **Final-year niche:** Not “all students & graduates” – Intern US optimises for penultimate + final year students and recent grads.   
- **Career-readiness, not just job listings:** From skills gaps and soft-skills coaching to interview prep and labor-law basics.   
- **SA-specific by design:** B-BBEE filters, SETA-aligned sectors, local salary benchmarks, and multi-language support.   
- **Built for low-data, high-mobile reality:** Progressive web app, WhatsApp/SMS alerts, offline-aware modules, and zero-rating as a strategic goal.   

---

## Core Experience by Persona

### For Students

Help final-year students go from “I have a degree but no idea where to start” to “I’m shortlisted, prepared, and know my worth”.

Key capabilities:   

- **Smart Profile & CV Builder**
  - ATS-optimised CV templates (SA-norms aware).
  - AI CV review: structure, clarity, and keyword alignment.
  - Portfolio sections for projects, societies, and WIL.

- **AI-Powered Job & Internship Matching**
  - SA-specific geo-targeting (province / city / remote).
  - Filters for **B-BBEE level**, sector, stipend, and remote/hybrid.
  - AI matcher that prioritises **fit and feasibility**, not just keywords.

- **Application Tracker**
  - Unified Kanban view: _Saved → Applied → Interviewing → Offer → Hired_.
  - Works even if the original application happened off-platform.

- **Career-Readiness Tools**
  - AI mock interviews (voice/video) tuned to SA sectors (banking, mining, tech, etc.).
  - Soft-skills micro-modules (communication, teamwork, problem-solving) in an SA context.
  - Digital skills gap analyser with course recommendations.

- **Market Reality & Rights**
  - Salary benchmarks by role + province.
  - Plain-language labor-law primers for interns and entry-level employees.
  - Resource library on tax, transport, stipends, and basic financial literacy.

- **Mentorship & Community**
  - Alumni / mentor connector (by sector, location, and background).
  - Peer forums and Q&A channels.
  - Template library for professional email, acceptance/rejection letters, and follow-ups.

---

### For Employers

Reduce risk and admin while **improving B-BBEE, ETI, and learnership ROI**.   

Key capabilities:

- **Curated Final-Year Talent Pool**
  - Filter by institution, programme, province, B-BBEE targets, and skills.
  - Clear differentiation between internship, WIL, and graduate roles.

- **Smart Screening**
  - Structured profiles that go beyond CV PDFs.
  - Optional psychometric and skills assessments.
  - AI-assisted shortlisting and “fit” scoring.

- **Compliance-Ready Pipelines**
  - Support for Section 12H learnerships, ETI, and B-BBEE skills development.
  - Transparent, auditable workflows for internships and WIL placements.   

- **Internship / WIL Programme Toolkit**
  - Mentor onboarding packs and scheduling aids.
  - Templates for learning plans, feedback cycles, and performance tracking.
  - Program health metrics (completion, absorption, and retention rates).

---

### For Universities & TVETs

Turn fragmented, one-off efforts into a unified **“campus-to-career infrastructure”**.   

Key capabilities:

- **WIL & Internship Management**
  - Central place to manage placements, partner companies, and student progress.
  - Configurable to different faculty rules, SETA requirements, and accreditation flows.

- **Data & Analytics**
  - Graduate outcomes dashboards (placements, sectors, time-to-first-role).
  - Employer feedback loops into curriculum discussions.

- **Integration-First Approach**
  - Designed to **augment**, not replace, existing career portals where they already exist.
  - APIs + SSO hooks for SIS/LMS/HEMIS as the ecosystem matures.   

---

## Feature Overview

From the refined feature set & AI design docs:   

**Career Tools**

- SA-specific search (geo + B-BBEE filters)  
- AI matcher and “What’s Next” roadmap  
- Unified application tracker  
- ATS-aware CV + AI CV review  
- AI cover-letter generator  

**Skills & Interview Readiness**

- Soft-skills & digital-skills micro-modules  
- AI mock interviewer (video/voice)  
- Behavioral question coach (STAR method)  
- Psychometric/aptitude practice library  

**Market, Law & Logistics**

- Salary benchmarking  
- Labor-law primer (interns + entry-level)  
- Resource library (transport, tax, stipends, medical aid basics)  

**Mentorship & Community**

- Mentor / alumni connector  
- Peer forums  
- SA-style communication templates  

**Personalisation & Access**

- WhatsApp + SMS alerts  
- Multi-language support for SA’s 11 official languages (roadmap)  
- Offline-friendly content and low-data design  

---

## Architecture (Proposed)

> This section should be updated to match the actual implementation of this repo. The outline below assumes a modern JS + cloud backend stack.

**Frontend**

- [Next.js] – React-based app with server-side rendering and API routes  
- [TypeScript] – typed components and domain logic  
- [Tailwind CSS] – utility-first styling for consistent, responsive UI  

**Backend & Infrastructure (Example)**

- Firebase / Supabase (Auth, DB, Storage)  
- Optional: Cloud Functions for matching, notifications, and scheduled jobs  
- Integration endpoints for WhatsApp, SMS, and email providers  

**AI Layer**

- External LLM APIs for:
  - CV review + cover letters  
  - Interview coaching  
  - “What’s Next” guidance and skills gap analysis  

- Future: custom fine-tuned models on anonymised, POPIA-compliant data.   

**Compliance & Trust**

- POPIA-aligned data flows (explicit consent, purpose limitation, minimal collection).   
- WCAG-aligned accessibility, particularly on mobile.   
- Audit trails for key decisions (matching, shortlisting, acceptance/rejection).   

---

## Getting Started (Developer Setup)

> Adjust commands to match your actual stack.

```bash
# 1. Clone the repo
git clone https://github.com/<ORG_OR_USER>/intern-us.git
cd intern-us

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Set environment variables
cp .env.example .env.local
# Fill in API keys, Firebase/DB config, etc.

# 4. Run the dev server
npm run dev
# Visit http://localhost:3000
