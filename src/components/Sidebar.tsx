import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Pill, 
  Package, 
  Truck, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { PharmacySettings } from '../types/pharmacy';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  settings: PharmacySettings;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  lowStockCount: number;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  settings,
  isLoggedIn,
  setIsLoggedIn,
  lowStockCount
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS Billing', icon: ShoppingCart },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/30">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-tight leading-snug line-clamp-1">
            {settings.pharmacyName}
          </h1>
          <span className="text-[11px] text-emerald-400 font-medium">SaaS Pharmacy v2.5</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Session Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        {isLoggedIn ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700/40 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">Administrator</p>
                <p className="text-[10px] text-slate-400 truncate">admin@pharmacy.com</p>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              title="Logout / Switch Account"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentTab('login')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Login to System</span>
          </button>
        )}
      </div>
    </aside>
  );
}
