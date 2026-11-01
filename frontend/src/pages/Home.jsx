import React from 'react';
import { 
  Leaf, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Server, 
  Database, 
  Cloud, 
  ShieldAlert, 
  BarChart3, 
  Trash2, 
  Layers, 
  Smartphone,
  ChevronRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';

export default function Home({ setActivePage }) {
  const steps = [
    {
      num: '01',
      title: 'Add Food Products',
      desc: 'Quickly log grocery and pantry purchases with quantities, categories, and purchase dates.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Enter Expiry Dates',
      desc: 'Set the manufacturer expiration date with automated boundary and validation rules.',
      icon: Clock,
    },
    {
      num: '03',
      title: 'Store in Cloud',
      desc: 'Inventory records securely sync to Amazon DynamoDB through serverless API Gateway.',
      icon: Database,
    },
    {
      num: '04',
      title: 'Monitor Status',
      desc: 'Dynamic engine categorizes items into Expired, Expiring Soon, or Fresh without timezone drift.',
      icon: Sparkles,
    },
    {
      num: '05',
      title: 'View Alerts & Reduce Waste',
      desc: 'Prioritize upcoming items on the dashboard to consume food on time and avoid waste.',
      icon: CheckCircle2,
    },
  ];

  const features = [
    {
      title: 'Food Inventory Management',
      desc: 'Maintain a single organized ledger of all household and store items categorized cleanly.',
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Smart Expiry Tracking',
      desc: 'Automated date calculation classifies goods as Fresh, Expiring Soon (≤ 7 days), or Overdue.',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Automated Expiry Alerts',
      desc: 'Proactive in-app alert badges and organized urgency feeds highlight what needs prompt action.',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      title: 'Cloud-Based Data Storage',
      desc: 'Built on Amazon DynamoDB NoSQL database for reliable, scalable, low-latency record persistence.',
      icon: Database,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Dynamic Statistics',
      desc: 'Real-time charts and breakdown metrics show stock levels, waste risks, and category distribution.',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Food Waste Reduction',
      desc: 'Minimizes financial losses and environmental footprint by prioritizing consumption before expiry.',
      icon: TrendingDown,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
  ];

  const cloudServices = [
    {
      name: 'AWS Lambda',
      type: 'Compute Service',
      role: 'Executes serverless Node.js backend logic on demand without provisioning or managing EC2 instances.',
      icon: Server,
      badge: 'Serverless',
    },
    {
      name: 'Amazon API Gateway',
      type: 'API Management',
      role: 'Securely routes RESTful HTTP endpoints from the web frontend to corresponding Lambda functions with CORS.',
      icon: Cloud,
      badge: 'REST API',
    },
    {
      name: 'Amazon DynamoDB',
      type: 'NoSQL Database',
      role: 'Stores inventory records in high-performance, single-digit millisecond latency key-value tables.',
      icon: Database,
      badge: 'Managed NoSQL',
    },
    {
      name: 'React.js & Vite',
      type: 'Modern Frontend',
      role: 'Provides an ultra-responsive single-page dashboard with real-time reactive state updates and Tailwind UI.',
      icon: Smartphone,
      badge: 'Client SPA',
    },
    {
      name: 'Vercel Edge',
      type: 'Global CDN Hosting',
      role: 'Delivers optimized client static assets with instant deployments and zero-configuration SSL.',
      icon: Layers,
      badge: 'Global Edge',
    },
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading and CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cloud Computing Lab Mini-Project</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Track Freshness. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                  Reduce Food Waste.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                FreshTrack is a cloud-based smart food expiry alert platform. Record your groceries, track shelf-lives in Amazon DynamoDB, and receive automated real-time alerts before food spoils.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center space-x-2 transition hover:-translate-y-0.5"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActivePage('about')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs flex items-center space-x-2 transition hover:-translate-y-0.5"
                >
                  <span>Explore Project Architecture</span>
                </button>
              </div>

              {/* Micro specs */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/70 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500">Automated Expiry</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">AWS</div>
                  <div className="text-xs text-slate-500">Serverless Native</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Zero</div>
                  <div className="text-xs text-slate-500">Food Waste Goal</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Illustration / Live Card Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-20 transform -rotate-1"></div>
              
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-xs font-semibold text-slate-500 ml-1">Live Expiry Engine</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Real-time
                  </span>
                </div>

                {/* Demonstration Alert Cards */}
                <div className="space-y-3">
                  {/* Expired Item */}
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                        EXP
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Greek Yogurt (500g)</div>
                        <div className="text-[11px] text-rose-600 font-medium">Expired 3 days ago • Discard</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-md">
                      Overdue
                    </span>
                  </div>

                  {/* Expiring Soon Item */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        SOON
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Organic Whole Milk</div>
                        <div className="text-[11px] text-amber-700 font-medium">Expires today • Use promptly</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                      0 Days Left
                    </span>
                  </div>

                  {/* Fresh Item */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        SAFE
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Artisan Sourdough Bread</div>
                        <div className="text-[11px] text-emerald-700 font-medium">Expires in 9 days • Good</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
                      Fresh
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="flex items-center space-x-1">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>DynamoDB Synchronized</span>
                  </span>
                  <button 
                    onClick={() => setActivePage('inventory')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
                  >
                    View Inventory <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Problem Card */}
          <div className="bg-gradient-to-br from-rose-50/60 to-white p-8 rounded-2xl border border-rose-100 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">The Problem: Forgotten Expiry Dates</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Households, convenience stores, and commercial kitchens routinely misplace track of perishables stored deep inside refrigerators and pantry shelves. This leads to:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Massive Financial Loss:</strong> Billions of dollars in edible groceries are thrown away annually.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Health Hazards:</strong> Accidental consumption of expired dairy, poultry, or canned goods causes foodborne illness.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Environmental Burden:</strong> Food decomposing in landfills generates potent methane gas and greenhouse emissions.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">The Solution: FreshTrack Cloud System</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              FreshTrack provides a unified, cloud-backed digital inventory that monitors shelf life dynamically and issues proactive alerts:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Proactive Alerts:</strong> Identifies items expiring within seven days so meals can be scheduled beforehand.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Centralized Cloud Records:</strong> Accessible anywhere via serverless REST endpoints and Amazon DynamoDB.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Zero Setup Friction:</strong> Supports instantaneous demo mode locally and seamless deployment to AWS.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Core Capabilities</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Everything needed to stop food waste</h3>
          <p className="text-sm text-slate-600">
            A reliable, practical feature set engineered to meet all Cloud Computing Lab mini-project objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-200 space-y-3"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works: 5 Steps */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Working Procedure</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">How FreshTrack Works</h3>
            <p className="text-sm text-slate-600">Five simple stages from entry to automated cloud alert.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-200">{st.num}</span>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{st.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cloud Architecture Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Cloud Computing Stack</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Built on Production-Grade Serverless Cloud</h3>
          <p className="text-sm text-slate-600">
            Demonstrating key concepts from the Cloud Computing syllabus: FaaS (Lambda), PaaS/NoSQL (DynamoDB), and Edge hosting (Vercel).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cloudServices.map((cs, i) => {
            const Icon = cs.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {cs.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{cs.name}</h4>
                  <div className="text-[11px] font-semibold text-emerald-600">{cs.type}</div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{cs.role}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Ready to see FreshTrack in action?</h3>
            <p className="text-sm text-emerald-100 max-w-xl">
              Inspect dynamic inventory metrics, add test food items, verify expiry calculations, or review the cloud architecture report.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow hover:bg-slate-50 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setActivePage('add-item')}
              className="px-5 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-400/40 transition"
            >
              Add First Food Item
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
