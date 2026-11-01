import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Server, 
  Database, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  Code2,
  HardDrive,
  Cpu,
  Globe,
  Share2
} from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Title & Academic Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cloud Computing Lab Mini-Project Comprehensive Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          FreshTrack Project Documentation & Architecture
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Full technical overview, serverless cloud architecture diagram, methodology, and lab viva reference guide for the <strong>FreshTrack – Cloud-Based Smart Expiry & Food Waste Alert System</strong>.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4">
          {[
            { id: 'architecture', label: 'C. System Architecture Diagram' },
            { id: 'overview', label: 'A. Project Overview & Objectives' },
            { id: 'cloud-services', label: 'D. Cloud Services Used' },
            { id: 'methodology', label: 'B & F. Methodology & Working Procedure' },
            { id: 'analysis', label: 'G, H, I & J. Viva Review, Limits & Scope' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SYSTEM ARCHITECTURE (Section 10 & Section 11.C) */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-emerald-600" />
                <span>Section C: End-to-End Serverless Cloud Architecture</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Visual representation of client-to-cloud request lifecycles through Amazon Web Services serverless stack.
              </p>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8 overflow-x-auto">
              <div className="text-center font-mono text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                --- Complete Request & Data Pipeline ---
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center min-w-[700px]">
                
                {/* Step 1: User */}
                <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-xs font-bold text-emerald-400">
                    1
                  </div>
                  <div className="text-xs font-bold text-white">Client User</div>
                  <div className="text-[10px] text-slate-400">Desktop / Mobile Web Browser</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-slate-500">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Step 2: Vercel / React */}
                <div className="bg-slate-800/90 p-4 rounded-xl border border-emerald-500/40 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="text-xs font-bold text-white">React SPA on Vercel</div>
                  <div className="text-[10px] text-emerald-300">Global Edge CDN / SSL</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-slate-500">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Step 3: API Gateway */}
                <div className="bg-slate-800/90 p-4 rounded-xl border border-blue-500/40 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 mx-auto flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="text-xs font-bold text-white">Amazon API Gateway</div>
                  <div className="text-[10px] text-blue-300">REST API + CORS Handler</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-slate-500">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Step 4: AWS Lambda */}
                <div className="bg-slate-800/90 p-4 rounded-xl border border-amber-500/40 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div className="text-xs font-bold text-white">AWS Lambda</div>
                  <div className="text-[10px] text-amber-300">Node.js FaaS Logic</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-slate-500">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Step 5: DynamoDB */}
                <div className="bg-slate-800/90 p-4 rounded-xl border border-purple-500/40 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 mx-auto flex items-center justify-center text-xs font-bold">
                    5
                  </div>
                  <div className="text-xs font-bold text-white">Amazon DynamoDB</div>
                  <div className="text-[10px] text-purple-300">Table: FreshTrackItems</div>
                </div>

              </div>

              {/* Optional Component: S3 */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="p-1 rounded bg-slate-800 text-teal-400 font-bold text-[10px] uppercase">
                    Optional Add-on
                  </span>
                  <span><strong>Amazon S3 (Simple Storage Service):</strong> Object bucket for storing product receipt images or barcode scans.</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">Pay-as-you-go Serverless</span>
              </div>
            </div>

            {/* Step-by-Step Description of Request Lifecycle */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Step-by-Step Execution Sequence
              </h3>
              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">1</span>
                  <span><strong>User Interface Interaction:</strong> The user accesses the web portal on their browser and enters new food items or views real-time expiry countdowns.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">2</span>
                  <span><strong>Static Asset Delivery:</strong> The compiled React frontend (bundled with Vite & Tailwind CSS) is served rapidly from Vercel Edge CDN nodes with SSL termination.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">3</span>
                  <span><strong>API Routing via Amazon API Gateway:</strong> When the user submits, edits, or fetches data, HTTP requests (<code>GET /items</code>, <code>POST /items</code>, etc.) reach Amazon API Gateway, which handles CORS, throttling, and request routing.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">4</span>
                  <span><strong>Compute Execution via AWS Lambda:</strong> API Gateway triggers an AWS Lambda container running Node.js. The Lambda function validates inputs, performs server-side safety logic, and establishes IAM-authenticated sessions.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5</span>
                  <span><strong>Persistence via Amazon DynamoDB:</strong> The Lambda handler communicates with the <code>FreshTrackItems</code> DynamoDB table using the AWS SDK v3 to store, update, query, or delete records.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">6</span>
                  <span><strong>Reactive Client Update:</strong> The JSON response returns through API Gateway to the frontend React context, immediately refreshing dynamic metrics, charts, and alert lists.</span>
                </li>
              </ol>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PROJECT OVERVIEW & OBJECTIVES (Section 11.A) */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Section A: Project Overview & Objectives</h2>
              <p className="text-xs text-slate-500 mt-1">Foundational problem definition, proposed solution, and academic lab goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Problem Definition</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Food expiration is an invisible waste crisis. Both residential consumers and commercial grocers lack an automated mechanism to track items after purchasing. Food reaches its expiration date tucked away at the back of refrigerators or shelves, resulting in significant financial loss, unnecessary greenhouse gases in landfills, and potential food poisoning.
                </p>
              </div>

              <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <h3 className="text-sm font-bold text-emerald-950">Proposed Solution</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>FreshTrack</strong> solves this by introducing a serverless, cloud-native inventory system. Users record perishable items with purchase and expiration dates. A dynamic calculation engine automatically categorizes food items into Fresh, Expiring Soon, and Expired states, surfacing prioritized alerts on a centralized dashboard.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Main Project Objectives</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-2">
                  <span className="font-bold text-emerald-600">1.</span>
                  <span><strong>Maintain a digital inventory:</strong> Track product names, quantities, categories, purchase dates, and notes.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-2">
                  <span className="font-bold text-emerald-600">2.</span>
                  <span><strong>Monitor product expiry dates:</strong> Compute days remaining relative to current dates without timezone drift.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-2">
                  <span className="font-bold text-emerald-600">3.</span>
                  <span><strong>Automatically identify expired &amp; nearly expired products:</strong> Enforce strict rules (≤ 7 days vs past today).</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-2">
                  <span className="font-bold text-emerald-600">4.</span>
                  <span><strong>Display expiry alerts through a dashboard:</strong> Clear visual cards, notification feeds, and action buttons.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-2">
                  <span className="font-bold text-emerald-600">5.</span>
                  <span><strong>Store product information in a cloud database:</strong> Seamless persistence in Amazon DynamoDB NoSQL tables.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-2">
                  <span className="font-bold text-emerald-600">6.</span>
                  <span><strong>Demonstrate cloud computing concepts:</strong> FaaS, serverless API design, NoSQL modeling, and edge delivery.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: CLOUD SERVICES USED (Section 11.D) */}
      {activeTab === 'cloud-services' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Section D: Cloud Services Used &amp; Architectural Roles</h2>
              <p className="text-xs text-slate-500 mt-1">Detailed breakdown of AWS and modern cloud hosting services utilized in FreshTrack.</p>
            </div>

            <div className="space-y-4">
              
              {/* AWS Lambda */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                  <Server className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">AWS Lambda (Function-as-a-Service)</h3>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Compute</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AWS Lambda executes the backend Node.js business logic on demand. When an API call is made, AWS automatically spins up a micro-container to run the handler function, executes DynamoDB CRUD operations, and scales down to zero when idle. This eliminates the expense and maintenance of 24/7 dedicated virtual servers (like EC2).
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-200">
                    Handler: <code>backend/src/handlers/items.handler</code> | Runtime: Node.js 20.x/22.x
                  </div>
                </div>
              </div>

              {/* Amazon API Gateway */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-blue-100 text-blue-800 rounded-xl shrink-0">
                  <Cloud className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Amazon API Gateway</h3>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Networking &amp; API</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Acts as the secure single point of entry for all incoming frontend HTTP requests. It manages REST routing (<code>GET /items</code>, <code>POST /items</code>, <code>PUT /items/&#123;id&#125;</code>, <code>DELETE /items/&#123;id&#125;</code>, <code>GET /health</code>), implements Cross-Origin Resource Sharing (CORS), and proxies request payloads directly to Lambda.
                  </p>
                </div>
              </div>

              {/* Amazon DynamoDB */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-purple-100 text-purple-800 rounded-xl shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Amazon DynamoDB</h3>
                    <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Database</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Amazon DynamoDB is a fully managed, serverless NoSQL database that delivers predictable, single-digit millisecond latency at any scale. The <code>FreshTrackItems</code> table uses <code>itemId</code> as the partition key and on-demand billing, ensuring zero cost when no requests are being processed.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-200">
                    Table: <code>FreshTrackItems</code> | Partition Key: <code>itemId (S)</code> | Billing: PAY_PER_REQUEST
                  </div>
                </div>
              </div>

              {/* Vercel */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Vercel Edge Hosting</h3>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Frontend Host</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hosts the production React.js single-page application on a global edge CDN network. Provides automated CI/CD deployments, automatic HTTPS/SSL certificate provisioning, and sub-100ms asset delivery to clients globally.
                  </p>
                </div>
              </div>

              {/* Amazon S3 (Optional) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4 opacity-90">
                <div className="p-3 bg-teal-100 text-teal-800 rounded-xl shrink-0">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Amazon S3 (Optional Object Store)</h3>
                    <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">Storage</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Architecture includes provision for an Amazon S3 bucket (<code>freshtrack-item-images</code>) to store product receipts, grocery packaging photos, and barcode captures via presigned upload URLs. Kept optional to maintain project simplicity.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 4: METHODOLOGY & WORKING PROCEDURE (Section 11.B & 11.F) */}
      {activeTab === 'methodology' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Section B &amp; F: Methodology &amp; Working Procedure</h2>
              <p className="text-xs text-slate-500 mt-1">Detailed operational steps followed by FreshTrack from ingestion to alert generation.</p>
            </div>

            <div className="space-y-6">
              
              {/* Working Procedure Steps */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Step-by-Step Working Procedure</h3>
                <div className="space-y-2.5">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">Stage 1: Food Registration &amp; Input Validation</div>
                    <p className="text-slate-600">
                      The user enters food attributes (Name, Category, Quantity, Unit, Purchase Date, Expiry Date, Notes). Client-side and server-side validation ensure mandatory fields are complete, numeric values are positive, and the expiry date is strictly not earlier than the purchase date.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">Stage 2: Serverless Cloud Ingestion</div>
                    <p className="text-slate-600">
                      The frontend serializes the validated item and submits a <code>POST /items</code> request to API Gateway. API Gateway invokes the AWS Lambda handler, which assigns a unique <code>itemId</code>, generates ISO-8601 timestamps, and commits the item to Amazon DynamoDB.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">Stage 3: Smart Expiry Engine Computation</div>
                    <p className="text-slate-600">
                      Whenever records are rendered on the client dashboard or processed by the backend, the Smart Expiry Engine calculates days remaining relative to today's normalized midnight timestamp:
                      <br />• <strong>Expired:</strong> Days remaining &lt; 0 (past date).
                      <br />• <strong>Expiring Soon:</strong> 0 ≤ Days remaining ≤ 7 (today or within 7 calendar days).
                      <br />• <strong>Fresh:</strong> Days remaining &gt; 7.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">Stage 4: Proactive Alerts &amp; Visualization</div>
                    <p className="text-slate-600">
                      The application categorizes items into dedicated alert queues: red cards highlight expired items for safe disposal, amber cards suggest soon-to-expire goods for immediate consumption in meal prep, and green badges indicate stable items.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">Stage 5: Inventory Lifecycle Resolution</div>
                    <p className="text-slate-600">
                      Users can update item quantities, edit expiration dates if resealed/frozen, or delete consumed/discarded items. All actions immediately synchronize back to DynamoDB.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 5: VIVA REVIEW, ADVANTAGES, LIMITS & SCOPE (Section 11.G, 11.H, 11.I, 11.J) */}
      {activeTab === 'analysis' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Section G, H, I &amp; J: Project Evaluation &amp; Viva Guide</h2>
              <p className="text-xs text-slate-500 mt-1">Review material designed for viva questions and project presentation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Advantages */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>G. Key Advantages</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>• <strong>Prevents Waste:</strong> Early warnings ensure perishables are consumed before spoiling.</li>
                  <li>• <strong>Financial Savings:</strong> Reduces household grocery expenditures wasted on expired food.</li>
                  <li>• <strong>Health Safety:</strong> Eliminates accidental ingestion of expired dairy or meat products.</li>
                  <li>• <strong>Serverless Scalability:</strong> Zero server maintenance cost; scales automatically from 1 to 100,000+ items.</li>
                  <li>• <strong>Dual Operation Modes:</strong> Functions seamlessly in offline local demo mode and real AWS cloud mode.</li>
                </ul>
              </div>

              {/* Limitations */}
              <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <h3 className="text-sm font-bold text-amber-950 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>H. Realistic Limitations</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>• <strong>Manual Data Entry:</strong> Users must manually input dates printed on packaging.</li>
                  <li>• <strong>Dependence on User Accuracy:</strong> Inaccurate date entries lead to faulty alert scheduling.</li>
                  <li>• <strong>Unmonitored Open Shelf Life:</strong> Certain foods degrade faster once opened regardless of expiration date.</li>
                  <li>• <strong>No Native Push/SMS:</strong> Relies on web in-app dashboard alerts rather than cellular notifications.</li>
                </ul>
              </div>

            </div>

            {/* Future Scope */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>I. Future Scope &amp; Planned Enhancements</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">Barcode / OCR Scanning</div>
                  <p className="text-[11px] text-slate-500 mt-1">Computer vision integration using AWS Rekognition to scan barcode UPCs and printed expiration dates automatically.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">Amazon SNS &amp; SES Alerts</div>
                  <p className="text-[11px] text-slate-500 mt-1">Automated daily email summaries and SMS alerts sent via Amazon Simple Notification Service.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">Food Donation Network</div>
                  <p className="text-[11px] text-slate-500 mt-1">Connect with local shelters and community food banks to donate edible items approaching the 3-day mark.</p>
                </div>
              </div>
            </div>

            {/* Academic Conclusion */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400">J. Academic Conclusion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The <strong>FreshTrack</strong> mini-project successfully demonstrates how serverless cloud architectures (AWS Lambda, Amazon API Gateway, and Amazon DynamoDB) provide resilient, cost-effective, and highly scalable solutions for everyday sustainability challenges. By removing server provisioning overhead and automating expiry tracking, FreshTrack showcases practical full-stack cloud engineering directly aligned with modern industry best practices.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
