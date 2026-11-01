import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { FOOD_CATEGORIES, QUANTITY_UNITS, validateFoodItemDates } from '../utils/expiry';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Calendar, 
  Tag, 
  AlertCircle, 
  Info,
  CheckCircle2,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

export default function Inventory({ setActivePage }) {
  const { items, removeItem, editItem, loading, resetDemo } = useInventory();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('expiry-asc');

  // Modals state
  const [viewingItem, setViewingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editError, setEditError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
        const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'expiry-asc') {
          return a.statusInfo.daysRemaining - b.statusInfo.daysRemaining;
        }
        if (sortBy === 'expiry-desc') {
          return b.statusInfo.daysRemaining - a.statusInfo.daysRemaining;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'purchase-desc') {
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        }
        return 0;
      });
  }, [items, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Open edit modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      notes: item.notes || ''
    });
    setEditError('');
  };

  // Submit edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const validation = validateFoodItemDates(editFormData.purchaseDate, editFormData.expiryDate);
    if (!validation.valid) {
      setEditError(validation.error);
      return;
    }

    const res = await editItem(editingItem.itemId, editFormData);
    if (res.success) {
      setEditingItem(null);
    }
  };

  const handleConfirmDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from your cloud inventory?`)) {
      await removeItem(id, name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Food Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your food stock, monitor shelf lives, and review live statuses.
          </p>
        </div>

        <button
          onClick={() => setActivePage('add-item')}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search product by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="ALL">All Categories</option>
              {FOOD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Expiry Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="ALL">All Expiry Statuses</option>
              <option value="FRESH">Fresh (&gt; 7 days)</option>
              <option value="EXPIRING_SOON">Expiring Soon (0–7 days)</option>
              <option value="EXPIRED">Expired (&lt; 0 days)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="expiry-asc">Expiry: Nearest First</option>
              <option value="expiry-desc">Expiry: Furthest First</option>
              <option value="name-asc">Product Name (A–Z)</option>
              <option value="purchase-desc">Purchase: Most Recent</option>
            </select>
          </div>

        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredItems.length} of {items.length} items
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItems.map((item) => (
                  <tr key={item.itemId} className="hover:bg-slate-50/70 transition">
                    
                    {/* Product Name & Notes Indicator */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      {item.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs" title={item.notes}>
                          {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 font-medium">
                      {item.quantity} {item.unit}
                    </td>

                    {/* Purchase Date */}
                    <td className="py-3 px-4 text-slate-500">
                      {item.purchaseDate}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.expiryDate}
                    </td>

                    {/* Status with Dynamic Indicator */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.statusInfo.theme.badgeBg} ${item.statusInfo.theme.badgeText} ${item.statusInfo.theme.badgeBorder}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.statusInfo.theme.dotBg}`} />
                        <span>{item.statusInfo.shortLabel}</span>
                      </span>
                    </td>

                    {/* Actions: View, Edit, Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewingItem(item)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Food Item"
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(item.itemId, item.name)}
                          title="Delete Food Item"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Food Items Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
                  ? 'No items matched your search query or filter combination.'
                  : 'Your inventory is currently empty. Start logging food items to activate cloud expiry alerts.'}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('add-item')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Add First Food Item
              </button>
              <button
                onClick={resetDemo}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Load Sample Demonstration Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Item Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${viewingItem.statusInfo.theme.dotBg}`} />
                <h3 className="font-bold text-slate-900 text-sm">Product Inspection</h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Product Name</span>
                <div className="text-base font-bold text-slate-900">{viewingItem.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Category</span>
                  <div className="font-bold text-slate-800">{viewingItem.category}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Quantity</span>
                  <div className="font-bold text-slate-800">{viewingItem.quantity} {viewingItem.unit}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Purchase Date</span>
                  <div className="font-bold text-slate-800">{viewingItem.purchaseDate}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Expiry Date</span>
                  <div className="font-bold text-slate-800">{viewingItem.expiryDate}</div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${viewingItem.statusInfo.theme.cardBg} ${viewingItem.statusInfo.theme.cardBorder}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase text-[10px] text-slate-500">Computed Status</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${viewingItem.statusInfo.theme.badgeBg} ${viewingItem.statusInfo.theme.badgeText}`}>
                    {viewingItem.statusInfo.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {viewingItem.status === 'EXPIRED'
                    ? `This product expired ${viewingItem.statusInfo.overdueDays} days ago and should be safely discarded.`
                    : viewingItem.status === 'EXPIRING_SOON'
                    ? `This product is within the 7-day critical window (${viewingItem.statusInfo.daysRemaining} days left). Prioritize in meal planning!`
                    : `This product is fresh with ${viewingItem.statusInfo.daysRemaining} days remaining.`}
                </p>
              </div>

              {viewingItem.notes && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Storage / Chef Notes</span>
                  <p className="text-slate-700 mt-0.5">{viewingItem.notes}</p>
                </div>
              )}

              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex justify-between">
                <span>ID: {viewingItem.itemId}</span>
                <span>DB: DynamoDB</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Edit Food Item</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              {editError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {FOOD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={editFormData.quantity}
                      onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Unit</label>
                    <select
                      value={editFormData.unit}
                      onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {QUANTITY_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.purchaseDate}
                    onChange={(e) => setEditFormData({ ...editFormData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notes (Optional)</label>
                <textarea
                  rows="2"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Storage guidelines, brand info..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
