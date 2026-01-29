# CI/CD Platform (Railway Cloud POC)

A **custom-built CI/CD platform Proof of Concept** designed to demonstrate how modern deployment systems (like GitHub Actions, Jenkins, or CircleCI) work internally — using **GitHub Webhooks + Railway Cloud + Node.js**.

This project shows **how to deploy a service automatically without using Railway’s built‑in GitHub auto‑deploy**, giving you full control over build and deployment orchestration.

---

## 📌 What This Project Demonstrates

✔ Custom CI/CD Orchestrator  
✔ GitHub Webhook handling  
✔ Secure webhook signature verification  
✔ Monorepo support  
✔ Folder‑level deployment trigger  
✔ Railway CLI–based deployment  
✔ Production‑style architecture  

This is a **learning-grade but real-world aligned CI/CD system**.

---

## 🧱 Architecture Overview

```
GitHub Repository (Monorepo)
│
├── payment-service/
│     └── Node.js microservice
│
└── ci-cd-orchestrator/
      ├── webhook server
      ├── pipeline engine
      ├── Railway deploy trigger
      └── logging & validation
```

### Deployment Flow

```
GitHub Push
   ↓
GitHub Webhook
   ↓
CI/CD Orchestrator (Deployed on Railway Cloud)
   ↓
Change Detection (payment-service/)
   ↓
Railway CLI Deployment
   ↓
Payment Service Rebuilt from GitHub
```

---

## 🔧 Technology Stack

| Layer | Technology |
|------|-----------|
| Runtime | Node.js (ES Modules) |
| CI Engine | Custom Node Pipeline |
| Webhooks | GitHub Webhooks |
| Deployment | Railway CLI |
| Cloud | Railway |
| Repo Type | Monorepo |
| Auth | GitHub Webhook Secret |
| Infra Style | Platform‑Driven CI/CD |

---

## 🧠 Why This Approach?

Railway normally works like this:

```
GitHub → Railway (auto deploy)
```

But this project intentionally disables that and introduces:

```
GitHub → Orchestrator → Railway
```

This allows:

- Custom validations
- Conditional deployments
- Folder‑based triggers
- Multi‑service pipelines
- Future support for approvals, tests, rollbacks

Exactly how **real CI/CD platforms** work internally.

---

## 📁 Project Structure

```
ci-cd-platform/
│
├── payment-service/
│   ├── index.js
│   ├── package.json
│   └── railway.json
│
└── ci-cd-orchestrator/
    ├── index.js
    ├── pipeline/
    │     └── payment.pipeline.js
    ├── webhook/
    │     └── verifySignature.js
    ├── package.json
    └── README.md
```

---

## ⚙️ CI/CD Orchestrator Responsibilities

The orchestrator:

- Receives GitHub webhook events
- Verifies GitHub signature
- Detects folder‑level changes
- Runs deployment pipeline
- Triggers Railway deployment using CLI
- Does **not** contain service source code

---

## 🔐 Environment Variables

### In Railway → ci-cd-orchestrator service

| Variable | Description |
|--------|-------------|
| `GITHUB_SECRET` | GitHub webhook secret |
| `RAILWAY_TOKEN` | Railway personal API token |
| `PORT` | Auto assigned by Railway |

---

## 🔑 Creating Railway Token

1. Railway Dashboard  
2. Account → API Tokens  
3. Create new token  
4. Copy token  
5. Add to orchestrator environment variables  

Used internally by Railway CLI.

---

## 🔗 GitHub Webhook Setup

**Repository → Settings → Webhooks → Add Webhook**

| Field | Value |
|-----|------|
| Payload URL | `https://ci-cd-orchestrator.up.railway.app/webhook` |
| Content Type | `application/json` |
| Secret | same as `GITHUB_SECRET` |
| Events | Push |

---

## 🧪 How Deployment Trigger Works

Only deploy when this path changes:

```
payment-service/**
```

If commits affect:

- `ci-cd-orchestrator/` → ❌ ignored  
- `payment-service/` → ✅ deploy triggered  

This prevents orchestrator from redeploying itself.

---

## 🚀 Deployment Pipeline Logic

```js
railway up --service payment-service --yes
```

This command instructs Railway to:

- Pull latest code from GitHub
- Install dependencies
- Build service
- Deploy to production

The orchestrator never touches the codebase locally.

---

## 🧠 Key Learning Concepts

- CI vs CD separation
- Event‑driven deployments
- Webhook security
- Platform orchestration
- Infrastructure abstraction
- Real-world DevOps workflow
- Service isolation
- Controlled deployments

---

## ⚠️ Important Notes

- Orchestrator should **NOT** be GitHub auto‑deployed
- Payment service GitHub auto‑deploy should be disabled
- Only orchestrator triggers deployments
- Railway CLI handles Git fetch internally

---

## 🧩 Future Enhancements

- Multi‑service pipelines
- Environment promotion (dev → prod)
- Test execution stage
- Manual approval stage
- Rollback automation
- Slack / Discord notifications
- Deployment logs dashboard

---

## 🎯 Purpose of This Project

This is a **DevOps learning and demonstration platform**, ideal for:

- Understanding CI/CD internals
- Interview discussions
- Architecture explanations
- Portfolio projects
- Advanced backend engineering learning

---

## 👨‍💻 Author

**Shafqat Altaf**  
Backend Engineer | Microservices | DevOps | Cloud Architecture  

---

## ⭐ Final Note

This CI/CD platform is intentionally built **from scratch** to understand:

> “What actually happens behind GitHub Actions and Jenkins?”

If you understand this project — you understand CI/CD.

---
