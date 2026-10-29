import React from 'react';
import { 
  Pill, 
  DollarSign, 
  AlertTriangle, 
  Truck, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Medicine, Sale, Supplier, PharmacySettings } from '../types/pharmacy';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

interface DashboardViewProps {
  medicines: Medicine[];
  sales: Sale[];
  suppliers: Supplier[];
  settings: PharmacySettings;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({
  medicines,
  sales,
  suppliers,
  settings,
  onNavigate
}: DashboardViewProps) {
  // Calculations
  const totalMedicines = medicines.reduce((acc, m) => acc + m.stock, 0);
  const uniqueMedicinesCount = medicines.length;
  
  const todayRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  
  const lowStockMedicines = medicines.filter(m => m.stock <= settings.lowStockThreshold);
  
  // Expiry check (within 90 days)
  const today = new Date();
  const expiringMedicines = medicines.filter(m => {
    const exp = new Date(m.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 90 && diffDays >= 0;
  });

  const chartData = [
    { day: 'Mon', sales: 120 },
    { day: 'Tue', sales: 210 },
    { day: 'Wed', sales: 180 },
    { day: 'Thu', sales: 290 },
    { day: 'Fri', sales: 340 },
    { day: 'Sat', sales: 420 },
    { day: 'Sun', sales: 380 },
  ];

  const categoryData = medicines.reduce((acc: any[], m) => {
    const existing = acc.find(item => item.category === m.category);
    if (existing) {
      existing.count += m.stock;
    } else {
      acc.push({ category: m.category, count: m.stock });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {(lowStockMedicines.length > 0 || expiringMedicines.length > 0) && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Inventory Attention Required</h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                {lowStockMedicines.length} medicines are running low on stock, and {expiringMedicines.length} batches are nearing expiry.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 shadow-sm"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Medicines</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalMedicines}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">{uniqueMedicinesCount} Unique Items</p>
            </div>
            <button
              onClick={() => onNavigate('medicines')}
              className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {settings.currency}{todayRevenue.toFixed(2)}
              </h3>
              <p className="text-xs text-teal-600 font-medium mt-1">+18.2% vs yesterday</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-slate-400 hover:text-teal-600 flex items-center gap-1"
            >
              <span>Reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Low Stock Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{lowStockMedicines.length}</h3>
              <p className="text-xs text-amber-600 font-medium mt-1">Below threshold</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-slate-400 hover:text-amber-600 flex items-center gap-1"
            >
              <span>Check</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Suppliers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{suppliers.length}</h3>
              <p className="text-xs text-blue-600 font-medium mt-1">Verified Partners</p>
            </div>
            <button
              onClick={() => onNavigate('suppliers')}
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:col-span-2 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Sales Performance</h3>
              <p className="text-xs text-slate-500">Revenue trend over the last 7 days</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Full Analytics →
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => [`${settings.currency}${value}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Stock by Category</h3>
            <p className="text-xs text-slate-500 mb-6">Distribution across pharmaceutical categories</p>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {categoryData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                    <span className="text-slate-900 dark:text-white tabular-nums font-bold">{item.count} units</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (item.count / 500) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('pos')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Open POS Billing Counter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest sales completed at the POS counter</p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-500"
          >
            View All Sales
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400 text-xs">
                    {sale.invoiceNo}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">{sale.date}</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{sale.customerName}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                    {settings.currency}{sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
