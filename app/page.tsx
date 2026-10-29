'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/src/components/Sidebar';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import LoginView from '@/src/components/LoginView';
import DashboardView from '@/src/components/DashboardView';
import PosView from '@/src/components/PosView';
import MedicinesView from '@/src/components/MedicinesView';
import InventoryView from '@/src/components/InventoryView';
import SuppliersView from '@/src/components/SuppliersView';
import ReportsView from '@/src/components/ReportsView';
import SettingsView from '@/src/components/SettingsView';

import { initialMedicines, initialSuppliers, initialSales, initialSettings } from '@/src/data/initialData';
import { Medicine, Supplier, Sale, PharmacySettings } from '@/src/types/pharmacy';
import { Bell, X, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function Page() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Persistent state with localStorage
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgrow_pharmacy_medicines');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return initialMedicines;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgrow_pharmacy_suppliers');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return initialSuppliers;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgrow_pharmacy_sales');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return initialSales;
  });

  const [settings, setSettings] = useState<PharmacySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgrow_pharmacy_settings');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return initialSettings;
  });

  useEffect(() => {
    localStorage.setItem('edgrow_pharmacy_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('edgrow_pharmacy_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('edgrow_pharmacy_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('edgrow_pharmacy_settings', JSON.stringify(settings));
  }, [settings]);

  // Alert counts
  const lowStockCount = medicines.filter(m => m.stock <= settings.lowStockThreshold).length;
  const today = new Date();
  const expiredCount = medicines.filter(m => {
    const exp = new Date(m.expiryDate);
    return (exp.getTime() - today.getTime()) < 0;
  }).length;

  // Handlers
  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines(prev => [newMed, ...prev]);
  };

  const handleUpdateMedicine = (updated: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleCompleteSale = (newSale: Sale, updatedMedicines: Medicine[]) => {
    setSales(prev => [newSale, ...prev]);
    setMedicines(updatedMedicines);
  };

  const handleAddSupplier = (sup: Supplier) => {
    setSuppliers(prev => [sup, ...prev]);
  };

  const handleUpdateSupplier = (sup: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === sup.id ? sup : s));
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // If on login view
  if (currentTab === 'login' || !isLoggedIn) {
    return (
      <LoginView
        settings={settings}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setCurrentTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          settings={settings}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          lowStockCount={lowStockCount}
        />

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex md:hidden">
            <div className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-base">{settings.pharmacyName}</h3>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'pos', label: 'POS Billing' },
                    { id: 'medicines', label: 'Medicines' },
                    { id: 'inventory', label: 'Inventory' },
                    { id: 'suppliers', label: 'Suppliers' },
                    { id: 'reports', label: 'Sales Reports' },
                    { id: 'settings', label: 'Settings' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium ${
                        currentTab === item.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-red-600/20 text-red-400 rounded-xl text-xs font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentTab={currentTab}
            settings={settings}
            lowStockCount={lowStockCount}
            expiredCount={expiredCount}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {currentTab === 'dashboard' && (
                <DashboardView
                  medicines={medicines}
                  sales={sales}
                  suppliers={suppliers}
                  settings={settings}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentTab === 'pos' && (
                <PosView
                  medicines={medicines}
                  settings={settings}
                  onCompleteSale={handleCompleteSale}
                />
              )}

              {currentTab === 'medicines' && (
                <MedicinesView
                  medicines={medicines}
                  settings={settings}
                  onAddMedicine={handleAddMedicine}
                  onUpdateMedicine={handleUpdateMedicine}
                  onDeleteMedicine={handleDeleteMedicine}
                />
              )}

              {currentTab === 'inventory' && (
                <InventoryView
                  medicines={medicines}
                  settings={settings}
                  onUpdateMedicine={handleUpdateMedicine}
                />
              )}

              {currentTab === 'suppliers' && (
                <SuppliersView
                  suppliers={suppliers}
                  settings={settings}
                  onAddSupplier={handleAddSupplier}
                  onUpdateSupplier={handleUpdateSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsView
                  sales={sales}
                  settings={settings}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={setSettings}
                />
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in">
            <button
              onClick={() => setShowNotificationsModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">System Alerts</h3>
                <p className="text-xs text-slate-500">Inventory and batch expiry notifications</p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {medicines.filter(m => m.stock <= settings.lowStockThreshold).map(m => (
                <div key={`low-${m.id}`} className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">{m.name} is running low!</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">Only {m.stock} units remaining in stock.</p>
                  </div>
                </div>
              ))}

              {medicines.filter(m => {
                const exp = new Date(m.expiryDate);
                const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                return diffDays <= 90 && diffDays >= 0;
              }).map(m => (
                <div key={`exp-${m.id}`} className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-900 dark:text-red-200">{m.name} expiring soon!</p>
                    <p className="text-[11px] text-red-700 dark:text-red-400">Batch {m.batchNo} expires on {m.expiryDate}.</p>
                  </div>
                </div>
              ))}

              {lowStockCount === 0 && expiredCount === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active warnings or alerts. All inventory is optimal!
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
