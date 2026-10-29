import React from 'react';
import { Bell, Search, Menu, UserCheck, ShieldCheck } from 'lucide-react';
import { PharmacySettings } from '../types/pharmacy';

interface HeaderProps {
  currentTab: string;
  settings: PharmacySettings;
  lowStockCount: number;
  expiredCount: number;
  onOpenNotifications: () => void;
  onMobileMenuToggle?: () => void;
}

export default function Header({
  currentTab,
  settings,
  lowStockCount,
  expiredCount,
  onOpenNotifications,
  onMobileMenuToggle
}: HeaderProps) {
  const getTabTitle = (tab: string) => {
    switch(tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'pos': return 'POS Billing & Checkout';
      case 'medicines': return 'Medicine Catalog';
      case 'inventory': return 'Inventory & Stock Control';
      case 'suppliers': return 'Supplier Management';
      case 'reports': return 'Sales & Revenue Reports';
      case 'settings': return 'Pharmacy Settings';
      case 'login': return 'System Authentication';
      default: return 'Dashboard';
    }
  };

  const totalAlerts = lowStockCount + expiredCount;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Pharmacy System</span>
            <span>/</span>
            <span className="text-emerald-600 font-medium capitalize">{currentTab}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {getTabTitle(currentTab)}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Badge status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-full text-xs text-emerald-700 dark:text-emerald-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>System Active</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Stock & Expiry Alerts"
        >
          <Bell className="w-5 h-5" />
          {totalAlerts > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {totalAlerts}
            </span>
          )}
        </button>

        {/* User Profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-emerald-600/20">
            PH
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Chief Pharmacist</p>
            <p className="text-[10px] text-slate-500">Branch #01 - Main</p>
          </div>
        </div>
      </div>
    </header>
  );
}
