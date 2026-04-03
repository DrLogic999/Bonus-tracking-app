import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, BookOpen, Settings, LogOut, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: any) => void;
  onLogout: () => void;
  teacherName: string;
}

export function Navigation({ activeView, onViewChange, onLogout, teacherName }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Award className="text-white" size={24} />
        </div>
        <span className="hidden lg:block font-black text-xl tracking-tight">BonusTrack</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative",
              activeView === item.id || (activeView === 'class-detail' && item.id === 'classes')
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <item.icon size={24} />
            <span className="hidden lg:block font-bold">{item.label}</span>
            {activeView === item.id && (
              <motion.div 
                layoutId="nav-active"
                className="absolute left-0 w-1 h-8 bg-white rounded-r-full hidden lg:block"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="hidden lg:flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center font-bold text-slate-500">
            {teacherName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{teacherName}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-black">Teacher</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group"
        >
          <LogOut size={24} />
          <span className="hidden lg:block font-bold">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
