import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../services/api.js';
import { calculateExpiryStatus } from '../utils/expiry.js';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setModeState] = useState(apiService.getMode());
  const [apiUrl, setApiUrlState] = useState(apiService.getApiUrl());
  const [backendHealth, setBackendHealth] = useState({ online: false, checking: false });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const checkHealthStatus = useCallback(async (customUrl = null) => {
    setBackendHealth((prev) => ({ ...prev, checking: true }));
    const res = await apiService.checkHealth(customUrl || apiUrl);
    setBackendHealth({ ...res, checking: false });
    return res;
  }, [apiUrl]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getItems();
      setItems(res.data);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err.message || 'Failed to load inventory');
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadItems();
    if (mode === 'cloud') {
      checkHealthStatus();
    }
  }, [mode, loadItems, checkHealthStatus]);

  const switchMode = useCallback(async (newMode) => {
    apiService.setMode(newMode);
    setModeState(newMode);
    if (newMode === 'cloud') {
      const health = await checkHealthStatus();
      if (!health.online) {
        showToast('Connected to Cloud Mode (Backend offline or unreachable, please check endpoint)', 'warning');
      } else {
        showToast('Successfully connected to AWS Cloud Backend!', 'success');
      }
    } else {
      showToast('Switched to Demo Mode (Local Storage)', 'info');
    }
    await loadItems();
  }, [checkHealthStatus, loadItems, showToast]);

  const updateApiUrl = useCallback(async (url) => {
    apiService.setApiUrl(url);
    setApiUrlState(url);
    const health = await checkHealthStatus(url);
    if (health.online) {
      showToast('AWS Cloud API endpoint verified and active!', 'success');
    } else {
      showToast('Could not reach backend at that URL. Check CORS or endpoint.', 'warning');
    }
    if (mode === 'cloud') {
      await loadItems();
    }
  }, [checkHealthStatus, mode, loadItems, showToast]);

  const addItem = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await apiService.createItem(formData);
      setItems((prev) => [data, ...prev.filter((i) => i.itemId !== data.itemId)]);
      showToast(`Added "${formData.name}" successfully!`, 'success');
      return { success: true, item: data };
    } catch (err) {
      setError(err.message);
      showToast(`Failed to add item: ${err.message}`, 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const editItem = useCallback(async (id, formData) => {
    setLoading(true);
    try {
      const { data } = await apiService.updateItem(id, formData);
      setItems((prev) => prev.map((item) => (item.itemId === id ? { ...item, ...data } : item)));
      showToast(`Updated "${formData.name || 'item'}" successfully!`, 'success');
      return { success: true, item: data };
    } catch (err) {
      setError(err.message);
      showToast(`Failed to update item: ${err.message}`, 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const removeItem = useCallback(async (id, name = 'Item') => {
    setLoading(true);
    try {
      await apiService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.itemId !== id));
      showToast(`Removed "${name}" from inventory.`, 'info');
      return { success: true };
    } catch (err) {
      setError(err.message);
      showToast(`Failed to delete item: ${err.message}`, 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const resetDemo = useCallback(() => {
    const sample = apiService.resetDemoData();
    setItems(sample);
    showToast('Reset inventory to default sample demonstration data.', 'info');
  }, [showToast]);

  // Derived dynamic calculations
  const enhancedItems = useMemo(() => {
    const now = new Date();
    return items.map((item) => {
      const statusInfo = calculateExpiryStatus(item.expiryDate, now);
      return {
        ...item,
        statusInfo,
        status: statusInfo.status,
      };
    });
  }, [items]);

  const summary = useMemo(() => {
    let fresh = 0;
    let expiringSoon = 0;
    let expired = 0;
    const categoriesMap = {};

    enhancedItems.forEach((item) => {
      if (item.status === 'EXPIRED') expired++;
      else if (item.status === 'EXPIRING_SOON') expiringSoon++;
      else if (item.status === 'FRESH') fresh++;

      const cat = item.category || 'Others';
      categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoriesMap).map((cat) => ({
      name: cat,
      count: categoriesMap[cat],
    }));

    // Nearest expiry items (ascending days remaining)
    const sortedByExpiry = [...enhancedItems].sort(
      (a, b) => a.statusInfo.daysRemaining - b.statusInfo.daysRemaining
    );

    // Recent inventory (by createdAt descending)
    const sortedByRecent = [...enhancedItems].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return {
      total: enhancedItems.length,
      fresh,
      expiringSoon,
      expired,
      categoryDistribution,
      sortedByExpiry,
      sortedByRecent,
    };
  }, [enhancedItems]);

  const value = {
    items: enhancedItems,
    loading,
    error,
    mode,
    apiUrl,
    backendHealth,
    toast,
    summary,
    loadItems,
    switchMode,
    updateApiUrl,
    checkHealthStatus,
    addItem,
    editItem,
    removeItem,
    resetDemo,
    showToast,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
