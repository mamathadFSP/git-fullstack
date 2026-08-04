<<<<<<< HEAD
# 🚀 GitHub Portfolio Analyzer & Enhancer

> **"Unfold Success from Untold Experiences"**

Turn your GitHub repositories into recruiter-ready proof. Get an objective **Recruiter-Readiness Score (0–100)**, discover red flags, and receive actionable fixes — in seconds.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **Recruiter-Readiness Score** — Objective 0–100 score based on how recruiters evaluate GitHub profiles
- **Dimension Breakdown** — Radar chart analyzing Documentation, Consistency, Impact & Best Practices
- **Tech Stack Analysis** — Visual breakdown of languages used across repositories
- **Strengths & Red Flags** — Explicit feedback on what looks good and what needs work
- **3 Actionable Recommendations** — Specific, prioritized fixes to boost your score immediately
- **Dark Mode UI** — Modern glassmorphism design with smooth animations

---

## 🏗️ Scoring Algorithm

| Dimension | Weight | What's Checked |
|---|---|---|
| 📝 Documentation | 30% | README existence & detail (> 500 chars) |
| 🔄 Consistency | 25% | Push event frequency over last 30 days |
| ⭐ Impact | 25% | Stars, forks, and repository count |
| ✅ Best Practices | 20% | `.gitignore` presence & repo descriptions |

**Color Coding:** 🟢 ≥ 75 (Recruiter-Ready) · 🟡 50–74 (Getting There) · 🔴 < 50 (Needs Work)

---

## 📂 Project Structure

```
├── client/                        # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard.jsx      # Score card, charts, metrics, recommendations
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Hero section with username input
│   │   │   └── AnalyzePage.jsx    # Loading states + dashboard rendering
│   │   ├── App.jsx                # React Router setup
│   │   └── index.css              # Dark design system
│   └── vite.config.js
│
├── server/                        # Express Backend
│   ├── controllers/
│   │   └── analyzeController.js   # Request handling + error responses
│   ├── services/
│   │   ├── githubService.js       # GitHub API integration (Octokit)
│   │   └── scoringService.js      # Scoring algorithm + recommendations
│   ├── routes/
│   │   └── analyze.js             # POST /api/analyze
│   └── index.js                   # Express entry point
│
├── render.yaml                    # Render deployment config
└── package.json                   # Root build/start scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **GitHub Personal Access Token** (optional but recommended — [create one here](https://github.com/settings/tokens), no scopes needed)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/github-portfolio-analyzer.git
cd github-portfolio-analyzer

# Install all dependencies (server + client)
npm install
```

### Configuration

Create a `.env` file in the `server/` directory:

```env
GITHUB_TOKEN=ghp_your_personal_access_token
PORT=3001
```

> ⚠️ Without a token, you're limited to **60 API requests/hour**. With a token, you get **5,000/hour**.

### Run Locally

```bash
# Terminal 1 — Start the backend
cd server
npm start

# Terminal 2 — Start the frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 Deploy on Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml`, or set manually:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variable: `GITHUB_TOKEN` = your token

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| API | GitHub REST API via `@octokit/rest` |
| Deployment | Render |

---

