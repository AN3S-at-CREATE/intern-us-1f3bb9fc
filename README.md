# 🇿🇦 Intern Us — Bridging South African Students & Industry

![Intern Us Banner](src/assets/Banner.png)

**Intern Us** is a digital-first platform built to **break the “no experience, no job” loop** facing South Africa’s final-year students. We connect universities, students, and employers into a unified ecosystem—designed to make internship discovery, application, placement, and onboarding seamless, inclusive, and impactful.

> 💼 62% of youth aged 15–24 are unemployed.
>  
> 😰 58.7% of them have **no work experience**.
>  
> 🚀 Intern Us fixes that with a platform built for students, not just recruiters.

---

## 🔧 Core Features

- 🎓 **Student Profile Builder** – Build CVs, upload certificates, record voice intros, and earn micro-credentials.
- 🧠 **AI-Powered Matching** – Match students with internships, WIL, and jobs by location, skills, B-BBEE, and more.
- 📦 **Application Tracker** – Kanban-style tracking for saved, applied, interviewed, and hired roles.
- 🏢 **Employer Dashboard** – Post, screen, and manage interns with built-in compliance and ETI tools.
- 🏅 **Skills Hub** – Mobile-first modules with badges to boost soft skills and employability.
- 🔄 **Mentor & University Integrations** – Syncs with SETAs and universities for verified WIL pathways.
- 📱 **Mobile-First, Zero-Rated Access** – Runs on 3G in rural areas, includes offline mode and voice-based CVs.
- 🔒 **POPIA-Compliant & Inclusive** – Fully localised, privacy-first, and designed for WCAG accessibility standards.

---

## 📈 Why Intern Us?

### 👩‍🎓 For Students
- Saves an average of **R938/month** on job-seeking costs
- Unlocks networks through **peer referrals** and **community hubs**
- Offers multilingual voice-first onboarding, even on low-end phones

### 🧑‍💼 For Employers
- Reduces time-to-hire and compliance complexity
- Leverages **B-BBEE**, **Section 12H**, and **ETI** tax incentives
- Automates intern onboarding, screening, and mentorship toolkits

### 🏛 For Universities
- Ensures WIL is integrated into academic pathways
- Tracks placement outcomes and builds SETA-aligned compliance
- Provides shared dashboards for curriculum feedback loops

---

## ⚖️ Compliance & Accessibility

- ✅ Fully **POPIA** aligned: transparency, consent, breach notifications
- ♿ **WCAG 2.1 AA** compliant: screen readers, keyboard navigation, alt text, and contrast optimized
- 🌍 **Multilingual** support & **voice-note** applications for accessibility in rural areas
- 🔐 Secure connections, encrypted data handling, audit-ready policies

---

## 💰 Sustainability & Monetisation

Intern Us is built on a blended revenue model:

- Employer subscription tiers with B-BBEE integration tools
- Value-add services like psychometric testing & screening APIs
- White-label deployment for academic institutions and SETAs
- Government partnerships & donor funding for accessibility initiatives

---

## 🛠 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **State Management**: React Query
- **Testing**: Vitest
- **AI Features**: Lovable AI (integrated via Supabase Edge Functions)
- **Deployment**: Standard SPA (Vercel/Netlify/etc)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd intern-us
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Environment Setup:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`).
   - *Note*: Supabase Edge Functions require `LOVABLE_API_KEY` to be set in your Supabase project secrets, not in the local `.env` file (unless running functions locally).

### Development

Start the development server:

```bash
npm run dev
# or
bun dev
```

### Testing

Run the test suite:

```bash
npm test
# or
bun test
```

---

## 🧪 Future Enhancements

- 🧬 **Voice-based CV generator**
- 🌐 **Offline PWA with full career toolkit**
- 🎓 **Learning → Placement auto-conversion engine**
- 🔍 **Real-time ETI & 12H tax incentive dashboards for HR**
- 🤝 **University + Employer co-designed curriculum AI assistant**

---

## 📎 Documentation & Reports

> **Note**: Comprehensive documentation and strategy reports are currently being updated.

---

## 🤝 Contributing

> We're building a future where **every student has a shot at success**, no matter their zip code or network.

Want to join the mission?  
Fork, raise an issue, or hit us up at [hello@internus.co.za](mailto:hello@internus.co.za)

---

## 🛡 License

MIT © Intern Us | Powered by South Africa’s Youth Employment Movement 🚀
