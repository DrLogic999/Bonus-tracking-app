import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20 font-semibold" 
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all relative",
        active 
          ? "text-primary" 
          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      )}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="mobile-nav-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
        />
      )}
    </button>
  );
}
