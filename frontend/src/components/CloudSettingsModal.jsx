import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Cloud, HardDrive, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ExternalLink, X } from 'lucide-react';

export default function CloudSettingsModal({ isOpen, onClose }) {
  const { mode, apiUrl, switchMode, updateApiUrl, checkHealthStatus, backendHealth, resetDemo } = useInventory();
  const [customUrl, setCustomUrl] = useState(apiUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestHealth = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await checkHealthStatus(customUrl);
    setTestResult(result);
    setTesting(false);
  };

  const handleSaveUrl = () => {
    updateApiUrl(customUrl);
    handleTestHealth();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Cloud & Data Settings</h3>
              <p className="text-xs text-slate-500">Configure AWS Cloud Mode or Local Demo Mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Operation Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => switchMode('demo')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition ${
                  mode === 'demo'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <HardDrive className="w-4 h-4" />
                  </span>
                  {mode === 'demo' && (
                    <span className="text-[11px] font-medium bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Demo Mode</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Browser localStorage with realistic relative sample data. Zero AWS credentials required.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => switchMode('cloud')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition ${
                  mode === 'cloud'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <Cloud className="w-4 h-4" />
                  </span>
                  {mode === 'cloud' && (
                    <span className="text-[11px] font-medium bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">AWS Cloud Mode</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Connects to Amazon API Gateway → AWS Lambda → DynamoDB table.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* AWS API URL Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="apiUrlInput" className="text-xs font-semibold text-slate-700">
                AWS API Gateway Endpoint URL:
              </label>
              <span className="text-[11px] text-slate-500">e.g. AWS SAM local or deployed URL</span>
            </div>
            <div className="flex space-x-2">
              <input
                id="apiUrlInput"
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://xxxx.execute-api.us-east-1.amazonaws.com/prod"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSaveUrl}
                className="px-3.5 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition"
              >
                Apply
              </button>
            </div>

            {/* Health check test button */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleTestHealth}
                disabled={testing}
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Test Backend /health</span>
              </button>

              {testResult && (
                <div className="flex items-center space-x-1.5 text-xs">
                  {testResult.online ? (
                    <span className="inline-flex items-center text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      AWS Backend Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-rose-600 font-medium">
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Unreachable
                    </span>
                  )}
                </div>
              )}
            </div>

            {testResult && !testResult.online && (
              <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                Unable to connect to <code className="font-mono">{customUrl}</code>. If running backend locally, run <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">npm start</code> inside the <code className="font-mono">backend</code> folder (port 5000).
              </p>
            )}

            {testResult && testResult.online && (
              <div className="text-[11px] text-slate-600 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-emerald-700 font-semibold uppercase">{testResult.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Database:</span>
                  <span>{testResult.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Service:</span>
                  <span>{testResult.service}</span>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <div className="text-xs font-semibold text-slate-800">Reset Demo Data</div>
              <div className="text-[11px] text-slate-500">Restore dynamic relative sample items</div>
            </div>
            <button
              onClick={() => {
                resetDemo();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Reset Sample Items
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
