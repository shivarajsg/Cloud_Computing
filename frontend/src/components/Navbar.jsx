import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Leaf, 
  LayoutDashboard, 
  Boxes, 
  PlusCircle, 
  BellRing, 
  BookOpen, 
  Menu, 
  X, 
  Cloud, 
  HardDrive,
  Settings
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenSettings }) {
  const { mode, summary, backendHealth } = useInventory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const urgentAlertsCount = (summary?.expired || 0) + (summary?.expiringSoon || 0);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'My Inventory', icon: Boxes, count: summary?.total },
    { id: 'add-item', label: 'Add Food Item', icon: PlusCircle },
    { 
      id: 'alerts', 
      label: 'Expiry Alerts', 
      icon: BellRing, 
      badge: urgentAlertsCount > 0 ? urgentAlertsCount : null,
      badgeColor: summary?.expired > 0 ? 'bg-rose-500' : 'bg-amber-500'
    },
    { id: 'about', label: 'About Project', icon: BookOpen },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition duration-200">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">Fresh<span className="text-emerald-600">Track</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                  Cloud
                </span>
              </div>
              <p className="text-[10px] text-slate-600 hidden sm:block">Smart Expiry & Food Waste Alert System</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>

                  {link.badge !== undefined && link.badge !== null && (
                    <span className={`text-[11px] font-bold text-white px-1.5 py-0.2 rounded-full ${link.badgeColor} animate-pulse`}>
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && !link.badge && link.count > 0 && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Status & Settings Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              title="Click to view AWS Cloud & Demo settings"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-slate-50 hover:bg-slate-100 transition border-slate-200"
            >
              {mode === 'cloud' ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-700 font-semibold">AWS Cloud</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      backendHealth.online ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-slate-700 font-semibold">Demo Mode</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </>
              )}
              <Settings className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge !== null && (
                  <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${link.badgeColor}`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
