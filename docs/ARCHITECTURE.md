# FreshTrack – Cloud Architecture Specification
**Cloud-Based Smart Expiry & Food Waste Alert System**  
*Cloud Computing Lab Mini-Project Reference*

---

## 1. System Overview

FreshTrack employs a modern **Serverless Cloud Architecture** designed to minimize infrastructure management, eliminate idle server costs, and provide instantaneous elasticity.

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
                      |  - Region: ap-south-1 (Mumbai)    |
                      |  - CORS Header Handling           |
                      |  - Endpoint: ng7dtfqk39.execute-  |
                      |    api.ap-south-1.amazonaws.com  |
                      +-----------------+-----------------+
                                        |
                          Synchronous Lambda Invocation
                                        v
                      +-----------------------------------+
                      |           AWS Lambda              |
                      |  - Function: FreshTrackFunction   |
                      |  - Node.js 24.x Runtime           |
                      |  - Input Validation & Security    |
                      |  - Expiry Calculation Engine      |
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
                                        :
                                        : (Optional Object Storage)
                                        v
                      +-----------------------------------+
                      |        Amazon S3 Bucket           |
                      |  - freshtrack-item-images         |
                      +-----------------------------------+
```

---

## 2. Cloud Service Breakdown & Academic Roles

### A. AWS Lambda (Function-as-a-Service / FaaS)
- **Role:** Executes backend REST controllers upon HTTP events triggered by API Gateway.
- **Runtime:** Node.js 20.x / 22.x.
- **Key Characteristics:**
  - Auto-scales horizontally from 0 to thousands of concurrent executions.
  - Zero charge when no requests are being processed.
  - IAM Execution Role grants least-privilege permissions solely to the `FreshTrackItems` DynamoDB table.

### B. Amazon API Gateway (API Management & Routing)
- **Role:** Exposes public endpoints, routes requests to Lambda, and handles Cross-Origin Resource Sharing (CORS).
- **Supported HTTP Methods:**
  - `GET /health` — Health check endpoint.
  - `GET /items` — Retrieve full inventory listing.
  - `GET /items/{id}` — Retrieve an individual food record.
  - `POST /items` — Ingest new perishable item with validation.
  - `PUT /items/{id}` — Modify item quantity, notes, or expiration date.
  - `DELETE /items/{id}` — Delete consumed or discarded inventory items.
  - `OPTIONS /*` — CORS preflight validation.

### C. Amazon DynamoDB (Managed NoSQL Database)
- **Role:** High-performance, single-digit millisecond latency key-value data store.
- **Table Name:** `FreshTrackItems`
- **Partition Key (PK):** `itemId` (String, UUID format `ft-<timestamp>-<hash>`)
- **Billing Mode:** `PAY_PER_REQUEST` (On-Demand Capacity)
- **Schema Attributes:**
  | Field | DynamoDB Type | Description |
  |---|---|---|
  | `itemId` | String (HASH) | Primary Unique Key |
  | `name` | String | Commercial product name |
  | `category` | String | Food category classification |
  | `quantity` | Number | Quantity numerical value |
  | `unit` | String | Metric unit (kg, g, litres, ml, pieces, packets) |
  | `purchaseDate`| String | Date purchased (`YYYY-MM-DD`) |
  | `expiryDate` | String | Expiration deadline (`YYYY-MM-DD`) |
  | `notes` | String | Storage guidelines or user remarks |
  | `createdAt` | String | ISO 8601 creation timestamp |
  | `updatedAt` | String | ISO 8601 last update timestamp |

### D. Vercel Edge Hosting (Frontend Delivery)
- **Role:** Static asset distribution, CI/CD pipeline, and SSL termination.
- Global CDN caching guarantees sub-100ms dashboard load times on mobile and desktop browsers.

---

## 3. Smart Expiry Calculation Engine

To prevent common timezone shifts and DST offset bugs, all calculations operate on normalized calendar dates:

```
DaysRemaining = round((ExpiryMidnight - TodayMidnight) / 86,400,000 ms)

If DaysRemaining < 0:
    Status = "EXPIRED" (Color: Red / Rose)
Else If DaysRemaining <= 7:
    Status = "EXPIRING_SOON" (Color: Orange / Amber)
    - 0 Days: "Expires today"
    - 1 Day:  "Expires tomorrow"
    - 2-7 Days: "Expires in X days"
Else:
    Status = "FRESH" (Color: Green / Emerald)
```

---

## 4. Security & Least Privilege

1. **Zero Secret Keys on Frontend:** No AWS Access Keys or Secrets exist in client-side code.
2. **Lambda IAM Role:** Lambda operates with a scoped IAM Execution Policy allowing only `dynamodb:Scan`, `dynamodb:GetItem`, `dynamodb:PutItem`, and `dynamodb:DeleteItem` on the `FreshTrackItems` table ARN.
3. **CORS Restrictions:** API Gateway enforces explicit origin filtering and allowed headers.
