import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  FileText,
  ShoppingBag
} from 'lucide-react';
import { Sale, PharmacySettings } from '../types/pharmacy';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface ReportsViewProps {
  sales: Sale[];
  settings: PharmacySettings;
}

export default function ReportsView({ sales, settings }: ReportsViewProps) {
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalTransactions = sales.length;
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const weeklyData = [
    { period: 'Mon', revenue: 145.20, count: 8 },
    { period: 'Tue', revenue: 230.50, count: 12 },
    { period: 'Wed', revenue: 195.00, count: 10 },
    { period: 'Thu', revenue: 310.40, count: 15 },
    { period: 'Fri', revenue: 380.90, count: 19 },
    { period: 'Sat', revenue: 450.00, count: 24 },
    { period: 'Sun', revenue: 410.10, count: 21 },
  ];

  const monthlyData = [
    { period: 'Week 1', revenue: 1650.00, count: 85 },
    { period: 'Week 2', revenue: 1920.50, count: 98 },
    { period: 'Week 3', revenue: 2100.00, count: 110 },
    { period: 'Week 4', revenue: 2450.80, count: 130 },
  ];

  const activeChartData = reportPeriod === 'weekly' ? weeklyData : monthlyData;

  const handleExportCSV = () => {
    const headers = "InvoiceNo,Date,Customer,PaymentMethod,Total\n";
    const rows = sales.map(s => `${s.invoiceNo},${s.date},${s.customerName},${s.paymentMethod},${s.total}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top filter and export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">Sales & Financial Analytics</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setReportPeriod('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                reportPeriod === 'weekly' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setReportPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                reportPeriod === 'monthly' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Recorded Revenue</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tabular-nums">
            {settings.currency}{totalRevenue.toFixed(2)}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Calculated from POS transactions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Transactions</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tabular-nums">
            {totalTransactions}
          </h3>
          <p className="text-xs text-blue-600 font-medium mt-1">Completed checkouts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Average Order Value</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tabular-nums">
            {settings.currency}{avgOrderValue.toFixed(2)}
          </h3>
          <p className="text-xs text-teal-600 font-medium mt-1">Per receipt average</p>
        </div>
      </div>

      {/* Revenue & Transaction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Revenue Trend</h3>
          <p className="text-xs text-slate-500 mb-6">Revenue breakdown by {reportPeriod}</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`${settings.currency}${val}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Transaction Volume</h3>
          <p className="text-xs text-slate-500 mb-6">Number of bills processed</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [val, 'Bills']}
                />
                <Line type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={3} dot={{ fill: '#0d9488', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Sales Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">All Recorded Transactions</h3>
        <p className="text-xs text-slate-500 mb-4">Complete log of POS billing history</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cashier</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {sale.invoiceNo}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{sale.date}</td>
                  <td className="py-3.5 px-4 text-slate-900 dark:text-white font-medium text-xs">{sale.customerName}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{sale.cashier}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums text-xs">
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
