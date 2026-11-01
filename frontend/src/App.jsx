import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CloudSettingsModal from './components/CloudSettingsModal';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import Alerts from './pages/Alerts';
import About from './pages/About';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function Toast() {
  const { toast } = useInventory();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl bg-slate-900 text-white text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-sm">
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
      {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
      {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
      <span className="flex-1">{toast.message}</span>
    </aside>
  );
}

function MainLayout() {
  const [activePage, setActivePage] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'inventory':
        return <Inventory setActivePage={setActivePage} />;
      case 'add-item':
        return <AddItem setActivePage={setActivePage} />;
      case 'alerts':
        return <Alerts setActivePage={setActivePage} />;
      case 'about':
        return <About />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer setActivePage={setActivePage} />

      <CloudSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <MainLayout />
    </InventoryProvider>
  );
}
