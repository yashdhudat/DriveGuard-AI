<div align="center">

<!-- HERO BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=DriveGuard%20AI&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Agentic%20Automotive%20Predictive%20Maintenance%20Platform&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<br/>

<p>
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge&logo=statuspage&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=opensourceinitiative&logoColor=white"/>
  <img src="https://img.shields.io/badge/Built%20With-FastAPI%20%2B%20React-FF5722?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/AI-Multi--Agent%20System-8A2BE2?style=for-the-badge&logo=openai&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/EY%20Techathon%206.0-Submitted-gold?style=for-the-badge&logo=award&logoColor=white"/>
  <img src="https://img.shields.io/github/stars/yashdhudat/DriveGuard-AI?style=for-the-badge&logo=github&color=yellow"/>
  <img src="https://img.shields.io/github/forks/yashdhudat/DriveGuard-AI?style=for-the-badge&logo=github&color=orange"/>
</p>

<br/>

> **DriveGuard AI** is an advanced automotive intelligence platform that predicts vehicle faults *before they occur*, automates service scheduling, provides real-time driver assistance via voice, and closes the feedback loop for OEM manufacturing improvements — all powered by a coordinated multi-agent AI architecture.

<br/>

[🚀 Live Demo](#-screenshots--demo) &nbsp;·&nbsp; [📖 Documentation](#-how-to-run-locally) &nbsp;·&nbsp; [🤝 Contribute](#-contribute) &nbsp;·&nbsp; [📬 Contact](#-contact)

</div>

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture-diagram)
- [Technology Stack](#-technology-stack)
- [Screenshots / Demo](#-screenshots--demo)
- [Getting Started](#-how-to-run-locally)
- [Team](#-team-members)
- [Impact & Benefits](#-impact--benefits)
- [Achievements](#-achievements)
- [License](#-license)
- [Contact](#-contact)

---

## 🔍 Problem Statement

Vehicle breakdowns, last-minute servicing, and slow diagnostics cascade into systemic losses across the entire automotive value chain:

| Pain Point | Impact |
|---|---|
| ⚠️ Unplanned Breakdowns | High emergency repair costs & safety risks |
| 🕐 Reactive Maintenance | Missed preventive windows, shortened vehicle lifespan |
| 🔧 Slow Diagnostics | Service center bottlenecks & poor throughput |
| 📦 Poor Supply Forecasting | Spare part shortages, idle service bays |
| 🏭 No OEM Feedback Loop | Design flaws persist across production cycles |

> **Traditional maintenance is reactive. DriveGuard AI makes it predictive, proactive, and intelligent.**

---

## 🧠 Solution Overview

DriveGuard AI deploys a **coordinated multi-agent AI system** that continuously monitors vehicle health signals, predicts failures, automates interventions, and feeds insights back to manufacturers — all in real time.

```
Vehicle Sensors ──► Diagnostics Agent ──► Severity Agent ──► Root Cause Agent
                                                                      │
                         ┌────────────────────────────────────────────┘
                         ▼
              Service Scheduler Agent ──► Demand Forecast Agent
                         │
                         ▼
              VoiceBot Agent ◄──► Driver Interface
                         │
                         ▼
              OEM Analytics Dashboard
```

---

## 🧩 Key Features

<table>
<thead>
  <tr>
    <th>Agent</th>
    <th>Role</th>
    <th>Capability</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>🔍 <strong>Diagnostics Agent</strong></td>
    <td>Fault Detection</td>
    <td>Real-time anomaly detection on component telemetry; flags early-stage failures before they escalate</td>
  </tr>
  <tr>
    <td>⚠️ <strong>Severity Agent</strong></td>
    <td>Risk Scoring</td>
    <td>Assigns urgency scores and classifies safety threats across detected anomalies</td>
  </tr>
  <tr>
    <td>🧠 <strong>Root Cause Agent</strong></td>
    <td>Failure Analysis</td>
    <td>Identifies probable root causes and generates actionable repair recommendations</td>
  </tr>
  <tr>
    <td>🛠️ <strong>Service Scheduler Agent</strong></td>
    <td>Appointment Automation</td>
    <td>Optimizes service slot allocation and routing based on fault urgency and proximity</td>
  </tr>
  <tr>
    <td>📈 <strong>Demand Forecast Agent</strong></td>
    <td>Supply Chain Intelligence</td>
    <td>Predicts spare-part requirements for proactive inventory management</td>
  </tr>
  <tr>
    <td>🎙️ <strong>VoiceBot Agent</strong></td>
    <td>Driver Assistance</td>
    <td>Conversational troubleshooting and proactive safety alerts via voice interface</td>
  </tr>
</tbody>
</table>

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DriveGuard AI Platform                       │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────────────────────────┐  │
│  │   Vehicle    │    │           Multi-Agent Backend             │  │
│  │   Sensors    │───►│  Diagnostics → Severity → Root Cause     │  │
│  │  Telemetry   │    │       ↓              ↓                    │  │
│  └──────────────┘    │  Scheduler   Demand Forecast             │  │
│                      │       ↓              ↓                    │  │
│  ┌──────────────┐    │   VoiceBot    OEM Analytics              │  │
│  │   React.js   │◄───│         FastAPI + PostgreSQL             │  │
│  │  Dashboard   │    └──────────────────────────────────────────┘  │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

> 📌 Full architecture diagram coming soon. Contributions welcome!

---

## 🛠️ Technology Stack

<table>
<thead>
  <tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr>
</thead>
<tbody>
  <tr>
    <td rowspan="4"><strong>Frontend</strong></td>
    <td><img src="https://img.shields.io/badge/React.js-20232A?style=flat&logo=react&logoColor=61DAFB"/> React.js</td>
    <td>Component-based UI</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white"/> Tailwind CSS</td>
    <td>Utility-first styling</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Recharts-FF6B6B?style=flat"/> Recharts</td>
    <td>Data visualization & charts</td>
  </tr>
  <tr>
    <td>REST API Integration</td>
    <td>Backend communication</td>
  </tr>
  <tr>
    <td rowspan="3"><strong>Backend</strong></td>
    <td><img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white"/> FastAPI</td>
    <td>High-performance async API</td>
  </tr>
  <tr>
    <td>Async Multi-Agent System</td>
    <td>Coordinated AI agent orchestration</td>
  </tr>
  <tr>
    <td>Uvicorn</td>
    <td>ASGI production server</td>
  </tr>
  <tr>
    <td rowspan="3"><strong>AI & ML</strong></td>
    <td><img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat&logo=scikitlearn&logoColor=white"/> Scikit-Learn</td>
    <td>Predictive ML models</td>
  </tr>
  <tr>
    <td>Fault Diagnosis Algorithms</td>
    <td>Anomaly detection & root cause analysis</td>
  </tr>
  <tr>
    <td>Severity Scoring Engine</td>
    <td>Risk classification & prioritization</td>
  </tr>
  <tr>
    <td rowspan="3"><strong>Infra</strong></td>
    <td><img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white"/> PostgreSQL</td>
    <td>Primary database</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white"/> Docker</td>
    <td>Containerization (Planned)</td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Azure-0078D4?style=flat&logo=microsoftazure&logoColor=white"/> Azure Cloud</td>
    <td>Cloud deployment (Planned)</td>
  </tr>
</tbody>
</table>

---

## 🚀 Screenshots / Demo

> 🖼️ Screenshots and live demo GIFs coming soon. Star the repo to stay updated!

---

## ⚙️ How to Run Locally

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the Repository

```bash
git clone https://github.com/yashdhudat/DriveGuard-AI.git
cd DriveGuard-AI
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn app.main:app --reload
```

> 🔗 API will be available at `http://localhost:8000`
> 📄 Swagger docs at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

> 🔗 Frontend will be available at `http://localhost:3000`

### 4. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/driveguard
SECRET_KEY=your_secret_key_here
```

---

## 👥 Team Members

<table>
<thead>
  <tr>
    <th>Member</th>
    <th>Role</th>
    <th>Contribution</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><a href="https://linkedin.com/in/yash-dhudat-4a231b249"><strong>Yash Dhudat</strong></a></td>
    <td>Backend + AI Lead</td>
    <td>Multi-agent system, ML models, FastAPI backend, system architecture</td>
  </tr>
  <tr>
    <td><strong>Maithili</strong></td>
    <td>Frontend Developer</td>
    <td>React dashboard, data visualization, component design</td>
  </tr>
  <tr>
    <td><strong>Avishkar</strong></td>
    <td>Data & Integration</td>
    <td>Service scheduling logic, database design, API integration</td>
  </tr>
  <tr>
    <td><strong>Shubhangi</strong></td>
    <td>UI/UX & QA</td>
    <td>Interface design, user testing, quality assurance</td>
  </tr>
</tbody>
</table>

---

## 🎯 Impact & Benefits

```
┌─────────────────────────────────────────────────────────────────┐
│                        DriveGuard AI Impact                     │
├──────────────────────────┬──────────────────────────────────────┤
│  🚘 For Drivers          │  Fewer breakdowns, safer journeys    │
│  🔧 For Service Centers  │  Higher throughput, less idle time   │
│  📦 For Supply Chain     │  Optimized inventory, reduced waste  │
│  🏭 For Manufacturers    │  Actionable design feedback loop     │
│  💰 For Stakeholders     │  Lower warranty & repair costs       │
└──────────────────────────┴──────────────────────────────────────┘
```

- ✅ Reduces unplanned breakdowns with proactive fault alerts
- ✅ Improves service center efficiency via automated scheduling
- ✅ Enhances customer trust and satisfaction
- ✅ Enables OEM manufacturing feedback optimization
- ✅ Lowers warranty claims and long-term repair costs

---

## 🏆 Achievements

<table>
<tr>
  <td>🥇</td>
  <td><strong>EY Techathon 6.0</strong> — Submitted & evaluated at national level</td>
</tr>
<tr>
  <td>⚡</td>
  <td><strong>Fully functional MVP</strong> built and shipped within 6 weeks</td>
</tr>
<tr>
  <td>🔄</td>
  <td><strong>Real-time predictive maintenance</strong> workflow implemented end-to-end</td>
</tr>
</table>

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contribute

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request 🚀

---

## 📬 Contact

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>Yash Dhudat</td>
</tr>
<tr>
  <td>📧 <strong>Email</strong></td>
  <td><a href="mailto:yashdhudat@gmail.com">yashdhudat@gmail.com</a></td>
</tr>
<tr>
  <td>💼 <strong>LinkedIn</strong></td>
  <td><a href="https://linkedin.com/in/yash-dhudat-4a231b249">linkedin.com/in/yash-dhudat-4a231b249</a></td>
</tr>
<tr>
  <td>🐙 <strong>GitHub</strong></td>
  <td><a href="https://github.com/yashdhudat">github.com/yashdhudat</a></td>
</tr>
<tr>
  <td>🌐 <strong>Portfolio</strong></td>
  <td><a href="https://yashdhudat.vercel.app">yashdhudat.vercel.app</a></td>
</tr>
</table>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=100&section=footer" width="100%"/>

<p>Built with ❤️ by <a href="https://github.com/yashdhudat"><strong>Yash Dhudat</strong></a> & Team</p>

<p>
  <a href="https://github.com/yashdhudat/DriveGuard-AI">⭐ Star this repo</a> if you found it useful!
</p>

</div>
