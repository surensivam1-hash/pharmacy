import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Pharmacy Management System. All rights reserved.</p>
        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
          Developed by EdGrow Tech (PVT) LTD
        </p>
      </div>
    </footer>
  );
}
