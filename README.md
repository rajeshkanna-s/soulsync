# 🔮 SoulSync

> **Next-Generation Onboarding, Background Analytics & Psychological Compatibility Engine**

SoulSync is a modern psychological profiling and compatibility web application built with **React, TypeScript, Vite, and Supabase**. It analyzes deep biographical factors, cultural upbringing, family structures, and emotional experiences to map out a comprehensive personality compatibility report.

Featuring a premium **Pink & Beige glassmorphism design system**, SoulSync offers a highly responsive and micro-animated interface crafted with vanilla CSS.

---

## ✨ Key Features

### 1. 📋 Multi-Step Demographic Onboarding Wizard
Before entering the statement test, users complete a beautiful 4-step biographical onboarding sequence:
- **Step 1: Identity & Origins**: Name, Age, Biological Gender, Country selection, and City of Birth / Living City.
  - *Comprehensive Indian Cities Database*: Selecting "India" activates a database of **1,200+ Indian cities** dynamically bound to the Born/Living dropdown inputs, with custom typed fallbacks ("Other").
- **Step 2: Education & Languages**: Education level, Languages Spoken, and Languages Studied.
  - *Prioritized Select Options*: Standard select dropdown menus with the most common languages highlighted at the very top (`English`, `Tamil`, `Malayalam`, `Hindi`, `Telugu`, `Kannada`), along with custom typing fallbacks.
- **Step 3: Family & Wealth**: Sibling counts, Parents' education status, and socioeconomic standing.
- **Step 4: Life & Health**: Disability status and love failure diagnostics (conditionally asked only if Age &ge; 16).

### 2. ⚡ Snap & Auto-Submit Statement Quiz
The core personality evaluation comprises 24 Likert statement ratings (Strongly Disagree to Strongly Agree):
- **Snappier Auto-Advance**: Toggling any answer rating automatically advances the user to the next slide with a **200ms delay**—providing brief visual feedback of the active choice before sliding forward.
- **Auto-Submit on Final Question**: The final question automatically packages answers and demographic metadata to compute the results—completely removing the manual need to click a submit button.

### 3. 🧠 Upbringing & Background Narrative Engine
Using scientific principles on how early environment influences emotional baselines, the engine synthesizes biographical factors to construct a custom narrative details report:
- **City Migration**: Calculates environmental adaptability and Openness based on differences in Born City vs. Living City.
- **Cognitive Flexibility**: Evaluates empathy and adaptability from multilingualism.
- **Sibling Dynamics**: Maps peer negotiations and Agreeableness based on sibling structures.
- **Vulnerabilities**: Analyzes emotional boundaries, stress reactions, and act-of-service appreciation through love failures and health challenges.

### 4. 🔗 Side-by-Side Biographical Partner Matching
Users can download their completed **Soul Matrix profile (.json)** locally, and upload a partner's file. The result dashboard renders:
- **Demographic Alignment Grid**: A side-by-side comparative table showing origins, siblings, education, wealth, and life experiences.
- **8-Dimensional Comparative Charts**: Interactive visual scales detailing alignment across Honesty, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness, EQ, and Conflict Resolution.

### 5. 🗄️ Supabase Telemetry Integration
Anonymous demographic inputs and statement scores are automatically pushed to a secure Supabase backend for relationship analytics and compatibility research, keeping all identifying user profiles locally sandboxed in the browser.

---

## 🛠️ Tech Stack & Design System

- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database Backend**: [Supabase PostgreSQL](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS featuring:
  - Custom Google Fonts integration (`Outfit` for headings, `Inter` for body).
  - Elegant Glassmorphism tokens (`--bg-glass`, `--border-glass-glow`).
  - Warm Beige background theme (`#faf6f0`) and Blush Pink highlights (`#ec4899`).
  - Floating keyframe micro-animations and glowing hover states.

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16+ recommended) and `npm` installed.

### ⚙️ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rajeshkanna-s/soulsync.git
   cd soulsync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and specify your Supabase access keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anonymous-key
   ```

4. Run the development server locally:
   ```bash
   npm run dev
   ```

5. Build production bundle:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
SoulSync/
├── public/                # Static assets & icons
├── scratch/               # Helper data fetching scripts
└── src/
    ├── assets/            # Static media
    ├── data/              # Core datasets (Indian Cities list, questions, types)
    ├── hooks/             # LocalStorage & custom React hooks
    ├── styles/            # CSS theme configurations & component styling
    ├── utils/             # Core engines (Supabase, matching formulas, background narratives)
    └── views/             # Onboarding Quiz, Result Dashboard, and Home views
```

---

## 📜 License
This project is licensed under the MIT License.
