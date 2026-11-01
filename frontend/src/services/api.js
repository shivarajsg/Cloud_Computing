import { generateSampleItems } from '../utils/sampleData.js';

const STORAGE_KEY_ITEMS = 'freshtrack_demo_items_v1';
const STORAGE_KEY_MODE = 'freshtrack_mode';
const STORAGE_KEY_API_URL = 'freshtrack_cloud_api_url';

// Environment variable or production AWS API Gateway default
const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://ng7dtfqk39.execute-api.ap-south-1.amazonaws.com/prod';

export function getStoredMode() {
  return localStorage.getItem(STORAGE_KEY_MODE) || 'demo';
}

export function setStoredMode(mode) {
  localStorage.setItem(STORAGE_KEY_MODE, mode);
}

export function getStoredApiUrl() {
  return localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_API_URL;
}

export function setStoredApiUrl(url) {
  localStorage.setItem(STORAGE_KEY_API_URL, url.replace(/\/+$/, ''));
}

/**
 * Initialize Demo Storage if empty
 */
function getLocalDemoItems() {
  const data = localStorage.getItem(STORAGE_KEY_ITEMS);
  if (!data) {
    const initial = generateSampleItems();
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse local demo items', e);
    const initial = generateSampleItems();
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(initial));
    return initial;
  }
}

function saveLocalDemoItems(items) {
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
}

export const apiService = {
  getMode() {
    return getStoredMode();
  },

  setMode(mode) {
    setStoredMode(mode);
  },

  getApiUrl() {
    return getStoredApiUrl();
  },

  setApiUrl(url) {
    setStoredApiUrl(url);
  },

  resetDemoData() {
    const sample = generateSampleItems();
    saveLocalDemoItems(sample);
    return sample;
  },

  async checkHealth(targetUrl = null) {
    const url = targetUrl || this.getApiUrl();
    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}`);
      }
      const data = await response.json();
      return {
        online: true,
        status: data.status || 'healthy',
        timestamp: data.timestamp || new Date().toISOString(),
        service: data.service || 'FreshTrack Cloud Backend',
        database: data.database || 'Amazon DynamoDB'
      };
    } catch (err) {
      return {
        online: false,
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  async getItems() {
    const mode = this.getMode();

    if (mode === 'demo') {
      const items = getLocalDemoItems();
      return {
        data: items,
        source: 'Demo Mode (Local Storage)'
      };
    }

    // Cloud Mode
    const url = `${this.getApiUrl()}/items`;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        throw new Error(`Cloud API error: ${res.statusText} (${res.status})`);
      }
      const json = await res.json();
      const items = Array.isArray(json) ? json : (json.items || []);
      return {
        data: items,
        source: 'AWS Cloud (API Gateway -> Lambda -> DynamoDB)'
      };
    } catch (err) {
      console.error('Failed to fetch from cloud API:', err);
      throw err;
    }
  },

  async getItem(id) {
    const mode = this.getMode();

    if (mode === 'demo') {
      const items = getLocalDemoItems();
      const item = items.find(i => i.itemId === id);
      if (!item) throw new Error('Item not found in demo inventory');
      return { data: item, source: 'Demo Mode' };
    }

    const url = `${this.getApiUrl()}/items/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch item ${id}`);
    const data = await res.json();
    return { data, source: 'AWS Cloud' };
  },

  async createItem(payload) {
    const mode = this.getMode();

    const newItem = {
      itemId: payload.itemId || `ft-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: payload.name.trim(),
      category: payload.category,
      quantity: Number(payload.quantity),
      unit: payload.unit,
      purchaseDate: payload.purchaseDate,
      expiryDate: payload.expiryDate,
      notes: payload.notes ? payload.notes.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (mode === 'demo') {
      const items = getLocalDemoItems();
      const updated = [newItem, ...items];
      saveLocalDemoItems(updated);
      return { data: newItem, source: 'Demo Mode' };
    }

    const url = `${this.getApiUrl()}/items`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to save to cloud: ${errText || res.statusText}`);
    }

    const data = await res.json();
    return { data: data.item || newItem, source: 'AWS Cloud' };
  },

  async updateItem(id, payload) {
    const mode = this.getMode();

    if (mode === 'demo') {
      const items = getLocalDemoItems();
      const index = items.findIndex(i => i.itemId === id);
      if (index === -1) throw new Error('Item not found');

      const updatedItem = {
        ...items[index],
        ...payload,
        itemId: id,
        updatedAt: new Date().toISOString()
      };

      items[index] = updatedItem;
      saveLocalDemoItems(items);
      return { data: updatedItem, source: 'Demo Mode' };
    }

    const url = `${this.getApiUrl()}/items/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to update item: ${errText || res.statusText}`);
    }

    const data = await res.json();
    return { data: data.item || payload, source: 'AWS Cloud' };
  },

  async deleteItem(id) {
    const mode = this.getMode();

    if (mode === 'demo') {
      const items = getLocalDemoItems();
      const filtered = items.filter(i => i.itemId !== id);
      saveLocalDemoItems(filtered);
      return { success: true, source: 'Demo Mode' };
    }

    const url = `${this.getApiUrl()}/items/${id}`;
    const res = await fetch(url, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to delete item from cloud: ${errText || res.statusText}`);
    }

    return { success: true, source: 'AWS Cloud' };
  }
};
