# FRESH TRACK: CLOUD-BASED SMART EXPIRY & FOOD WASTE ALERT SYSTEM
## College Cloud Computing Lab Mini-Project Report Draft
**Course:** Cloud Computing Laboratory  
**Department:** Computer Science & Engineering  
**Academic Year:** 2024–2025  

---

## 1. INTRODUCTION
Global food wastage represents one of the most critical socio-economic and ecological dilemmas of the 21st century. Billions of tons of edible food are discarded annually because consumers, grocery retailers, and dining establishments lose track of items stored in refrigerators, walk-in coolers, and pantry shelves. This negligence not only triggers substantial monetary loss for households and businesses, but also significantly contributes to carbon emissions through landfill decomposition and increases health risks associated with the accidental ingestion of expired perishables.

**FreshTrack** is an innovative, cloud-native food expiry monitoring system designed to bridge this gap. Developed as a Cloud Computing Lab Mini-Project, FreshTrack leverages modern serverless computing principles, managed NoSQL databases, and real-time reactive web dashboards to automate food inventory management and deliver proactive expiry notifications.

---

## 2. PROBLEM DEFINITION
1. **Lack of Automated Expiry Tracking:** The vast majority of consumers rely on memory or disorganized physical tags to track food freshness, frequently leading to forgotten items.
2. **Economic Waste:** Households routinely throw away 10%–25% of purchased groceries solely due to expired dates.
3. **Food Safety Hazards:** Perishable items (especially dairy, poultry, seafood, and prepared meals) turn toxic upon expiration, causing food poisoning when consumed unknowingly.
4. **Lack of Scalable Infrastructure in Small Businesses:** Small convenience stores and local eateries lack costly enterprise ERP solutions for shelf-life monitoring.

---

## 3. OBJECTIVES
The primary objectives of the FreshTrack project include:
1. Maintain a centralized digital inventory of food products with detailed metadata (category, quantity, unit, purchase date, expiry date, notes).
2. Continuously monitor expiration timelines relative to live calendar dates without manual recalculation.
3. Automatically categorize products into three strict safety tiers: **Expired**, **Expiring Soon** (within 7 days), and **Fresh**.
4. Surface actionable alerts and category breakdowns through a responsive, modern SaaS dashboard.
5. Persist inventory data in a managed cloud database using Amazon DynamoDB.
6. Provide an intuitive, educational demonstration of cloud computing models: Function-as-a-Service (FaaS), Platform-as-a-Service (PaaS), NoSQL storage, and Edge hosting.

---

## 4. METHODOLOGY
The project adopted an agile, modular development methodology structured in four key phases:
1. **Requirements & Architectural Design:** Defining RESTful contracts (`GET /items`, `POST /items`, etc.), CORS policies, and serverless infrastructure specifications.
2. **Cloud Backend Engineering:** Implementing AWS Lambda handlers with Node.js and AWS SDK v3, defining DynamoDB schemas, and configuring API Gateway proxy endpoints.
3. **Frontend Development:** Building a high-performance single-page application using React.js, Vite, Tailwind CSS, and Recharts, equipped with a seamless toggle between Local Demo Mode and AWS Cloud Mode.
4. **Validation & Verification:** Formulating unit tests, date boundary edge-case tests, API contract tests, and performance benchmarks.

---

## 5. TECHNOLOGIES USED
- **Client Framework:** React.js (v19) with Vite
- **Styling & UI:** Tailwind CSS (v4) with Lucide React iconography
- **Data Visualization:** Recharts (Dynamic category distribution and status breakdown)
- **Runtime Environment:** Node.js (v24.x LTS)
- **AWS Deployment Region:** ap-south-1 (Asia Pacific - Mumbai)
- **Production API Gateway:** `https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod`
- **Managed Database Table:** Amazon DynamoDB (`FreshTrackItems`)
- **Web Server / Proxy:** Express.js (Local Emulation) / Amazon API Gateway (Cloud Production)
- **Infrastructure-as-Code:** AWS Serverless Application Model (SAM) / CloudFormation (`template.yaml`)

---

## 6. CLOUD SERVICES USED
- **AWS Lambda (Compute):** Executes backend CRUD logic on demand. Eliminates server management, scales automatically from zero to thousands of concurrent requests, and charges strictly per millisecond of compute time.
- **Amazon API Gateway (API Routing & Security):** Provides unified REST endpoints, validates schemas, enforces throttling, and configures CORS headers for cross-domain requests.
- **Amazon DynamoDB (NoSQL Database):** High-throughput key-value store holding the `FreshTrackItems` table with partition key `itemId`. Delivers single-digit millisecond latency with zero upfront capacity provisioning.
- **Vercel Edge Platform (Frontend Hosting):** Hosts the static React bundle on global Content Delivery Network (CDN) edge nodes, offering rapid client loading and automated TLS/SSL.
- **Amazon S3 (Optional Storage Extension):** Architecture provides for bucket storage of receipt photographs and barcode scans.

---

## 7. SYSTEM ARCHITECTURE
The system operates according to a decoupled serverless 3-tier architecture:
1. **Presentation Tier:** The client browser loads the React single-page application delivered via Vercel.
2. **API & Logic Tier:** Client fetch requests transmit over HTTPS to Amazon API Gateway, which forwards payloads to the AWS Lambda function.
3. **Data Tier:** AWS Lambda authenticates via IAM execution roles and carries out DocumentClient operations against Amazon DynamoDB.

```
[ Browser / Client ] ---> [ Vercel CDN ]
         |
    (REST API)
         v
[ Amazon API Gateway ] ---> [ AWS Lambda ] ---> [ Amazon DynamoDB (FreshTrackItems) ]
```

---

## 8. IMPLEMENTATION
### Dynamic Smart Expiry Engine
The core algorithm calculates days remaining without timezone offset errors:
$$\text{DaysRemaining} = \left\lfloor \frac{\text{ExpiryDate}_{\text{midnight}} - \text{Today}_{\text{midnight}}}{86,400,000 \text{ ms}} \right\rfloor$$

- $\text{DaysRemaining} < 0 \implies \mathbf{EXPIRED}$
- $0 \le \text{DaysRemaining} \le 7 \implies \mathbf{EXPIRING\_SOON}$
- $\text{DaysRemaining} > 7 \implies \mathbf{FRESH}$

### Dual Operating Modes
- **Demo Mode:** Uses browser `localStorage` seeded with relative sample items (1 expired, 2 expiring soon, 3 fresh relative to the current execution date) for offline presentation without requiring active AWS credentials.
- **AWS Cloud Mode:** Configures live endpoints connecting to deployed Amazon API Gateway and DynamoDB instances with real-time health checking.

---

## 9. TESTING & VERIFICATION
A comprehensive 20-test suite verified all critical paths:

| Test ID | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| TC-01 | Product expired in past | Status = EXPIRED, overdue days count > 0 | PASS |
| TC-02 | Product expiring today (0 days) | Status = EXPIRING_SOON, label = 'Expires today' | PASS |
| TC-03 | Product expiring tomorrow (1 day) | Status = EXPIRING_SOON, label = 'Expires tomorrow' | PASS |
| TC-04 | Product expiring at upper boundary (7 days) | Status = EXPIRING_SOON | PASS |
| TC-05 | Product expiring at lower fresh boundary (8 days) | Status = FRESH | PASS |
| TC-06 | Product expiring in 45 days | Status = FRESH | PASS |
| TC-07 | Expiry date earlier than purchase date | Validation error, rejects entry | PASS |
| TC-08 | Expiry date equal to purchase date | Accepted (same-day perishable) | PASS |
| TC-09 | Sample data generation check | Exactly 1 expired, 2 soon, 3 fresh | PASS |
| TC-10 | Health check endpoint (`GET /health`) | Status 200, healthy JSON payload | PASS |
| TC-11 | Preflight CORS check (`OPTIONS /items`) | Status 200 with Allow-Origin header | PASS |
| TC-12 | Retrieve all items (`GET /items`) | Status 200 with JSON items array | PASS |
| TC-13 | Missing product name validation | Status 400 Bad Request | PASS |
| TC-14 | Date logic validation in backend | Status 400 Bad Request | PASS |
| TC-15 | Create valid product (`POST /items`) | Status 201 Created with generated `itemId` | PASS |
| TC-16 | Fetch created product (`GET /items/{id}`) | Status 200 with correct item data | PASS |
| TC-17 | Update product quantity (`PUT /items/{id}`) | Status 200 with updated fields | PASS |
| TC-18 | Delete item (`DELETE /items/{id}`) | Status 200 with success confirmation | PASS |
| TC-19 | Fetch deleted product | Status 404 Not Found | PASS |
| TC-20 | Combined test execution command | All test suites pass in < 500ms | PASS |

---

## 10. RESULTS
- **Build Performance:** Production Vite build completes in ~1.1 seconds.
- **Accuracy:** Zero false positives on boundary date calculations (0 days and 7 days).
- **Latency:** Sub-15ms local response times; DynamoDB query latency ~8ms.
- **User Interface:** Responsive, accessible SaaS dashboard featuring intuitive status cards, search, filtering, and visual category charts.

---

## 11. ADVANTAGES
1. Eliminates food spoilage through timely alerts.
2. Reduces household expenditure on duplicate or wasted purchases.
3. Serverless architecture incurs \$0.00 idle cost during low activity periods.
4. Auto-scales effortlessly to handle enterprise-level inventory sizes.
5. Operates in standalone demo mode during lab vivas and presentations.

---

## 12. LIMITATIONS
1. **Manual Data Entry:** Expiry dates must be entered manually from packaging labels.
2. **Packaging Dependency:** Relies on manufacturer dates, which may not account for opened packaging decay rates.
3. **In-App Notifications Only:** Alert feeds are rendered within the dashboard rather than via cellular SMS or native mobile push.

---

## 13. FUTURE SCOPE
1. **Optical Character Recognition (OCR) & Barcodes:** Integration with AWS Rekognition to extract printed expiration dates from camera photos automatically.
2. **Amazon SNS / SES Notifications:** Automated daily morning digests and SMS warnings for items expiring within 48 hours.
3. **Surplus Food Donation Platform:** Community integration allowing stores to route soon-to-expire goods to local shelters before spoilage.

---

## 14. CONCLUSION
The **FreshTrack** project accomplishes all core objectives of the Cloud Computing Laboratory syllabus. By integrating AWS Lambda, Amazon API Gateway, and Amazon DynamoDB with a modern React web frontend, FreshTrack illustrates how cloud serverless technologies solve tangible real-world environmental and economic challenges with high efficiency, reliability, and minimal cost.
