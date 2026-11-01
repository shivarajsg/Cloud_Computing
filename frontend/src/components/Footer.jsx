import React from 'react';
import { Leaf, Cloud, Server, Database, Layers, CheckCircle } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const navigateTo = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Fresh<span className="text-emerald-400">Track</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cloud-Based Smart Expiry & Food Waste Alert System designed to track household and commercial food inventories, automate expiry monitoring, and combat food waste.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 text-emerald-400 text-[11px] rounded-md border border-slate-700">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Serverless Architecture</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition">Home Landing</button>
              </li>
              <li>
                <button onClick={() => navigateTo('dashboard')} className="hover:text-emerald-400 transition">Live Dashboard</button>
              </li>
              <li>
                <button onClick={() => navigateTo('inventory')} className="hover:text-emerald-400 transition">My Inventory</button>
              </li>
              <li>
                <button onClick={() => navigateTo('add-item')} className="hover:text-emerald-400 transition">Add Food Item</button>
              </li>
              <li>
                <button onClick={() => navigateTo('alerts')} className="hover:text-emerald-400 transition">Expiry Alerts</button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-emerald-400 transition">Project Report & Architecture</button>
              </li>
            </ul>
          </div>

          {/* Cloud Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Cloud Infrastructure</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>AWS Lambda (Node.js runtime)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Amazon API Gateway (REST API)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Amazon DynamoDB (NoSQL Data)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>React.js + Vite + Tailwind CSS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 text-center font-bold text-slate-300">▲</span>
                <span>Vercel Edge Hosting</span>
              </li>
            </ul>
          </div>

          {/* Academic Identification */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Academic Lab Project
            </span>
            <h5 className="text-xs font-semibold text-white">Cloud Computing Lab Mini-Project</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Coursework demonstration of modern cloud architectures, serverless computing, and RESTful cloud database integration.
            </p>
            <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-700/60">
              Department of Computer Science & Engineering
            </div>
          </div>
        </div>

        {/* Bottom copyright / disclaimer */}
        <div className="pt-6 border-t border-slate-800 text-center md:flex md:justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FreshTrack — Cloud-Based Smart Expiry & Food Waste Alert System.</p>
          <p className="mt-2 md:mt-0">Built for Demonstration & College Lab Evaluation.</p>
        </div>
      </div>
    </footer>
  );
}
