import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  BellRing, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  ChefHat
} from 'lucide-react';

export default function Alerts({ setActivePage }) {
  const { summary, removeItem, resetDemo } = useInventory();
  const { sortedByExpiry = [], expired = 0, expiringSoon = 0, fresh = 0 } = summary;

  const expiredItems = sortedByExpiry.filter((i) => i.status === 'EXPIRED');
  const soonItems = sortedByExpiry.filter((i) => i.status === 'EXPIRING_SOON');
  const freshItems = sortedByExpiry.filter((i) => i.status === 'FRESH');

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Discard "${name}" from inventory?`)) {
      await removeItem(id, name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <BellRing className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Expiry Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated notifications categorized into high-priority action feeds to minimize food wastage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActivePage('add-item')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Notification Banner / Urgency Summary */}
      {(expired > 0 || expiringSoon > 0) ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs mt-0.5">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Action Required: {expired + expiringSoon} Perishables Need Attention
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {expired > 0 && <span className="font-semibold text-rose-700">{expired} expired item(s) to discard. </span>}
                {expiringSoon > 0 && <span className="font-semibold text-amber-800">{expiringSoon} item(s) expiring within the 7-day critical window.</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
              Live Today's Date: {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <div className="text-sm font-bold text-emerald-900">Optimal Food Safety!</div>
            <p className="text-xs text-emerald-700">
              No items are expired or expiring in the next 7 days. Your inventory is in great shape.
            </p>
          </div>
        </div>
      )}

      {/* Section 1: Expired Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-rose-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <h2 className="text-lg font-bold text-rose-900">Expired Products ({expiredItems.length})</h2>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            Past Expiration Date
          </span>
        </div>

        {expiredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredItems.map((item) => (
              <div
                key={item.itemId}
                className="bg-white p-5 rounded-2xl border-2 border-rose-200/90 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{item.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      -{item.statusInfo.overdueDays} Days Overdue
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Quantity</span>
                      <span className="font-semibold text-slate-800">{item.quantity} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Expired On</span>
                      <span className="font-semibold text-rose-600">{item.expiryDate}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-rose-600 font-medium">Unsafe to consume</span>
                  <button
                    onClick={() => handleDeleteItem(item.itemId, item.name)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard Item</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
            No expired products found in your inventory.
          </div>
        )}
      </div>

      {/* Section 2: Expiring Soon Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <h2 className="text-lg font-bold text-amber-900">Expiring Soon ({soonItems.length})</h2>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Critical Window (0–7 Days Remaining)
          </span>
        </div>

        {soonItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {soonItems.map((item) => (
              <div
                key={item.itemId}
                className="bg-white p-5 rounded-2xl border-2 border-amber-200/90 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{item.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {item.statusInfo.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Quantity</span>
                      <span className="font-semibold text-slate-800">{item.quantity} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Expiry Deadline</span>
                      <span className="font-semibold text-amber-700">{item.expiryDate}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 font-semibold flex items-center">
                    <ChefHat className="w-3.5 h-3.5 mr-1" /> Use in next meal
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.itemId, item.name)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    <span>Mark Consumed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
            No items currently approaching expiration within the 7-day window.
          </div>
        )}
      </div>

      {/* Section 3: Fresh Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 className="text-lg font-bold text-emerald-900">Fresh Products ({freshItems.length})</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Safe (&gt; 7 Days Remaining)
          </span>
        </div>

        {freshItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freshItems.map((item) => (
              <div
                key={item.itemId}
                className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {item.statusInfo.daysRemaining}d left
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Stock</span>
                    <span className="font-semibold text-slate-800">{item.quantity} {item.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Expiry</span>
                    <span className="font-semibold text-slate-800">{item.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
            No fresh items logged.
          </div>
        )}
      </div>

    </div>
  );
}
