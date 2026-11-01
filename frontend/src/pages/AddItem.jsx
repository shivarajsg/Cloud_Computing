import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { FOOD_CATEGORIES, QUANTITY_UNITS, validateFoodItemDates, formatDate } from '../utils/expiry';
import { 
  PlusCircle, 
  Calendar, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Info
} from 'lucide-react';

export default function AddItem({ setActivePage }) {
  const { addItem, loading, mode } = useInventory();

  const todayStr = formatDate(new Date());

  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy Products',
    quantity: '1',
    unit: 'pieces',
    purchaseDate: todayStr,
    expiryDate: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Quick preset helper for lab presentations
  const setExpiryDaysFromToday = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData((prev) => ({ ...prev, expiryDate: formatDate(d) }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }

    const validation = validateFoodItemDates(formData.purchaseDate, formData.expiryDate);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const res = await addItem(formData);
    if (res.success) {
      setSuccess(true);
      setFormData({
        name: '',
        category: 'Dairy Products',
        quantity: '1',
        unit: 'pieces',
        purchaseDate: todayStr,
        expiryDate: '',
        notes: '',
      });
    } else {
      setError(res.error || 'Failed to add food item to inventory.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('inventory')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </button>

        <span className="text-xs text-slate-500">
          Target: <span className="font-semibold text-emerald-700">{mode === 'cloud' ? 'Amazon DynamoDB' : 'Demo Local Storage'}</span>
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Record Food Item</h1>
              <p className="text-xs text-emerald-100">
                Log food inventory details for cloud tracking and smart automated expiry alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Item added successfully! DynamoDB records and dashboard have been updated.</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSuccess(false)}
                className="text-xs font-semibold text-emerald-700 underline"
              >
                Add Another
              </button>
              <button
                onClick={() => setActivePage('inventory')}
                className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
              >
                View Inventory
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="m-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Almond Milk, Brown Bread, Fresh Spinach..."
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setError('');
              }}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Category & Quantity / Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Food Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              >
                {FOOD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Quantity & Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Quantity & Unit <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {QUANTITY_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Purchase Date */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Purchase Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => {
                  setFormData({ ...formData, purchaseDate: e.target.value });
                  setError('');
                }}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Defaults to today's date</span>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Expiry Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => {
                  setFormData({ ...formData, expiryDate: e.target.value });
                  setError('');
                }}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />

              {/* Quick Preset Buttons for Lab Testing */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 mr-1 flex items-center">
                  <Sparkles className="w-3 h-3 text-emerald-500 mr-0.5" /> Demo Quick:
                </span>
                <button
                  type="button"
                  onClick={() => setExpiryDaysFromToday(-2)}
                  className="text-[10px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200"
                >
                  -2d (Expired)
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryDaysFromToday(0)}
                  className="text-[10px] font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200"
                >
                  Today (Expiring)
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryDaysFromToday(5)}
                  className="text-[10px] font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200"
                >
                  +5d (Soon)
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryDaysFromToday(15)}
                  className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200"
                >
                  +15d (Fresh)
                </button>
              </div>
            </div>

          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Storage Instructions or Notes (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Keep refrigerated below 4°C, store in airtight container after opening..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Cloud Info Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start space-x-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900">Automatic Status Computation:</span>
              <p>
                Status will be computed dynamically upon saving based on today's calendar date without timezone drift. Expired: past today; Expiring Soon: 0–7 days; Fresh: &gt; 7 days.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setActivePage('inventory')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-2 disabled:opacity-50 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Add Food Item'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
