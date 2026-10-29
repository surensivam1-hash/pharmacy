import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  Search, 
  Plus, 
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  X
} from 'lucide-react';
import { Medicine, PharmacySettings } from '../types/pharmacy';

interface InventoryViewProps {
  medicines: Medicine[];
  settings: PharmacySettings;
  onUpdateMedicine: (med: Medicine) => void;
}

export default function InventoryView({ medicines, settings, onUpdateMedicine }: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'LowStock' | 'ExpiringSoon'>('All');
  const [restockModalMed, setRestockModalMed] = useState<Medicine | null>(null);
  const [restockAmount, setRestockAmount] = useState(50);

  const today = new Date();

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const exp = new Date(m.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const isLow = m.stock <= settings.lowStockThreshold;
    const isExpiring = diffDays <= 90 && diffDays >= 0;

    if (filterStatus === 'LowStock') return matchesSearch && isLow;
    if (filterStatus === 'ExpiringSoon') return matchesSearch && isExpiring;
    return matchesSearch;
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalMed) return;

    const updated: Medicine = {
      ...restockModalMed,
      stock: restockModalMed.stock + Number(restockAmount)
    };

    onUpdateMedicine(updated);
    setRestockModalMed(null);
    setRestockAmount(50);
  };

  return (
    <div className="space-y-6">
      {/* Top filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock by name or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pl-10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'LowStock', 'ExpiringSoon'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status === 'All' ? 'All Stock' : status === 'LowStock' ? 'Low Stock' : 'Expiring Soon'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4">Batch No</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredMedicines.map((med) => {
                const exp = new Date(med.expiryDate);
                const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                const isLow = med.stock <= settings.lowStockThreshold;
                const isExpired = diffDays < 0;
                const isExpiringSoon = diffDays <= 90 && diffDays >= 0;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-xs">
                      {med.name}
                      <p className="text-[11px] text-slate-400 font-normal">{med.supplier}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {med.batchNo}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className={isExpired ? 'text-red-500 font-bold' : isExpiringSoon ? 'text-amber-500 font-semibold' : 'text-slate-600 dark:text-slate-300'}>
                        {med.expiryDate} {isExpired ? '(Expired)' : isExpiringSoon ? `(${diffDays}d left)` : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-xs">
                      {med.stock} units
                    </td>
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          <ShieldAlert className="w-3 h-3" /> Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Optimal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setRestockModalMed(med)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalMed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setRestockModalMed(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Restock Inventory</h3>
            <p className="text-xs text-slate-500 mb-4">Adding stock units for <strong className="text-slate-900 dark:text-white">{restockModalMed.name}</strong></p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Current Stock</label>
                <input
                  type="text"
                  disabled
                  value={`${restockModalMed.stock} units`}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Units to Add</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRestockModalMed(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
