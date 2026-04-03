import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, ChevronRight } from 'lucide-react';

interface AuthViewProps {
  onLogin: (name: string) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 border border-slate-200 dark:border-slate-800 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/30"
          >
            <Award className="text-white w-12 h-12" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mt-3 text-lg">
            Manage your classroom rewards with ease.
          </p>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = (e.target as any).name.value;
          if (name) onLogin(name);
        }} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Teacher Identity</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Users size={20} />
              </div>
              <input 
                name="name"
                type="text" 
                required
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-lg"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2"
          >
            Enter Dashboard
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            By continuing, you agree to our terms of service.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
