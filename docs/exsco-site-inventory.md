# Exsco Website Change Inventory & Recommendations

This document lists every page in the app (public + authenticated) and highlights concrete change options Exsco can request per page.

## Public site
- **Landing /** — hero, featured internships carousel, role highlights (students, employers, universities), how-it-works, feature grid, stats, partners, CTA.
  - Change ideas: localise hero copy for SA grads (add stipend expectations in ZAR), rotate industry-specific featured internships, add partner testimonials, and surface POPIA badge/link near signup CTAs.
- **Get Started /get-started** — onboarding explainer (currently static guidance).
  - Change ideas: add role-based quick-start checklists, embed a 60-second video, and show a “pricing from R0” banner for employers.
- **Install /install** — PWA install helper with iOS/Android steps and benefits.
  - Change ideas: add OS detection badges, short demo GIF of offline mode, and a QR code deep link to the install page.
- **Auth: Sign In /signin & /auth/signin; Sign Up /signup & /auth/signup** — authentication flows.
  - Change ideas: swap headline to “Intern US for Exsco”, add SSO placeholders (Google/Microsoft) with disabled state, and include POPIA consent microcopy.
- **Not Found /*** — generic 404 fallback.
  - Change ideas: add primary CTA back to landing and a secondary CTA to support.

## Student dashboard (protected)
- **Dashboard /dashboard** — greeting, profile completeness, stats (applications, views, match score, interviews), and quick actions.
  - Change ideas: enable sample data instead of zeros, add “Recommended next step” card tied to profile completeness, and show weekly streak metric.
- **Profile Builder /dashboard/profile** — profile inputs (headline, institution, field of study, etc.).
  - Change ideas: add upload for certifications, prefill institution list with SA universities/TVETs, and show a live preview card.
- **CV Builder /dashboard/cv-builder** — AI CV builder workspace.
  - Change ideas: add export buttons (PDF/Docx), version history, and a POPIA notice for uploaded data.
- **Interview Simulator /dashboard/interview** — mock interviews with AI prompts.
  - Change ideas: add role-specific question banks, timer/scorecard, and an option to download transcript.
- **Opportunities /dashboard/opportunities** — browse jobs/internships.
  - Change ideas: add filters for province/remote, salary band in ZAR, and “applied” badges.
- **Skill Modules /dashboard/skills** — learning modules.
  - Change ideas: add module completion tracker, bookmark/favourite toggles, and links to related jobs.
- **Application Tracker /dashboard/applications** — track submitted applications.
  - Change ideas: add Kanban columns (Applied/Interview/Offer), reminder nudges, and upload offer letter for record-keeping.
- **Community Hub /dashboard/community** — community feed/forums.
  - Change ideas: add pinned posts for Exsco announcements, role-based filters, and event RSVP links.
- **Career Advisor /dashboard/career-advisor** — guidance area.
  - Change ideas: include “career pathways” per discipline, salary outlook charts (ZAR), and email-my-plan action.
- **Events /dashboard/events** — event listings.
  - Change ideas: add calendar export (ICS), location + virtual toggle, and waitlist sign-up.
- **Notification Settings /dashboard/settings/notifications** — notification preferences.
  - Change ideas: add digest frequency options, SMS toggle (with airtime cost notice), and test notification button.
- **POPIA Trust Center /dashboard/privacy** — privacy settings/info.
  - Change ideas: add data access/download request link, consent logs, and retention timeline visual.
- **Student Analytics /dashboard/analytics** — user-facing analytics.
  - Change ideas: add daily/weekly toggle, cohort benchmarks, and “export CSV” for sharing.

## Employer workspace (protected)
- **Employer Dashboard /employer, /employer/dashboard** — overview for employers.
  - Change ideas: add open roles count, candidate pipeline, and CTA to post an opportunity.
- **Post Opportunity /employer/post-opportunity** — create job/internship postings.
  - Change ideas: add templates by role, stipend/salary currency default to ZAR with range helper, and preview card before publishing.
- **Opportunities Management /employer/opportunities** — manage posted roles.
  - Change ideas: add status filters (draft/open/closed), performance stats (views, applies), and quick clone button.
- **Applicant Management /employer/applicants** — view applicants.
  - Change ideas: add scorecards, shortlist/reject actions with reasons, and bulk email templates.
- **Company Profile /employer/company** — employer profile setup.
  - Change ideas: add branding uploads (logo/brand colors), social links, and compliance documents upload.
- **Employer Analytics /employer/analytics** — analytics for employers.
  - Change ideas: add source-of-hire chart, cost-per-hire estimate (ZAR), and export to CSV/PDF.

## University workspace (protected)
- **University Dashboard /university, /university/dashboard** — overview for universities.
  - Change ideas: add placement funnel, student engagement score, and CTA to invite employers.
- **Student Placements /university/placements** — placement tracking.
  - Change ideas: add filters by faculty/campus, WIL compliance status, and CSV import for placements.
- **At-Risk Students /university/at-risk** — risk tracking.
  - Change ideas: add risk reasons dropdown, advisor assignment, and follow-up reminder scheduling.
- **WIL Reports /university/reports** — reporting area.
  - Change ideas: add report templates, export options (PDF/CSV), and “send to dean” email shortcut.
- **University Analytics /university/analytics** — analytics for universities.
  - Change ideas: add cohort comparison, trendlines by semester, and retention metric.
- **University Profile /university/profile** — institutional profile.
  - Change ideas: add accreditation documents upload, campus locations map, and POPIA contact details field.

## System utility pages
- **Install /install** — PWA install helper (duplicate listed above for completeness).
- **Not Found /*** — 404 fallback (duplicate listed above for completeness).

## Rollout suggestion
- Prioritise changes that boost conversions: Landing hero localisation and employer “pricing from R0” banner first, then dashboard sample data so Exsco sees live-looking numbers during demos. Estimated design + build for the priority trio: ~R18k–R25k (roughly 1–1.5 engineer weeks at R1.2k–R1.6k/hour). Add the rest as a backlog for phased delivery.
