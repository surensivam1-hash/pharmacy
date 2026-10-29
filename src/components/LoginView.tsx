import React, { useState } from 'react';
import { Pill, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PharmacySettings } from '../types/pharmacy';

interface LoginViewProps {
  onLoginSuccess: () => void;
  settings: PharmacySettings;
}

export default function LoginView({ onLoginSuccess, settings }: LoginViewProps) {
  const [username, setUsername] = useState('admin@citycare.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 600);
  };

  const handleQuickDemo = () => {
    setUsername('admin@citycare.com');
    setPassword('secret123');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow decorative elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 mb-4">
            <Pill className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{settings.pharmacyName}</h1>
          <p className="text-xs text-slate-400 mt-1">Professional Pharmacy Management SaaS</p>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-4 mb-6 text-xs text-emerald-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-200">Frontend Preview Mode</p>
            <p className="text-emerald-400/80 mt-0.5">Use demo credentials below or click quick preview to instantly explore all management & POS modules.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Username / Email</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="admin@pharmacy.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={handleQuickDemo}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
          >
            Instant Demo Preview (Skip Login)
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-500">
            Developed by <span className="text-emerald-400 font-semibold">EdGrow Tech (PVT) LTD</span>
          </p>
        </div>
      </div>
    </div>
  );
}
