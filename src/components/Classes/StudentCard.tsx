import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, History, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Student, AppSettings, BonusCategory } from '../../types';
import { cn } from '../../lib/utils';
import { CategoryIcon } from '../Common/CategoryIcon';

interface StudentCardProps {
  student: Student;
  settings: AppSettings;
  onGiveBonus: (amount: number, category: BonusCategory) => void;
  onRemoveLastBonus: () => void;
  onViewHistory: () => void;
}

export function StudentCard({ student, settings, onGiveBonus, onRemoveLastBonus, onViewHistory }: StudentCardProps) {
  const bonusRecords = student.bonusRecords || [];
  const lastBonus = bonusRecords[bonusRecords.length - 1];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl font-bold text-slate-400">
            {student.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-lg leading-tight">{student.name}</h4>
            <div className="flex items-center gap-1 text-primary font-black text-xl">
              <Award size={18} />
              <span>{student.totalBonus}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onViewHistory}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors"
        >
          <History size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {settings.bonusCategories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => onGiveBonus(cat.defaultAmount, cat)}
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-xs font-bold border border-transparent hover:border-primary/20"
          >
            <CategoryIcon iconName={cat.icon} size={14} />
            <span className="truncate">{cat.name}</span>
            <span className="ml-auto text-[10px] opacity-50">+{cat.defaultAmount}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {lastBonus ? (
          <motion.div 
            key={lastBonus.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] text-slate-500"
          >
            <div className="flex items-center gap-2 truncate">
              <div className={cn(
                "p-1 rounded-md",
                lastBonus.amount > 0 ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
              )}>
                {lastBonus.amount > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">+{lastBonus.amount}</span>
              <span className="truncate opacity-70">{lastBonus.categoryName}</span>
            </div>
            <button 
              onClick={onRemoveLastBonus}
              className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded-md transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </motion.div>
        ) : (
          <div className="h-8 flex items-center justify-center text-[10px] text-slate-400 italic">
            No recent activity
          </div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
}
