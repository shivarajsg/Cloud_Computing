# FreshTrack — Cloud-Based Smart Expiry & Food Waste Alert System
> **College Cloud Computing Lab Mini-Project**  
> *Demonstrating Serverless Cloud Architecture with AWS Lambda, Amazon API Gateway, and Amazon DynamoDB*

[![GitHub Repository](https://img.shields.io/badge/GitHub-shivarajsg%2FCloud__Computing-181717?logo=github)](https://github.com/shivarajsg/Cloud_Computing)
[![AWS Deployed Region](https://img.shields.io/badge/AWS%20Region-ap--south--1%20(Mumbai)-ff9900?logo=amazon-aws)](https://ap-south-1.console.aws.amazon.com)
[![AWS API Gateway](https://img.shields.io/badge/API%20Gateway-Live%20Verified-10b981?logo=amazon-aws)](https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod/health)
[![DynamoDB Table](https://img.shields.io/badge/DynamoDB-FreshTrackItems%20(Active)-4053D6?logo=amazon-dynamodb)](https://ap-south-1.console.aws.amazon.com/dynamodbv2)
[![Build & Test Status](https://img.shields.io/badge/tests-22%20passed-10b981.svg)](https://github.com/shivarajsg/Cloud_Computing)
[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite-61dafb.svg?logo=react)](https://vitejs.dev)
[![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS%20v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com)

---

## 1. Project Overview

Households, grocery stores, and food businesses often forget expiration dates of stored food items, resulting in unnecessary waste, financial losses, and food safety risks.

**FreshTrack** is a cloud-based smart food expiry alert application that records food items, monitors shelf lives relative to the current calendar date, and issues automated alerts when products approach or pass their expiration date.

### Core Objectives
1. Maintain a digital inventory of food products.
2. Monitor expiration dates dynamically without timezone drift.
3. Automatically identify expired and nearly expired goods (0–7 days window).
4. Display real-time expiry alerts and category breakdowns on a centralized dashboard.
5. Store product information in a cloud database (Amazon DynamoDB).
6. Demonstrate cloud computing concepts (FaaS, PaaS, serverless APIs, NoSQL).

---

## 2. Live Cloud Deployment Status

| Component | AWS Resource / URL | Status |
|---|---|:---:|
| **API Gateway Endpoint** | `https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod` | **Active / Verified** |
| **Health Check URL** | `https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod/health` | **HTTP 200 OK** |
| **AWS Region** | `ap-south-1` (Asia Pacific - Mumbai) | **Active** |
| **CloudFormation Stack** | `freshtrack-backend` | **CREATE_COMPLETE** |
| **Lambda Function** | `FreshTrackFunction` (Node.js runtime) | **Active** |
| **DynamoDB Table** | `FreshTrackItems` (Partition Key: `itemId`) | **ACTIVE** |
| **GitHub Repository** | [https://github.com/shivarajsg/Cloud_Computing](https://github.com/shivarajsg/Cloud_Computing) | **Main Branch** |

---

## 3. Technology Stack

### Frontend
- **Framework:** React.js (v19)
- **Tooling:** Vite (v8)
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Data Visualization:** Recharts (Dynamic Bar and Pie charts)
- **Hosting:** Vercel Global Edge CDN

### Backend & Cloud Services
- **Runtime:** Node.js (v24.x LTS)
- **Compute:** AWS Lambda (Serverless execution)
- **API Management:** Amazon API Gateway (REST API with CORS)
- **Database:** Amazon DynamoDB (Table: `FreshTrackItems`, on-demand capacity)
- **Infrastructure-as-Code:** AWS Serverless Application Model (SAM) / CloudFormation (`backend/template.yaml`, `backend/samconfig.toml`)

---

## 4. System Architecture

```
                      +-----------------------------------+
                      |       Client Web Browser          |
                      |   (Desktop, Tablet, Smartphone)   |
                      +-----------------+-----------------+
                                        |
                         HTTPS (Port 443) / DNS
                                        v
                      +-----------------------------------+
                      |      Vercel Edge Global CDN       |
                      |     (React SPA + Tailwind CSS)    |
                      +-----------------+-----------------+
                                        |
                       REST API Calls (JSON over HTTPS)
                                        v
                      +-----------------------------------+
                      |       Amazon API Gateway          |
                      |  - REST API Proxy Integration     |
                      |  - CORS Header Handling           |
                      |  - Region: ap-south-1 (Mumbai)    |
                      +-----------------+-----------------+
                                        |
                          Synchronous Lambda Invocation
                                        v
                      +-----------------------------------+
                      |           AWS Lambda              |
                      |  - Function: FreshTrackFunction   |
                      |  - Node.js 24.x Runtime           |
                      |  - Input Validation & Security    |
                      +-----------------+-----------------+
                                        |
                            AWS SDK v3 (lib-dynamodb)
                                        v
                      +-----------------------------------+
                      |         Amazon DynamoDB           |
                      |  - Table: FreshTrackItems         |
                      |  - Partition Key: itemId (S)      |
                      |  - Billing: PAY_PER_REQUEST       |
                      +-----------------+-----------------+
```

---

## 5. Key Features

- **Dynamic Expiry Engine:**
  - **Expired:** Expiry date is strictly earlier than today ($< 0$ days remaining, Red indicator).
  - **Expiring Soon:** Expiry date is within the next 7 days, including today ($0 \le \text{days} \le 7$, Amber indicator).
  - **Fresh:** Expiry date is $> 7$ days away (Green indicator).
- **Interactive Dashboard:** Dynamic counts, multi-segment progress breakdown, upcoming items list, category distribution chart, and urgent alerts.
- **Inventory Management:** Full CRUD operations (Add, View, Edit, Delete), search by product name, category filters, and multiple sort orders.
- **Date Range Validation:** Enforces positive quantities and strictly rejects expiration dates earlier than purchase dates.
- **Dual Operating Modes:**
  - **Demo Mode:** Zero-config local demo backed by browser `localStorage` preloaded with relative demonstration dates.
  - **AWS Cloud Mode:** Live integration with Amazon API Gateway and DynamoDB with in-app health check monitoring.

---

## 6. Folder Structure

```
FreshTrack/
├── frontend/                     # React.js + Vite + Tailwind CSS Single-Page App
│   ├── src/
│   │   ├── components/           # Navbar, Footer, CloudSettingsModal
│   │   ├── context/              # InventoryContext state & mode manager
│   │   ├── pages/                # Home, Dashboard, Inventory, AddItem, Alerts, About
│   │   ├── services/             # api.js (Dual Demo/Cloud mode service)
│   │   ├── utils/                # expiry.js (Core calculation engine), sampleData.js
│   │   ├── tests/                # expiry.test.js (10 automated unit tests)
│   │   ├── App.jsx               # Root application layout
│   │   ├── main.jsx              # Vite entrypoint
│   │   └── index.css             # Tailwind CSS v4 styling
│   ├── public/                   # Favicon and static assets
│   ├── index.html                # HTML entrypoint
│   ├── package.json              # Frontend scripts & dependencies
│   ├── vite.config.js            # Vite + Tailwind v4 configuration
│   └── .env.example              # Environment variables template
│
├── backend/                      # Node.js + AWS Lambda Serverless Backend
│   ├── src/
│   │   ├── handlers/             # items.js (AWS Lambda API handler)
│   │   ├── services/             # dynamoService.js (AWS SDK v3 DynamoDB client)
│   │   ├── app.js                # Lambda entrypoint export
│   │   └── local-server.js       # Standalone Express development server (Port 5000)
│   ├── tests/                    # items.test.js (12 automated API tests)
│   ├── template.yaml             # AWS SAM / CloudFormation template
│   ├── samconfig.toml            # AWS SAM deployment configuration (ap-south-1)
│   ├── package.json              # Backend scripts & dependencies
│   └── .env.example              # Backend environment configuration
│
├── docs/                         # Lab Presentation & Academic Documentation
│   ├── REPORT_DRAFT.md           # Complete 14-section lab mini-project report
│   ├── PPT_OUTLINE.md            # 10-slide viva presentation guide
│   └── ARCHITECTURE.md           # In-depth cloud architecture analysis
│
├── package.json                  # Root runner script configuration
└── README.md                     # Master project documentation
```

---

## 7. How to Run the Project Locally

### Prerequisites
- Node.js (v18, v20, or v22 LTS)
- npm (v9+)

### Installation
Clone or navigate to the project directory and install dependencies:

```bash
# Clone the repository
git clone https://github.com/shivarajsg/Cloud_Computing.git
cd Cloud_Computing

# Install all dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Option A: Run in Demo Mode (Zero AWS Setup Required)
Demo mode runs purely in your browser using local storage with realistic relative sample data:

```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

### Option B: Run Full Cloud-Connected Frontend
The frontend automatically connects to the deployed AWS API Gateway in `ap-south-1`:

```bash
npm run dev
```

1. Open **`http://localhost:5173`**.
2. Click the **Demo Mode / Cloud** badge in the top-right navbar.
3. Switch to **AWS Cloud Mode** (pre-configured with `https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod`).
4. Click **Test Backend /health** — it verifies live connectivity to Amazon DynamoDB (`FreshTrackItems`).

---

## 8. Running the Automated Test Suite

Both frontend calculation logic and backend API endpoints include comprehensive automated tests (22 tests in total):

```bash
# Run all tests (frontend + backend)
npm test

# Run frontend calculation tests only (10 tests)
npm run test:frontend

# Run backend API & Lambda tests only (12 tests)
npm run test:backend
```

---

## 9. API Endpoints Reference

All endpoints are deployed and accessible under:
`https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod`

| HTTP Method | Route | Description | Expected Status |
|---|---|---|:---:|
| `GET` | `/health` | Check backend availability & DynamoDB connectivity | `200 OK` |
| `GET` | `/items` | Retrieve all food items from DynamoDB | `200 OK` |
| `GET` | `/items/{id}` | Retrieve a specific food item | `200 OK` / `404 Not Found` |
| `POST` | `/items` | Add a new food item with validation | `201 Created` / `400 Bad Request` |
| `PUT` | `/items/{id}` | Update food item details | `200 OK` / `400 Bad Request` |
| `DELETE` | `/items/{id}` | Delete food item from inventory | `200 OK` |
| `OPTIONS` | `/*` | CORS preflight check | `200 OK` |

---

## 10. Deployment to Vercel

The frontend is ready for zero-config Vercel deployment:

1. Import this repository `https://github.com/shivarajsg/Cloud_Computing` in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod`
5. Click **Deploy**.

---

## 11. Security & Compliance

- **Zero Credentials in Code:** No AWS access keys, secret keys, or session tokens exist in repository files.
- **Sanitized Logging:** All HTTP headers (`Authorization`, `Cookie`, `x-api-key`) are redacted before CloudWatch logging.
- **Least-Privilege IAM:** The Lambda execution role has permissions restricted solely to `FreshTrackItems` table operations.
- **Safe Environment Templates:** All `.env` files are excluded by `.gitignore`; only `.env.example` templates with placeholders are tracked.

---

## 12. Demonstration Guide for Lab Review

When presenting to your lab evaluator or professor:
1. **Explain the Problem & Objectives:** Open the **Home** page and walk through the Problem, Solution, and 5-step process.
2. **Demonstrate Dynamic Expiry:** Navigate to **Dashboard** and show the 4 statistic cards and category chart. Note how the numbers reflect relative dates generated dynamically today.
3. **Inspect Inventory & Boundary Rules:** Go to **My Inventory**, search for items, filter by status, and click **Edit** or **View**.
4. **Test Live AWS Cloud Persistence:** Switch to **AWS Cloud Mode**, add a food item, and verify it persists directly in Amazon DynamoDB.
5. **Show Prioritized Alerts:** Open **Expiry Alerts** to show the 3 separate urgency queues (Expired, Expiring Soon, and Fresh).
6. **Walk Through Architecture:** Open **About Project** $\rightarrow$ **C. System Architecture Diagram** and explain the request lifecycle through Vercel, API Gateway, Lambda, and DynamoDB.
7. **Show Test Suite:** Run `npm test` in the terminal to demonstrate that all 22 test cases pass cleanly.

---

## License
Created for academic evaluation as a College Cloud Computing Lab Mini-Project. Open source for educational use.
