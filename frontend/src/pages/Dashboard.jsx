import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Boxes, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  PlusCircle, 
  Calendar, 
  Tag, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

export default function Dashboard({ setActivePage }) {
  const { summary, loading, mode } = useInventory();

  const {
    total = 0,
    fresh = 0,
    expiringSoon = 0,
    expired = 0,
    categoryDistribution = [],
    sortedByExpiry = [],
    sortedByRecent = [],
  } = summary;

  // Urgent items needing attention (Expired + Expiring Soon)
  const attentionItems = sortedByExpiry.filter(
    (item) => item.status === 'EXPIRED' || item.status === 'EXPIRING_SOON'
  );

  // Top 4 upcoming expiry items
  const upcomingItems = sortedByExpiry.slice(0, 4);

  // Top 4 recently added
  const recentItems = sortedByRecent.slice(0, 4);

  // Chart data for status breakdown
  const statusChartData = [
    { name: 'Fresh', count: fresh, color: '#10b981' },
    { name: 'Expiring Soon', count: expiringSoon, color: '#f59e0b' },
    { name: 'Expired', count: expired, color: '#f43f5e' },
  ].filter((item) => item.count > 0);

  const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#64748b', '#14b8a6'];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inventory Dashboard
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
              Live Monitor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time expiry calculation and category distribution from{' '}
            <span className="font-semibold text-slate-700">
              {mode === 'cloud' ? 'Amazon DynamoDB' : 'Local Demo Storage'}
            </span>
            .
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActivePage('add-item')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
          <button
            onClick={() => setActivePage('inventory')}
            className="inline-flex items-center space-x-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 4 Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Food Items</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{total}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span>Managed in inventory</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        {/* Fresh Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-emerald-700">Fresh Items</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">{fresh}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span>&gt; 7 days shelf-life</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-amber-700">Expiring Soon</div>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">{expiringSoon}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span>Within next 7 days</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Expired Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-rose-700">Expired Items</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-1">{expired}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span>Requires disposal</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Expiry Overview & Urgent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Expiry Overview & Category Chart */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section A: Expiry Overview & Progress Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Section A: Expiry Overview</h2>
                <p className="text-xs text-slate-500">Breakdown of product safety states across all logged items.</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {total > 0 ? `${Math.round((fresh / total) * 100)}% Fresh Rate` : 'No items yet'}
              </span>
            </div>

            {/* Visual Multi-Segment Progress Bar */}
            {total > 0 ? (
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(fresh / total) * 100}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Fresh: ${fresh}`}
                  />
                  <div
                    style={{ width: `${(expiringSoon / total) * 100}%` }}
                    className="bg-amber-500 transition-all duration-500"
                    title={`Expiring Soon: ${expiringSoon}`}
                  />
                  <div
                    style={{ width: `${(expired / total) * 100}%` }}
                    className="bg-rose-500 transition-all duration-500"
                    title={`Expired: ${expired}`}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-700 font-medium">Fresh ({fresh})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-slate-700 font-medium">Expiring Soon ({expiringSoon})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-slate-700 font-medium">Expired ({expired})</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                Inventory is empty. Click "Add Food Item" to see the dynamic overview.
              </div>
            )}
          </div>

          {/* Section D: Food Category Distribution (Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Section D: Food Category Distribution</h2>
                <p className="text-xs text-slate-500">Total counts categorized by item types.</p>
              </div>
              <span className="text-xs text-slate-400">DynamoDB Records</span>
            </div>

            {categoryDistribution.length > 0 ? (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <XAxis 
                      dataKey="name" 
                      angle={-25} 
                      textAnchor="end" 
                      interval={0} 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        color: '#fff', 
                        borderRadius: '8px', 
                        fontSize: '12px',
                        border: 'none'
                      }}
                      formatter={(val) => [`${val} items`, 'Quantity']}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">
                No categorical data available yet.
              </div>
            )}
          </div>

          {/* Section B: Upcoming Expiry List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Section B: Upcoming Expiry</h2>
                <p className="text-xs text-slate-500">Products sorted by closest expiry deadline.</p>
              </div>
              <button
                onClick={() => setActivePage('alerts')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center"
              >
                View Alerts <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            {upcomingItems.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {upcomingItems.map((item) => (
                  <div key={item.itemId} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.statusInfo.theme.dotBg}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.quantity} {item.unit} • <span className="text-slate-600">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.statusInfo.theme.badgeBg} ${item.statusInfo.theme.badgeText} ${item.statusInfo.theme.badgeBorder}`}>
                        {item.statusInfo.label}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">Exp: {item.expiryDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">No upcoming items.</div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Alerts Summary & Recent Inventory */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section E: Alerts Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Section E: Alerts Summary</h2>
                  <p className="text-[11px] text-slate-500">Requires prompt attention</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                attentionItems.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {attentionItems.length} Urgent
              </span>
            </div>

            {attentionItems.length > 0 ? (
              <div className="space-y-2.5">
                {attentionItems.slice(0, 5).map((item) => (
                  <div
                    key={item.itemId}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      item.status === 'EXPIRED'
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] font-medium text-slate-600">
                        {item.status === 'EXPIRED' ? (
                          <span className="text-rose-600 font-semibold">Overdue ({item.statusInfo.overdueDays}d)</span>
                        ) : (
                          <span className="text-amber-700 font-semibold">{item.statusInfo.label}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setActivePage('alerts')}
                      className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
                    >
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-xs font-bold text-emerald-900">All Goods In Order!</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  No expired or soon-to-expire food items found in inventory.
                </div>
              </div>
            )}
          </div>

          {/* Section C: Recent Inventory */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Section C: Recent Inventory</h2>
                <p className="text-xs text-slate-500">Latest items logged into database.</p>
              </div>
              <button
                onClick={() => setActivePage('inventory')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Browse
              </button>
            </div>

            {recentItems.length > 0 ? (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div key={item.itemId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.quantity} {item.unit} • {item.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.statusInfo.theme.badgeBg} ${item.statusInfo.theme.badgeText}`}>
                        {item.statusInfo.shortLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">No items recorded yet.</div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
