# FreshTrack Presentation Outline (8–10 Slides)
**Cloud Computing Lab Mini-Project Presentation**  
*Title: FreshTrack – Cloud-Based Smart Expiry & Food Waste Alert System*

---

### SLIDE 1: TITLE SLIDE
- **Project Title:** FreshTrack – Cloud-Based Smart Expiry & Food Waste Alert System
- **Subtitle:** College Cloud Computing Lab Mini-Project
- **Domain:** Serverless Cloud Architecture & Sustainability
- **Presenter Name(s):** [Your Name / Team Members]
- **Department:** Department of Computer Science & Engineering
- **Guide / Evaluator:** [Lab Evaluator / Professor Name]

---

### SLIDE 2: INTRODUCTION & PROBLEM STATEMENT
- **The Global Waste Crisis:** 1.3 billion tons of edible food wasted annually.
- **Root Cause:** Forgotten expiration dates inside home fridges and commercial storage.
- **Consequences:**
  - Severe financial losses for households and businesses.
  - Health hazard of consuming unknowingly expired goods.
  - Environmental damage from methane generation in landfills.
- **The Core Need:** An automated, cloud-based tracking system that monitors food life cycles and proactively alerts users.

---

### SLIDE 3: PROJECT OBJECTIVES
1. Digitize food inventory with categories, quantities, and expiration dates.
2. Automate real-time calculation of shelf-life status (Fresh, Expiring Soon, Expired).
3. Display centralized dashboard metrics and category distributions.
4. Issue clear visual alerts for products needing immediate consumption or disposal.
5. Persist inventory in a managed cloud database (Amazon DynamoDB).
6. Demonstrate core cloud computing concepts (FaaS, PaaS, NoSQL, and Serverless).

---

### SLIDE 4: PROPOSED SYSTEM & KEY HIGHLIGHTS
- **System Name:** FreshTrack
- **Key Capabilities:**
  - Dynamic Expiry Engine: Zero timezone offset drift, automatic countdowns.
  - 3-Tier Categorization:
    - **Expired:** < 0 days (Past today).
    - **Expiring Soon:** 0 to 7 days (Includes today's boundary!).
    - **Fresh:** > 7 days.
  - Dual Execution Modes: Offline Local Demo Mode (localStorage) and Live AWS Cloud Mode.
  - Fast search, category filters, and sorting.

---

### SLIDE 5: CLOUD ARCHITECTURE
*(Include Architecture Diagram from `docs/ARCHITECTURE.md` or Section C of website)*
- **Presentation Layer:** React.js Single Page App hosted on Vercel Global Edge CDN.
- **API Management:** Amazon API Gateway providing REST routing, throttling, and CORS.
- **Compute Layer:** AWS Lambda (Node.js runtime) running serverless business logic on demand.
- **Data Layer:** Amazon DynamoDB NoSQL table (`FreshTrackItems`) with pay-per-request billing.
- **Optional Storage:** Amazon S3 bucket for product packaging and receipt image uploads.

---

### SLIDE 6: TECHNOLOGIES & CLOUD SERVICES
| Component | Technology | Role in Project |
|---|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS | Ultra-fast responsive user interface |
| **Icons & Charts**| Lucide React & Recharts | Visual indicators and category bar charts |
| **Compute** | AWS Lambda (Node.js) | Serverless backend execution without EC2 overhead |
| **API Proxy** | Amazon API Gateway | Secure REST endpoints and CORS preflight |
| **Database** | Amazon DynamoDB | High-performance NoSQL key-value persistence |
| **Hosting** | Vercel Edge CDN | Global low-latency frontend static asset delivery |

---

### SLIDE 7: WORKING PROCEDURE & DATA FLOW
1. **Product Ingestion:** User inputs product details on Add Food Item form.
2. **Client Validation:** Enforces non-empty names and validates that Expiry Date $\ge$ Purchase Date.
3. **Cloud Dispatch:** Payload sent via `POST /items` to Amazon API Gateway.
4. **Lambda Processing:** Generates unique `itemId`, formats timestamps, and writes to DynamoDB.
5. **Real-time Recalculation:** Dashboard computes counts and charts dynamically.
6. **Alert Prioritization:** High-urgency alert feeds guide consumers on what to cook or discard.

---

### SLIDE 8: TESTING & EXPERIMENTAL RESULTS
- **Automated Test Suite:** 20 comprehensive unit and integration tests covering:
  - Date boundary checks: today (0 days remaining) and 7-day cutoff.
  - Validation rules: rejection of expired purchase dates.
  - Full CRUD lifecycle: Create, Read, Update, Delete with status assertions.
- **Test Performance:** 100% test pass rate with execution time < 500ms.
- **Live Verification:** Verified in both Local Demo Mode and live Node.js / Lambda backend.

---

### SLIDE 9: ADVANTAGES & LIMITATIONS
- **Advantages:**
  - Drastically curtails household and commercial food spoilage.
  - Incurs \$0.00 infrastructure cost when idle (true serverless).
  - Scales automatically to handle spikes in traffic.
  - Modern, responsive SaaS design tailored for presentation.
- **Limitations:**
  - Requires manual entry of packaging expiration dates.
  - Relies on in-app web notifications rather than SMS or cellular push.

---

### SLIDE 10: FUTURE SCOPE & CONCLUSION
- **Future Enhancements:**
  - AI OCR & Barcode scanning via AWS Rekognition.
  - Automated morning SMS / email summaries via Amazon SNS & SES.
  - Integration with community food donation networks for 3-day perishables.
- **Conclusion:**
  - FreshTrack effectively validates the practicality of serverless cloud architectures.
  - Successfully satisfies all Cloud Computing Lab project requirements with a clean, demonstrable product.
- **Q&A / Demonstration Session**
