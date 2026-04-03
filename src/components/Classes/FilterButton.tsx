import React from 'react';
import { cn } from '../../lib/utils';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-200 dark:border-slate-800",
        active 
          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
          : "bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
      )}
    >
      {children}
    </button>
  );
}
